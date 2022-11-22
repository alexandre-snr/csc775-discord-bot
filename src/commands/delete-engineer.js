const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-engineer')
    .setDescription('Delete an engineer and all its acquired certifications, skills mastered')
    .addStringOption((option) => option
      .setName('engineer')
      .setDescription('The engineer')
      .setRequired(true)),
  async execute(interaction) {
    const engineer = interaction.options.getString('engineer');
    await interaction.reply(`Pong ${engineer}!`);
  },
};
