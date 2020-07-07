import { ApiConfig, SmartFeedApi } from './api'
import { hap, platformName, pluginName } from './hap'
import { useLogger } from './util'
import { SmartFeedAccessory, FeederConfig } from './accessory'
import {
  API,
  DynamicPlatformPlugin,
  Logger,
  PlatformAccessory,
  PlatformConfig,
} from 'homebridge'

const debug = __filename.includes('release')

export class PetSafeSmartFeedPlatform implements DynamicPlatformPlugin {
  private readonly homebridgeAccessories: {
    [uuid: string]: PlatformAccessory
  } = {}

  constructor(
    public log: Logger,
    public config: PlatformConfig & ApiConfig,
    public api: API
  ) {
    useLogger({
      logInfo(message) {
        log.info(message)
      },
      logError(message) {
        log.error(message)
      },
    })

    if (!config) {
      this.log.info('No configuration found for platform PetSafeSmartFeed')
      return
    }

    this.api.on('didFinishLaunching', () => {
      this.log.debug('didFinishLaunching')
      this.connectToApi().catch((e) => {
        this.log.error('Error connecting to API')
        this.log.error(e)
      })
    })

    this.homebridgeAccessories = {}
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info(
      `Configuring cached accessory ${accessory.UUID} ${accessory.displayName}`
    )
    this.log.debug('%j', accessory)
    this.homebridgeAccessories[accessory.UUID] = accessory
  }

  async connectToApi() {
    const smartFeedApi = new SmartFeedApi(this.config),
      feeders = await smartFeedApi.getFeeders(),
      cachedAccessoryIds = Object.keys(this.homebridgeAccessories),
      platformAccessories: PlatformAccessory[] = [],
      activeAccessoryIds: string[] = [],
      debugPrefix = debug ? 'TEST ' : ''

    this.log.info(`Configuring ${feeders.length} PetSafe Smart Feeder(s):`)

    feeders.forEach((feeder) => {
      this.log.info(` - ${feeder.name}: ${feeder.id}`)
      const uuid = hap.uuid.generate(debugPrefix + feeder.id),
        displayName = debugPrefix + feeder.name,
        createHomebridgeAccessory = () => {
          const accessory = new this.api.platformAccessory(
            displayName,
            uuid,
            hap.Categories.LIGHTBULB
          )

          this.log.info(`Adding new Smart Feed - ${displayName}`)
          platformAccessories.push(accessory)

          return accessory
        },
        homebridgeAccessory =
          this.homebridgeAccessories[uuid] || createHomebridgeAccessory()

      const feederConfig = this.config.feeders ? this.config.feeders.filter((config: FeederConfig) => config.id === feeder.id)[0] : undefined

      new SmartFeedAccessory(feeder, homebridgeAccessory, feederConfig)

      this.homebridgeAccessories[uuid] = homebridgeAccessory
      activeAccessoryIds.push(uuid)
    })

    if (platformAccessories.length) {
      this.api.registerPlatformAccessories(
        pluginName,
        platformName,
        platformAccessories
      )
    }

    const staleAccessories = cachedAccessoryIds
      .filter((cachedId) => !activeAccessoryIds.includes(cachedId))
      .map((id) => this.homebridgeAccessories[id])

    staleAccessories.forEach((staleAccessory) => {
      this.log.info(
        `Removing stale cached accessory ${staleAccessory.UUID} ${staleAccessory.displayName}`
      )
    })

    if (staleAccessories.length) {
      this.api.unregisterPlatformAccessories(
        pluginName,
        platformName,
        staleAccessories
      )
    }
  }
}
