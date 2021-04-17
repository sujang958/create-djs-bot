import * as Discord from 'discord.js';
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

bot.login();