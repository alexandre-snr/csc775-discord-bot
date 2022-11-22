const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-top-level')
    .setDescription('Find the highest available level of a skill given its name  ')
    .addStringOption((option) => option
      .setName('skill-name')
      .setDescription('The name of the skill')
      .setRequired(true)),
  async execute(interaction) {
    const skillName = interaction.options.getString('skill-name');
    await interaction.reply(`Pong ${skillName}!`);
  },
};
