const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const Customer = require('../database/Customer');
const ProjectManager = require('../database/ProjectManager');
const Project = require('../database/Project');

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
    const projectNameOption = interaction.options.getString('project-name');
    const customerOption = interaction.options.getString('customer');
    const projectManagerOption = interaction.options.getString('project-manager');
    const conn = await openConnection();

    const customer = await Customer.getByName(conn, customerOption);
    const projectManager = await ProjectManager.getByName(conn, projectManagerOption);

    if (!customer) {
      await interaction.reply(`Customer '${customerOption}' not found`);
      await conn.end();
      return;
    }
    if (!projectManager) {
      await interaction.reply(`Project manager '${projectManagerOption}' not found`);
      await conn.end();
      return;
    }

    const project = new Project({
      name: projectNameOption,
      customer: customer.customerId,
      projectManager: projectManager.projectManagerId,
    });
    await project.save(conn);

    await interaction.reply(`Project '${projectNameOption}' created!`);
    await conn.end();
  },
};
