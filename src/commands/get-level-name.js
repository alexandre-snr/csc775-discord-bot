const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const { Function } = require('../database/queryBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-level-name')
    .setDescription('Create a function that converts a skill level to a readable string')
    .addNumberOption((option) => option
      .setName('level')
      .setDescription('The level of the skill')
      .setRequired(true)),
  async execute(interaction) {
    const levelOption = interaction.options.getNumber('level');
    const conn = await openConnection();

    const output = await Function('getSkillLevelStr')
      .args(levelOption)
      .call(conn);

    await interaction.reply(`The name for this level is '${output}'`);
    await conn.destroy();
  },
};
