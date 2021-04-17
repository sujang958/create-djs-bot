const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const createApp = require('./createAppjs');
const createPackageJSON = require('./createPackagejson');
const createEnv = require('./createEnv');

/**
 * 
 * @param {String} name 
 * @param {String} dirname 
 * @param {String} lang 
 * @param {String} semicolon 
 */
const createDiscordBotPrj = (name, dirname=process.cwd(), lang, semicolon=false, token, prefix) => {
    if (fs.existsSync(path.join(dirname, name)))   throw new Error('Directory already exists!');

    console.log(chalk.cyanBright('Create File...'));

    fs.mkdirSync(path.join(dirname, name));
    fs.mkdirSync(path.join(dirname, name, '/commands/'));
    createApp(path.join(dirname, `/${name}/`), lang, semicolon);
    createPackageJSON(name, path.join(dirname, `/${name}/`), lang);
    createEnv(path.join(dirname, `/${name}/`), token, prefix);

    console.log(chalk.greenBright('Done!'));
    console.log(chalk.cyanBright('Install modules...'));
    
    require('child_process').exec(`cd ${path.join(dirname, `/${name}/`)} && npm i`).on('close', () => {
        console.log(chalk.greenBright('Done!'));
        console.log(chalk.blueBright('Happy Hacking!'));
    });
}

module.exports = createDiscordBotPrj;