const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('find-lazy-employees')
    .setDescription('Find the employees who have taken more than a number of holidays')
    .addNumberOption((option) => option
      .setName('min-number-of-holidays-taken')
      .setDescription('The minimum number of holidays taken')),
  async execute(interaction) {
    const minNumberOfHolidaysTaken = interaction.options.getNumber('min-number-of-holidays-taken') ?? 3;
    await interaction.reply(`Pong ${minNumberOfHolidaysTaken}!`);
  },
};
