module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(bot, msg, args) {
      msg.channel.send('pong');
    },
  };