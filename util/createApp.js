const chalk = require('chalk');
const fs = require('fs');
const path = require('path');


/**
 * 
 * @param {String} name 
 * @param {String} dirname 
 * @param {String} lang 
 * @param {String} semicolon 
 */
const createDiscordBotPrj = (name, dirname, lang, semicolon=false) => {
    fs.mkdirSync(name);
    dirname = process.cwd();
    console.log(chalk.cyanBright('Create File...'));
    createApp(name, path.join(dirname, `/${name}/`), lang, semicolon);
    console.log(chalk.greenBright('Done!'));
    console.log(chalk.cyanBright('Install modules...'));
    require('child_process').exec(`cd ${path.join(dirname, `/${name}/`)} && npm i`).on('close', () => {
        console.log(chalk.greenBright('Done!'));
    });
}

const createApp = (name, pathname, lang, semicolon)=> {
    if (lang == "TS") {
        let code = `import Discord from 'discord.js';

class Bot {
    public client: Discord.Client;
    private readonly token: string | undefined;

    constructor(token: string | undefined) {
        this.client = new Discord.Client();
        this.token = token;

        this.client.on('ready', () => {
            console.log('Logged on:', this.client.user.tag);
        });
    }

    message(cb: (message: Discord.Message) => void): void {
        this.client.on('message', cb);
    }

    login(): void {
        this.client.login(this.token);
    }
}

const bot = new Bot('your token here');

bot.client.on('disconnect', () => {
    console.log('disconnect!');
});

bot.message(message => {
    if (message.author.bot) return;
});

bot.login();`;
        if (semicolon) code = code.replace(/[;]/g, '');
        fs.writeFileSync(path.join(pathname, `/app.ts`), code);
        createPackageJSON(name, pathname, lang)
    } else {
        let code = `const { Client, Collection } = require('discord.js');
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
    console.log(\`logged on: \${client.user.tag}\`);
    client.user.setActivity(defaultStatus, {
        type: 'WATCHING'
    });
});

client.once("reconnecting", () => {
    client.user.setActivity('Reconnecting')
    console.log("reconnecting");
});

client.once("disconnect", () => {
    client.user.setActivity('Disconnect')
    console.log("Disconnecting");
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
        if (semicolon) code = code.replace(/[;]/g, '');
        fs.writeFileSync(path.join(pathname, `/app.js`), code);
    }
    
}

const createPackageJSON = (name, pathname, lang="JS") => {
    let package = {
        name: name,
        version: "1.0.0",
        description: "",
        main: "app.js",
        scripts: {
            start: "ts-node app.ts"
        },
        keywords: [],
        author: "",
        license: "MIT",
        dependencies: {
            "discord.js": "latest"
        },
    }

    if (lang == "JS") {
        package.scripts.start = "node app";
        fs.writeFileSync(path.join(pathname, "/package.json"), JSON.stringify(package));
        createConfig(pathname);
    } else {
        package.dependencies["@types/node"] = "latest";
        fs.writeFileSync(path.join(pathname, "/package.json"), JSON.stringify(package));
    }
}

const createConfig = (pathname) => {
    fs.writeFileSync(path.join(pathname, "/config.json"), JSON.stringify({
        prefix: "",
        token: "",
        defaultStatus: ""
    }));
}

module.exports = createDiscordBotPrj;