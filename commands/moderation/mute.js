module.exports = {
	name: 'mute',
	description: 'mute a user',
	usage: '<user>',
	category: 'moderation',
	execute: async (client, message, args) => {
        if(args[0]) return message.reply('Please mention a valid user!')

        const user = message.mentions.members.first() || await client.users.fetch(args[0]);
        const mutedRole = message.guild.roles.cache.find(r => r.name === 'Muted');

        if(!message.member.hasPermission("MANAGE_ROLES")) return message.reply('you dont have permission to mute!');

        if(!user) return message.reply('Please mention a valid user!');
        if(!mutedRole) return message.reply('Could\'nt find a role named \`Muted\`');

        if(message.member.roles.highest.position <= user.roles.highest.position) return message.reply('Cannot mute users higher or equal to yourself!');
        if(user.roles.cache.has(mutedRole.id)) return message.reply('User is already muted!');

        
        user.roles.add(mutedRole).then(() => { message.channel.send(`${user} was muted!`)}).catch(err => console.log(err))
		}};
