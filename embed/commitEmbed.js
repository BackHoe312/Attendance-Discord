const { MessageEmbed } = require('discord.js');

module.exports = {
    createEmbed({ interaction, sid, sname, track }) {
        const commitEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`정보입력`)
            .setAuthor({ name: 'Root-bot', iconURL: 'https://i.pinimg.com/564x/bd/d8/ca/bdd8ca06b4c8ea9772ff34003db2e2c9.jpg' })
            .setDescription('입력이 성공적으로 완료되었습니다.')
            .setThumbnail(`${interaction.user.displayAvatarURL()}`)
            .addFields(
                // { name: 'Regular field title', value: 'Some value here' },
                // { name: '\u200B', value: '\u200B' },
                { name: '학번', value: `${sid}`, inline: true },
                { name: '이름', value: `${sname}`, inline: true },
                { name: '트랙', value: `${track}`, inline: true },
            )
            .setTimestamp()

        return commitEmbed;
    }
}