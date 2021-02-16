const program = require('commander'),
chalk = require('chalk'),
fs = require('fs'),
path = require('path'),
regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi,
child_process = require("child_process");


program
.version('0.1', '-v, --version')
.usage('[options]')

program
.command('create <name>')
.usage('create <name> --lang <lang(default: js)>')
.option('--lang <lang>')
.description('Create Discord.js Project \nDefault Language: JS, use "--lang ts" to use typescript') 
.alias('crt')
.action((name, options) => {
    let lang;

    if (typeof options.lang == 'string') {
        options.lang = options.lang.toUpperCase();
        if (options.lang == "JS" || options.lang == "TS") {
            lang = options.lang;
        } else {
            return console.log(chalk.red("Unknown language"));
        }
    } else {
        lang = "JS";
    }
    
    if (regExp.test(name)) {
        return console.log(chalk.red("특수문자를 지워주세요"));
    } else {
        try {
            createDiscordBotPrj(lang, name)
        } catch (e) {
            return console.log(chalk.bgRed(e.toString()));
        }
    }
});


const createDiscordBotPrj = (lang, name) => {
    if (lang == "JS") {
        var t0 = Date.now();
        console.log(chalk.cyanBright("Create File..."));

        fs.mkdirSync(path.join(__dirname, name));
        fs.mkdirSync(path.join(__dirname, `${name}/commands`));
        fs.writeFileSync(path.join(__dirname, `${name}/app.js`), createApp(lang));
        fs.writeFileSync(path.join(__dirname, `${name}/package.json`), createPackageJSON(name));
        fs.writeFileSync(path.join(__dirname, `${name}/config.json`), createConfig(lang));
        fs.writeFileSync(path.join(__dirname, `${name}/commands/example.js`), createCommands());

        var t1 = Date.now();
        console.log(chalk.greenBright(`Done! (${t1 - t0}ms)`));


        var t0 = Date.now();
        console.log(chalk.cyanBright("Install modules.."));

        let execute = child_process.exec(`cd ${name} && npm install`)
        execute.on("close", () => {
            var t1 = Date.now();
            console.log(chalk.greenBright(`Done! (${t1 - t0}ms)`));
        });
    } else {
        var t0 = Date.now();
        console.log(chalk.cyanBright("Create File..."));

        fs.mkdirSync(path.join(__dirname, name));
        fs.mkdirSync(path.join(__dirname, `${name}/commands`));
        fs.writeFileSync(path.join(__dirname, `${name}/app.ts`), createApp(lang));
        fs.writeFileSync(path.join(__dirname, `${name}/package.json`), createPackageJSON(name, lang));
        fs.writeFileSync(path.join(__dirname, `${name}/config.json`), createConfig(lang));
        fs.writeFileSync(path.join(__dirname, `${name}/tsconfig.json`), createTSConfig());
        fs.writeFileSync(path.join(__dirname, `${name}/commands/example.js`), createCommands());

        var t1 = Date.now();
        console.log(chalk.greenBright(`Done! (${t1 - t0}ms)`));


        var t0 = Date.now();
        console.log(chalk.cyanBright("Install modules.."));

        let execute = child_process.exec(`cd ${name} && npm install`)
        execute.on("close", () => {
            var t1 = Date.now();
            console.log(chalk.greenBright(`Done! (${t1 - t0}ms)`));
        });
    }
}

const createTSConfig = () => {
    return JSON.stringify({
        compilerOptions: {
            target: "es5",
            module: "commonjs",
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            resolveJsonModule: true
        }
    })
}

const createApp = lang => {
    if (lang == "TS") {
        return `import * as Discord from 'discord.js';
import { prefix, token, defaultStatus } from './config.json'
import * as fs from 'fs';

const client: Discord.Client = new Discord.Client()
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(\`./commands/\${file}\`);
    client.commands.set(command.name, command);
}


client.on("ready", () => {
    console.log(\`\${client.user.tag} 에 로그인됨\`);
    client.user.setActivity(defaultStatus, {
        type: 'WATCHING'
    });
});

client.once("reconnecting", () => {
    client.user.setActivity('다시 연결하는 중')
    console.log("reconnecting");
});

client.once("disconnect", () => {
    client.user.setActivity('Disconnect')
    console.log("disconnecting");
});

client.on('message', async (message: Discord.Message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args: any = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;
    
    let command: any = client.commands.get(cmd);
    if (command) {
        command.run(client, message, args);
    }
})


client.login(token)`;
    } else {
        return `const { Client, Collection } = require('discord.js');
const { prefix, token, defaultStatus } = require('./config.json');
const fs = require('fs');


const client = new Client();


client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(\`./commands/\${file}\`);
    client.commands.set(command.name, command);
}


client.on("ready", () => {
    console.log(\`\${client.user.tag} 에 로그인됨\`);
    client.user.setActivity(defaultStatus, {
        type: 'WATCHING'
    });
});

client.once("reconnecting", () => {
    client.user.setActivity('다시 연결하는 중')
    console.log("reconnecting");
});

client.once("disconnect", () => {
    client.user.setActivity('Disconnect')
    console.log("disconnecting");
});


client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (command) {
        command.run(client, message, args);
    }
})


client.login(token);
`;
    }
    
}

const createPackageJSON = (name, lang="JS") => {
    if (lang == "JS") {
        return `{
    "name": "${name}",
    "version": "1.0.0",
    "description": "",
    "main": "app.js",
    "scripts": {
        "start": "node app.js"
    },
    "keywords": [],
    "author": "",
    "license": "MIT",
    "dependencies": {
        "discord.js": "latest"
    }
}`;
    } else {
        return JSON.stringify({
            name: name,
            version: "1.0.0",
            description: "",
            main: "app.js",
            scripts: {
                start: "tsc app.ts && node app.js"
            },
            keywords: [],
            author: "",
            license: "MIT",
            dependencies: {
                "discord.js": "latest",
                "@types/node": "latest"
            },
        })
    }
}

const createCommands = () => {
    return `module.exports = {
    name: "ping",
    async run(client, message, args) {
        message.reply('Pong!')
    }
}`;
}

const createConfig = () => {
    return `{
    "prefix": "",
    "token": "",
    "defaultStatus": ""
}`
}

program.parse(process.argv);