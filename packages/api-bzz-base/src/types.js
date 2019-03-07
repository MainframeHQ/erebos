// @flow

import type { hexValue } from '@erebos/hex'
import type { Observable } from 'rxjs'

export type DirectoryData = {
  [path: string]: { data: string | Buffer, contentType: string, size?: number },
}

export type FileEntry = {
  data: string | Buffer,
  path: string,
  size?: number,
}

export type ListEntry = {
  hash: string,
  path: string,
  contentType: string,
  size: number,
  mod_time: string,
}

export type ListResult = {
  common_prefixes?: Array<string>,
  entries?: Array<ListEntry>,
}

export type FeedMetadata = {
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

export type FetchOptions = {
  headers?: Object,
  timeout?: ?number,
}

export type FileOptions = FetchOptions & {
  contentType?: string,
  path?: string,
}

export type BzzMode = 'default' | 'immutable' | 'raw'

export type DownloadOptions = FileOptions & {
  mode?: BzzMode,
}

export type UploadOptions = FileOptions & {
  defaultPath?: string,
  encrypt?: boolean,
  manifestHash?: hexValue | string,
}

export type FeedMode = 'feed-response' | 'content-hash' | 'content-response'

export type FeedOptions = FetchOptions & {
  mode?: FeedMode, // defaults to 'feed-response'
}

export type PollOptions = FeedOptions & {
  interval: number, // in milliseconds
  immediate?: boolean, // defaults to true
  whenEmpty?: 'accept' | 'ignore' | 'error', // defaults to 'accept'
  contentChangedOnly?: boolean, // only relevant when mode is 'content-*'
  trigger?: Observable<void>,
}

export type FeedParams = {
  user: string,
  level?: number,
  name?: string,
  time?: number,
  topic?: string,
}

export type FeedUpdateParams = {
  user: string,
  level: number,
  time: number,
  topic: string,
  signature: string,
}

export type SignBytesFunc = (
  digest: Array<number>,
  params?: any,
) => Promise<Array<number>>

export type BzzConfig = {
  signBytes?: SignBytesFunc,
  timeout?: number,
  url: string,
}
