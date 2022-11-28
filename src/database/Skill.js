const { Select } = require('./queryBuilder');

class Skill {
  constructor({
    skillId,
    name,
    level,
  }) {
    this.skillId = skillId;
    this.name = name;
    this.level = level;
  }

  static async getUnmasteredSkills(conn) {
    const query = Select({
      tableName: 'Skill',
      tableNameVar: 'skill',
      fields: [
        'skill_id',
        'name',
        'level',
      ],
    })
      .join({
        tableName: 'SkillMastered',
        tableNameVar: 'skillMastered',
        condition: 'skill.skill_id = skillMastered.skill',
        joinType: 'LEFT',
      })
      .groupBy('skill_id, name, level')
      .having('COUNT(skillMastered.skill_mastered_id) = 0');

    const [rows] = await query.execute(conn);
    return rows.map((row) => new Skill({
      skillId: row.skill_id,
      name: row.name,
      level: row.level,
    }));
  }
}

module.exports = Skill;
