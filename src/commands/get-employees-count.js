const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const { Function } = require('../database/queryBuilder');
const Company = require('../database/Company');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-employees-count')
    .setDescription('Create a function that returns the number of employees from a given company')
    .addStringOption((option) => option
      .setName('company')
      .setDescription('The name of the company')
      .setRequired(true)),
  async execute(interaction) {
    const companyOption = interaction.options.getString('company');
    const conn = await openConnection();

    const company = await Company.getByName(conn, companyOption);
    if (!company) {
      await interaction.reply(`Could not find company '${companyOption}'`);
      await conn.end();
      return;
    }

    const output = await Function('getEmployeesCount')
      .args(company.companyId)
      .call(conn);

    await interaction.reply(`The number of employees for company ${companyOption} is ${output}`);
    await conn.end();
  },
};
