# homebridge-petsafe-smart-feed

[![Actions Status](https://github.com/dgreif/homebridge-petsafe-smart-feed/workflows/Node%20CI/badge.svg)](https://github.com/dgreif/homebridge-petsafe-smart-feed/actions)
[![Donate](https://badgen.net/badge/Donate/PayPal/91BE09)](https://www.paypal.me/dustingreif)
[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)

This homebridge plugin allows you to add the PetSafe Smart Feed to HomeKit.

## Installation

`npm i -g homebridge-petsafe-smart-feed`

## Configuration

### Obtain a token

To interact with the PetSafe api, you must first obtain an access token.  You can do this by running the following command

`npx -p homebridge-petsafe-smart-feed petsafe-auth-cli`

### Homebridge Config

Once you have an access token, set up your homebridge config as follows

 ```json
{
  "platforms": [
    {
      "platform": "PetSafeSmartFeed",
      "token": "Token from petsafe-auth-cli"
    }
  ]
}
```
