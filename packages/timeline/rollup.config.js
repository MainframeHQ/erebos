import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import globals from 'rollup-plugin-node-globals'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import { uglify } from 'rollup-plugin-uglify'

const env = process.env.NODE_ENV
const extensions = ['.js', '.ts']

const config = {
  input: 'src/index.ts',
  output: {
    file: `dist/erebos.timeline.${env}.js`,
    format: 'umd',
    name: 'Erebos.timeline',
  },
  plugins: [
    resolve({
      browser: true,
      extensions,
    }),
    commonjs(),
    babel({
      exclude: '**/node_modules/**',
      extensions,
      runtimeHelpers: true,
    }),
    json(),
    globals(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
}

if (env === 'production') {
  config.plugins.push(uglify())
}

export default config
