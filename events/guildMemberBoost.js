let discord = require('discord.js')
let p = [
    'https://media1.tenor.com/images/bc58975b4797d945c2cdffe2dda64a0f/tenor.gif',
    'https://www.animefeminist.com/wp-content/uploads/2018/03/Samantha-Coming-Out-003-20180312.jpg',
    'https://i.kym-cdn.com/photos/images/original/001/155/275/559.gif',
    'https://media3.giphy.com/media/kigfYxdEa5s1ziA2h1/source.gif',
    'https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif',
    'https://media1.tenor.com/images/0ec6bf6d627e139db6028651b213e841/tenor.gif',
    'https://gif-free.com/uploads/posts/2017-05/1493703506_spongebob-thumb-up.gif'
]
let rstatus = Math.floor(Math.random() * p.length);

module.exports = async (client, member) => {
    let embed = new discord.MessageEmbed()
        .setColor(client.warna.kato)
        .setAuthor('Member Boost', 'https://cdn.discordapp.com/emojis/638719606738911236.gif')
        .setDescription(`Hai ${member}, terima kasih telah boost di server Perkumpulan Orang Santai ヾ(≧▽≦*)o `)
        .setImage(p[rstatus])
    client.channels.cache.find(a => a.name === 'chit-chat').send(embed);
}