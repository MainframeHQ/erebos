---
title: Bzz API
---

## Standalone usage

```javascript
import BzzAPI from '@erebos/api-bzz-browser' // browser
// or
import BzzAPI from '@erebos/api-bzz-node' // node

const bzz = new BzzAPI({ url: 'http://localhost:8500' })
```

## Flow types

### hexValue

Hexadecimal-encoded string prefixed with `0x`. This type is exported by the [`@erebos/hex` package](hex.md).

### DirectoryData

```javascript
type DirectoryData = {
  [path: string]: { data: string | Buffer, contentType: string, size?: number },
}
```

### FileEntry

```javascript
type FileEntry = {
  data: string | Buffer,
  path: string,
  size?: number,
}
```

### ListEntry

```javascript
type ListEntry = {
  hash: string,
  path: string,
  contentType: string,
  size: number,
  mod_time: string,
}
```

### ListResult

```javascript
type ListResult = {
  common_prefixes?: Array<string>,
  entries?: Array<ListEntry>,
}
```

### FeedMetadata

```javascript
type FeedMetadata = {
  feed: {
    topic: hexValue,
    user: hexValue,
  },
  epoch: {
    time: number,
    level: number,
  },
  protocolVersion: number,
}
```

### FetchOptions

Common options to all HTTP requests. The `timeout` value can be set to `0` to prevent applying any timeout, for example if a default timeout is set at the instance level, but a particular request needs to ignore it.

```javascript
type FetchOptions = {
  headers?: Object,
  timeout?: ?number,
}
```

### FileOptions

Includes [FetchOptions](#fetchoptions)

```javascript
type FileOptions = {
  headers?: Object,
  timeout?: ?number,
  contentType?: string,
  path?: string,
}
```

### BzzMode

```javascript
type BzzMode = 'default' | 'immutable' | 'raw'
```

### DownloadOptions

Includes [FileOptions](#fileoptions)

```javascript
type DownloadOptions = {
  headers?: Object,
  timeout?: ?number,
  contentType?: string,
  path?: string,
  mode?: BzzMode,
}
```

### UploadOptions

Includes [FileOptions](#fileoptions)

```javascript
type UploadOptions = {
  headers?: Object,
  timeout?: ?number,
  contentType?: string,
  path?: string,
  defaultPath?: string,
  encrypt?: boolean,
  manifestHash?: string,
}
```

### FeedMode

```javascript
type FeedMode = 'feed-response' | 'content-hash' | 'content-response'
```

### FeedOptions

Includes [FetchOptions](#fetchoptions)

```javascript
type FeedOptions = {
  headers?: Object,
  timeout?: ?number,
  contentType?: string,
  path?: string,
  mode?: FeedMode,
}
```

### PollOptions

Includes [FeedOptions](#feedoptions)

```javascript
type PollOptions = {
  headers?: Object,
  timeout?: ?number,
  contentType?: string,
  path?: string,
  mode?: FeedMode,
  interval: number,
  immediate?: boolean,
  whenEmpty?: 'accept' | 'ignore' | 'error',
  contentChangedOnly?: boolean,
  trigger?: Observable<void>,
}
```

### FeedParams

```javascript
type FeedParams = {
  level?: number,
  name?: string,
  time?: number,
  topic?: string,
}
```

### FeedUpdateParams

```javascript
type FeedUpdateParams = {
  level: number,
  time: number,
  topic: string,
  signature: string,
}
```

### SignBytesFunc

Function to provide in order to sign feed updates

```javascript
type SignBytesFunc = (
  bytes: Array<number>,
  params?: any,
) => Promise<Array<number>>
```

### BzzConfig

```javascript
type BzzConfig = {
  signBytes?: SignBytesFunc,
  timeout?: number,
  url: string,
}
```

## Public API

### createFeedDigest()

**Arguments**

1.  `meta: FeedMetadata`
1.  `data: string | Object | Buffer`

**Returns** `Buffer`

### getFeedTopic()

**Arguments**

1.  [`options?: FeedOptions = {}`](#feedoptions)

**Returns** `hexValue`

### HTTPError class

**Arguments**

1.  `status: number`: HTTP status code
1.  `message: string`: error message

**Properties**

- `status: number`: HTTP status code
- `message: string`: error message

### Bzz class (default export)

**Arguments**

1.  `config: BzzConfig`, see below

**Configuration**

- `url: string`: address of the Swarm HTTP gateway
- [`signBytes?: SignBytesFunc`](#signbytesfunc): needed in order to use feed updates APIs
- `timeout?: number`: default timeout to apply to all requests

### .getDownloadURL()

Returns the Swarm download URL for a given resource based on the provided arguments.

**Arguments**

1.  `hashOrDomain: string`: ENS name or Swarm hash
1.  [`options?: DownloadOptions = {}`](#downloadoptions): optional object providing the `path`.
1.  `raw?: boolean`

**Returns** `string`

### .getUploadURL()

Returns the Swarm upload URL for a given resource based on the provided arguments.

**Arguments**

1.  [`options?: UploadOptions = {}`](#uploadoptions)
1.  `raw?: boolean`

**Returns** `string`

### .getFeedURL()

Returns the Swarm URL for a feed based on the provided arguments.

**Arguments**

1.  `hashOrParams: string | FeedParams | FeedUpdateParams`: ENS name, hash of the feed manifest, [feed parameters](#feedparams) or [feed update parameters](#feedupdateparams)
1.  `flag?: 'meta'`

**Returns** `string`

### .hash()

Returns the hash of the provided `domain`.

**Arguments**

1.  `domain: string`
1.  [`options?: FetchOptions = {}`](#fetchoptions)

**Returns** `Promise<string>`

### .list()

Returns the manifest data for the provided `hashOrDomain` and optional `path`.

**Arguments**

1.  `hashOrDomain: string`: ENS name or Swarm hash
1.  [`options?: DownloadOptions = {}`](#downloadoptions): optional object providing the `path`.

**Returns** `Promise<ListResult>`

### .download()

The `download()` method returns a [`Response` instance](https://developer.mozilla.org/en-US/docs/Web/API/Response) if the request succeeds, or throws a `HTTPError`.

**Arguments**

1.  `hashOrDomain: string`: ENS name or Swarm hash
1.  [`options?: DownloadOptions = {}`](#downloadoptions) optional object providing the `path`, `mode` and `contentType`.

**Returns** `Promise<Response>`

### .uploadFile()

Uploads a single file and returns the hash. If the `contentType` option is provided, it will return the manifest hash, otherwise the file will be uploaded as raw data and will return the hash of the data itself.

**Arguments**

1.  `data: string | Buffer`
1.  [`options: UploadOptions = {}`](#uploadoptions)

**Returns** `Promise<string>`

### .uploadDirectory()

Uploads multiple files and returns the hash of the manifest containing these files.

By setting the `defaultPath` option, a file can be defined as the default one when resolving a manifest root, for example a static website could be uploaded with the `index.html` default path so that accessing `bzz://domain.eth` would resolve to `bzz://domain.eth/index.html`.

**Arguments**

1.  [`data: DirectoryData`](#directorydata)
1.  [`options: UploadOptions = {}`](#uploadoptions)

**Returns** `Promise<string>`

### .upload()

Calls [`uploadFile()`](#uploadfile) or [`uploadDirectory()`](#uploaddirectory) based on the provided `data` type.

**Arguments**

1.  `data: string | Buffer | DirectoryData`: providing a [`DirectoryData`](#directorydata) object uses [`uploadDirectory()`](#uploaddirectory), otherwise [`uploadFile()`](#uploadfile) is used
1.  [`options: UploadOptions = {}`](#uploadoptions)

**Returns** `Promise<string>`

### .deleteResource()

Deletes the resource with at the provided `path` in the manifest and returns the hash of the new manifest without this resource.

**Arguments**

1.  `hashOrDomain: string`: ENS name or Swarm hash
1.  `path: string`
1.  [`options?: FetchOptions = {}`](#fetchoptions)

**Returns** `Promise<string>`

### .createFeedManifest()

**Arguments**

1.  [`params: FeedParams`](#feedparams)
1.  [`options?: UploadOptions = {}`](#uploadoptions)

**Returns** `Promise<hexValue>`

### .getFeedMetadata()

**Arguments**

1.  `hashOrParams: string | FeedParams`: hash of the feed manifest or [feed parameters](#feedparams)
1.  [`options?: FetchOptions = {}`](#fetchoptions)

**Returns** `Promise<FeedMetadata>`

### .getFeedValue()

Depending on the `mode` option provided, returns the feed HTTP response (in `feed-response` mode, the default one), the content hash (in `content-hash` mode) or the content HTTP response (in `content-response`) mode.
The `content-hash` and `content-response` modes assume to value of the feed is a Swarm hash pointing to another resource.

**Arguments**

1.  `hashOrParams: string | FeedParams`: : ENS name, hash of the feed manifest or [feed parameters](#feedparams)
1.  [`options?: FeedOptions = {}`](#feedoptions)

**Returns** `Promise<Response | string>`

### .pollFeedValue()

Returns a [RxJS `Observable`](https://rxjs.dev/api/index/class/Observable) emitting the `Response` objects (or a `string` when the `mode` option is set to `content-hash`) as they are downloaded.

**Arguments**

1.  `hashOrParams: string | FeedParams`: ENS name, hash of the feed manifest or [feed parameters](#feedparams)
1.  `options: PollOptions`, see below

**Options**

- `interval: number`: the number of milliseconds between each query
- `immediate?: boolean`: by default, a query will be performed as soon as the returned `Observable` is subscribed to. Set this option to `false` in order to wait for the first `interval` tick to perform the first query.
- `whenEmpty?: 'accept' | 'ignore' | 'error'`: behaviour to apply when the feed response is an HTTP 404 status: `accept` (default) will push a `null` value to the subscriber, `ignore` will not push any empty value, and `error` will push the error response to the subscriber, causing it to error
- `contentChangedOnly?: boolean`: this option is only relevant in the `content-hash` or `content-mode`, set it to `true` in order to only push when the content has changed rather than on every interval tick
- `trigger?: Observable<void>`: provides an external `Observable` that can be used to execute queries

**Returns** `Observable<Response>`

### .postSignedFeedValue()

**Arguments**

1.  `hashOrParams: string | FeedParams`: ENS name, hash of the feed manifest or [feed parameters](#feedparams)
1.  `body: Buffer`
1.  [`options?: FetchOptions = {}`](#fetchoptions)

**Returns** `Promise<Response>`

### .postFeedValue()

**Arguments**

1.  `meta: FeedMetadata`
1.  `data: string | Object | Buffer`
1.  [`options?: FetchOptions = {}`](#fetchoptions)
1.  `signParams?: any`

**Returns** `Promise<Response>`

### .updateFeedValue()

**Arguments**

1.  `hashOrParams: string | FeedParams`: ENS name, hash of the feed manifest or [feed parameters](#feedparams)
1.  `data: string | Object | Buffer`
1.  [`options?: FetchOptions = {}`](#fetchoptions)
1.  `signParams?: any`

**Returns** `Promise<Response>`

### .uploadFeedValue()

This method implements the flow of uploading the provided `data` and updating the feed identified by the provided `userOrHash` and eventually `feedParams` with the immutable hash of the uploaded contents, and returns this hash.

**Arguments**

1.  `hashOrParams: string | FeedParams`: ENS name, hash of the feed manifest or [feed parameters](#feedparams)
1.  `data: string | Object | Buffer`
1.  [`options?: UploadOptions = {}`](#uploadoptions)
1.  `signParams?: any`

**Returns** `Promise<string>`

## Node-specific APIs

The following `Bzz` class methods are only available when using `@erebos/api-bzz-node`.

### .downloadObservable()

Returns a [RxJS `Observable`](https://rxjs.dev/api/index/class/Observable) emitting the `FileEntry` objects as they are downloaded.

**Arguments**

1.  `hashOrDomain: string`: ENS name or Swarm hash
1.  [`options?: DownloadOptions = {}`](#downloadoptions)

**Returns** `Observable<FileEntry>`

### .downloadDirectoryData()

**Arguments**

1.  `hashOrDomain: string`: ENS name or Swarm hash
1.  [`options?: DownloadOptions = {}`](#downloadoptions)

**Returns** `Promise<DirectoryData>`

### .downloadFileTo()

**Arguments**

1.  `hashOrDomain: string`: ENS name or Swarm hash
1.  `path: string`
1.  [`options?: DownloadOptions = {}`](#downloadoptions)

**Returns** `Promise<void>`

### .downloadDirectoryTo()

**Arguments**

1.  `hashOrDomain: string`: ENS name or Swarm hash
1.  `path: string`
1.  [`options?: DownloadOptions = {}`](#downloadoptions)

**Returns** `Promise<number>` the number of files written.

### .downloadTo()

Call `downloadFileTo()` or `downloadDirectoryTo()` depending on the provided `path`.

**Arguments**

1.  `hashOrDomain: string`: ENS name or Swarm hash
1.  `path: string`
1.  [`options?: DownloadOptions = {}`](#downloadoptions)

**Returns** `Promise<void>`

### .uploadFileStream()

**Arguments**

1.  `stream: Readable`: Node.js [`Readable stream`](https://nodejs.org/dist/latest-v10.x/docs/api/stream.html#stream_class_stream_readable) instance
1.  [`options?: UploadOptions = {}`](#uploadoptions)

**Returns** `Promise<string>`

### .uploadTar()

**Arguments**

1.  `path: string`: path to an existing tar archive or a directory to pack
1.  [`options?: UploadOptions = {}`](#uploadoptions)

**Returns** `Promise<string>`

### .uploadFileFrom()

**Arguments**

1.  `path: string`: file to upload
1.  [`options?: UploadOptions = {}`](#uploadoptions)

**Returns** `Promise<string>`

### .uploadDirectoryFrom()

**Arguments**

1.  `path: string`: directory to upload
1.  [`options?: UploadOptions = {}`](#uploadoptions)

**Returns** `Promise<string>`

### .uploadFrom()

Calls `uploadFileFrom()` or `uploadDirectoryFrom()` depending on the provided `path`.

**Arguments**

1.  `path: string`: file or directory to upload
1.  [`options?: UploadOptions = {}`](#uploadoptions)

**Returns** `Promise<string>`
