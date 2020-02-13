import { SmartFeed } from './smart-feed'
import { hap, HAP } from './hap'
import { distinctUntilChanged, map, take } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { delay, logError, logInfo } from './util'

export class SmartFeedAccessory {
  currentlyFeeding = false

  constructor(private feeder: SmartFeed, private accessory: HAP.Accessory) {
    const { Service, Characteristic } = hap,
      feedService = this.getService(Service.Switch),
      feedCharacteristic = feedService.getCharacteristic(Characteristic.On),
      batteryService = this.getService(Service.BatteryService),
      accessoryInfoService = this.getService(Service.AccessoryInformation)

    feedCharacteristic
      .on('get', (callback: any) => {
        this.feeder.requestInfoUpdate()
        callback(null, this.currentlyFeeding)
      })
      .on('set', async (value: boolean, callback: any) => {
        callback()

        if (value && !this.currentlyFeeding) {
          try {
            this.currentlyFeeding = true
            await feeder.repeatLastFeed()
            logInfo(`Done Feeding ${feeder.name}`)
            await delay(2 * 60 * 1000)
          } catch (e) {
            logError('Failed to feed')
            logError(e)
          } finally {
            feedCharacteristic.updateValue(false)
            this.currentlyFeeding = false
          }
        } else if (!value) {
          this.currentlyFeeding = false
        }
      })

    this.registerCharacteristic(
      batteryService.getCharacteristic(Characteristic.BatteryLevel),
      feeder.onBatteryLevel
    )
    this.registerCharacteristic(
      batteryService.getCharacteristic(Characteristic.StatusLowBattery),
      feeder.onBatteryLevel.pipe(
        map(batteryLevel => (batteryLevel < 20 ? 1 : 0))
      )
    )
    this.registerCharacteristic(
      batteryService.getCharacteristic(Characteristic.ChargingState),
      feeder.onState.pipe(map(state => (state.is_adapter_installed ? 1 : 0)))
    )

    accessoryInfoService
      .getCharacteristic(Characteristic.Manufacturer)
      .updateValue('PetSafe')
    accessoryInfoService
      .getCharacteristic(Characteristic.Model)
      .updateValue(feeder.state.product_name)
    accessoryInfoService
      .getCharacteristic(Characteristic.SerialNumber)
      .updateValue(feeder.state.serial || 'Unknown')

    this.registerCharacteristic(
      accessoryInfoService.getCharacteristic(Characteristic.FirmwareRevision),
      feeder.onState.pipe(map(state => state.firmware_version))
    )
    this.registerCharacteristic(
      accessoryInfoService.getCharacteristic(Characteristic.Name),
      feeder.onState.pipe(map(state => state.settings.friendly_name))
    )
  }

  getService(serviceType: HAP.Service) {
    const existingService = this.accessory.getService(serviceType)
    return existingService || this.accessory.addService(serviceType)
  }

  registerCharacteristic(
    characteristic: HAP.Characteristic,
    onValue: Observable<any>,
    setValue?: (value: any) => any
  ) {
    const getValue = () => onValue.pipe(take(1)).toPromise()

    characteristic.on('get', async (callback: any) => {
      this.feeder.requestInfoUpdate()
      callback(null, await getValue())
    })

    if (setValue) {
      characteristic.on('set', async (value: boolean, callback: any) => {
        callback()

        const currentValue = await getValue()
        if (value !== currentValue) {
          setValue(value)
        }
      })
    }

    onValue.pipe(distinctUntilChanged()).subscribe(value => {
      characteristic.updateValue(value)
    })
  }
}
