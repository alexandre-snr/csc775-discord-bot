const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const Project = require('../database/Project');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('understaffed-projects')
    .setDescription('Find all projects where a skill is required and no one in the company manages it'),
  async execute(interaction) {
    const conn = await openConnection();

    const projects = await Project.getUnderstaffedProjects(conn);
    await interaction.reply(`Understaffed projects:\n${projects.map((project) => (
      `${project.name}`
    ))}`);

    await conn.end();
  },
};
