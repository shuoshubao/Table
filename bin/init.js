const { readFileSync, writeFileSync } = require('fs')
const { copySync } = require('fs-extra')

copySync('node_modules/@ke/form/dist/components.esm.js', 'lib/components.js')
