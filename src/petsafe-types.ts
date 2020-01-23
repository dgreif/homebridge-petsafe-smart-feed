export interface FeederSchedule {
  amount: number
  id: number
  time: string // '15:00'
  updated_at: string
}

export interface FeederInfo {
  battery_voltage: string
  connection_status: number // 2 for connected
  connection_status_timestamp: string
  created_at: string
  deleted_at: string | null
  firmware_version: string
  food_sensor_current: number
  food_sensor_reference: number
  id: number
  is_adapter_installed: boolean
  is_batteries_installed: boolean
  is_food_low: 0 | 1 | 2 // 2 for empty, 1 for low, 0 for full
  network_rssi: number
  network_snr: number
  product_name: string
  region: string
  revision_desired: number
  revision_reported: number
  schedules: FeederSchedule[]
  serial: null
  settings: {
    child_lock: boolean
    friendly_name: string
    notify_on_community_message: boolean
    notify_on_connection_state_change: boolean
    notify_on_empty_food: boolean
    notify_on_error: boolean
    notify_on_feed: boolean
    notify_on_low_food: boolean
    paused: boolean
    pet_type: 'dog' | 'cat'
    slow_feed: boolean
    ssid: null
    timezone: string
    updated_at: string
  }
  thing_name: string
}

export interface InfoMessage {
  message_type: 'WILL_MESSAGE' | 'FOOD_GOOD' | 'FOOD_EMPTY'
  created_at: string
}

export interface FeedDoneMessage {
  message_type: 'FEED_DONE'
  created_at: string
  payload: {
    isFoodLow: number
    amount: number
    source: 'cloud' | 'button'
    sensorReading1Infrared: number
    sensorReading2Infrared: number
    time: number
  }
}

export type Message = InfoMessage | FeedDoneMessage
