const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const Project = require('../database/Project');
const Sprint = require('../database/Sprint');

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
    const projectNameOption = interaction.options.getString('project-name');
    const startDateOption = interaction.options.getString('start-date');
    const endDateOption = interaction.options.getString('end-date');
    const conn = await openConnection();

    const project = await Project.getByName(conn, projectNameOption);
    if (!project) {
      await interaction.reply(`Could not find project '${projectNameOption}'`);
      await conn.end();
      return;
    }

    const sprint = new Sprint({
      project: project.projectId,
      startDate: new Date(startDateOption),
      endDate: new Date(endDateOption),
    });
    await sprint.save(conn);

    await interaction.reply(`Sprint for project '${projectNameOption}' from ${startDateOption} to ${endDateOption} created!`);
    await conn.end();
  },
};
