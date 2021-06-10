let Discord = require('discord.js');
let db = require('quick.db');

exports.run = async (client, message, args) => {

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
    let ar = new db.table('ARs');
    let list_data = ar.all()
    let array = [];
    for (let i = 0; i < list_data.length; i++) {
        array.push(JSON.parse(list_data[i].data))
    }
    let check = array.find(a => a.name === obj.name);
    if (check) {
        return message.reply('telah ada ar dengan nama yang sama, permintaan digagalkan!');
    } else {

        await ar.set(obj.name, obj);
        await message.channel.send('telah selesai ditambahkan!');
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permission: ['ADMINISTRATOR']
}

exports.help = {
    name: 'addar',
    description: 'nambahin ar',
    usage: 'add',
    example: 'add'
}