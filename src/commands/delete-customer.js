const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const Customer = require('../database/Customer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-customer')
    .setDescription('Delete a customer and all its projects from the database  ')
    .addStringOption((option) => option
      .setName('customer')
      .setDescription('The customer')
      .setRequired(true)),
  async execute(interaction) {
    const customerOption = interaction.options.getString('customer');

    const conn = await openConnection();

    const customer = await Customer.getByName(conn, customerOption);
    if (!customer) {
      await interaction.reply(`Could not find customer '${customerOption}'`);
      await conn.destroy();
      return;
    }

    await customer.remove(conn);

    await interaction.reply(`Customer '${customer.name}' was deleted`);
    await conn.destroy();
  },
};
