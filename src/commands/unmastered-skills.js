const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmastered-skills')
    .setDescription('Find the skills who are not mastered by anyone'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
