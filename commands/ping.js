const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute({ interaction }) {
        const timestamp = Math.abs(Date.now() - interaction.createdTimestamp);
        await interaction.reply({content: `Pong! ${timestamp}ms`, ephemeral: true});
    }
};