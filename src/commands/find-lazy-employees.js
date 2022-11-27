const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const Employee = require('../database/Employee');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('find-lazy-employees')
    .setDescription('Find the employees who have taken more than a number of holidays')
    .addNumberOption((option) => option
      .setName('min-number-of-holidays-taken')
      .setDescription('The minimum number of holidays taken')),
  async execute(interaction) {
    const minNumberOfHolidaysTaken = interaction.options.getNumber('min-number-of-holidays-taken') ?? 3;
    const conn = await openConnection();

    const employees = await Employee
      .findEmployeesWithMinHolidays(conn, minNumberOfHolidaysTaken);

    await interaction.reply(`Employee who have more than ${minNumberOfHolidaysTaken} holidays:\n${employees.map((employee) => (
      `${employee.user.firstName} ${employee.user.lastName}`
    )).join(', ')}`);
    await conn.end();
  },
};
