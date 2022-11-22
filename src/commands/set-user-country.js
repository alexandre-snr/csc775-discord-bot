const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-user-country')
    .setDescription('Update the country of a specific user')
    .addStringOption((option) => option
      .setName('country')
      .setDescription('The new country of the user')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('user')
      .setDescription('The user')
      .setRequired(true)),
  async execute(interaction) {
    const country = interaction.options.getString('country');
    const user = interaction.options.getString('user');
    await interaction.reply(`Pong ${country} ${user}!`);
  },
};
