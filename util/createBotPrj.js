const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const createApp = require('./createAppjs');


/**
 * 
 * @param {String} name 
 * @param {String} dirname 
 * @param {String} lang 
 * @param {String} semicolon 
 */
const createDiscordBotPrj = (name, dirname=process.cwd(), lang, semicolon=false) => {
    if (fs.existsSync(path.join(dirname, name)))   throw new Error('Directory already exists!');
    fs.mkdirSync(path.join(dirname, name));
    createApp(name, path.join(dirname, `/${name}/`), lang, semicolon);
    console.log(chalk.greenBright('Done!'));
    console.log(chalk.cyanBright('Install modules...'));
    require('child_process').exec(`cd ${path.join(dirname, `/${name}/`)} && npm i`).on('close', () => {
        console.log(chalk.greenBright('Done!'));
    });
}

module.exports = createDiscordBotPrj;