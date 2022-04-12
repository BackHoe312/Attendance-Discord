const print_attendance = require('../func/print_attendance');
const schedule = require('node-schedule');
const { channelId } = require('../config');

// conn, client module
const { client, conn, setMsgId } = require('../context')

// nodeschedule.scheduleJob(rule, function (){
//     console.log("Schedule active!");
//
//     //put in here
//     set_attendance({conn});
// })

async function set_attendance() { // atd_list에 학생 정보를 추가하여 세팅
    let sql = `select * from std_list where sid like '10%'`; // 1학년 학생만 선택
    const [stdInfo] = await conn.query(sql); // 학생 정보를 배열로 반환
    sql = "insert into atd_list (sid, sname, track, user_id) values"; // 출석 정보 입력
    for (let i = 0; i < stdInfo.length; i++){ // 다중 쿼리를 통해 쿼리 설정
        console.log("stdInfo[i] ", stdInfo[i]); // print result
        if(i!=0) sql+=",";
        sql += `('${stdInfo[i].sid}', '${stdInfo[i].sname}', '${stdInfo[i].track}', '${stdInfo[i].user_id}')`;
    }
    console.log(sql)
    try {
        await conn.execute(sql) // 쿼리 실행
        console.log("complete set attendance")
    } catch (e) {
        console.log("set_attendance error ", e);
    }
    client.channels.cache.get(channelId).send("12시입니다. 출석해주세요.").then(msg => {
        // console.log("msg ", msg); // msg Info
        setMsgId(msg.id); // msg id 저장
        print_attendance();
    });
}

module.exports = async function scheduling() {
    // 화 ~ 토 오전 12시
    const rule = '0 0 0 * * 2-6';
    // const rule = new schedule.RecurrenceRule();
    // rule.tz = 'EDT';
    // rule.dayOfWeek = [new schedule.Range(2, 5)];
    // rule.hour = 2;
    // rule.minute = 10;

    const job = schedule.scheduleJob(rule, async () => {
        console.log("Schedule active!");
        await set_attendance();
    });
}