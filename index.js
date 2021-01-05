require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');

Object.keys(botCommands).map(key => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

var prefixes = ['!mutorials', '!mu', '!mutorial'];

bot.on('ready', () => {   
  console.info(`Logged in as ${bot.user.tag}!`);
  bot.user.setPresence({
    status: "online",  //You can show online, idle....
    game: {
        name: "!mutorials",  //The message shown
        type: "LISTENING" //PLAYING: WATCHING: LISTENING: STREAMING:
    }
  })
});

bot.on('message', msg => {
  const args = msg.content.split(/ +/);
  const pref = args.shift().toLowerCase().trim();

if(prefixes.includes(pref)){
  var command;
  try {
    command = args.shift().toLowerCase().trim();
  } catch (error) {
    msg.reply('Error: Please provide an argument to the command');
    return;
  }

  console.info(`Called command: ${command}`);
  if(bot.commands.has(command)){
  
  try {
    bot.commands.get(command).execute(bot, msg, args);
  } catch (error) {
    console.error(error);
    msg.reply('there was an error trying to execute that command!');
  }
}
}
});
