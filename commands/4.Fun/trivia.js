const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args) => {
    //ignore channel
    if (client.config.channel.includes(message.channel.id)) return;

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
    let rstatus = Math.floor(Math.random() * soal.length)
    let quiz = soal[rstatus]


    let embed = new Discord.MessageEmbed()
        .setColor(client.warna.kato)
        .setTitle('Trivia Seputar POS')
        .setDescription(quiz.pertanyaan)

    for (let i = 0; i < quiz.jawaban.length; i++) {
        embed.addField(`Jawaban ${i + 1}`, quiz.jawaban[i], true)
    }

    let r = await message.channel.send(embed);
    r.react('1️⃣');
    r.react('2️⃣');
    r.react('3️⃣');

    const aOne = (reaction, user) =>
        reaction.emoji.name === `1️⃣` && user.id === message.author.id;
    const aTwo = (reaction, user) =>
        reaction.emoji.name === `2️⃣` && user.id === message.author.id;
    const aThree = (reaction, user) =>
        reaction.emoji.name === `3️⃣` && user.id === message.author.id;

    const oneA = r.createReactionCollector(aOne);
    const twoA = r.createReactionCollector(aTwo);
    const threeA = r.createReactionCollector(aThree);

    oneA.on('collect', (f) => {
        r.delete();
        if (quiz.jawaban[0].toLowerCase() === quiz.bener.toLowerCase()) {
            message.channel.send('bener')
        } else {
            message.channel.send('salah men')
        }
    })

    twoA.on('collect', (f) => {
        r.delete();
        if (quiz.jawaban[1].toLowerCase() === quiz.bener.toLowerCase()) {
            message.channel.send('bener')
        } else {
            message.channel.send('salah men')
        }
    })

    threeA.on('collect', (f) => {
        r.delete();
        if (quiz.jawaban[2].toLowerCase() === quiz.benar.toLowerCase()) {
            message.channel.send('bener')
        } else {
            message.channel.send('salah men')
        }
    })
}

exports.conf = {
    aliases: [],
    cooldown: 120
}

exports.help = {
    name: 'trivia',
    description: 'bot',
    usage: 'trivia',
    example: 'trivia'
}