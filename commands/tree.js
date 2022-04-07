const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('족보')
        .setDescription('위대한 선배들의 역사를 불러옵니다.'),
    async execute({interaction}) {
        await interaction.reply({content: `Pong! ${timestamp}ms`, ephemeral: true});
    }
}