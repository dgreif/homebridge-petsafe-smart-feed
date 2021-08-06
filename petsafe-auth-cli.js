#!/usr/bin/env node
require('./lib/auth-cli')
  .generateRefreshToken()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error('Login Failed')
    // eslint-disable-next-line no-console
    console.error(e)
  })
