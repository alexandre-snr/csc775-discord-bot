const { Client, Events, GatewayIntentBits } = require('discord.js');
const { openConnection } = require('./database/connection');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.id === client.user.id) {
    return;
  }

  if (message.content === 'Ping') {
    await message.reply('Pong!');
  } else if (message.content === '/companies') {
    const db = await openConnection();

    const [rows] = await db.execute('SELECT * FROM Company');

    await message.reply(rows.map((company) => `${company.company_id}: ${company.name}`).join('\n'));

    await db.destroy();
  }
});

client.login(process.env.DISCORD_TOKEN);
