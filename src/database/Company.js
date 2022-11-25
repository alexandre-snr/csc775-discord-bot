const { Select } = require('./queryBuilder');

class Company {
  constructor({
    companyId,
    name,
  }) {
    this.companyId = companyId;
    this.name = name;
  }

  static async getByName(conn, name) {
    const query = Select({
      tableName: 'Company',
      where: 'name = ?',
      vars: [name],
    });

    const [rows] = await query.execute(conn);
    if (rows.length <= 0) {
      return null;
    }

    const row = rows[0];
    return new Company({
      companyId: row.company_id,
      name: row.name,
    });
  }
}

module.exports = Company;
