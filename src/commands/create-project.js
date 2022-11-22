const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-project')
    .setDescription('When a project is created, a first sprint of two weeks for design should be created')
    .addStringOption((option) => option
      .setName('project-name')
      .setDescription('The name of the project')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('customer')
      .setDescription('The customer of the project')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('project-manager')
      .setDescription('The project manager of the project')
      .setRequired(true)),
  async execute(interaction) {
    const projectName = interaction.options.getString('project-name');
    const customer = interaction.options.getString('customer');
    const projectManager = interaction.options.getString('project-manager');
    await interaction.reply(`Pong ${projectName} ${customer} ${projectManager}!`);
  },
};
