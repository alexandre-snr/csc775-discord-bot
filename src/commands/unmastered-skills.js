const { SlashCommandBuilder } = require('discord.js');
const { openConnection } = require('../database/connection');
const Skill = require('../database/Skill');
const { Function } = require('../database/queryBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmastered-skills')
    .setDescription('Find the skills who are not mastered by anyone'),
  async execute(interaction) {
    const conn = await openConnection();

    const skills = await Skill.getUnmasteredSkills(conn);

    await interaction.reply(`Unmastered skills:\n${(await Promise.all(skills.map(async (skill) => {
      const output = await Function('getSkillLevelStr')
        .args(skill.level)
        .call(conn);

      return (
        `${skill.name} - ${output}`
      );
    }))).join('\n')}`);

    await conn.end();
  },
};
