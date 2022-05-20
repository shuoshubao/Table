const { copySync } = require('fs-extra');

copySync('node_modules/@nbfe/form/dist/components.esm.js', 'lib/components.js');
