const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-certifications-count')
    .setDescription('Find certifications count of an institution by its name')
    .addStringOption((option) => option
      .setName('institution-name')
      .setDescription('The name of the institution')
      .setRequired(true)),
  async execute(interaction) {
    const institutionName = interaction.options.getString('institution-name');
    await interaction.reply(`Pong ${institutionName}!`);
  },
};
