const { MessageEmbed } = require('discord.js')

module.exports = async (client, message) => {

    const embed = new MessageEmbed().setColor('#985ce7')
    let ar = [
        {
            name: 'pedo',
            link: ['https://cdn.discordapp.com/attachments/519859252966457369/641765228987809802/FB_IMG_1571834909693.png']
        },
        {
            name: 'ngaca',
            link: ['https://cdn.discordapp.com/attachments/447408276628307969/714442765311803472/Screenshot_2020-05-25-18-40-09-59.png']
        },
        {
            name: '<@' + '>',
            link: ['https://cdn.discordapp.com/attachments/519859252966457369/702365347721773116/kato_ping.gif']
        },
        {
            name: 'trumint',
            link: ['https://cdn.discordapp.com/attachments/447408276628307969/717310728209694770/ture_miny.png', 'https://cdn.discordapp.com/attachments/447408276628307969/717284086011527188/FB_IMG_1590936689041.jpg']
        }
    ]

    let msg = ar.find(a => a.name === message.content.toLowerCase());

    //trigger 
    if (msg) {
        let rstatus = Math.floor(Math.random() * msg.link.length)
        embed.setImage(msg.link[rstatus])
        message.channel.send(embed)
    }
}