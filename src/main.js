const {
  Client, Events, GatewayIntentBits, Collection, REST, Routes,
} = require('discord.js');
const commands = require('./commands');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();
commands.forEach((command) => {
  client.commands.set(command.data.name, command);
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await client.login(process.env.DISCORD_TOKEN);

    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT, process.env.DISCORD_GUILD),
      { body: commands.map((command) => command.data.toJSON()) },
    );
  } catch (err) {
    console.log(err);
  }
})();
