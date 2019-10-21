// Note : Agar tidak terjadinya kebocoran informasi , jadikan cmd ini sebagai owner only atau yang berhubungan saja
const Discord = require('discord.js');
const awasAdaToken = ["Token: kontol"];

module.exports.run = (client, message, args) => {

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
let embed = new Discord.RichEmbed()
  .setAuthor('Evaluation')
  .setColor("#b5ec8a")
  .addField("Output", `\`\`\`js\n${code}\n\`\`\``)
message.channel.send(embed);
} catch(e) {
    let embed = new Discord.RichEmbed()
    .setAuthor('Evaluation')
    .setColor("#eb6162")
    .addField("Error", `\`\`\`js\n${e}\n\`\`\``)
message.channel.send(embed);
    }
}

module.exports.help = {
  name: "eval"
}
