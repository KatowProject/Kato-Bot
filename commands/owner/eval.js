const Discord = require('discord.js');
const awasAdaToken = ["Token: kontol"];

exports.run = async (client, message, args) => {
  if (message.author.id !== "458342161474387999")
    return message.reply('gk boleh nakal ya sayang');

  try {
    let codein = args.join(' ');
    let code = eval(codein);

    if (!codein) return;
    if (codein.includes("process.env.TOKEN")) {
      code = awasAdaToken[Math.floor(Math.random() * awasAdaToken.length)];
    } else {
      code = eval(code);
    }

    if (typeof code !== 'string')
      code = require('util').inspect(code, { depth: 0 });
    let embed = new Discord.MessageEmbed()
      .setAuthor('Evaluation')
      .setTitle('Output')
      .setColor("#b5ec8a")
      .setDescription(`\`\`\`js\n${code}\n\`\`\``)
    message.channel.send(embed);
  } catch (e) {
    let embed = new Discord.MessageEmbed()
      .setAuthor('Evaluation')
      .setTitle('Error')
      .setColor("#eb6162")
      .setDescription(`\`\`\`js\n${e}\n\`\`\``)
    message.channel.send(embed);
  }
}

exports.conf = {
  aliases: ["e"],
  cooldown: 1
}

exports.help = {
  name: 'eval',
  description: 'owner only',
  usage: '',
  example: ''
}