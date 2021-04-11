/* eslint-disable no-console */
import { requestInput } from './util'
import { getToken, requestCode } from './auth'

async function getTokens(email: string): Promise<string> {
  let code = await requestInput('Code: ')

  if (code.length === 6) {
    code = code.substr(0, 3) + '-' + code.substr(3)
  }

  try {
    return await getToken(email, code)
  } catch (e) {
    console.error('Failed: ', e.response.data.message)
    return getTokens(email)
  }
}

export async function logRefreshToken() {
  console.log(
    'This CLI will provide you with a token which you can use to configure homebridge-petsafe-smart-feed. Please enter your email address to start the process.'
  )

  const email = await requestInput('Email: ')
  await requestCode(email)

  console.log(
    'You should now receive an email from PetSafe.  Please enter the code from that email below.'
  )

  const token = await getTokens(email)

  console.log(
    '\nSuccessfully logged in to PetSafe. Please use the following line in your homebridge config:\n'
  )
  console.log(`"token": "${token}"`)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
process.on('unhandledRejection', () => {})
