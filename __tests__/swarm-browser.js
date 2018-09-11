/* global Erebos */
/* eslint-env browser */

import { resolve } from 'path'

describe('browser', () => {
  let evalClient
  let uploadContent

  beforeEach(() => {
    uploadContent = Math.random()
      .toString(36)
      .slice(2)
  })

  beforeAll(async () => {
    await page.addScriptTag({
      path: resolve(
        __dirname,
        '../packages/swarm-browser/dist/erebos.development.js',
      ),
    })
    const clientHandle = await page.evaluateHandle(
      () => new Erebos.SwarmClient('http://localhost:8500'),
    )
    page.on('console', msg => {
      for (let i = 0; i < msg.args().length; ++i)
        /* eslint-disable-next-line no-console */
        console.log(`${i}: ${msg.args()[i]}`)
    })
    evalClient = (exec, ...args) => page.evaluate(exec, clientHandle, ...args)
  })

  describe('bzz', () => {
    it('trying to download non-existent hash raises an error', async () => {
      const errMessage = await evalClient(async client => {
        try {
          await client.bzz.downloadRawBlob('abcdef123456')
        } catch (err) {
          return err.message
        }
      })
      expect(errMessage).toBe('Not Found')
    })

    it('trying to upload without specifying content-type fails', async () => {
      const errMessage = await evalClient(async (client, uploadContent) => {
        try {
          await client.bzz.upload(uploadContent, {})
        } catch (err) {
          return err.message
        }
      }, uploadContent)
      expect(errMessage).toBe('Bad Request')
    })

    it('uploads/downloads the file using bzz', async () => {
      let evalResponse
      const manifestHash = await evalClient(async (client, uploadContent) => {
        const headers = { 'Content-Type': 'text/plain' }
        return await client.bzz.upload(uploadContent, headers)
      }, uploadContent)
      evalResponse = await evalClient(async (client, manifestHash) => {
        const response = await client.bzz.download(manifestHash)
        return response.text()
      }, manifestHash)
      expect(evalResponse).toBe(uploadContent)
      evalResponse = await evalClient(async (client, manifestHash) => {
        return await client.bzz.downloadText(manifestHash)
      }, manifestHash)
      expect(evalResponse).toBe(uploadContent)
    })

    it('uploads/downloads the file using bzz with content path', async () => {
      let evalResponse
      const manifestHash = await evalClient(async (client, uploadContent) => {
        const headers = { 'Content-Type': 'text/plain' }
        return await client.bzz.upload(uploadContent, headers)
      }, uploadContent)
      const manifest = await evalClient(async (client, manifestHash) => {
        return await client.bzz.downloadRawText(manifestHash)
      }, manifestHash)
      const entryHash = JSON.parse(manifest).entries[0].hash
      evalResponse = await evalClient(
        async (client, manifestHash, entryHash) => {
          const response = await client.bzz.download(manifestHash, entryHash)
          return response.text()
        },
        manifestHash,
        entryHash,
      )
      expect(evalResponse).toBe(uploadContent)
      evalResponse = await evalClient(async (client, manifestHash) => {
        const response = await client.bzz.downloadText(manifestHash)
        return response
      }, manifestHash)
      expect(evalResponse).toBe(uploadContent)
    })

    it('uploads/downloads the file using bzz-raw', async () => {
      let evalResponse
      const manifestHash = await evalClient(async (client, uploadContent) => {
        return await client.bzz.uploadRaw(uploadContent)
      }, uploadContent)
      evalResponse = await evalClient(async (client, manifestHash) => {
        const response = await client.bzz.downloadRaw(manifestHash)
        return response.text()
      }, manifestHash)
      expect(evalResponse).toBe(uploadContent)
      evalResponse = await evalClient(async (client, manifestHash) => {
        return await client.bzz.downloadRawText(manifestHash)
      }, manifestHash)
      expect(evalResponse).toBe(uploadContent)
      evalResponse = await evalClient(async (client, manifestHash) => {
        const response = await client.bzz.downloadRawBlob(manifestHash)
        const getBlobText = blob => {
          return new Promise(resolve => {
            const reader = new FileReader()
            reader.addEventListener('loadend', () => {
              resolve(reader.result)
            })
            reader.readAsText(blob)
          })
        }
        return await getBlobText(response)
      }, manifestHash)
      expect(evalResponse).toBe(uploadContent)
    })

    it('lists directories and files', async () => {
      const expectedCommonPrefixes = ['dir1/', 'dir2/']
      const dirs = {
        [`dir1/foo-${uploadContent}.txt`]: {
          data: `this is foo-${uploadContent}.txt`,
          contentType: 'plain/text',
        },
        [`dir2/bar-${uploadContent}.txt`]: {
          data: `this is bar-${uploadContent}.txt`,
          contentType: 'plain/text',
        },
      }
      const files = {
        [`baz-${uploadContent}.txt`]: {
          data: `this is baz-${uploadContent}.txt`,
          contentType: 'plain/text',
        },
      }
      const dir = { ...dirs, ...files }
      const manifest = await evalClient(async (client, dir) => {
        const dirHash = await client.bzz.uploadDirectory(dir)
        const manifest = await client.bzz.listDirectory(dirHash)
        return manifest
      }, dir)
      /* eslint-disable-next-line no-console */
      console.log(manifest, 'manifest')
      expect(manifest.entries[0].hash).not.toBe('0000000000000000000000000000000000000000000000000000000000000000')
    })
  })
})
