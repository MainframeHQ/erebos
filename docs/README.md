# Erebos documentation

The Erebos library exposes modules split into 3 layers:

- A [SwarmClient class](swarm-client.md) providing a single instance to use the APIs injected to it, or lazily instantiate them when accessed.
- Individual [APIs](api.md) to interact with Swarm.
- A `createRPC()` factory function used by the APIs to handle the interactions, selecting the appropriate transport when using a [browser](https://github.com/MainframeHQ/js-tools/tree/master/packages/rpc-browser#rpc-browser) or [node](https://github.com/MainframeHQ/js-tools/tree/master/packages/rpc-node#rpc-node).

Additional [utilities](https://github.com/MainframeHQ/js-tools/tree/master/packages/utils-hex#utils-hex) are also provided to convert value to and from the `hex` type (hexadecimal-encoded `string` prefixed with `0x`) used in the library.

## Swarm client usage examples

```js
import { SwarmClient, PssAPI, createRPC } from '@erebos/swarm'

// Basic client creation over a single endpoint
async function basicClient() {
  const client = new SwarmClient({
    ws: 'ws://localhost:8501', // Option 1: provide an endpoint supporting streaming, transport will be created and used for PSS
    pss: 'ws://localhost:8501', // Option 2: explicit transport endpoint for PSS
    pss: new PssAPI(rpc('ws://localhost:8501')), // Option 3: explicit API injection
  })
  const pubKey = await client.pss.getPublicKey()
}

async function pssOnly() {
  const pss = new PssAPI(createRPC('/path/to/geth.ipc'))
  const pubKey = await pss.getPublicKey()
}
```

Additional examples are provided in the [`examples` folder](../examples) of the repository.

### CLI

Erebos also provides a [command-line interface](cli.md) with the `@erebos/cli` package.
