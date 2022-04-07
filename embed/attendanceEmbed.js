const { MessageEmbed } = require('discord.js');

module.exports = {
    async attendanceEmbed({ values }) {
        console.log("values", values);
        const attendanceEmbed = await new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('출석체크')
            .setAuthor({ name: 'Root-bot', iconURL: 'https://i.pinimg.com/564x/bd/d8/ca/bdd8ca06b4c8ea9772ff34003db2e2c9.jpg' })
            .setDescription('')
            .setThumbnail()
            .addFields(
                // values.none_atd.map(item => ({ name: '미출석자', value: item})),
                // values.ok_atd.map(item => ({ name: '출석자', value: item})),
                ({name: '미출석자', value: values.none_atd.length > 0?values.none_atd.join('\n'):"미출석자가 없습니다.", inline: true}),
                { name: '\u200B', value: '\u200B', inline: true },
                ({name: '출석자', value: values.ok_atd.length > 0?values.ok_atd.join('\n'):"출석자가 없습니다.", inline: true}),
                { name: '\u200B', value: '\u200B', inline: true },
            )
            .setTimestamp()
            .setFooter({text: 'Root-bot', iconURL: 'https://i.pinimg.com/564x/bd/d8/ca/bdd8ca06b4c8ea9772ff34003db2e2c9.jpg'});

        return attendanceEmbed;
    }
}