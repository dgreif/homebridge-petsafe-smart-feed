import got, { Options as RequestOptions } from 'got'
import { delay, logError } from './util'
import { refreshTokens } from './auth'

const apiBaseUrl = 'https://platform.cloud.petsafe.net/smart-feed/',
  defaultRequestOptions: RequestOptions = {
    responseType: 'json',
    method: 'GET',
  }

export function apiPath(path: string) {
  return apiBaseUrl + path
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
  idToken?: string

  constructor(private authOptions: AuthOptions) {}

  async updateIdToken() {
    try {
      const { AuthenticationResult } = await refreshTokens(
        this.authOptions.token
      )

      this.idToken = AuthenticationResult?.IdToken
    } catch (e) {
      logError(e.message)
    }

    if (!this.idToken) {
      throw new Error(
        'Your PetSafe token is invalid or expired.  Please generate a new token and update your config.'
      )
    }
  }

  async request<T = void>(
    options: RequestOptions & { url: string }
  ): Promise<T> {
    if (!this.idToken) {
      await this.updateIdToken()
    }

    if (!this.idToken) {
      throw new Error('Unable to update auth token')
    }

    try {
      const headers: { [key: string]: string } = {
          ...options.headers,
          Authorization: this.idToken,
        },
        response = await requestWithRetry<T>({
          ...options,
          headers,
        })

      return response
    } catch (e) {
      const response = e.response || {},
        { url } = options

      if (response.status === 401) {
        await this.updateIdToken()
        return this.request(options)
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
