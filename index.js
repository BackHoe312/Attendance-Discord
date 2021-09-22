// discord.js 클래스
const { Client, Intents, Collection } = require('discord.js');
const { token, channelId } = require(__dirname + '/config.json');
// embed
const { createEmbed } = require(__dirname + '/embed/welcomEmbed.js');

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

// events 파일 읽기
const eventFiles = fs.readdirSync(__dirname + '/events')
    .filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(__dirname + `/events/${file}`);
    // console.log(event);
    if (event.once) {
        client.once(event.name, async (...args) => event.execute(...args));
    } else {
        client.on(event.name, async (...args) => event.execute(...args));
    }
}

client.on('interactionCreate', async interaction => {
    // console.log(interaction);
    if (interaction.customId === 'track') {
        const track = interaction.values;
        const command = client.commands.get(interaction.commandName);
        console.log(command)
        console.log(command.values.id);
        console.log(track);
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

// client login
client.login(token);