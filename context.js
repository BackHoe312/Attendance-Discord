// discord.js 클래스
const { Client, Intents, Collection } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

// DB
const db_config = require(__dirname + '/DB/DBConnection.js');
const conn = db_config.init();

let msgId;

module.exports = {
    client: client,
    conn: conn,
    setMsgId(id) {
        msgId = id;
    },
    getMsgId() {
        return msgId;
    }
}
