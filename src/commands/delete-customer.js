const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-customer')
    .setDescription('Delete a customer and all its projects from the database  ')
    .addStringOption((option) => option
      .setName('customer')
      .setDescription('The customer')
      .setRequired(true)),
  async execute(interaction) {
    const customer = interaction.options.getString('customer');
    await interaction.reply(`Pong ${customer}!`);
  },
};
