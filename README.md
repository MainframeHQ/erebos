# Erebos [![Build Status](https://travis-ci.com/MainframeHQ/erebos.svg?branch=master)](https://travis-ci.com/MainframeHQ/erebos) [![Gitter](https://badges.gitter.im/MainframeHQ/erebos.svg)](https://gitter.im/MainframeHQ/erebos) [![Last release](https://img.shields.io/github/release/MainframeHQ/erebos.svg)](https://github.com/MainframeHQ/erebos/releases)

JavaScript client and CLI for [Swarm](https://swarm-guide.readthedocs.io/en/latest/index.html).

## Installation

Node.js v10+ is required to use the Node.js APIs and run the CLI.

### Client library

```sh
yarn add @erebos/swarm-browser # browser-only
yarn add @erebos/swarm-node # node-only
yarn add @erebos/swarm # universal
```

### CLI

```sh
npm install -g @erebos/cli
```

## [Documentation](https://erebos.js.org)

- [Getting started](https://erebos.js.org/docs/getting-started)
- [API reference](https://erebos.js.org/docs/swarm-client)

## Packages

| Name | Version | Description |
| ---- | ------- | ----------- |
| **Clients**
| [`@erebos/swarm`](/packages/swarm) | [![npm version](https://img.shields.io/npm/v/@erebos/swarm.svg)](https://www.npmjs.com/package/@erebos/swarm) | Universal Erebos library for Swarm
| [`@erebos/swarm-browser`](/packages/swarm-browser) | [![npm version](https://img.shields.io/npm/v/@erebos/swarm-browser.svg)](https://www.npmjs.com/package/@erebos/swarm-browser) | Browser-only Erebos library for Swarm
| [`@erebos/swarm-node`](/packages/swarm-node) | [![npm version](https://img.shields.io/npm/v/@erebos/swarm-node.svg)](https://www.npmjs.com/package/@erebos/swarm-node) | Node-only Erebos library for Swarm
| **Individual APIs**
| [`@erebos/api-bzz-browser`](/packages/api-bzz-browser) | [![npm version](https://img.shields.io/npm/v/@erebos/api-bzz-browser.svg)](https://www.npmjs.com/package/@erebos/api-bzz-browser) | Browser-only Swarm (BZZ) APIs
| [`@erebos/api-bzz-node`](/packages/api-bzz-node) | [![npm version](https://img.shields.io/npm/v/@erebos/api-bzz-node.svg)](https://www.npmjs.com/package/@erebos/api-bzz-node) | Node-only Swarm (BZZ) APIs
| [`@erebos/api-pss`](/packages/api-pss) | [![npm version](https://img.shields.io/npm/v/@erebos/api-pss.svg)](https://www.npmjs.com/package/@erebos/api-pss) | Postal Services over Swarm (PSS) APIs
| [`@erebos/timeline`](/packages/timeline) | [![npm version](https://img.shields.io/npm/v/@erebos/timeline.svg)](https://www.npmjs.com/package/@erebos/timeline) | Feed-based Timeline APIs
| **Utilities**
| [`@erebos/hex`](/packages/hex) | [![npm version](https://img.shields.io/npm/v/@erebos/hex.svg)](https://www.npmjs.com/package/@erebos/hex) | Hexadecimal values encoding and decoding
| [`@erebos/keccak256`](/packages/keccak256) | [![npm version](https://img.shields.io/npm/v/@erebos/keccak256.svg)](https://www.npmjs.com/package/@erebos/keccak256) | Keccak256 hashing
| [`@erebos/secp256k1`](/packages/secp256k1) | [![npm version](https://img.shields.io/npm/v/@erebos/secp256k1.svg)](https://www.npmjs.com/package/@erebos/secp256k1) | ECDSA key creation and signing using the SECP256k1 curve
| [`@erebos/wallet-hd`](/packages/wallet-hd) | [![npm version](https://img.shields.io/npm/v/@erebos/wallet-hd.svg)](https://www.npmjs.com/package/@erebos/wallet-hd) | Hierarchical Deterministic wallet
| **CLI**
| [`@erebos/cli`](/packages/cli) | [![npm version](https://img.shields.io/npm/v/@erebos/cli.svg)](https://www.npmjs.com/package/@erebos/cli) |
| **Base classes**
| [`@erebos/api-bzz-base`](/packages/api-bzz-base) | [![npm version](https://img.shields.io/npm/v/@erebos/api-bzz-base.svg)](https://www.npmjs.com/package/@erebos/api-bzz-base) | Shared logic for Swarm (BZZ) APIs
| [`@erebos/client-base`](/packages/client-base) | [![npm version](https://img.shields.io/npm/v/@erebos/client-base.svg)](https://www.npmjs.com/package/@erebos/client-base) | Shared logic for Client APIs

## Development

### Prerequisites

- [Node](https://nodejs.org/en/) v10+ (includes npm)
- [Yarn](https://yarnpkg.com/lang/en/) (optional - faster alternative to npm)
- [Docker](https://www.docker.com/community-edition)

### Setup

```
yarn install
yarn bootstrap
yarn build
```

### Running tests

In one terminal window run:

```
./start_swarm_node.sh
```

And in the second one run:

```
yarn test:all
```

## License

MIT.\
See [LICENSE](LICENSE) file.
