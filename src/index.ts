import { platformName, pluginName, setHap } from './hap'
import { PetSafeSmartFeedPlatform } from './platform'

export default function (homebridge: any) {
  setHap(homebridge.hap)

  homebridge.registerPlatform(
    pluginName,
    platformName,
    PetSafeSmartFeedPlatform,
    true
  )
}
