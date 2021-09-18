/* eslint-disable no-console */
import { getAuthTokens, initiateAuth } from '../auth'
import {
  HomebridgePluginUiServer,
  RequestError,
} from '@homebridge/plugin-ui-utils'
import { InitiateAuthCommandOutput } from '@aws-sdk/client-cognito-identity-provider'

interface CodeRequest {
  email: string
}

interface TokenRequest {
  email: string
  code: string
}

let initiateAuthOutput: InitiateAuthCommandOutput

class PluginUiServer extends HomebridgePluginUiServer {
  constructor() {
    super()

    this.onRequest('/send-code', this.generateCode)
    this.onRequest('/token', this.generateToken)

    this.ready()
  }

  generateCode = async ({ email }: CodeRequest) => {
    console.log(`Sending code to ${email}`)

    try {
      initiateAuthOutput = await initiateAuth(email)
    } catch (e: any) {
      console.error('Failed to send code to ' + email)
      console.error(e)
      throw new RequestError(e.message, e)
    }
  }

  generateToken = async ({ email, code }: TokenRequest) => {
    console.log(`Getting token for ${email} with code ${code}`)

    if (!initiateAuthOutput) {
      console.error('Auth Initiation Not Found')

      throw new RequestError(
        'Auth Initiation Not Found',
        new Error('Auth Initiation Not Found')
      )
    }

    try {
      const { AuthenticationResult } = await getAuthTokens(
        initiateAuthOutput,
        code
      )

      if (!AuthenticationResult) {
        throw new Error('Incorrect Code')
      }

      const token = AuthenticationResult.RefreshToken
      console.log('Generated token: ' + token)
      return { token }
    } catch (e: any) {
      console.error('Failed to generate token')
      console.error(e)
      throw new RequestError(e.message, e)
    }
  }
}

function startPluginUiServer() {
  return new PluginUiServer()
}

startPluginUiServer()
