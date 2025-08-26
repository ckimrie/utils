import childProcess from 'node:child_process'
import { debuglog } from 'node:util'

const cmdDebug = debuglog('CMD Utils')

/**
 *
 * @param {string} cmd Command to run
 * @returns {Promise<string>} Command output
 */
export function runCmd (cmd:string):Promise<string> {
  return new Promise((resolve, reject) => {
    cmdDebug('Running command', { cmd })
    // eslint-disable-next-line security/detect-child-process
    childProcess.exec(cmd, (err, stdout, stderr) => {
      cmdDebug('Command result', { cmd, err, stdout, stderr })
      if (err) {
        reject(err)
      } else {
        resolve(stdout)
      }
    })
  })
}
