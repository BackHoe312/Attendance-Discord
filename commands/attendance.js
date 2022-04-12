const { SlashCommandBuilder } = require('@discordjs/builders');
const print_attendance = require(__dirname + '/../func/print_attendance.js');
const { getMsgId } = require('../context');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('출석')
        .setDescription('출석합니다.'),
    async execute({ interaction, conn }) {
        // insert uptime, alter isCheck
        let sql = `update atd_list set isCheck = '1', uptime = curTime() where user_id = '${interaction.user.id}'`;
        // interaction.reply({embeds: [attendanceEmbed({ interaction })], ephemeral: false});
        console.log(conn)
        await conn.execute(sql).then(() => {
            print_attendance(getMsgId());
            interaction.reply({content: '출석을 완료했습니다.', ephemeral: false});
        }).catch(err => {
            console.log(err);
            interaction.reply({content: '오류가 발생했습니다. 관리자에게 문의해주세요.', ephemeral: false});
        });
        return;
    }
};