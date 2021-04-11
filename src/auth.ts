import { requestWithRetry, userPath } from './rest-client'

interface Tokens {
  accessToken: string
  deprecatedToken: string
  identityId: string
  refreshToken: string
}

export async function requestCode(email: string) {
  await requestWithRetry({
    method: 'POST',
    url: userPath(),
    json: {
      consentVersion: '2019-06-25',
      email,
      language: 'en',
    },
  })
}

export async function getToken(email: string, code: string) {
  const tokens = await requestWithRetry<Tokens>({
    method: 'POST',
    url: userPath('tokens'),
    json: {
      code,
      email,
    },
  })

  return tokens.deprecatedToken
}
