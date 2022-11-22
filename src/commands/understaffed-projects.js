const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('understaffed-projects')
    .setDescription('Find all projects where a skill is required and no one in the company manages it'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
