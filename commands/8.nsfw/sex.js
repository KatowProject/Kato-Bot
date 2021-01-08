const Discord = require('discord.js');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
if (!args[0]) return message.reply(`no parameter has been given\n
\`amateur\` \`anal\` \`anal_gape\` \`asian\` \`ass\` \`ass_fucking\` 
\`ass_licking\` \`babe\` \`ball_licking\` \`bath\` \`bbw\` \`beach\` 
\`big_cock\` \`big_tits\` \`bikini\` \`bikini\` \`blindfold\` \`blonde\` 
\`blowbang\` \`blowjob\` \`bondage\` \`boots\` \`brazilian\` \`brunette\` 
\`bukkake\` \`cameltoe\` \`centerfold\` \`cfnm\` \`cheerleader\` \`christmas\` 
\`chubby\` \`close_up\` \`clothed\` \`college\` \`cosplay\` \`cougar\` 
\`cowgirl\` \`creampie\` \`cum_in_mouth\` \`cum_in_pussy\` \`cum_swapping\` 
\`cumshot\` \`deepthroat\` \`dildo\` \`double_penetration\` \`ebony\` 
\`european\` \`face\` \`facesitting\` \`facial\` \`fake_tits\` \`femdom\` 
\`fetish\` \`fingering\` \`fisting\` \`flexible\` \`foot_fetish\` \`footjob\` 
\`gangbang\` \`girlfriend\` \`glamour\` \`glasses\` \`gloryhole\` \`granny\` 
\`groupsex\` \`gyno\` \`hairy\` \`handjob\` \`hardcore\` \`high_heels\` 
\`homemade\` \`housewife\` \`humping\` \`indian\` \`interracial\` \`japanese\` 
\`jeans\` \`kissing\` \`latex\` \`latina\` \`legs\` \`lesbian\` \`lingerie\` 
\`maid\` \`massage\` \`masturbation\` \`mature\` \`milf\` \`missionary\` \`mom\` 
\`natural_tits\` \`natural_tits\` \`nipples\` \`non_nude\` \`nurse\` \`office\` 
\`oiled\` \`orgy\` \`outdoor\` \`panties\` \`pantyhose\` \`party\` \`pegging\` 
\`petite\` \`piercing\` \`pissing\` \`police\` \`pool\` \`pornstar\` \`pov\` 
\`pregnant\` \`public\` \`pussy\` \`pussy_licking\` \`reality\` \`redhead\` 
\`saggy_tits\` \`schoolgirl\` \`secretary\` \`seduction\` \`self_shot\` \`shaved\` 
\`short_hair\` \`shorts\` \`shower\` \`skinny\` \`skirt\` \`smoking\` \`socks\` 
\`spanking\` \`sports\` \`spreading\` \`squirting\` \`ssbbw\` \`stockings\` 
\`strapon\` \`stripper\` \`tall\` \`tattoo\` \`teacher\` \`teen\` 
\`thai\` \`threesome\` \`tiny_tits\` \`titjob\` \`tribbing\` \`undressing\` 
\`uniform\` \`upskirt\` \`voyeur\` \`wedding\` \`wet\` \`wife\` \`yoga_pants\`
`);
    
  if (!['710431360954794004'].includes(message.channel.id)) return;
  try {
    const { url } = await fetch(`https://scathach.redsplit.org/v3/porn/?tags=${args}`).then(response => response.json());
    if (!url[0]) return message.reply('Your query returned no results');

    let embed = new Discord.MessageEmbed()

    .setImage(`${url}`)
    .setTitle('CROTT')
    .setColor('#985ce7')
    message.channel.send(embed);

  } catch (error) {
    return message.channel.send(`Something went wrong: ${error.message}`);
    // Restart the bot as usual.
  }
}

exports.conf = {
  aliases: [],
  cooldown: 1
}

exports.help = {
  name: 'sex',
  description: 'Gets a random porn images',
  usage: 'k!sex',
  example: 'k!sex',
  hide: true
}