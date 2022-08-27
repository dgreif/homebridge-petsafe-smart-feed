# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.0.4](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v2.0.4-beta.0...v2.0.4) (2022-08-27)

### [2.0.4-beta.0](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v2.0.3...v2.0.4-beta.0) (2022-08-27)


### Bug Fixes

* update dependencies ([e28d938](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/e28d93822aecc4853bd3cde961c04e1f4c129caa))
* update homebridge-ui dependencies ([8a70fa2](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/8a70fa2347687f7e2fa6255382b5c2643caedfec))

### [2.0.3](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v2.0.2...v2.0.3) (2021-09-18)


### Bug Fixes

* update dependencies ([22c74c1](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/22c74c1b3c4d6e773c4164d65e939d08680d29de))

### [2.0.2](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v2.0.1...v2.0.2) (2021-08-08)


### Bug Fixes

* fetch new auth token before current one expires ([be3397f](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/be3397f8f3db18a140d2d5955590bd88dd872949))

### [2.0.1](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v2.0.0...v2.0.1) (2021-08-07)


### Bug Fixes

* disable http2 for requests ([76b3921](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/76b39213dd64dabc112e0cd3843a5381d690b245))

## [2.0.0](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.3.2...v2.0.0) (2021-08-06)


### ⚠ BREAKING CHANGES

* Drop support for Node < 12
* Drop support for homebridge < 1.0.0
* PetSafe is migrating to a new API, with a new setup for authentication.  Your previous `token` will no longer work, and you will need to generate a new `token` after updating the plugin.  In `homebridge-config-ui-x`, open the PetSafe plugin settings and click "Generate New Auth Token" to get started.  If you are not using config-ui-x, run `npx -p homebridge-petsafe-smart-feed petsafe-auth-cli` from your terminal

### Features

* use new petsafe api ([b118125](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/b1181251b72d6e4b62161921e7723f4b8f57ae7e))


### Bug Fixes

* small tweaks to custom ui ([c487ec3](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/c487ec320997620ac712d408b3f22f4e912d071d))


* drop support for older node and homebridge versions ([efdf0ff](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/efdf0ff43139720ac59fb4ccbf6ef76cdbce7c9d))

### [1.3.2](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.3.1...v1.3.2) (2021-07-30)


### Bug Fixes

* update dependencies ([4ed55b1](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/4ed55b1e5fea208c835f56ddc07865e3532cafa4))

### [1.3.1](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.3.0...v1.3.1) (2021-05-17)


### Bug Fixes

* update dependencies ([f1aff05](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/f1aff05ce483b4c3d030312e93218ccf4b7f22bb))
* use latest rxjs ([ef6d1eb](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/ef6d1ebf22bb65788ba51c3be1387b68afbd9396))

## [1.3.0](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.2.6...v1.3.0) (2021-04-11)


### Features

* custom ui for auth token ([c02011c](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/c02011c495985f3de6f5fba0f28f6bcbe5e6cba0))


### Bug Fixes

* update dependencies ([809d2ae](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/809d2ae6a4fc5f55704a8fb61edbc2ee698ac172))
* use string for SerialNumber to fix HB warning ([#21](https://github.com/dgreif/homebridge-petsafe-smart-feed/issues/21)) ([2eafab9](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/2eafab9be88a282c33610cc0def669c984f19fce))

### [1.2.6](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.2.5...v1.2.6) (2021-01-29)

### [1.2.5](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.2.4...v1.2.5) (2020-12-27)

### [1.2.4](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.2.3...v1.2.4) (2020-09-13)

### [1.2.3](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.2.2...v1.2.3) (2020-08-24)

### [1.2.2](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.2.1...v1.2.2) (2020-08-16)


### Bug Fixes

* adjust minimum battery voltage, based on official app ([#14](https://github.com/dgreif/homebridge-petsafe-smart-feed/issues/14)) ([d5bb2c7](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/d5bb2c721df388da2617b94941ab97063641bf74))

### [1.2.1](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.2.0...v1.2.1) (2020-07-08)


### Bug Fixes

* add fallback for model and serial number ([a3da9b0](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/a3da9b0ca88576ae81f90d1520e858bae9da6629)), closes [#10](https://github.com/dgreif/homebridge-petsafe-smart-feed/issues/10)

## [1.2.0](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.1.6...v1.2.0) (2020-07-07)


### Features

* allow configuration of feeding size ([#9](https://github.com/dgreif/homebridge-petsafe-smart-feed/issues/9)) ([39ce052](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/39ce0523f76e394182d5f9786be653715473d9c6))

### [1.1.6](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.1.5...v1.1.6) (2020-06-05)

### [1.1.5](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.1.4...v1.1.5) (2020-06-03)

### [1.1.4](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.1.3...v1.1.4) (2020-04-08)

### [1.1.3](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.1.2...v1.1.3) (2020-02-13)


### Bug Fixes

* leave switch on for 2 minutes ([f8bf433](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/f8bf4337a4d83b055fcc1080460ed244e2aa080f))

### [1.1.2](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.1.1...v1.1.2) (2020-02-13)


### Bug Fixes

* prevent double feeding ([b0d3311](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/b0d331137d5bd5b5ba0e3832a639ff8d582ace92))

### [1.1.1](https://github.com/dgreif/homebridge-petsafe-smart-feed/compare/v1.1.0...v1.1.1) (2020-01-24)


### Bug Fixes

* include auth-cli in release ([8904dab](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/8904dab16c154895ac10727bd0f1059a9d054e0a))

## 1.1.0 (2020-01-23)


### Features

* petsafe smart feed platform ([34ec949](https://github.com/dgreif/homebridge-petsafe-smart-feed/commit/34ec94932443ec67c3a0e2aa73afc323447f0d69))
