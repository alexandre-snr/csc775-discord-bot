const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-level-name')
    .setDescription('Create a function that converts a skill level to a readable string')
    .addNumberOption((option) => option
      .setName('level')
      .setDescription('The level of the skill')
      .setRequired(true)),
  async execute(interaction) {
    const level = interaction.options.getNumber('level');
    await interaction.reply(`Pong ${level}!`);
  },
};
