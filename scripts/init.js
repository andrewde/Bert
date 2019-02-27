const fs = require('fs')
const path = require('path')
const os = require('os')

// init symlinks
// TODO udate naee
const localsDstPath = `${os.homedir()}/.ELaunch/locales`
const localesSrcPath = `${process.cwd()}/app/locales`
if (!fs.existsSync(localsDstPath)) {
  fs.symlinkSync(localesSrcPath,
   localsDstPath, 'dir')
}
