import {
  AuthFlowType,
  ChallengeNameType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider'

const PETSAFE_CLIENT_ID = '18hpp04puqmgf5nc6o474lcp2g'

let sharedClient: CognitoIdentityProviderClient

function getClient() {
  if (!sharedClient) {
    sharedClient = new CognitoIdentityProviderClient({ region: 'us-east-1' })
  }

  return sharedClient
}

export function initiateAuth(email: string) {
  const client = getClient(),
    command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.CUSTOM_AUTH,
      AuthParameters: {
        USERNAME: email,
        AuthFlow: ChallengeNameType.CUSTOM_CHALLENGE,
      },
      ClientId: PETSAFE_CLIENT_ID,
    })

  return client.send(command)
}

export async function getAuthTokens(
  initiateAuthOutput: InitiateAuthCommandOutput,
  code: string
) {
  const client = getClient(),
    command = new RespondToAuthChallengeCommand({
      ClientId: PETSAFE_CLIENT_ID,
      ChallengeName: initiateAuthOutput.ChallengeName,
      Session: initiateAuthOutput.Session,
      ChallengeResponses: {
        ANSWER: code.replace(/\D/g, ''),
        USERNAME: initiateAuthOutput.ChallengeParameters!.USERNAME!,
      },
    }),
    output = await client.send(command)

  if (output.Session) {
    initiateAuthOutput.Session = output.Session
  }

  return output
}

export function refreshTokens(refreshToken: string) {
  const client = getClient(),
    command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
      ClientId: PETSAFE_CLIENT_ID,
    })

  return client.send(command)
}
