const fs = require('fs');
const path = require('path');


module.exports = (pathname, lang, semicolon) => {
    let code = fs.readFileSync(path.join(__dirname, `/codes/app.${lang.toLowerCase()}`)).toString();
    if (!semicolon) code = code.replace(/[;]/g, '');
    fs.writeFileSync(path.join(pathname, `/app.${lang.toLowerCase()}`), code);
}