---
title: Hexadecimal encoding
---

## Purpose

Many of Ethereum and Swarm APIs require inputs or output values to be encoded as an hexadecimal string prefixed with `0x`, therefore many of Erebos APIs also have this requirement.\
The `@erebos/hex` package is used by other Erebos packages to ease the interactions with some APIs by providing an abstraction on top of it.\
The `Hex` class is a container for the prefixed hexadecimal string, exposed in its `value` property, but also handles strings, objects and buffers as input and output values in order to simplify application-level interactions.

## Installation

```sh
npm install @erebos/hex
```

## Usage

```javascript
import { createHex } from '@erebos/hex'

const fromString = createHex('Hello world!')
fromString.value // '0x48656c6c6f20776f726c6421'

const fromHex = createHex('0x48656c6c6f20776f726c6421')
fromHex.toString() // 'Hello world!'
```

## Interfaces and types

### hexValue

```typescript
enum HexValue {}
type hexValue = HexValue & string
```

### hexInput

```typescript
type hexInput = hexValue | string | Record<string, any> | Buffer | Array<number>
```

## Public API

### isHexValue()

**Arguments**

1.  `value: any`

**Returns** `boolean`

### createHex()

**Arguments**

1.  `value: hexInput | Hex`

**Returns** `Hex`

### Hex class

**Arguments**

1.  `value: hexInput | Hex`

### .value

**Returns** `hexValue`

### .equals()

**Arguments**

1.  `other: hexInput | Hex`

**Returns** `boolean`

### .toBuffer()

**Returns** `Buffer`

### .toBytesArray()

**Returns** `Array<number>`

### .toObject()

**Returns** `Record<string, any>`

### .toString()

**Returns** `string`
