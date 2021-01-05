const Discord = require('discord.js');
module.exports = {
    name: 'help',
    description: 'help',
    execute(bot, msg, args) {
      msg.channel.send(getEmbed());
    },
  };

  function getEmbed(){
    return new Discord.RichEmbed()
	.setColor('#FE2B0D')
	.setTitle('Help Menu')
	.addField('**Parameters:**', '*profile* \n *ping* \n *help* \n *dailyquestion*')
	.addField('**Shorthand:**', '*!mutorials* \n> !mu, !mutorial')
	.setTimestamp()
	.setFooter('Mutorials Bot v0.0.1');
  }