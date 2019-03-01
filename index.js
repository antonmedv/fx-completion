#!/usr/bin/env node
'use strict'
const os = require('os')
const fs = require('fs')
const path = require('path')
const reduce = require('fx/reduce')

void function main() {
  if (process.argv.includes('--bash')) {
    process.stdout.write(fs.readFileSync(path.join(__dirname, './complete.sh')))
    return
  }

  process.stdout.write(
    [
      ...globals(),
      ...fields(),
    ].join('\n')
  )
}()

function globals() {
  const defaultGlobals = [
    'clearImmediate',
    'clearTimeout',
    'global',
    'setImmediate',
    'setTimeout',
    'Buffer',
    'clearInterval',
    'process',
    'setInterval',
  ]


  try {
    require(path.join(os.homedir(), '.fxrc'))
  } catch (err) {
    // Ignore
  }

  return [
    'select',
    ...Object.keys(global)
      .filter(x =>
        !x.startsWith('DTRACE_')
        && !x.startsWith('FX_')
        && !defaultGlobals.includes(x)
      ),
  ]
}

function fields() {
  const compIndex = parseInt(process.argv[2], 10) - 2
  const compLine = process.argv[4] || ''
  let args = compLine
    .trim()
    .split(' ')
    .slice(1) // Remove fx name

  if (/\.json$/.test(args[0])) {
    try {
      let filename = args[0]
      filename = filename.replace(/^~\//, os.homedir() + '/')
      const input = fs.readFileSync(filename).toString('utf8')
      const json = JSON.parse(input)
      args = args.slice(1) // Remove file name

      if (args[compIndex]) {
        args = args.slice(0, compIndex) // Remove current word
      }

      const output = args.reduce(reduce, json)
      return [...paths(output)]
    } catch (e) {
      // Ignore
    }
  }
  return []
}

function* paths(json) {
  const queue = []

  if (Array.isArray(json)) {
    let i = 0
    for (let item of json) {
      const path = 'this[' + (i++) + ']'
      if (Array.isArray(item) || isObject(item)) {
        yield path
      }
    }
  } else {
    if (isObject(json)) {
      for (let [key, value] of Object.entries(json)) {
        const path = /^\w+$/.test(key) ? `.${key}` : `this["${key}"]`
        yield path
        if (Array.isArray(value)) {
          queue.push([value, path])
        }
      }
    }
  }

  while (queue.length > 0) {
    const [value, path] = queue.shift()
    let i = 0
    for (let item of value) {
      const p = path + '[' + (i++) + ']'
      if (Array.isArray(item) || isObject(item)) {
        yield p
      }
    }
  }
}

function isObject(v) {
  return typeof v === 'object' && v.constructor === Object
}
