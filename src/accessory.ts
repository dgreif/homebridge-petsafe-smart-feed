import { SmartFeed } from './smart-feed'
import { hap } from './hap'
import { distinctUntilChanged, map, take } from 'rxjs/operators'
import { BehaviorSubject, Observable } from 'rxjs'
import { delay, logError, logInfo } from './util'
import {
  Characteristic as CharacteristicClass,
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  PlatformAccessory,
  WithUUID,
  Service as ServiceClass,
} from 'homebridge'

export interface FeederConfig {
  id: number
  amount: number
}

export class SmartFeedAccessory {
  onCurrentlyFeeding = new BehaviorSubject(false)

  constructor(
    private feeder: SmartFeed,
    private accessory: PlatformAccessory,
    { amount = 0 } = { amount: 0 }
  ) {
    const { Service, Characteristic } = hap,
      feedService = this.getService(Service.Switch),
      feedCharacteristic = feedService.getCharacteristic(Characteristic.On),
      batteryService = this.getService(Service.BatteryService),
      accessoryInfoService = this.getService(Service.AccessoryInformation)

    this.registerCharacteristic(
      feedCharacteristic,
      this.onCurrentlyFeeding,
      async (value: CharacteristicValue) => {
        if (value && !this.onCurrentlyFeeding.getValue()) {
          try {
            this.onCurrentlyFeeding.next(true)
            if (amount && amount > 0) {
              await feeder.feed({ amount })
            } else {
              await feeder.repeatLastFeed()
            }
            logInfo(`Done Feeding ${feeder.name}`)
            await delay(2 * 60 * 1000)
          } catch (e) {
            logError('Failed to feed')
            logError(e)
          } finally {
            feedCharacteristic.updateValue(false)
            this.onCurrentlyFeeding.next(false)
          }
        } else if (!value) {
          this.onCurrentlyFeeding.next(false)
        }
      }
    )

    this.registerCharacteristic(
      batteryService.getCharacteristic(Characteristic.BatteryLevel),
      feeder.onBatteryLevel
    )
    this.registerCharacteristic(
      batteryService.getCharacteristic(Characteristic.StatusLowBattery),
      feeder.onBatteryLevel.pipe(
        map((batteryLevel) => (batteryLevel < 20 ? 1 : 0))
      )
    )
    this.registerCharacteristic(
      batteryService.getCharacteristic(Characteristic.ChargingState),
      feeder.onState.pipe(map((state) => (state.is_adapter_installed ? 1 : 0)))
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
      feeder.onState.pipe(map((state) => state.firmware_version))
    )
    this.registerCharacteristic(
      accessoryInfoService.getCharacteristic(Characteristic.Name),
      feeder.onState.pipe(map((state) => state.settings.friendly_name))
    )
  }

  getService(serviceType: WithUUID<typeof ServiceClass>) {
    const existingService = this.accessory.getService(serviceType)
    return existingService || this.accessory.addService(serviceType)
  }

  registerCharacteristic(
    characteristic: CharacteristicClass,
    onValue: Observable<any>,
    setValue?: (value: any) => any
  ) {
    const getValue = () => onValue.pipe(take(1)).toPromise()

    characteristic.on(
      CharacteristicEventTypes.GET,
      async (callback: CharacteristicGetCallback) => {
        this.feeder.requestInfoUpdate()
        callback(null, await getValue())
      }
    )

    if (setValue) {
      characteristic.on(
        CharacteristicEventTypes.SET,
        async (
          value: CharacteristicValue,
          callback: CharacteristicSetCallback
        ) => {
          callback()

          const currentValue = await getValue()
          if (value !== currentValue) {
            setValue(value)
          }
        }
      )
    }

    onValue.pipe(distinctUntilChanged()).subscribe((value) => {
      characteristic.updateValue(value)
    })
  }
}
