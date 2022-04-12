const { SlashCommandBuilder } = require('@discordjs/builders');
const { conn } = require('../context');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('select')
        .setDescription('select all student!'),
    async execute() {
        await conn.query("SELECT * FROM atd_list", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        })
    }
}