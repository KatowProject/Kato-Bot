
const {MessageEmbed} = require('discord.js')
const neko = require('nekos.life')
const {nsfw} = new neko()

module.exports = async (client,message) => {
let prefix = "k!"
if (message.author.bot) return undefined;
if (!message.content.startsWith(prefix)) return undefined;

let command = message.content.toLowerCase().split(' ')[0];
    command = command.slice(prefix.length)

    if (command === "nsfw") {
        if(message.channel.id === "710431360954794004"){
        let embed = new MessageEmbed()
        .addField("**rhentai**" , "`Get a Random of Hentai gif`",true)
        .addField("**pussy**" , "`Get a NSFW Pussy`",true)
        .addField("**lesbian**" , "`Get a NSFW Lesbian`",true)
        .addField("**cumluts**" , "`Get a NSFW cumsluts`",true)
        .addField("**anal**", "`Get a NSFW anal`",true)
        .addField("**tits**", "`Get a NSFW tits`",true)
        .addField("**girl**", "`Get a NSFW girlSolo`",true)
        .addField("**hentai**", "`Get a NSFW hentai`",true)
        .addField("**futa**", "`Get a NSFW Futanari`",true)
        .addField("**feet**", "`Get a NSFW feetgif`",true)
        .addField("**blowjob**","`Get a NSFW Blowjob`",true)
        
        message.channel.send(embed);
        }
          else return;
    
    } 
 else if (command === "anal") {

    if(message.channel.id === "710431360954794004"){
        let rhentai = await nsfw.anal();
     if (rhentai) {
      let embed = new MessageEmbed()
       .setTitle(`( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)`)
       .setColor("#985ce7")
       .setImage(rhentai.url);
      
      message.channel.send(embed);
     } 
    }
      else return;
 }
 else if (command === "blowjob") {
    if(message.channel.id === "710431360954794004"){
        let rhentai = await nsfw.blowJob();
     if (rhentai) {
      let embed = new MessageEmbed()
       .setTitle(`( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)`)
       .setColor("#985ce7")
       .setImage(rhentai.url);
      
      message.channel.send(embed);
     } 
    }
      else return;
 }
 else if (command === "cumarts") {
    if(message.channel.id === "710431360954794004"){
        let rhentai = await nsfw.cumArts();
     if (rhentai) {
      let embed = new MessageEmbed()
       .setTitle(`( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)`)
       .setColor("#985ce7")
       .setImage(rhentai.url);
      
      message.channel.send(embed);
     } 
    }
      else return;
 }
 else if (command === "cumluts") {
    if(message.channel.id === "710431360954794004"){
        let rhentai = await nsfw.cumsluts();
     if (rhentai) {
      let embed = new MessageEmbed()
       .setTitle(`( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)`)
       .setColor("#985ce7")
       .setImage(rhentai.url);
      
      message.channel.send(embed);
     } 
    }
      else return;
 }
 else if (command === "feet") {
    if(message.channel.id === "710431360954794004"){
        let rhentai = await nsfw.feetGif()
     if (rhentai) {
      let embed = new MessageEmbed()
       .setTitle(`( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)`)
       .setColor("#985ce7")
       .setImage(rhentai.url);
      
      message.channel.send(embed);
     } 
    }
      else return;
 } 
 else if (command === "futa") {
    if(message.channel.id === "710431360954794004"){
        let rhentai = await nsfw.futanari();
     if (rhentai) {
      let embed = new MessageEmbed()
       .setTitle(`( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)`)
       .setColor("#985ce7")
       .setImage(rhentai.url);
      
      message.channel.send(embed);
     } 
    }
      else return;
 }
 else if (command === "girl") {
    if(message.channel.id === "710431360954794004"){
        let rhentai = await nsfw.girlSoloGif()
     if (rhentai) {
      let embed = new MessageEmbed()
       .setTitle(`( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)`)
       .setColor("#985ce7")
       .setImage(rhentai.url);
      
      message.channel.send(embed);
     } 
    }
      else return;
 }
 else if (command === "hentai") {
    if(message.channel.id === "710431360954794004"){
        let rhentai = await nsfw.hentai();
     if (rhentai) {
      let embed = new MessageEmbed()
       .setTitle(`( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)`)
       .setColor("#985ce7")
       .setImage(rhentai.url);
      
      message.channel.send(embed);
     } 
    }
      else return;
 }
 else if (command === "lesbian") {
    if(message.channel.id === "710431360954794004"){
        let rhentai = await nsfw.yuri()
     if (rhentai) {
      let embed = new MessageEmbed()
       .setTitle(`( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)`)
       .setColor("#985ce7")
       .setImage(rhentai.url);
      
      message.channel.send(embed);
     } 
    }
      else return;
 }
 else if (command === "pussy") {
    if(message.channel.id === "710431360954794004"){
        let rhentai = await nsfw.pussy()
     if (rhentai) {
      let embed = new MessageEmbed()
       .setTitle(`( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)`)
       .setColor("#985ce7")
       .setImage(rhentai.url);
      
      message.channel.send(embed);
     } 
    }
      else return;
 }
 else if (command === "rhentai") {
    if(message.channel.id === "710431360954794004"){
        let rhentai = await nsfw.randomHentaiGif();
     if (rhentai) {
      let embed = new MessageEmbed()
       .setTitle(`( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)`)
       .setColor("#985ce7")
       .setImage(rhentai.url);
      
      message.channel.send(embed);
     } 
    }
      else return;  
 }
 else if (command === "tits") {
    if(message.channel.id === "710431360954794004"){
        let rhentai = await nsfw.tits()
     if (rhentai) {
      let embed = new MessageEmbed()
       .setTitle(`( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)`)
       .setColor("#985ce7")
       .setImage(rhentai.url);
      
      message.channel.send(embed);
     } 
    }
      else return;
 }
 else if (command === "boobs") {
    if(message.channel.id === "710431360954794004"){
        let rhentai = await nsfw.boobs();
     if (rhentai) {
      let embed = new MessageEmbed()
       .setTitle(`( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)`)
       .setColor("#985ce7")
       .setImage(rhentai.url);
      
      message.channel.send(embed);
     } 
    }
      else return;
 }
} 