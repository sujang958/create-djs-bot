const fs = require('fs');
const path = require('path');


module.exports = (name, pathname, lang, semicolon)=> {
    if (lang == "TS") {
        let code = `import * as Discord from 'discord.js';
import { config } from 'dotenv';

config();

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

const bot = new Bot(process.env.TOKEN);

bot.client.on('disconnect', () => {
    console.log('disconnect!');
});

bot.message(message => {
    if (message.author.bot) return;
});

bot.login();`;
        if (!semicolon) code = code.replace(/[;]/g, '');
        fs.writeFileSync(path.join(pathname, `/app.ts`), code);
    } else {
        let code = `const { Client, Collection } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');


dotenv.config();
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


client.login(process.env.TOKEN);
`;
        if (!semicolon) code = code.replace(/[;]/g, '');
        fs.writeFileSync(path.join(pathname, `/app.js`), code);
    }
}