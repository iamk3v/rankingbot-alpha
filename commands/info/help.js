const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Brings up command list',
	category: 'info',
	execute: async (client, message, args, prefix, footer) => {

        const data = [];
		const { commands } = message.client;

        const info = client.commands
			.filter(command => command.category === 'info')
            .map(command => `\`${command.name}\``)

        const elo = client.commands
			.filter(command => command.category === 'elo')
			.map(command => `\`${command.name}\``)

		const moderation = client.commands
			.filter(command => command.category === 'moderation')
			.map(command => `\`${command.name}\``)

		const utility = client.commands
			.filter(command => command.category === 'utility')
			.map(command => `\`${command.name}\``)

        const helpEmbed = new Discord.MessageEmbed()
        .setTitle('Commands')
        .setColor("RANDOM")
        .addField('__Info__', info.join(" "))
        .addField('__Moderation__', moderation.length>0 ? moderation.join(" ") : "none")
        .addField('__Elo__', elo.length>0 ? elo.join(" ") : "none")
        .addField('__Utility__', utility>0 ? utility.join(" ") : "none")
        .setFooter(`Your prefix is ${prefix} | ${footer}`)
        if(!args[0]) return     message.channel.send(helpEmbed);

        if(args[0]) {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
            if (!command) {
                return message.reply('that\'s not a valid command!');
            }
    
            if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
            if (command.description) data.push(`**Description:** ${command.description}`);
            if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);
            if (command.example) data.push(`**Example:** \n\`${command.example}\``)
    
            data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
            return message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Command: **${command.name}**`)
            .setColor('#5787E8')
            .setDescription(data)
            .setFooter(footer, client.user.displayAvatarURL({ format: "png" })))
            }
}};
