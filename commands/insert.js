const { SlashCommandBuilder } = require('@discordjs/builders');
const { trackEmbed } = require(__dirname + '/../embed/trackEmbed.js');
// DB
// const db_config = require(__dirname + '/DB/DBConnection.js');
// const conn = db_config.init();
// wait for the bot to be ready
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('insert')
        .setDescription("학생 정보를 입력합니다.")
        .addStringOption(option => option.setName('학번').setDescription('학번을 입력해주세요.'))
        .addStringOption(option => option.setName('이름').setDescription('이름을 입력해주세요.')),
    async execute({ interaction, conn }) {
        sid = interaction.options.getString('학번');
        sname = interaction.options.getString('이름');

        if (isNaN(sid)) { // 학번이 숫자가 아닐 경우
            await interaction.reply({ content: `학번은 숫자만 입력할 수 있습니다.\nYour entered: ${sid}, ${sname}`, ephemeral: false });
            return;
        } else if (sid.length != 5) {
          await interaction.reply({ content: `학번은 5글자로 입력해주세요.\nYour entered: ${sid}, ${sname}`, ephemeral: false });
          return;
        } else if (!isNaN(sname)) { // 이름이 숫자일 경우
            await interaction.reply({ content: `형식에 맞지 않는 이름입니다.\nYour entered:  ${sid}, ${sname}`, ephemeral: false });
            return;
        }

        const sql = `SELECT * FROM std_list WHERE sid = '${sid}'`; // 중복 여부 sql

        await interaction.deferReply({ ephemeral: true });
        conn.query(sql, function(err, result, fields) { // sql 실행
            if (err) throw err;
            // console.log("result : " + result);
            // console.log("fields : " + fields);
            if (result != "") { // 중복일 경우
                console.log("학번 중복\n입력 : " + sid);
                wait(1000);
                interaction.editReply({ content: '중복된 학번입니다. 다시 입력해주세요.', ephemeral: false });
                return;
            } else { // 중복이 아닐 경우
                wait(1000);
                interaction.editReply({ content: '트랙을 선택해주세요.', components: [trackEmbed], ephemeral: false });
            }
        });
    },
    async track({ interaction, conn }) {
        const track = interaction.values;
        // console.log(track);
        // 날짜 객체
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = today.getDate();
        const joindate = `${year}/${month}/${date}`; // 가입 날짜

        console.log('sid: ' + sid);

        const sql = `insert into std_list(sid, sname, track, joindate) values('${sid}', '${sname}', '${track}', '${joindate}');`;

        conn.query(sql, function (error, result, field) {
            if (error) {
                console.log(error);
                interaction.editReply({ content: '오류가 발생했습니다. ', ephemeral: false });
                return;
            }
            else {
                console.log('SQL Success!');
                // 역할 구하기
                const role = interaction.message.guild.roles.cache.find(role => role.name === track[0]);
                interaction.member.roles.add(role);

                interaction.editReply({ content: '입력이 완료되었습니다. 루트에 오신 것을 환영합니다!', ephemeral: false });
            }
        });
    }
};