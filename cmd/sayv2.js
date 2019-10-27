// NPM Package = discord.js
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let string_message = args.slice(0).join(" ");
    if(string_message == "") string_message = " "; 

    if(message.attachments.size > 0){
        // Last Message ID
        let lastMessage_author = message.author.lastMessageID;
        // Get Last Message ID
        let message_id = message.channel.messages.get(`${mAuthor}`);
        // Attachment ID
        let gAttachment = message_id.attachments.map(file => file.id);
        // Get Attachment ID
        let attachment_id = message_id.attachments.get(`${gAttachment}`);
        // URL Images
        let attached = `${attachment_id.url}`;

        message.delete().catch(err => {});

        // Attach an image
        message.channel.send(`${string_message}`, {disableEveryone : true, files: [`${attached}`]});
    }
    else {
        //check apakah tidak ada args[0]
        //jika iya, maka return kosong (tidak merespon message)
        if(!args[0]){
            return;
        }
        //jika tidak, maka eksekusi instruksi dibawahnya
        else{
            message.delete();
            
            //message no attachment
            message.channel.send(`${string_message}`, {disableEveryone : true});
        }
    }
}

module.exports.help = {
    name: "say"
}
