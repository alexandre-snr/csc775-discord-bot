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
}

module.exports = Project;
