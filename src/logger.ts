/* ChillerDragon's logger */

import fs from 'fs';

export function log(type: string, msg: string) {
  const ts = new Date().toISOString().split('T').join(' ').split(':').join(':').split('.')[0]
  const logmsg = `[${ts}][${type}] ${msg}`
  console.log(logmsg)
  logToFile(type, msg)
}

export function logToFile(type: string, msg: string) {
  const ts = new Date().toISOString().split('T').join(' ').split(':').join(':').split('.')[0]
  const logmsg = `[${ts}][${type}] ${msg}`
  fs.appendFile('logs/logfile.txt', logmsg + '\n', (err) => {
    if (err) {
      throw err
    }
  })
}

export function logAndThrow (err: Error): never {
  logToFile('error', err.message)
  throw err
}