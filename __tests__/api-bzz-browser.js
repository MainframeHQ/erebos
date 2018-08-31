/**
 * @jest-environment jsdom
 */

import Bzz from '../packages/api-bzz-browser'

describe('bzz-browser', () => {
  const url = 'http://localhost:8500/'
  const bzz = new Bzz(url)

  it('upload() called with Object as an argument calls uploadDirectory()', async () => {
    const dir = {}
    const uploadRequest = bzz.upload(dir)
    expect(uploadRequest).rejects.toThrow('Not Implemented')
  })

  it('uploadDirectory() is not implemented for the browser yet', async () => {
    const dir = {}
    const uploadRequest = bzz.uploadDirectory(dir)
    expect(uploadRequest).rejects.toThrow('Not Implemented')
  })

  xit('trying to download non-existent hash raises an error', async () => {
    const hash = 'abcdef123456'
    const downloadRequest = bzz.downloadRawBlob(hash)
    expect(downloadRequest).rejects.toThrow('Not Found')
  })
})
