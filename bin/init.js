const { copySync } = require('fs-extra');

copySync('node_modules/@ke/form/dist/components.esm.js', 'lib/components.js');
copySync('node_modules/@ke/form/dist/form.esm.js', 'lib/Form.js');
