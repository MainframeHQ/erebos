// @flow
/* eslint-env browser */

import BaseBzz, {
  type DirectoryData, // eslint-disable-line import/named
} from '@erebos/api-bzz-base'

export default class Bzz extends BaseBzz {
  constructor(url: string) {
    super(url)
    this._fetch = window.fetch.bind(window)
    this._FormData = window.FormData.bind(window)
  }

  uploadDirectory(directory: DirectoryData): Promise<string> {
    const form = new this._FormData()
    Object.keys(directory).forEach(function(key) {
      form.append(key, directory[key].data, {
        contentType: directory[key].contentType,
      })
    })

    return this._fetch(`${this._url}bzz:/`, {
      method: 'POST',
      body: form,
      // headers: form.getHeaders(),
    }).then(
      res => (res.ok ? res.text() : Promise.reject(new Error(res.statusText))),
    )
  }

  downloadRawBlob(hash: string): Promise<Blob> {
    return this.downloadRaw(hash).then(
      res => (res.ok ? res.blob() : Promise.reject(new Error(res.statusText))),
    )
  }
}
