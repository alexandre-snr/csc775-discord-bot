const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const User = require('../database/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-user-email')
    .setDescription('Update the email of a specific user')
    .addStringOption((option) => option
      .setName('email')
      .setDescription('The new email of the user')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('user')
      .setDescription('The user')
      .setRequired(true)),
  async execute(interaction) {
    const emailOption = interaction.options.getString('email');
    const userOption = interaction.options.getString('user');

    const conn = await openConnection();

    const user = await User.getByName(conn, userOption);
    if (!user) {
      await interaction.reply(`Could not find user '${userOption}'`);
      await conn.destroy();
      return;
    }

    user.credentials.email = emailOption;
    await user.save(conn);

    await interaction.reply(`${user.firstName} ${user.lastName}'s email was set to '${user.credentials.email}'`);
    await conn.destroy();
  },
};
