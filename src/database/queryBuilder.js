class Insert {
  constructor({
    tableName,
    data,
  }) {
    this.tableName = tableName;
    this.data = data;
  }

  async execute(conn) {
    const fields = Object.keys(this.data).join(', ');
    const names = '?'.repeat(Object.keys(this.data).length).split('').join(', ');
    const values = Object.keys(this.data).map((key) => this.data[key]);

    return conn.execute(`INSERT INTO ${this.tableName}(${fields}) VALUES (${names})`, values);
  }
}

class Select {
  constructor({
    tableName,
    fields,
    tableNameVar,
    where,
    vars,
  }) {
    this.tableName = tableName;
    this.tableNameVar = tableNameVar;
    this.fields = fields || ['*'];
    this.joins = [];
    this.where = where;
    this.vars = vars || [];
  }

  join({
    tableName,
    tableNameVar,
    condition,
  }) {
    this.joins.push({
      tableName,
      tableNameVar,
      condition,
    });
    return this;
  }

  async execute(conn) {
    const fields = this.fields.join(', ');
    const joins = this.joins.map((join) => `JOIN ${join.tableName} ${join.tableNameVar} ON ${join.condition}`);

    const query = `SELECT ${fields} FROM ${this.tableName}`
      + (this.tableNameVar ? ` ${this.tableNameVar}` : '')
      + (joins.length > 0 ? ` ${joins.join(' ')}` : '')
      + (this.where ? ` WHERE ${this.where}` : '');

    return conn.execute(query, this.vars);
  }
}

class Update {
  constructor({
    tableName,
    data,
    where,
    whereValue,
  }) {
    this.tableName = tableName;
    this.data = data;
    this.where = where;
    this.whereValue = whereValue;
  }

  async execute(conn) {
    const setStatements = Object.keys(this.data).map((key) => `${key} = ?`).join(', ');
    const setValues = [
      ...Object.keys(this.data).map((key) => this.data[key]),
      this.whereValue,
    ];

    const query = `UPDATE ${this.tableName} SET ${setStatements} WHERE ${this.where}`;

    return conn.execute(query, setValues);
  }
}

class Procedure {
  constructor({
    procedureName,
    args,
  }) {
    this.procedureName = procedureName;
    this.args = args;
  }

  async execute(conn) {
    const names = '?'.repeat(this.args.length).split('').join(', ');

    const query = `CALL ${this.procedureName}(${names}, @output); SELECT @output;`;

    const result = await conn.query(query, this.args);
    return result[0][1][0]['@output'];
  }
}

module.exports = {
  Insert: (args) => new Insert(args),
  Select: (args) => new Select(args),
  Update: (args) => new Update(args),
  Procedure: (args) => new Procedure(args),
};
