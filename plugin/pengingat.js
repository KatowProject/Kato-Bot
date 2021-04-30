let discord = require('discord.js');


module.exports = (client, message) => {

    let embed = new discord.MessageEmbed().setColor("RANDOM");
    let moment = require('moment')(Date.now()).utcOffset("+0700");
    let jam = moment.hours();
    let menit = moment.minutes();
    let channel = '795783129893568572';

    if (jam == 6 && menit == 0) {
        embed.setImage(kato.pagi)
        client.channels.cache.get(channel)
            .send('Hai, Selamat Pagi! \nSemoga Harimu Menyenangkan! ( •̀ ω •́ )y', embed)
    }
    if (jam == 10 && menit == 0) {
        embed.setImage(kato.siang)
        client.channels.cache.get(channel)
            .send('Hai, Selamat Siang!\nJangan lupa makan dulu ya, jangan sampai lemes! O(∩_∩)O', embed)
    }
    if (jam == 15 && menit == 0) {
        embed.setImage(kato.sore)
        client.channels.cache.get(channel)
            .send('Hai, Selamat Sore!\nSemoga bisa menikmati harimu! (≧∇≦)ﾉ', embed)
    }
    if (jam == 18 && menit == 0) {
        embed.setImage(kato.petang)
        client.channels.cache.get(channel)
            .send('Hai, Selamat Petang!\nIstirahatlah jika kamu lelah! o(*^▽^*)┛', embed)
    }
    if (jam == 20 && menit == 00) {
        embed.setImage(kato.malam)
        client.channels.cache.get(channel)
            .send('Hai, Selamat Malam\nJangan bergadang jika tidak penting ya!\nSelalu Jaga Kesehatan ya! ( •̀ ω •́ )✧', embed)
    }
    if (jam == 0 && menit == 0) {
        embed.setImage(kato.tengah)
        client.channels.cache.get(channel)
            .send('Hai, sudah masuk pergantian hari nih.\nSemoga sehat selalu ya! (*^▽^*)', embed)
    }
    if (jam == 3 && menit == 0) {
        embed.setImage(kato.dini)
        client.channels.cache.get(channel)
            .send('Hai, sudah masuk Dini Hari nih.\nJika kamu terbangun, jangan lupa Sholat Tahajud dulu ya! ヾ(≧▽≦*)o', embed)
    }
}