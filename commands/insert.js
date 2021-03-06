const { SlashCommandBuilder } = require('@discordjs/builders');
const { trackEmbed } = require(__dirname + '/../embed/trackEmbed.js');
const { commitEmbed } = require(__dirname + '/../embed/commitEmbed.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('입력')
        .setDescription("학생 정보를 입력합니다.")
        .addStringOption(option => option.setName('학번').setDescription('학번을 입력해주세요.'))
        .addStringOption(option => option.setName('이름').setDescription('이름을 입력해주세요.')),
    async execute({ interaction, conn }) {
        sid = interaction.options.getString('학번');
        sname = interaction.options.getString('이름');

        if (isNaN(sid)) { // 학번이 숫자가 아니거나 입력하지 않았을 경우
            await interaction.reply({ content: `학번은 숫자만 입력할 수 있습니다.\nYour entered: ${sid}, ${sname}`, ephemeral: true });
            return;
        } else if (sid.length != 5) {
          await interaction.reply({ content: `학번은 5글자로 입력해주세요.\nYour entered: ${sid}, ${sname}`, ephemeral: true });
          return;
        } else if (!isNaN(sname)) { // 이름이 숫자이거나 입력하지 않았을 경우
            await interaction.reply({ content: `형식에 맞지 않는 이름입니다.\nYour entered:  ${sid}, ${sname}`, ephemeral: true });
            return;
        }

        const sql = `SELECT * FROM std_list WHERE sid = '${sid}'`; // 중복 여부 sql

        await conn.query(sql, function(err, result, fields) { // sql 실행
            if (err) throw err;
            // console.log("result : " + result);
            // console.log("fields : " + fields);
            if (result != "") { // 중복일 경우
                console.log("학번 중복\n입력 : " + sid);
                interaction.reply({ content: '중복된 학번입니다. 다시 입력해주세요.', ephemeral: true });
                return;
            } else { // 중복이 아닐 경우
                interaction.reply({ content: '트랙을 선택해주세요.', components: [trackEmbed], ephemeral: true });
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
        const user_id = interaction.user.id; // 유저 id

        console.log(`${sid}_${sname} 이(가) ${track} 트랙으로 가입합니다.`);
        console.log(`join date : ${joindate} | user id : ${user_id}`);

        const sql = `insert into std_list(sid, sname, track, joindate, user_id) values('${sid}', '${sname}', '${track}', '${joindate}', '${user_id}');`;

        await conn.query(sql, function (error, result, field) {
            if (error) {
                console.log(error);
                interaction.reply({ content: '오류가 발생했습니다. ', ephemeral: true });
                return;
            }
            else {
                console.log('SQL Success!');
                // 역할 구하기
                const role = interaction.message.guild.roles.cache.find(role => role.name === track[0]);
                interaction.member.roles.add(role);

                interaction.reply({ content: `루트에 오신 것을 환영합니다! <@${interaction.user.id}>`, embeds: [commitEmbed({ interaction, sid, sname, track})], ephemeral: false });
                // client.channel.send({ content: `루트에 오신 것을 환영합니다! <@${interaction.user.id}>`, embeds: [commitEmbed({ interaction, sid, sname, track})], ephemeral: false });
            }
        });
    }
};