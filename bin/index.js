#!/usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');
const option = require('../util/option.json');
const create = require('../util/createApp');


program
.version('v1.1', '-v, --version')
.usage('<name>')
.arguments('<name>')
.action(async (name) => {
    const { language } = await inquirer.prompt({
            type: "list",
            message: "Language",
            choices: ["Javascript", "Typescript"],
            name: "language"
    })
    const { semicolon } = await inquirer.prompt({
        type: "list",
        message: "Do you require Semicolon?",
        choices: ["Yes", "No"],
        name: "semicolon"
    })
    
    create(name, process.cwd(), option.language[language], option.semicolon[semicolon])
});

// program
// .command('create <name>')
// .usage('create <name>')
// .description('Create Discord.js Project')
// .alias('crt')
// .action(async (name) => {
//     const { language } = await inquirer.prompt({
//             type: "list",
//             message: "Language",
//             choices: ["Javascript", "Typescript"],
//             name: "language"
//     })
//     const { semicolon } = await inquirer.prompt({
//         type: "list",
//         message: "Do you require Semicolon?",
//         choices: ["Yes", "No"],
//         name: "semicolon"
//     })
//     console.log(option.language[language], option.semicolon[semicolon]);

//     create(name, __dirname, option.language[language], option.semicolon[semicolon])
// });

program.parse(process.argv);