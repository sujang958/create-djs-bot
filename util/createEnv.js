const fs = require('fs');
const path = require('path');

module.exports = (pathname, token, prefix) => {
    fs.writeFileSync(path.join(pathname, '/.env'), `TOKEN=${token}\nPREFIX=${prefix}`);
}