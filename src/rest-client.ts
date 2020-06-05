import got, { Options as RequestOptions } from 'got'
import { delay, logError } from './util'

const apiBaseUrl = 'https://api.ps-smartfeed.cloud.petsafe.net/api/v2/',
  usersApiBasePath = 'https://users-api.ps-smartfeed.cloud.petsafe.net/users/',
  defaultRequestOptions: RequestOptions = {
    http2: true,
    responseType: 'json',
    method: 'GET',
  }

export function apiPath(path: string) {
  return apiBaseUrl + path
}

export function userPath(path = '') {
  return usersApiBasePath + path
}

export async function requestWithRetry<T>(options: RequestOptions): Promise<T> {
  try {
    const response = (await got({ ...defaultRequestOptions, ...options })) as {
      body: T
    }
    return response.body
  } catch (e) {
    if (!e.response) {
      logError(
        `Failed to reach PetSafe server at ${options.url}.  ${e.message}.  Trying again in 5 seconds...`
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
  constructor(private authOptions: AuthOptions) {}

  async request<T = void>(
    options: RequestOptions & { url: string }
  ): Promise<T> {
    try {
      const headers: { [key: string]: string } = {
          ...options.headers,
          token: this.authOptions.token,
        },
        response = await requestWithRetry<T>({
          ...options,
          headers,
        })

      return response
    } catch (e) {
      const response = e.response || {},
        { url } = options

      if (
        response.status === 400 &&
        response?.data?.errors?.app?.[0] === 'invalid-token'
      ) {
        logError('Your token has expired!')
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
