// discord.js 클래스
const { Collection } = require('discord.js');

// config
const { token, channelId } = require(__dirname + '/config.json');

// conn, client Module
const { client, conn } = require('./context');

// scheduling
const scheduling = require('./events/schedule');

// embed
const { welcomeEmbed } = require(__dirname + '/embed/welcomeEmbed.js');

// 메시지 수정을 위한 변수
// let msgId = null;

// command 파일 읽기
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
        await conn.connect({conn});
        console.log("Connected MySQL!");
    } catch (e) {
        console.error(e);
    }
    await scheduling({conn});
})

client.on('interactionCreate', async interaction => {
    // console.log(interaction);
    if (interaction.isSelectMenu() || interaction.commandName === '입력') {
        if (interaction.isSelectMenu()) {
            const command = client.commands.get('입력');
            command.track({interaction, conn});
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
                await interaction.reply({content: '명령 실행 중 오류가 발생했습니다.', ephemeral: true});
            }
        }
    }
    else if (interaction.isCommand()) {

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.\n`
            + `command used: ${interaction.commandName}`);

        try {
            if (interaction.commandName === '출석') {
                await command.execute({interaction, client, conn});
            } else {
                await command.execute({interaction, client});
            }

            // console.log(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({content: '명령 실행 중 오류가 발생했습니다.', ephemeral: true});
        }
    }
});

// add member event
client.on('guildMemberAdd', async member => {
    console.log('guildMemberAdd Event Triggered!');

    await client.channels.cache.get(channelId).send({ embeds: [welcomeEmbed({ member })] }); // send embed
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