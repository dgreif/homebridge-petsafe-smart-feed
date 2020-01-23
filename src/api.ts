import { apiPath, AuthOptions, RestClient } from './rest-client'
import { FeederInfo } from './petsafe-types'
import { SmartFeed } from './smart-feed'

export interface ApiConfig extends AuthOptions {}

export class SmartFeedApi {
  restClient = new RestClient(this.config)
  constructor(private config: ApiConfig) {}

  async getFeeders() {
    const feeders = await this.restClient.request<FeederInfo[]>({
      url: apiPath('feeders')
    })

    return feeders.map(info => {
      return new SmartFeed(info, this.restClient)
    })
  }
}
