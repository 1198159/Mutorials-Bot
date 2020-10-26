require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
  bot.user.setPresence({
          status: "online",  //You can show online, idle....
          game: {
              name: "!quickpoll",  //The message shown
              type: "LISTENING" //PLAYING: WATCHING: LISTENING: STREAMING:
          }
      });
});

class Trigger{
    constructor(prefixes, children){
        this.prefixes = prefixes;
        this.children = children;

    }
    prefixes(){
        return this.prefixes;
    }
    children(){
        return this.children;
    }
    process(message, args){
        if(Array.isArray(this.children)){
            let noneFound = true;
            this.children.forEach(child => {
                if(child.prefixes.includes(args[0])){
                    noneFound = false;
                    args.shift();
                    child.process(message, args);
                }
            });
            if(noneFound){
                message.reply('No command was found, type !quickpoll help for available commands');
            }
        }else {
            this.children(message, args.length > 0 ? args[0] : getPollEmoji(message));
        }
    }
}

var defaultPollEmoji = '📊';

let pollEmojiTrigger = new Trigger(['trig', 'trigger', 'polltrigger', 'polltrig'], async function (msg, a) {
    await msg.react(a).then(emo => {
        pollEmojiMap.set(msg.channel.guild, emo.emoji);
        print(msg, `[TRIGGERCHANGE] QuickPoll trigger is ${emo.emoji}`);
    }).catch(error => msg.reply('Error'));
    await sleep(2000);
    //msg.clearReactions();
});
let helpTrigger = new Trigger(['help', 'h'], async function (msg, a) {
   msg.channel.send(helpEmbed);
});
let rootTrigger = new Trigger(['!quickpoll','!qp','!poll', '!q'], [pollEmojiTrigger, helpTrigger]);

const helpEmbed = new Discord.RichEmbed()
	.setColor('#FE2B0D')
	.setTitle('Help Menu')
	.addField('**Parameters:**', '*trigger* \n> *emoji* (Set trigger emoji) \n>     *no term* (Get trigger emoji) \n *help*')
	.addField('**Shorthand:**', '*!quickpoll* \n> !q, !qp, !poll \n *trigger* \n> trig, polltrigger, polltrig \n *help* \n> h')
	.setTimestamp()
	.setFooter('QuickPoll Bot '+getBotVersion());

let pollEmojiMap = new Map();

bot.on('message', async msg => {
  if(msg.author.equals(bot.user)) return;

  const args = processMsg(msg);

  const command = args.shift().toLowerCase();
  if(!command.startsWith('!')) return;
  print(msg, `[COMMAND]: ${command}`);

  //args.forEach(arg => console.log(arg));

  if(rootTrigger.prefixes.includes(command)){
    rootTrigger.process(msg, args);
  }


});
bot.on('messageReactionAdd', async (reaction, user) => {
    if(user.equals(bot.user)) return;
    const msg = reaction.message;
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
		    print(msg, `[ERROR] See Below`);
			console.error('Something went wrong when fetching the message: ', error);
			return;
		}
	}
	if(reaction.emoji.name === getPollEmoji(msg) || reaction.emoji.name === getPollEmoji(msg).name){
          const args = processMsg(msg);
	      args.forEach((a)  => {
	           msg.react(a).catch(error => {});
	      });
	}
});

function processMsg (msg) {
    return msg.content.split('<').join('').split('>').join('').split(/ +/);
}

function isAlphaNumeric(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};

//sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getBotVersion(){
    return "v1.0.0"
}

function getPollEmoji(msg){
    if(!pollEmojiMap.has(msg.channel.guild)){
        pollEmojiMap.set(msg.channel.guild, defaultPollEmoji);
    }
    return pollEmojiMap.get(msg.channel.guild);
}
function print(msg, item){
  console.info(`[${msg.channel.guild}][${msg.channel.name}][${msg.author.username}]${item}`);
}
