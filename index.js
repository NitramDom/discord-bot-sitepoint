require('dotenv').config();
const fs = require('fs');
const { Client } = require('discord.js');
const bot = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const TOKEN = process.env.TOKEN;
const MESSAGE_REGLEMENT = process.env.MESSAGE_REGLEMENT;
const CHANNEL_JOIN = process.env.CHANNEL_JOIN;
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

bot.on('ready', onReady);
bot.on('message', onMessage);
bot.on('messageReactionAdd', onMessageReactionAdd);
bot.on('messageReactionRemove', onMessageReactionRemove);
bot.on('guildMemberAdd', onGuildMemberAdd);


async function onReady() {
  const channel = bot.channels.cache.get(MESSAGE_REGLEMENT);

  try {
    await channel.messages.fetch();
  } catch (err) {
    console.error('Error fetching channel messages', err);
    return;
  }

  config.message_id = channel.lastMessageID;

  console.log(`Watching message '${config.message_id}' for reactions...`)
}

async function onGuildMemberAdd(user) {

}

async function onMessageReactionAdd({message, _emoji}, user) {
  const channel = bot.channels.cache.get(CHANNEL_JOIN);

  if(user.bot || message.id !== config.message_id) {
    return;
  }

  if(message.partial) {
    try {
      await message.fetch();
    } catch(err) {
      console.error('Error fetching message', err);
      return;
    }
  }

  const { guild } = message;

  const member = guild.members.cache.get(user.id);
  const role = guild.roles.cache.find((role) => role.name === config.roles[_emoji.name]);

  if (!role) {
    console.error(`Role not found for '${_emoji.name}'`);
    return;
  }
  
  try {
    member.roles.add(role.id);
    channel.send(member.toString() + "\nAccède à la whitelist et débute ton aventure dès maintenant ! :muscle: :muscle: :muscle: \n\n**Adresse** : play.vanillash.fr\n**Version** : 1.16.5\n\nhttps://cutt.ly/yjLHHRN");
  } catch (err) {
    console.error('Error adding role', err);
    return;
  }
}

async function onMessageReactionRemove({message, _emoji}, user) {
  if (user.bot || message.id !== config.message_id) {
    return;
  }

  // partials do not guarantee all data is available, but it can be fetched
  // fetch the information to ensure everything is available
  // https://github.com/discordjs/discord.js/blob/master/docs/topics/partials.md
  if (message.partial) {
    try {
      await message.fetch();
    } catch (err) {
      console.error('Error fetching message', err);
      return;
    }
  }

  const { guild } = message;

  const member = guild.members.cache.get(user.id);
  const role = guild.roles.cache.find((role) => role.name === config.roles[_emoji.name]);

  if (!role) {
    console.error(`Role not found for '${_emoji.name}'`);
    return;
  }

  try{
    member.roles.remove(role.id);
  } catch (err) {
    console.error('Error removing role', err);
    return;
  }
}

bot.login(TOKEN);
// async function onReady() {
//   const channel = bot.channels.get(MESSAGE_REGLEMENT);
//   config.message_id = channel.lastMessageID;

//   // try {
//   //   await channel.messages.fetch(config.message_id);
//   // } catch (err) {
//   //   console.error('Error fetching channel messages', err);
//   //   return;
//   // }

//   console.log(`Watching message '${config.message_id}' for reactions...`)
// }

// bot.on('messageDelete', message => {
//   console.log(`${message.id} was deleted!`);
//   // Partial messages do not contain any content so skip them
//   if (!message.partial) {
//     console.log(`It had content: "${message.content}"`);
//   }
// });


// bot.on('messageReactionAdd', async (reaction, user) => {
//   try {
//     const reaction = await potentialPartialReaction.fetch();
//     const user = await potentialPartialUser.fetch();
//   } catch (err) {
//     console.log(err);
//   }

//   console.log(reaction);
// });

// /**
//  * remove a role from a user when they remove reactions from the configured message
//  * @param {Object} reaction - the reaction that the user added
//  * @param {Objext} user - the user that added a role to a message
//  */
// async function removeRole({message, _emoji}, user) {
//   if (user.bot || message.id !== config.message_id) {
//     return;
//   }

//   // partials do not guarantee all data is available, but it can be fetched
//   // fetch the information to ensure everything is available
//   // https://github.com/discordjs/discord.js/blob/master/docs/topics/partials.md
//   if (message.partial) {
//     try {
//       await message.fetch();
//     } catch (err) {
//       console.error('Error fetching message', err);
//       return;
//     }
//   }

//   const { guild } = message;

//   const member = guild.members.get(user.id);
//   const role = guild.roles.find((role) => role.name === config.roles[_emoji.name]);

//   if (!role) {
//     console.error(`Role not found for '${_emoji.name}'`);
//     return;
//   }

//   try{
//     member.roles.remove(role.id);
//   } catch (err) {
//     console.error('Error removing role', err);
//     return;
//   }
// }

// bot.on('message', msg => {
//   if(msg.content === '!help') {
//     msg.channel.send('Commandes disponibles : \n!infos (informations du serveur)');
//   }
//   if (msg.content === '!infos') {
//     msg.channel.send('**Adresse du serveur** : play.vanillash.fr \n**Version** : 1.16.5');
//   } else if (msg.content.startsWith('!kick')) {
//     if (msg.mentions.users.size) {
//       const taggedUser = msg.mentions.users.first();
//       msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
//     } else {
//       msg.reply('Please tag a valid user!');
//     }
//   }
// });

async function onMessage(message) {
  if(message.content.startsWith('Nouvelle candidature de'))
  {
    message.react('✅');
    message.react('⛔');
  }
}