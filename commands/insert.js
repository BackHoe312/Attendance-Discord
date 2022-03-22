const { SlashCommandBuilder } = require('@discordjs/builders');
const { trackEmbed } = require(__dirname + '/../embed/trackEmbed.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('insert')
        .setDescription("Inserting student's information")
        .addStringOption(option => option.setName('학번').setDescription('학번을 입력해주세요.'))
        .addStringOption(option => option.setName('이름').setDescription('이름을 입력해주세요.')),
    async execute({ interaction }) {
        // stdID = interaction.options.getString('학번_이름'); // id_name
        // id = stdID.substring(0, 5);
        // name = stdID.substring(6, );
        id = interaction.options.getString('학번');
        name = interaction.options.getString('이름');
        if (isNaN(id)) { // ID is Not a Number
            await interaction.reply({
                content: `Student ID must be a number!\nYour entered: ${id}, ${name}`, // ${stdID}
                ephemeral: false
            });
            return;
        }
        else if (!isNaN(name)) { // Name is Number
            await interaction.reply({ content: `Student Name must be letters!\nYour entered:  ${id}, ${name}`, ephemeral:false }); // ${stdID}
            return;
        }
        else {
            await interaction.reply({ content: "Select Your Track!", components: [ trackEmbed ], ephemeral: false });
        }
    },
    getID() {
        const stdID = {id,name};
        return stdID;
    }
};