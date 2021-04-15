const fs = require('fs');
const path = require('path');

module.exports = pathname => {
    fs.writeFileSync(path.join(pathname, '/.env'), `TOKEN=\nPREFIX=\n`);
}