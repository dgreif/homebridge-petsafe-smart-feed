import axios, { AxiosRequestConfig, ResponseType } from 'axios'
import { delay, logError } from './util'

const apiBaseUrl = 'https://api.ps-smartfeed.cloud.petsafe.net/api/v2/',
  usersApiBasePath = 'https://users-api.ps-smartfeed.cloud.petsafe.net/users/'

export function apiPath(path: string) {
  return apiBaseUrl + path
}

export function userPath(path = '') {
  return usersApiBasePath + path
}

export async function requestWithRetry<T>(
  options: AxiosRequestConfig
): Promise<T> {
  try {
    const { data } = await axios(options)
    return data as T
  } catch (e) {
    if (!e.response) {
      logError(
        `Failed to reach Hatch Baby server at ${options.url}.  Trying again in 5 seconds...`
      )
      await delay(5000)
      return requestWithRetry(options)
    }

    throw e
  }
}

export interface AuthOptions {
  token: string
}

export class RestClient {
  // private loginPromise = this.logIn()

  constructor(private authOptions: AuthOptions) {}

  // async logIn(): Promise<any> {
  //   try {
  //     const resp = await requestWithRetry<any>({
  //       url: apiPath('todo'),
  //       data: {
  //         email: this.authOptions.email,
  //         password: this.authOptions.password
  //       },
  //       method: 'POST',
  //       headers: {
  //         'content-type': 'application/json'
  //       }
  //     })
  //
  //     return 'todo'
  //   } catch (requestError) {
  //     const errorMessage =
  //       'Failed to fetch oauth token from Hatch Baby. Verify that your email and password are correct.'
  //     logError(requestError.response || requestError)
  //     logError(errorMessage)
  //     throw new Error(errorMessage)
  //   }
  // }
  //
  // private refreshAuth() {
  //   this.loginPromise = this.logIn()
  // }

  async request<T = void>(options: {
    method?: 'GET' | 'POST' | 'PUT'
    url: string
    data?: any
    responseType?: ResponseType
  }): Promise<T> {
    const { method, url, data } = options

    try {
      const headers: { [key: string]: string } = {
          'content-type': 'application/json',
          token: this.authOptions.token
        },
        response = await requestWithRetry<T>({
          method: method || 'GET',
          url,
          data,
          headers
        })

      return response
    } catch (e) {
      const response = e.response || {}

      if (
        response.status === 400 &&
        response?.data?.errors?.app?.[0] === 'invalid-token'
      ) {
        logError('Your token has expired!')
        // this.refreshAuth()
        // return this.request(options)
      }

      if (response.status === 404 && url.startsWith(apiBaseUrl)) {
        logError('404 from endpoint ' + url)

        throw new Error(
          'Not found with response: ' + JSON.stringify(response.data)
        )
      }

      logError(
        `Request to ${url} failed (${response.status}). ${JSON.stringify(
          response.data
        )}`
      )

      throw e
    }
  }
}
