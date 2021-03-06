const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Replies user information!'),
    async execute({ interaction, ...params }) {
        const date = new Date(interaction.member.joinedTimestamp);
        await interaction.reply(`Your tag: ${interaction.user.tag}\n`
            + `Join: ${date}\n`
            + `Your avatar: ${interaction.user.avatarURL()}`
        );
    }
};

