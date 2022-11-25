const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const Employee = require('../database/Employee');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('count-certifications')
    .setDescription('Find the employees who have less than or equal a number of certifications')
    .addNumberOption((option) => option
      .setName('max-number-of-certifications')
      .setDescription('The maximum number of certifications')),
  async execute(interaction) {
    const maxNumberOfCertificationsOption = interaction.options.getNumber('max-number-of-certifications') ?? 0;

    const conn = await openConnection();

    const employees = await Employee
      .findEmployeesWithMaxCertifications(conn, maxNumberOfCertificationsOption);
    console.log(JSON.stringify(employees));

    await interaction.reply(`Employee who have less than or equal to ${maxNumberOfCertificationsOption} certifications:\n${employees.map((employee) => (
      `${employee.user.firstName} ${employee.user.lastName}`
    )).join(', ')}`);
    await conn.end();
  },
};
