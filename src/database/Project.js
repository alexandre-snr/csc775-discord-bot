const { Update, Insert } = require('./queryBuilder');

class Project {
  constructor({
    name,
    customer,
    projectManager,
  }) {
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
}

module.exports = Project;
