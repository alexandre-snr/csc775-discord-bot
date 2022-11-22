const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('count-certifications')
    .setDescription('Find the employees who have less than or equal a number of certifications')
    .addNumberOption((option) => option
      .setName('max-number-of-certifications')
      .setDescription('The maximum number of certifications')),
  async execute(interaction) {
    const maxNumberOfCertifications = interaction.options.getNumber('max-number-of-certifications') ?? 0;
    await interaction.reply(`Pong ${maxNumberOfCertifications}!`);
  },
};
