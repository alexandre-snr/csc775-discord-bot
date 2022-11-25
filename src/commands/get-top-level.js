const { SlashCommandBuilder } = require('discord.js');
const { Procedure } = require('../database/queryBuilder');
const { openConnection } = require('../database/connection');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-top-level')
    .setDescription('Find the highest available level of a skill given its name  ')
    .addStringOption((option) => option
      .setName('skill-name')
      .setDescription('The name of the skill')
      .setRequired(true)),
  async execute(interaction) {
    const skillNameOption = interaction.options.getString('skill-name');
    const conn = await openConnection();

    const output = await Procedure('getHighestLevelOfSkillName').args(skillNameOption)
      .call(conn);

    await interaction.reply(`The highest level for skill '${skillNameOption}' is ${output}`);
    await conn.end();
  },
};
