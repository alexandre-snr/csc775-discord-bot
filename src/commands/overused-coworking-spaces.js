const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('overused-coworking-spaces')
    .setDescription('Find the coworking spaces with more than a certain number of employees')
    .addNumberOption((option) => option
      .setName('min-number-of-employees')
      .setDescription('The minimum number of employees')),
  async execute(interaction) {
    const minNumberOfEmployees = interaction.options.getNumber('min-number-of-employees') ?? 3;
    await interaction.reply(`Pong ${minNumberOfEmployees}!`);
  },
};
