const { Select } = require('./queryBuilder');

class ProjectManager {
  constructor({
    projectManagerId,
  }) {
    this.projectManagerId = projectManagerId;
  }

  static async getByName(conn, name) {
    const query = Select({
      tableName: 'ProjectManager',
      tableNameVar: 'projectManager',
      where: 'last_name = ?',
      vars: [name],
    }).join({
      tableName: 'Employee',
      tableNameVar: 'employee',
      condition: 'employee.employee_id = projectManager.employee',
    }).join({
      tableName: 'User',
      tableNameVar: 'user',
      condition: 'user.user_id = employee.user_id',
    });

    const [rows] = await query.execute(conn);
    if (rows.length <= 0) {
      return null;
    }

    const row = rows[0];
    return new ProjectManager({
      projectManagerId: row.project_manager_id,
    });
  }
}

module.exports = ProjectManager;
