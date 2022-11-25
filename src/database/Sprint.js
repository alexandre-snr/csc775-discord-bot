const { Insert } = require('./queryBuilder');

class Sprint {
  constructor({
    project,
    startDate,
    endDate,
  }) {
    this.project = project;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  async save(conn) {
    await Insert({
      tableName: 'Sprint',
      data: {
        project: this.project,
        start_date: this.startDate.toISOString().slice(0, 19).replace('T', ' '),
        end_date: this.endDate.toISOString().slice(0, 19).replace('T', ' '),
      },
    }).execute(conn);
  }
}

module.exports = Sprint;
