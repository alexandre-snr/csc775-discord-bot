const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const Employee = require('../database/Employee');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('most-filled-pod')
    .setDescription('Find the pod with the most engineers'),
  async execute(interaction) {
    const conn = await openConnection();
    const mostUsedPod = await Employee.getMostFilledPod(conn);
    const employees = await Employee.findEmployeesFromPod(conn, mostUsedPod);

    await interaction.reply(`Most used pod is ${mostUsedPod}:\n${employees.map((employee) => (
      `${employee.user.firstName} ${employee.user.lastName}`
    )).join('\n')}`);
    await conn.end();
  },
};
