/* eslint-disable no-console */
import { getToken, requestCode } from '../auth'
import {
  HomebridgePluginUiServer,
  RequestError,
} from '@homebridge/plugin-ui-utils'

interface CodeRequest {
  email: string
}

interface TokenRequest {
  email: string
  code: string
}

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
      await requestCode(email)
    } catch (e) {
      console.error('Failed to send code to ' + email)
      console.error(e)
      throw new RequestError(e.message, e)
    }
  }

  generateToken = async ({ email, code }: TokenRequest) => {
    console.log(`Getting token for ${email} with code ${code}`)

    try {
      const token = await getToken(email, code)
      console.log('Generated token: ' + token)
      return { token }
    } catch (e) {
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
