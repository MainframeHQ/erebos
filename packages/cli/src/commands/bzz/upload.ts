import { flags } from '@oclif/command'

import { Command, DefaultFlags } from '../../Command'

interface Flags extends DefaultFlags {
  'content-type'?: string
  'default-path'?: string
  pin: boolean
}

interface Args {
  path: string
}

export default class BzzUploadCommand extends Command<Flags, Args> {
  public static args = [
    {
      name: 'path',
      description: 'path of the file or folder to upload',
      default: './',
    },
  ]

  public static flags = {
    ...Command.flags,
    'content-type': flags.string({
      description: 'content-type of the file',
    }),
    'default-path': flags.string({
      description: 'default path of the folder',
    }),
    pin: flags.boolean({
      char: 'p',
      description: 'pin the uploaded resource',
      default: false,
    }),
  }

  public async run(): Promise<void> {
    this.spinner.start(`Uploading contents from: ${this.args.path}`)
    try {
      const hash = await this.client.bzz.uploadFrom(
        this.resolvePath(this.args.path),
        {
          contentType: this.flags['content-type'],
          defaultPath: this.flags['default-path'],
          pin: this.flags.pin,
        },
      )
      this.spinner.succeed(`Contents successfully uploaded with hash: ${hash}`)
    } catch (err) {
      this.spinner.fail(err.message)
    }
  }
}
