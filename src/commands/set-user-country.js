const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const User = require('../database/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-user-country')
    .setDescription('Update the country of a specific user')
    .addStringOption((option) => option
      .setName('country')
      .setDescription('The new country of the user')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('user')
      .setDescription('The user')
      .setRequired(true)),
  async execute(interaction) {
    const countryOption = interaction.options.getString('country');
    const userOption = interaction.options.getString('user');

    const conn = await openConnection();

    const user = await User.getByName(conn, userOption);
    if (!user) {
      await interaction.reply(`Could not find user '${userOption}'`);
      await conn.destroy();
      return;
    }

    user.address.country = countryOption;
    await user.save(conn);

    await interaction.reply(`${user.firstName} ${user.lastName}'s country was set to '${user.address.country}'`);
    await conn.destroy();
  },
};
