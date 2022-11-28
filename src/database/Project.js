const { Insert, Select } = require('./queryBuilder');

class Project {
  constructor({
    projectId,
    name,
    customer,
    projectManager,
  }) {
    this.projectId = projectId;
    this.name = name;
    this.customer = customer;
    this.projectManager = projectManager;
  }

  async save(conn) {
    await Insert({
      tableName: 'Project',
      data: {
        name: this.name,
        customer: this.customer,
        project_manager: this.projectManager,
      },
    }).execute(conn);
  }

  static async getByName(conn, name) {
    const query = Select({
      tableName: 'Project',
      tableNameVar: 'project',
      where: 'name = ?',
      vars: [name],
    });

    const [rows] = await query.execute(conn);
    if (rows.length <= 0) {
      return null;
    }

    const row = rows[0];
    return new Project({
      projectId: row.project_id,
      name: row.name,
      customer: row.customer,
      projectManager: row.projectManager,
    });
  }

  static async getUnderstaffedProjects(conn) {
    const subQuery = Select({
      fields: [
        'subSkillMastered.skill',
      ],
      tableName: 'SkillMastered',
      tableNameVar: 'subSkillMastered',
      where: 'subEmployee.company_id = employee.company_id',
    }).join({
      tableName: 'Engineer',
      tableNameVar: 'subEngineer',
      condition: 'subEngineer.engineer_id = subSkillMastered.engineer',
    }).join({
      tableName: 'Employee',
      tableNameVar: 'subEmployee',
      condition: 'subEmployee.employee_id = subEngineer.employee',
    }).getQuery();

    const query = Select({
      tableName: 'SkillRequired',
      tableNameVar: 'skillRequired',
      where: `skillRequired.skill NOT IN (${subQuery})`,
      fields: [
        'project.name AS name',
        'project_id',
        'customer',
        'project_manager',
      ],
    })
      .join({
        tableName: 'Skill',
        tableNameVar: 'skill',
        condition: 'skill.skill_id = skillRequired.skill',
      })
      .join({
        tableName: 'Project',
        tableNameVar: 'project',
        condition: 'project.project_id = skillRequired.project',
      })
      .join({
        tableName: 'ProjectManager',
        tableNameVar: 'projectManager',
        condition: 'projectManager.project_manager_id = project.project_manager',
      })
      .join({
        tableName: 'Employee',
        tableNameVar: 'employee',
        condition: 'employee.employee_id = projectManager.employee',
      });

    const [rows] = await query.execute(conn);

    return rows.map((row) => new Project({
      projectId: row.project_id,
      name: row.name,
      customer: row.customer,
      projectManager: row.projectManager,
    }));
  }
}

module.exports = Project;
