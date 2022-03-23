// discord.js 클래스
const { Client, Intents, Collection, Role } = require('discord.js');
const { token, channelId } = require(__dirname + '/config.json');
// embed
const { createEmbed } = require(__dirname + '/embed/welcomEmbed.js');
// DB
const db_config = require(__dirname + '/DB/DBConnection.js');
const conn = db_config.init();
// student info
let id, name;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

// command 파일 읽기/
const fs = require('fs');

client.commands = new Collection();
const commandFiles = fs.readdirSync(__dirname + '/commands')
    .filter(file => file.endsWith('.js'));
// fs.readSync => 디렉토리에 있는 파일 이름을 배열로 반환
// .js로 끝나는 파일만 filter로 선택

for (const file of commandFiles) {
    const command = require(__dirname + `/commands/${file}`);

    client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
    console.log(`Ready!\nLogged in as ${client.user.tag}`);
    try {
        conn.connect();
        console.log("Connected MySQL!");
    } catch (e) {
        console.error(e);
    }
})

client.on('interactionCreate', async interaction => {
    // console.log(interaction);
    if (interaction.isSelectMenu() || interaction.commandName === 'insert') {
        if (interaction.isSelectMenu()) {
            const command = client.commands.get('insert');
            await command.track({interaction, conn});

            // const track = interaction.values; // 선택된 트랙
            // const today = new Date();
            // const year = today.getFullYear();
            // const month = today.getMonth() + 1;
            // const date = today.getDate();
            // const joindate = `${year}/${month}/${date}`;
            //
            // const sql = `insert into std_list(sid, sname, track, joindate) values('${id}', '${name}', '${track}', '${joindate}');`;
            //
            // await interaction.deferReply(); // 대기상태로 변경
            // let msg = "";
            // conn.query(sql, function (error, result, field) {
            //     if (error) {
            //         console.log(error);
            //         msg = "오류가 발생했습니다. 관리자에게 문의해주세요.";
            //     }
            //     else {
            //         console.log('SQL Success!');
            //         msg = "성공적으로 저장되었습니다. 루트에 오신 것을 환영합니다!";
            //     }
            //     console.log(result);
            // });
            // await wait(1000); // 쿼리문이 끝날 때까지 1초 대기
            //
            // // 역할 구하기
            // const role = await interaction.message.guild.roles.cache.find(role => role.name === track[0]);
            // console.log(role);
            // await interaction.member.roles.add(role);
            //
            // await interaction.editReply({ content: msg, components: [] }); // 결과 출력
        }
        else {
            const command = client.commands.get(interaction.commandName);

            console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.\n`
                + `command used: ${interaction.commandName}`);

            try {
                // if (commandName === 'ping') {
                //     await command.execute({ interaction })
                await command.execute({interaction, conn});

                // console.log(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({content: 'The was error while executing this command!', ephemeral: true});
            }

            // const stdID = command.getID()
            // id = stdID.id;
            // name = stdID.name;
        }
    }
    else if (interaction.isCommand()) {

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.\n`
            + `command used: ${interaction.commandName}`);

        try {
            await command.execute({client, interaction});

            // console.log(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({content: 'The was error while executing this command!', ephemeral: true});
        }
    }
});

// add member event
client.on('guildMemberAdd', async member => {
    console.log('guildMemberAdd Event Triggered!');

    await client.channels.cache.get(channelId).send({ embeds: [createEmbed({ member })] });
});

// events 파일 읽기
// const eventFiles = fs.readdirSync(__dirname + '/events')
//     .filter(file => file.endsWith('.js'));
//
// for (const file of eventFiles) {
//     const event = require(__dirname + `/events/${file}`);
//     // console.log(event);
//     if (event.once) {
//         client.once(event.name, async (...args) => event.execute(...args));
//     } else {
//         client.on(event.name, async (...args) => event.execute(...args));
//     }
// }

// client login
client.login(token);