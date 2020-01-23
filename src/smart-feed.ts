import { FeedDoneMessage, FeederInfo, Message } from './petsafe-types'
import { apiPath, RestClient } from './rest-client'
import { BehaviorSubject, merge, Subject } from 'rxjs'
import {
  debounceTime,
  distinctUntilChanged,
  map,
  throttleTime
} from 'rxjs/operators'
import { logError, logInfo } from './util'

const minVoltage = 26000,
  maxVoltage = 29100

function getBatteryLevel(info: FeederInfo) {
  const voltage = +info.battery_voltage

  if (
    !info.is_batteries_installed ||
    isNaN(voltage) ||
    voltage < 100 ||
    voltage > maxVoltage
  ) {
    return 100
  }

  return Math.max((100 * (voltage - minVoltage)) / (maxVoltage - minVoltage), 0)
}

export class SmartFeed {
  private onInfoRequested = new Subject()

  onState = new BehaviorSubject<FeederInfo>(this.initialInfo)

  onBatteryLevel = this.onState.pipe(
    map(getBatteryLevel),
    distinctUntilChanged()
  )

  get id() {
    return this.initialInfo.id
  }
  get name() {
    return this.initialInfo.settings.friendly_name
  }
  get state() {
    return this.onState.getValue()!
  }
  getBatteryLevel() {
    return getBatteryLevel(this.state)
  }

  private feederPath(path = '') {
    return apiPath(
      `feeders/${this.initialInfo.thing_name}${path ? '/' + path : ''}`
    )
  }

  constructor(public initialInfo: FeederInfo, private restClient: RestClient) {
    merge(
      this.onInfoRequested.pipe(throttleTime(2000)), // fire immediately
      this.onInfoRequested.pipe(debounceTime(2000)) // fire again after 2 seconds of quiet
    ).subscribe(() =>
      this.fetchInfo().catch(e => {
        logError(`Failed to fetch info for ${this.name}`)
        logError(e)
      })
    )
  }

  async feed({
    amount = 1,
    slowFeed = this.initialInfo.settings.slow_feed
  } = {}) {
    await this.restClient.request({
      method: 'POST',
      url: this.feederPath('meals'),
      data: {
        amount,
        slow_feed: slowFeed
      }
    })
    this.requestInfoUpdate()
  }

  getHistory({ days = 15 } = {}) {
    return this.restClient.request<Message[]>({
      method: 'GET',
      url: this.feederPath(`messages?days=${days}`)
    })
  }

  async getLastFeedingMessage(): Promise<FeedDoneMessage | undefined> {
    const messages = await this.getHistory()

    for (const message of messages) {
      if (message.message_type === 'FEED_DONE') {
        return message
      }
    }
  }

  async repeatLastFeed() {
    const lastFeeding = await this.getLastFeedingMessage(),
      amount = lastFeeding?.payload?.amount || 1

    logInfo(`Feeding ${this.name} ${amount}/8 Cups`)
    await this.feed({ amount })
  }

  async fetchInfo() {
    const info = await this.restClient.request<FeederInfo>({
      method: 'GET',
      url: this.feederPath()
    })

    this.onState.next(info)

    return info
  }

  requestInfoUpdate() {
    this.onInfoRequested.next()
  }
}
