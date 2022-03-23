const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    trackEmbed: new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('track')
                .setPlaceholder('트랙 선택')
                .addOptions([
                    {
                        label: 'Pwnable',
                        description: 'like System hacking',
                        value: 'Pwnable',
                    },
                    {
                        label: 'Reversing',
                        description: 'analysis Program',
                        value: 'Reversing',
                    },
                    {
                        label: 'WebHacking',
                        description: 'Hack a Web',
                        value: 'Webhacking',
                    }
                ]),
        )
};