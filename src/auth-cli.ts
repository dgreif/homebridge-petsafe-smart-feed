/* eslint-disable no-console */
import { requestInput } from './util'
import { getAuthTokens, initiateAuth } from './auth'
import {
  AuthenticationResultType,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider'

async function getTokens(
  initiateAuthOutput: InitiateAuthCommandOutput
): Promise<AuthenticationResultType> {
  let output: InitiateAuthCommandOutput | undefined

  try {
    output = await getAuthTokens(
      initiateAuthOutput,
      await requestInput('Code: ')
    )
  } catch (e: any) {
    console.error(e.message)
    void e
  }

  if (!output?.AuthenticationResult) {
    console.error(
      'Authentication failed. Please check your code and try again.'
    )

    return getTokens(initiateAuthOutput)
  }

  return output.AuthenticationResult
}

export async function generateRefreshToken() {
  console.log(
    'This CLI will provide you with a token which you can use to configure homebridge-petsafe-smart-feed. Please enter your email address to start the process.'
  )

  const email = await requestInput('Email: '),
    initiateAuthOutput = await initiateAuth(email)

  console.log(
    'You should now receive an email from PetSafe.  Please enter the code from that email below.'
  )

  const tokens = await getTokens(initiateAuthOutput)

  console.log(
    '\nSuccessfully logged in to PetSafe. Please use the following line in your homebridge config:\n'
  )
  console.log(`"token": "${tokens.RefreshToken}"`)
}
