const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    trackEmbed: new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('track')
                .setPlaceholder('νΈλ μ ν')
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
                        label: 'WebHack',
                        description: 'Hack a Web',
                        value: 'WebHack',
                    }
                ]),
        )

};