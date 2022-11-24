const { Select, Delete } = require('./queryBuilder');
const Address = require('./Address');

class Engineer {
  constructor({
    engineerId,
  }) {
    this.engineerId = engineerId;
  }

  async remove(conn) {
    if (this.engineerId === null) {
      return;
    }

    await Delete({
      tableName: 'Engineer',
      where: 'engineer_id = ?',
      whereValue: this.engineerId,
    }).execute(conn);
    this.engineerId = null;
  }

  static async getByName(conn, name) {
    const query = Select({
      tableName: 'Engineer',
      tableNameVar: 'engineer',
      where: 'last_name = ?',
      vars: [name],
    }).join({
      tableName: 'Employee',
      tableNameVar: 'employee',
      condition: 'employee.employee_id = engineer.employee',
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
    return new Engineer({
      engineerId: row.engineer_id,
    });
  }
}

module.exports = Engineer;
