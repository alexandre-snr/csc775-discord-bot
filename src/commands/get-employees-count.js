const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const { Function } = require('../database/queryBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-employees-count')
    .setDescription('Create a function that returns the number of employees from a given company')
    .addNumberOption((option) => option
      .setName('company')
      .setDescription('The ID of the company')
      .setRequired(true)),
  async execute(interaction) {
    const companyOption = interaction.options.getNumber('company');
    const conn = await openConnection();

    const output = await Function('getEmployeesCount')
      .args(companyOption)
      .call(conn);

    await interaction.reply(`The number of employees for company ${companyOption} is ${output}`);
    await conn.destroy();
  },
};
