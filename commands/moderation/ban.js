const userReg = RegExp(/<@!?(\d+)>/);
module.exports = {
	name: 'ban',
	description: 'ban a user',
	usage: '<user>',
	category: 'moderation',
	execute: async (client, message, args) => {
        
        if(args[0]) return message.reply('Please mention a valid user!')

		const userID = userReg.test(args[0]) ? userReg.exec(args[0])[1] : args[0]
		const mentionedUser = await client.users.fetch(userID).catch(() => null)

		const mentionedMember = await message.guild.members.fetch(mentionedUser.id);

        if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply('you dont have permission to ban!');

        if(!mentionedMember) return message.reply('Please mention a valid user!');

        if(mentionedMember.hasPermission("BAN_MEMBERS")) return message.reply('Cannot ban this user! \n Reason: User has permission to ban')
        if(message.member.roles.highest.position <= mentionedMember.roles.highest.position) return message.reply('Cannot ban users higher or equal to yourself!');

        
        mentionedMember.ban(reason).then(() => { message.channel.send(`${user} was banned ${reason ? reason : ''}`)}).catch(err => console.log(err))
		}};
