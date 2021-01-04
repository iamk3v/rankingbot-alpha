const Discord = require('discord.js');
const games = require('../../models/games.js');

module.exports = {
	name: 'challenge',
	description: 'challenge a user!',
	usage: '<user>',
	category: 'elo',
	execute: async (client, message, args) => {
        const user = message.mentions.users.first();

        let gameNumber = 0;
        
        if(!user) return message.reply('Please challenge a valid user!');
        if(user.bot) return message.reply('Cannot challenge bots!');
        if(message.author.id === user.id) return message.reply('Cannot challenge yourself...')

        gameNumber++;
        //gameNumber currently not saving and will always be game 1, needs a fix

        games.findOne(
      { Guild: message.guild.id },
      async (err, data) => {
        if (err) console.log(err);
        if (!data) {
          let newGame = new games({
            Guild: message.guild.id,
            Game: [
            {
            GameNumber: gameNumber,
            User1: message.author.id,
            User2: user.id,
            Accepted: false,
            Result: '',
            },
            ]
          });
          newGame.save()
        } else {
            data.games.unshift({
                GameNumber: gameNumber,
                User1: message.author.id,
                User2: user.id,
                Accepted: false,
                Result: '',
              });
        }
        //add in .challenge accept (gamenumber) command
        //check if user2 (challenged) match the user2 in the db, return if it doesnt (aka cant accept if not challenged)
        //if accepted change status to true, if declined delete game from db
        //implement a voting command, edit result accordingly -> user1 wins result could be "@user1 won"

    })

        const embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle(`${message.author.tag} challenged ${user.tag}! | Game ${gameNumber}`)
        .setDescription('Do you wish to accept? \n **Type .accept <game> or .deny <game>**');
        message.channel.send(embed);
		}};
