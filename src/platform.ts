import { ApiConfig, SmartFeedApi } from './api'
import { HAP, hap, platformName, pluginName } from './hap'
import { useLogger } from './util'
import { SmartFeedAccessory } from './accessory'

const debug = __filename.includes('release')

export class PetSafeSmartFeedPlatform {
  private readonly homebridgeAccessories: { [uuid: string]: HAP.Accessory } = {}

  constructor(
    public log: HAP.Log,
    public config: ApiConfig,
    public api: HAP.Platform
  ) {
    useLogger({
      logInfo(message) {
        log.info(message)
      },
      logError(message) {
        log.error(message)
      }
    })

    if (!config) {
      this.log.info('No configuration found for platform HatchBabyRest')
      return
    }

    this.api.on('didFinishLaunching', () => {
      this.log.debug('didFinishLaunching')
      this.connectToApi().catch(e => {
        this.log.error('Error connecting to API')
        this.log.error(e)
      })
    })

    this.homebridgeAccessories = {}
  }

  configureAccessory(accessory: HAP.Accessory) {
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
      platformAccessories: HAP.Accessory[] = [],
      activeAccessoryIds: string[] = [],
      debugPrefix = debug ? 'TEST ' : ''

    this.log.info(`Configuring ${feeders.length} PetSafe Smart Feeders`)

    feeders.forEach(feeder => {
      const uuid = hap.UUIDGen.generate(debugPrefix + feeder.id),
        displayName = debugPrefix + feeder.name,
        createHomebridgeAccessory = () => {
          const accessory = new hap.PlatformAccessory(
            displayName,
            uuid,
            hap.AccessoryCategories.LIGHTBULB
          )

          this.log.info(`Adding new Smart Feed - ${displayName}`)
          platformAccessories.push(accessory)

          return accessory
        },
        homebridgeAccessory =
          this.homebridgeAccessories[uuid] || createHomebridgeAccessory()

      new SmartFeedAccessory(feeder, homebridgeAccessory)

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
      .filter(cachedId => !activeAccessoryIds.includes(cachedId))
      .map(id => this.homebridgeAccessories[id])

    staleAccessories.forEach(staleAccessory => {
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
