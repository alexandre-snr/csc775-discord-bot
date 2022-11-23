const { Update } = require('./queryBuilder');

class Credentials {
  constructor({
    credentialsId,
    email,
    password,
  }) {
    this.credentialsId = credentialsId;
    this.email = email;
    this.password = password;
  }

  async save(conn) {
    await Update({
      tableName: 'Credential',
      data: {
        email: this.email,
        password: this.password,
      },
      where: 'credentials_id = ?',
      whereValue: this.credentialsId,
    }).execute(conn);
  }
}

module.exports = Credentials;
