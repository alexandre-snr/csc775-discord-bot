const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const Customer = require('../database/Customer');
const Engineer = require('../database/Engineer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-engineer')
    .setDescription('Delete an engineer and all its acquired certifications, skills mastered')
    .addStringOption((option) => option
      .setName('engineer')
      .setDescription('The engineer')
      .setRequired(true)),
  async execute(interaction) {
    const engineerOption = interaction.options.getString('engineer');

    const conn = await openConnection();

    const engineer = await Engineer.getByName(conn, engineerOption);
    if (!engineer) {
      await interaction.reply(`Could not find engineer '${engineerOption}'`);
      await conn.end();
      return;
    }

    await engineer.remove(conn);

    await interaction.reply(`Engineer '${engineerOption}' was deleted`);
    await conn.end();
  },
};
