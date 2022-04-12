const { channelId } = require('../config.json');
const { attendanceEmbed } = require('../embed/attendanceEmbed');

// client, conn module
const { client, conn, getMsgId } = require('../context');

module.exports = async function print_attendance() {
    let values = { // 미출석자와 출석자를 담아줄 객체
        none_atd: [],
        ok_atd: []
    }
    // 해당 날짜의 출석 명단
    const sql = `select sname from atd_list where isCheck = 0 and currDate = curDate();`
        + `select sname from atd_list where isCheck = 1 and currDate = curDate();`;
    const [result] = (await conn.query(sql))
    console.log("result ", result); // print result
    // 해당 날짜의 미출석자
    values.none_atd = await result[0].map(x => x.sname);
    // 해당 날짜의 출석자
    values.ok_atd = await result[1].map(x => x.sname);
    // console.log("values ", values); // print values
    const embed = await attendanceEmbed({values});
    // console.log("embed ", embed); // print embed
    // client.channels.cache.get(channelId).send({content: '12시입니다. 출석체크를 해주세요.'}).then((message) => message.edit({ embeds: [embed]}));
    console.log(getMsgId())
    await client.channels.cache.get(channelId).messages.fetch(getMsgId())
        .then((message) => message.edit( { embeds: [embed]}))
        .catch(err => {
                console.log(err);
    });
}
