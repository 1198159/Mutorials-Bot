const Discord = require('discord.js');
const Question = require('./question');
const Profile = require('./profile')
const sampleQuestion = new Question('Question here', ['answer here','answer here','answer here','answer here'], '🇦', 'subject here', 'rating here', 'passrate here');

module.exports = {
    name: 'dailyquestion',
    description: 'Ping!',
    execute(bot, msg, args) {
      msg.channel.send(getEmbed(sampleQuestion)).then(async message => {
      await message.react('🇦');
      await message.react('🇧');
      await message.react('🇨');
      await message.react('🇩');
      await message.react('📝');
      await message.react('❓');
      var currentChoice;
      const filter = (reaction, user) => user.id === msg.author.id;
      const collector = message.createReactionCollector(filter, { time: 120000 });
        collector.on('collect', async reaction => {
          console.log(`collected ${reaction.emoji.name}`);
          if(reaction.emoji.name === '📝'){
            Profile.setRank(msg.author, sampleQuestion.answerQuestion(currentChoice) ? 1 : -1);
            message.react(sampleQuestion.answerQuestion(currentChoice) ? '✅' : '❌');
            collector.stop();
          } else if(reaction.emoji.name === '❓'){
            message.clearReactions();
            collector.stop();
          } else{
            currentChoice = reaction.emoji.name;
            Question.removeAllOtherUserReactions(new Array(reaction.emoji.name), msg.author, message);
          }
        });
        collector.on('end', async collected =>  {
          await message.react('🔒');
          await Question.removeAllOtherUserReactions(new Array('✅','❌','🔒'), bot.user, message);
          await Question.removeAllOtherUserReactions(new Array('📝', '❓'), msg.author, message);
        })
    })
  },
  };

function getEmbed(question){
  return new Discord.RichEmbed()
	.setColor('#FE2B0D')
  .setTitle('Daily Question')
  .addField('*Subject*', question.subject)
  .addField('*Rating*', question.rating)
  .addField('*Passrate*', question.passrate)
  .addField('**Please read the following question and select the best answer:** \n', question.question)
	.addField('*Answer choices:*', `🇦: ${question.answers[0]} \n 🇧: ${question.answers[1]} \n 🇨: ${question.answers[2]} \n 🇩: ${question.answers[3]}`)
	.addField('*React with 📝 to submit, or ❓ if you give up*')
	.setTimestamp()
	.setFooter('Mutorials Bot v0.0.1');
}