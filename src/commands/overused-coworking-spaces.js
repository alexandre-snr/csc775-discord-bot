const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const CoworkingSpace = require('../database/CoworkingSpace');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('overused-coworking-spaces')
    .setDescription('Find the coworking spaces with more than a certain number of employees')
    .addNumberOption((option) => option
      .setName('min-number-of-employees')
      .setDescription('The minimum number of employees')),
  async execute(interaction) {
    const minNumberOfEmployeesOption = interaction.options.getNumber('min-number-of-employees') ?? 3;
    const conn = await openConnection();

    const coworkingSpaces = await CoworkingSpace.findOverUserCoworkingSpaces(
      conn,
      minNumberOfEmployeesOption,
    );

    await interaction.reply(`Overused coworking spaces:\n${coworkingSpaces.map((coworkingSpace) => (
      `${coworkingSpace.address.street} ${coworkingSpace.address.city} ${coworkingSpace.address.state} ${coworkingSpace.address.country}`
    ))}`);
    await conn.end();
  },
};
