const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-sprint')
    .setDescription('Create a trigger that prevents the start date of a sprint to be after the end date')
    .addStringOption((option) => option
      .setName('project-name')
      .setDescription('The name of the project')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('start-date')
      .setDescription('The start of the sprint')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('end-date')
      .setDescription('The end of the sprint')
      .setRequired(true)),
  async execute(interaction) {
    const projectName = interaction.options.getString('project-name');
    const startDate = interaction.options.getString('start-date');
    const endDate = interaction.options.getString('end-date');
    await interaction.reply(`Pong ${projectName} ${startDate} ${endDate}!`);
  },
};
