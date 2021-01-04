module.exports = {
	name: 'say',
	description: 'Say a message!',
	usage: '<message>',
	category: 'utility',
	execute: async (message, args) => {
            let msg = args.join(" ");
            message.channel.send(msg);
		}};
