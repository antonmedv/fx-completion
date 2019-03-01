#!/usr/bin/env node
'use strict'
const os = require('os')
const fs = require('fs')
const path = require('path')
const reduce = require('fx/reduce')

void function main() {
  if (process.argv.includes('--bash')) {
    process.stdout.write(fs.readFileSync('./complete.sh'))
    return
  }

  process.stdout.write(
    [
      ...globals(),
      ...fields(),
    ].join(' ')
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

      let startPath = ''
      if (args[compIndex]) {
        startPath = args[compIndex] = args[compIndex].replace(/\.[^.]*?\.?$/, '')
        if (startPath === '') {
          args = args.slice(0, compIndex) // Remove current word
        }
      }
      const output = args.reduce(reduce, json)

      const words = []
      let i = 0
      for (let word of bfs(output, startPath)) {
        words.push(word)
        i++
        if (i >= 99) {
          break
        }
      }
      return words

    } catch (e) {
      // Ignore
    }
  }
  return []
}

function* bfs(json, startPath) {
  const queue = [[json, startPath]]

  while (queue.length > 0) {
    const [v, path] = queue.shift()

    if (!v) {
      continue
    }

    if (Array.isArray(v)) {
      let i = 0
      for (let item of v) {
        const p = (path || 'this') + '[' + (i++) + ']'
        if (Array.isArray(item) || isObject(item)) {
          yield p
        }
        queue.push([item, p])
      }
    }

    if (isObject(v)) {
      for (let [key, value] of Object.entries(v)) {
        let p
        if (/^\w+$/.test(key)) {
          p = path + '.' + key
        } else {
          p = path + `["${key}"]`
        }
        yield p
        queue.push([value, p])
      }
    }
  }
}

function isObject(v) {
  return typeof v === 'object' && v.constructor === Object
}
