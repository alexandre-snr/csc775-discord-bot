const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-employees-count')
    .setDescription('Create a function that returns the number of employees from a given company')
    .addStringOption((option) => option
      .setName('company-name')
      .setDescription('The name of the company')
      .setRequired(true)),
  async execute(interaction) {
    const companyName = interaction.options.getString('company-name');
    await interaction.reply(`Pong ${companyName}!`);
  },
};
