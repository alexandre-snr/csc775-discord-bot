const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('companies')
    .setDescription('Replies with the list of companies'),
  async execute(interaction) {
    const db = await openConnection();

    const [rows] = await db.execute('SELECT * FROM Company');

    await interaction.reply(rows.map((company) => `${company.company_id}: ${company.name}`).join('\n'));

    await db.destroy();
  },
};
