const { SlashCommandBuilder } = require('@discordjs/builders');
const print_attendance = require(__dirname + '/../func/print_attendance.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('출석')
        .setDescription('출석합니다.'),
    async execute({ interaction, client, conn }) {
        // insert isUptime, alter isCheck
        let sql = `update atd_list set isCheck = 1, uptime = curTime() where sid = ${interaction.user.id}`;
        // interaction.reply({embeds: [attendanceEmbed({ interaction })], ephemeral: false});
        console.log(conn)
        await conn.execute(sql).then(() => {
            print_attendance({client, conn});
        }).catch(err => {
            console.log(err);
            interaction.reply({content: '오류가 발생했습니다. 관리자에게 문의해주세요.', ephemeral: false});
        });
        return;
    }
};