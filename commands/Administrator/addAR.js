const Discord = require('discord.js');
const AR = require('../../database/schema/autoResponse');


exports.run = async (client, message, args) => {

    //verify
    let req = message.author;

    //await message
    let msg_request = await message.channel.send('Untuk menambahkan Autorespond contohnya seperti ini,```json\n{"name": "kato", "text": "cantik", "image": ["link image"]}```');
    let msg_alert = await message.reply('Silahkan masukkan seperti dicontoh untuk melanjutkan, ku beri satu menit untuk mengisinya!');
    let request = await message.channel.awaitMessages((m) => m.content.toLowerCase() && m.author.id === req.id, {
        max: 1,
        time: 60000,
        errors: ["time"]
    }).catch((err) => {
        return message.reply('Waktu permintaan telah habis, silahkan buat permintaan kembali!').then(async t => {
            t.delete({ timeout: 5000 });
            await msg_request.delete()
            await msg_alert.delete();
        });
    });

    //string to json to object
    let json = JSON.parse(request.first().content);
    let obj = {
        name: json.name,
        text: json.text ? json.text : '',
        image: json.image ? json.image : []
    }

    //checking and add ar
    const ARs = await AR.find({ guild: message.guild.id });
    const content = ARs[0].data;
    const check = content.find(a => a.name === obj.name);
    if (check) {

        return message.reply('ada Data dengan nama yang sama, permintaan digagalkan!');

    } else {

        await AR.findOneAndUpdate({ guild: message.guild.id }, { guild: message.guild.id, data: content.concat(obj) })
        return message.reply('Telah selesai ditambahkan!');

    }

}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['ADMINISTRATOR']
}

exports.help = {
    name: 'addar',
    description: 'nambahin ar',
    usage: 'add',
    example: 'add'
}