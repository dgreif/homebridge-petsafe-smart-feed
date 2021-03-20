import { getToken, requestCode } from '../auth'

const {
  HomebridgePluginUiServer,
  RequestError,
} = require('@homebridge/plugin-ui-utils')

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

    // handle request for the /token route
    this.onRequest('/send-code', this.generateCode)
    this.onRequest('/token', this.generateToken)

    // this MUST be called when you are ready to accept requests
    this.ready()
  }

  generateCode = async ({ email }: CodeRequest) => {
    console.log(`Sending code to ${email}`)

    try {
      await requestCode(email)
    } catch (e) {
      console.error('Failed to send code to ' + email)
      console.error(e)
      throw new RequestError(e.message)
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
      throw new RequestError(e.message)
    }
  }
}

function startPluginUiServer() {
  return new PluginUiServer()
}

startPluginUiServer()
