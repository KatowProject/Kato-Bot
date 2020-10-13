const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args) => {
    //ignore channel
    if (client.config.discord.channel.includes(message.channel.id)) return;

    //get data in db
    /*
    -------------------------1.0 create database in quick.db-------------------------------
    ||example to create a database of the question in command||
    let db = require('quick.db');
    let table = new db.table('trivia');
    table.set('quiz', args.join(' '))

    ----------------------1.1 write it like this the argument (args)-----------------------
    [
        {
            question: 'kato is beautiful?',
            answer: ['yes', 'no', 'maybe'],
            correct: 'yes'
        },
        {
            ....
        },
        ....
    ]
    ---------------------2.0 to add a question, create a command to push the object.--------------
    ||example command||
    let db = require('quick.db');
    let table = new db.table('trivia');
    table.push('quiz', args.join(' '));

   ----------------------2.1 write it like this the argument (args)-------------------------------
    {
        question: '',
        answer: ['','',''], //three string in the array require
        correct: ''
    }

    */
    let table_soal = new db.table('tv');
    let soal = table_soal.get('soal');
    let rstatus = Math.floor(Math.random() * soal.length);
    let quiz = soal[rstatus];


    let embed = new Discord.MessageEmbed()
        .setColor(client.warna.kato)
        .setTitle('Trivia Seputar POS')
        .setDescription(quiz.pertanyaan)

    let req = message.author;
    let kata_kunci = [];
    quiz.jawaban.forEach((a, i) => {
        embed.addField(`Jawaban ${i + 1}`, a, true);
        kata_kunci.push(a);
    });

    let msg = await message.channel.send(embed);
    let alert = await message.reply('aku beri waktu 20 detik untuk menjawabnya!');

    let response = await message.channel.awaitMessages((m) => kata_kunci.includes(m.content) && m.author.id == req.id, {
        max: 1,
        time: 20000,
        errors: ["time"]
    }).catch((err) => {
        q.delete()
        message.reply('Waktu permintaan telah habis, silahkan buat permintaan kembali!').then(t => t.delete({ timeout: 5000 }));
    })

    const index = response.first().content;
    await msg.delete();
    await alert.delete();

    if (index.toLowerCase() === quiz.bener.toLowerCase()) {
        message.reply('Keren, jawaban kamu benar.');
    } else {
        message.reply('yah, kamu salah menjawabnya.');
    };

};

exports.conf = {
    aliases: [],
    cooldown: 120
};

exports.help = {
    name: 'trivia',
    description: 'bot',
    usage: 'trivia',
    example: 'trivia'
};