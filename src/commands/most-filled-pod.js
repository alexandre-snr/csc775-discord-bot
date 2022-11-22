const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('most-filled-pod')
    .setDescription('Find the pod with the most engineers'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
