const Discord = require('discord.js');
const { readdirSync } = require('fs');
const mongoose = require('mongoose');
const client = new Discord.Client();
const { token, prefix,mongo,footer } = require('./config.json')

mongoose.connect(mongo,{
	useUnifiedTopology: true,
	useNewUrlParser: true,
});

client.on('ready', () => {
    console.log(`logged in as ${client.user.tag}`);
    console.log(`Prefix: ${prefix}`);
    client.user.setActivity('.help', { type: "PLAYING" });
})

client.commands = new Discord.Collection(); 

client.categories = readdirSync('./commands');

for (dir of readdirSync(`./commands`)) {
const commandFiles = readdirSync(`./commands/${dir}`)
.filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${dir}/${file}`);
	client.commands.set(command.name, command);
	}
}
const cooldowns = new Discord.Collection();

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

client.on('message', async message => {
    if (message.channel.type === 'dm') return;
	if (message.author.bot) return;

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
	if (!prefixRegex.test(message.content)) return;
	
	const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    
	const embed = new Discord.MessageEmbed()
	.setColor('RANDOM')
    .setTitle(`Your prefix is ${prefix}`)
    .setFooter('Under developement by Kev#1880', client.user.displayAvatarURL({ format: "png" }));
    if (message.content.match(new RegExp(`^<@\!?${client.user.id}>$`))) return message.channel.send(embed);
    
    const commandName = args.shift().toLowerCase();
	
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    
    if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
    }
    
    timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(client, message, args, prefix, footer);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
})

client.login(token);