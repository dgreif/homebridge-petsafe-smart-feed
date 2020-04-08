import { hap, platformName, pluginName } from './hap'
import { PetSafeSmartFeedPlatform } from './platform'

export default function (homebridge: any) {
  hap.PlatformAccessory = homebridge.platformAccessory
  hap.Service = homebridge.hap.Service
  hap.Characteristic = homebridge.hap.Characteristic
  hap.UUIDGen = homebridge.hap.uuid
  hap.AccessoryCategories = homebridge.hap.Accessory.Categories

  homebridge.registerPlatform(
    pluginName,
    platformName,
    PetSafeSmartFeedPlatform,
    true
  )
}
