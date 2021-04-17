const { Client, Collection } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');


dotenv.config();
const client = new Client();


client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/\${file}`);
    client.commands.set(command.name, command);
}


client.on("ready", () => {
    console.log(`logged on: \${client.user.tag}`);
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