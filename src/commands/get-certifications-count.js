const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const { Procedure } = require('../database/queryBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-certifications-count')
    .setDescription('Find certifications count of an institution by its name')
    .addStringOption((option) => option
      .setName('institution-name')
      .setDescription('The name of the institution')
      .setRequired(true)),
  async execute(interaction) {
    const institutionNameOption = interaction.options.getString('institution-name');

    const conn = await openConnection();

    const output = await Procedure('getCertificationCountOfInstitution')
      .args(institutionNameOption)
      .call(conn);

    await interaction.reply(`The number of certifications proposed by '${institutionNameOption}' is ${output}`);
    await conn.destroy();
  },
};
