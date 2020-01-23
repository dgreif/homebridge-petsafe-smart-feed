/* eslint-disable no-console */
import { requestWithRetry, userPath } from './rest-client'
import { requestInput } from './util'

interface Tokens {
  accessToken: string
  deprecatedToken: string
  identityId: string
  refreshToken: string
}

async function getTokens(email: string): Promise<Tokens> {
  let code = await requestInput('Code: ')

  if (code.length === 6) {
    code = code.substr(0, 3) + '-' + code.substr(3)
  }

  try {
    const tokens = await requestWithRetry<Tokens>({
      method: 'POST',
      url: userPath('tokens'),
      data: {
        code,
        email
      }
    })

    return tokens
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

  await requestWithRetry({
    method: 'POST',
    url: userPath(),
    data: {
      consentVersion: '2019-06-25',
      email,
      language: 'en'
    }
  })

  console.log(
    'You should now receive an email from PetSafe.  Please enter the code from that email below.'
  )

  const tokens = await getTokens(email)

  console.log(
    '\nSuccessfully logged in to PetSafe. Please use the following line in your homebridge config:\n'
  )
  console.log(`"token": "${tokens.deprecatedToken}"`)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
process.on('unhandledRejection', () => {})
