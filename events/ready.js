const conn = require(__dirname + '/../DB/DBConnection.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready!\nLogged in as ${client.user.tag}`);
        try {
            conn.connect();
            console.log("Connected MySQL!");
        } catch (e) {
            console.error(e);
        }
    }
};