const { MessageEmbed } = require('discord.js')

module.exports = async (client, message) => {

    const embed = new MessageEmbed()
        .setColor('#985ce7')
    //message
    const ar = {
        kato: `<@${client.user.id}>` && `<@!${client.user.id}>`,
        everyone: '@everyone',
        ngaca: 'ngaca',
        pedo: 'pedo',
        trumint: 'trumint'
    }
    //link
    const link = {
        pedo: 'https://cdn.discordapp.com/attachments/519859252966457369/641765228987809802/FB_IMG_1571834909693.png',
        ngaca: 'https://cdn.discordapp.com/attachments/447408276628307969/714442765311803472/Screenshot_2020-05-25-18-40-09-59.png',
        ping_kato: 'https://cdn.discordapp.com/attachments/519859252966457369/702365347721773116/kato_ping.gif',
        trumint: ['https://cdn.discordapp.com/attachments/447408276628307969/717284086011527188/FB_IMG_1590936689041.jpg', 'https://cdn.discordapp.com/attachments/447408276628307969/717310728209694770/ture_miny.png'],
    }

    //trigger 
    if (message.content.toLowerCase() === ar.kato) {// Ar jika mention Kato
        embed.setImage(link.ping_kato)
        message.channel.send(embed)
    } else
        if (message.content.toLowerCase() === ar.everyone) {// Ar jika mention everyone
            if (message.channel.id === '401532703301828610') return
            if (message.channel.id === '653194232462442516') return
            embed.setImage(link.ping_kato)
            message.channel.send(embed)
        } else
            if (message.content.toLowerCase() === ar.ngaca) {// Ar jika ketik ngaca
                embed.setImage(link.ngaca)
                message.channel.send(embed)
            } else
                if (message.content.toLowerCase() === ar.pedo) {// Ar jika ketik pedo
                    embed.setImage(link.pedo)
                    message.channel.send(embed)
                } else
                    if (message.content.toLowerCase() === ar.trumint) {// Ar jika ketik trumint
                        let rstatus = Math.floor(Math.random() * link.trumint.length)
                        embed.setImage(link.trumint[rstatus])
                        message.channel.send(embed)
                    }


}