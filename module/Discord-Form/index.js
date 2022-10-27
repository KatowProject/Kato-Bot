const Discord = require('discord.js');
const db = require('../../database/schema/formModal');
const cooldown = new Discord.Collector();

class DiscordForm {
    constructor(obj = {}) {
        this.client = obj.client;
    }

    async createForm(message) {
        message.channel.send({ content: 'Masukkan judul form' });
    }



    async event(interaction) {
        // if (interaction.isButton() && interaction.customId.includes("open-form"))// this.openForm(interaction);
        //     if (interaction.isModalSubmit() && interaction.customId.includes("form"))// this.submitForm(interaction);
    }

    init() {
        this.client.on('interactionCreate', this.event)
    }
}