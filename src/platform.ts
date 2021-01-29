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

const { argv } = process,
  isTestHomebridge = argv.join(' ').includes('-P . -U ./.homebridge')

interface SmartFeedPlatformConfig {
  feeders?: FeederConfig[]
}

export class PetSafeSmartFeedPlatform implements DynamicPlatformPlugin {
  private readonly homebridgeAccessories: {
    [uuid: string]: PlatformAccessory
  } = {}

  constructor(
    public log: Logger,
    public config: PlatformConfig & ApiConfig & SmartFeedPlatformConfig,
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
      debugPrefix = isTestHomebridge ? 'TEST ' : '',
      feederConfigs = this.config.feeders || []

    this.log.info(`Configuring ${feeders.length} PetSafe Smart Feeder(s):`)

    feeders.forEach((feeder) => {
      let isNewFeeder = false
      const uuid = hap.uuid.generate(debugPrefix + feeder.id),
        displayName = debugPrefix + feeder.name,
        createHomebridgeAccessory = () => {
          isNewFeeder = true
          const accessory = new this.api.platformAccessory(
            displayName,
            uuid,
            hap.Categories.LIGHTBULB
          )
          platformAccessories.push(accessory)

          return accessory
        },
        homebridgeAccessory =
          this.homebridgeAccessories[uuid] || createHomebridgeAccessory(),
        feederConfig = feederConfigs.find(
          (config: FeederConfig) => config.id === feeder.id
        )

      this.log.info(
        ` - ${feeder.name} - ID: ${feeder.id}, Amount: ${
          feederConfig?.amount
            ? feederConfig.amount + '/8 Cup'
            : 'Repeat Last Meal'
        } ${isNewFeeder ? ' (NEW)' : ''}`
      )
      new SmartFeedAccessory(feeder, homebridgeAccessory, feederConfig)

      this.homebridgeAccessories[uuid] = homebridgeAccessory
      activeAccessoryIds.push(uuid)
    })

    feederConfigs.forEach((config) => {
      if (config.id && !feeders.some((feeder) => feeder.id === config.id)) {
        this.log.error(
          ` - Config found with no matching feeder ID ${config.id}.  Double check that you have the right ID from the logs above.`
        )
      }
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
