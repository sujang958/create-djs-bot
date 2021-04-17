#! /usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');
const option = require('../util/option.json');
const create = require('../util/createBotPrj');


program
.version('v2.1', '-v, --version')
.usage('<name>')
.arguments('<name>')
.action(async (name) => {
    const { language } = await inquirer.prompt({
            type: "list",
            message: "Language",
            choices: ["Javascript", "Typescript"],
            name: "language"
    });
    const { semicolon } = await inquirer.prompt({
        type: "confirm",
        message: "Do you require Semicolon?",
        choices: ["Yes", "No"],
        name: "semicolon"
    });

    create(name, process.cwd(), option.language[language], semicolon);
});

program.parse(process.argv);