const Discord = require('discord.js')

exports.run = async (client, message, args) => {

  //option
  let mention = message.mentions.users.first()
  let userID = message.guild.members.cache.get(args[0])
  let self = !args[0]
  let server = args[0] === "server"
  let nick = message.channel.guild.members.cache.find(a => {
    return a.nickname === args.join(' ') ? a.nickname === args.join(' ') : a.user.username === args.join(' ')
  })
    let user = message.channel.guild.members.cache.find(a => {                                                   //search via username
    return a.username === args.join(' ') ? a.nickname === args.join(' ') : a.user.username === args.join(' ')    //in case nicknya null
  })

  //embed
  let embed = new Discord.MessageEmbed().setColor(client.warna.kato)

  //get avatar and send to user
    if (nick) {
    embed.setAuthor(find.user.tag, find.user.displayAvatarURL({ size: 4096, dynamic: true }))
    embed.setDescription(`[Avatar URL](${find.user.displayAvatarURL({ size: 4096, dynamic: true })})`)
    embed.setImage(find.user.displayAvatarURL({ size: 4096, dynamic: true }).replace('.webp', '.png'))
    return message.channel.send(embed);
  } else;
    if (user) {                                                                                             //ini untuk username
    embed.setAuthor(find.user.tag, find.user.displayAvatarURL({ size: 4096, dynamic: true }))               //jadi kalo nick=null
    embed.setDescription(`[Avatar URL](${find.user.displayAvatarURL({ size: 4096, dynamic: true })})`)      //dia search via username
    embed.setImage(find.user.displayAvatarURL({ size: 4096, dynamic: true }).replace('.webp', '.png'))
    return message.channel.send(embed);
  } else;
  if (mention) {
    embed.setAuthor(mention.tag, mention.displayAvatarURL({ size: 4096, dynamic: true }))   //author embed
    embed.setDescription(`[Avatar URL](${mention.displayAvatarURL({ size: 4096, dynamic: true })})`) //redirect to avatar link
    embed.setImage(mention.displayAvatarURL({ size: 4096, dynamic: true }).replace('.webp', '.png')) //image of avatar
    return message.channel.send(embed); //send this message to user
  } else;
  if (userID) {
    embed.setAuthor(userID.user.tag, userID.user.displayAvatarURL({ size: 4096, dynamic: true }))
    embed.setDescription(`[Avatar URL](${userID.user.displayAvatarURL({ size: 4096, dynamic: true })})`)
    embed.setImage(userID.user.displayAvatarURL({ size: 4096, dynamic: true }).replace('.webp', '.png'))
    return message.channel.send(embed); //send this message to user
  } else;
  if (self) {
    embed.setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 4096, dynamic: true }))
    embed.setDescription(`[Avatar URL](${message.author.displayAvatarURL({ size: 4096, dynamic: true })})`)
    embed.setImage(message.author.displayAvatarURL({ size: 4096, dynamic: true }).replace('.webp', '.png'))
    return message.channel.send(embed); //send this message to user
  } else;
  if (server) {
    embed.setAuthor(message.guild.name, message.guild.iconURL())
    embed.setDescription(`[Avatar URL Link](${message.guild.iconURL({ size: 4096, dynamic: true })})`)
    embed.setImage(message.guild.iconURL({ size: 4096, dynamic: true }).replace('.webp', '.png'))
    return message.channel.send(embed); //send this message to user
  } else return;
};

exports.conf = {
  aliases: [],
  cooldown: 5

};

exports.help = {
  name: 'avatar',
  description: 'melihat avatar',
  usage: 'avatar [@mention | userID | server | nickname]>',
  example: 'avatar @juned'
}
