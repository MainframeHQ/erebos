// @flow

import createHex, {
  hexValueType,
  isHexValue,
  type hexInput,
  type hexValue,
} from '@erebos/hex'
import { interval, type Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { bytesToHexValue, createFeedDigest, getFeedTopic } from './feed'
import type {
  BzzConfig,
  BzzMode,
  DirectoryData,
  DownloadOptions,
  FeedMetadata,
  FeedParams,
  FetchOptions,
  ListResult,
  PollOptions,
  SignFeedDigestFunc,
  UploadOptions,
} from './types'

export * from './feed'
export * from './types'

export const BZZ_MODE_PROTOCOLS = {
  default: 'bzz:/',
  feed: 'bzz-feed:/',
  immutable: 'bzz-immutable:/',
  raw: 'bzz-raw:/',
}

export const getModeProtocol = (mode?: ?BzzMode): string => {
  return (mode && BZZ_MODE_PROTOCOLS[mode]) || BZZ_MODE_PROTOCOLS.default
}

export class HTTPError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const resOrError = (res: *) => {
  return res.ok
    ? Promise.resolve(res)
    : Promise.reject(new HTTPError(res.status, res.statusText))
}

export const resJSON = (res: *) => resOrError(res).then(r => r.json())

export const resText = (res: *) => resOrError(res).then(r => r.text())

const defaultSignFeedDigest = () => {
  return Promise.reject(new Error('Missing `signFeedDigest()` function'))
}

export default class BaseBzz {
  _defaultTimeout: number
  _fetch: *
  _signDigest: SignFeedDigestFunc
  _url: string

  constructor(config: BzzConfig) {
    const { url, timeout } = config
    this._defaultTimeout = timeout ? timeout : 0
    this._signDigest = config.signFeedDigest || defaultSignFeedDigest
    this._url = url
  }

  _fetchTimeout(
    url: string,
    options: FetchOptions,
    params?: Object = {},
  ): Promise<*> {
    const timeout = options.timeout ? options.timeout : this._defaultTimeout
    if (options.headers != null) {
      params.headers = options.headers
    }

    if (timeout === 0) {
      // No timeout
      return this._fetch(url, params)
    }

    return new Promise((resolve, reject) => {
      const timeoutID = setTimeout(() => {
        reject(new Error('Timeout'))
      }, timeout)
      this._fetch(url, params).then(res => {
        clearTimeout(timeoutID)
        resolve(res)
      })
    })
  }

  signFeedDigest(digest: Array<number>, params?: any): Promise<hexValue> {
    return this._signDigest(digest, params).then(bytesToHexValue)
  }

  getDownloadURL(
    hash: string,
    options: DownloadOptions,
    raw?: boolean = false,
  ): string {
    const protocol = raw
      ? BZZ_MODE_PROTOCOLS.raw
      : getModeProtocol(options.mode)
    let url = this._url + protocol + hash
    if (options.path != null) {
      url += `/${options.path}`
    }
    if (options.mode === 'raw' && options.contentType != null) {
      url += `?content_type=${options.contentType}`
    }
    return url
  }

  getUploadURL(options: UploadOptions, raw?: boolean = false): string {
    // Default URL to creation
    let url = this._url + BZZ_MODE_PROTOCOLS[raw ? 'raw' : 'default']
    // Manifest update if hash is provided
    if (options.manifestHash != null) {
      url += `${options.manifestHash}/`
      if (options.path != null) {
        url += options.path
      }
    }
    if (options.defaultPath != null) {
      url += `?defaultpath=${options.defaultPath}`
    }
    return url
  }

  getFeedURL(
    userOrHash: string,
    params?: FeedParams = {},
    flag?: 'meta',
  ): string {
    let url = this._url + BZZ_MODE_PROTOCOLS.feed
    let query = []

    if (isHexValue(userOrHash)) {
      // user
      query = Object.keys(params).reduce(
        (acc, key) => {
          const value = params[key]
          if (value != null) {
            acc.push(`${key}=${value}`)
          }
          return acc
        },
        [`user=${userOrHash}`],
      )
    } else {
      // hash
      url += userOrHash
    }

    if (flag != null) {
      query.push(`${flag}=1`)
    }

    return `${url}?${query.join('&')}`
  }

  hash(domain: string, options?: FetchOptions = {}): Promise<hexValue> {
    return this._fetchTimeout(`${this._url}bzz-hash:/${domain}`, options).then(
      resText,
    )
  }

  list(hash: string, options?: DownloadOptions = {}): Promise<ListResult> {
    let url = `${this._url}bzz-list:/${hash}`
    if (options.path != null) {
      url += `/${options.path}`
    }
    return this._fetchTimeout(url, options).then(resJSON)
  }

  _download(hash: string, options: DownloadOptions): Promise<*> {
    const url = this.getDownloadURL(hash, options)
    return this._fetchTimeout(url, options).then(resOrError)
  }

  download(hash: string, options?: DownloadOptions = {}): Promise<*> {
    return this._download(hash, options)
  }

  _upload(
    body: mixed,
    options: UploadOptions,
    raw?: boolean = false,
  ): Promise<hexValue> {
    const url = this.getUploadURL(options, raw)
    return this._fetchTimeout(url, options, { body, method: 'POST' }).then(
      resText,
    )
  }

  uploadFile(
    data: string | Buffer,
    options?: UploadOptions = {},
  ): Promise<hexValue> {
    const body = typeof data === 'string' ? Buffer.from(data) : data
    const raw = options.contentType == null

    if (options.headers == null) {
      options.headers = {}
    }
    options.headers['content-length'] = body.length
    if (
      options.headers != null &&
      options.headers['content-type'] == null &&
      !raw
    ) {
      options.headers['content-type'] = options.contentType
    }

    return this._upload(body, options, raw)
  }

  uploadDirectory(
    _directory: DirectoryData,
    _options?: UploadOptions,
  ): Promise<hexValue> {
    return Promise.reject(new Error('Must be implemented in extending class'))
  }

  upload(
    data: string | Buffer | DirectoryData,
    options?: UploadOptions = {},
  ): Promise<hexValue> {
    return typeof data === 'string' || Buffer.isBuffer(data)
      ? // $FlowFixMe: Flow doesn't understand type refinement with Buffer check
        this.uploadFile(data, options)
      : this.uploadDirectory(data, options)
  }

  deleteResource(
    hash: string,
    path: string,
    options?: FetchOptions = {},
  ): Promise<hexValue> {
    const url = this.getUploadURL({ manifestHash: hash, path })
    return this._fetchTimeout(url, options, { method: 'DELETE' }).then(resText)
  }

  createFeedManifest(
    user: string,
    params?: FeedParams = {},
    options?: UploadOptions = {},
  ): Promise<hexValue> {
    const manifest = {
      entries: [
        {
          contentType: 'application/bzz-feed',
          mod_time: '0001-01-01T00:00:00Z',
          feed: { topic: getFeedTopic(params), user },
        },
      ],
    }
    return this.uploadFile(JSON.stringify(manifest), options).then(hexValueType)
  }

  getFeedMetadata(
    user: string,
    params?: FeedParams = {},
    options?: FetchOptions = {},
  ): Promise<FeedMetadata> {
    const url = this.getFeedURL(user, params, 'meta')
    return this._fetchTimeout(url, options).then(resJSON)
  }

  getFeedValue(
    user: string,
    params?: FeedParams = {},
    options?: FetchOptions = {},
  ): Promise<*> {
    const url = this.getFeedURL(user, params)
    return this._fetchTimeout(url, options).then(resOrError)
  }

  pollFeedValue(
    user: string,
    params?: FeedParams = {},
    options: PollOptions,
  ): Observable<*> {
    let handler

    if (options.errorWhenNotFound) {
      handler = () => this.getFeedValue(user, params, options)
    } else {
      const url = this.getFeedURL(user, params)
      handler = async () => {
        const res = await this._fetchTimeout(url, options)
        if (res.status === 404) {
          return null
        }
        if (res.ok) {
          return res
        }
        return new HTTPError(res.status, res.statusText)
      }
    }

    return interval(options.interval).pipe(map(handler))
  }

  postSignedFeedValue(
    user: string,
    body: Buffer,
    params: FeedParams,
    options?: FetchOptions = {},
  ): Promise<*> {
    const url = this.getFeedURL(user, params)
    return this._fetchTimeout(url, options, { method: 'POST', body }).then(
      resOrError,
    )
  }

  postFeedValue(
    user: string,
    data: hexInput,
    meta: FeedMetadata,
    options?: FetchOptions,
    signParams?: any,
  ): Promise<*> {
    const body = createHex(data).toBuffer()
    const digest = createFeedDigest(meta, body)
    return this.signFeedDigest(digest, signParams).then(signature => {
      const params = {
        topic: meta.feed.topic,
        time: meta.epoch.time,
        level: meta.epoch.level,
        signature,
      }
      return this.postSignedFeedValue(user, body, params, options)
    })
  }

  updateFeedValue(
    user: string,
    data: hexInput,
    params?: FeedParams,
    options?: FetchOptions,
    signParams?: any,
  ): Promise<*> {
    return this.getFeedMetadata(user, params, options).then(meta => {
      return this.postFeedValue(user, data, meta, options, signParams)
    })
  }
}
