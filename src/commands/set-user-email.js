const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-user-email')
    .setDescription('Update the email of a specific user')
    .addStringOption((option) => option
      .setName('email')
      .setDescription('The new email of the user')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('user')
      .setDescription('The user')
      .setRequired(true)),
  async execute(interaction) {
    const email = interaction.options.getString('email');
    const user = interaction.options.getString('user');
    await interaction.reply(`Pong ${email} ${user}!`);
  },
};
