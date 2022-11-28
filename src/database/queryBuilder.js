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

    const query = `INSERT INTO ${this.tableName}(${fields}) VALUES (${names})`;

    return conn.execute(query, values);
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
    joinType,
  }) {
    this.joins.push({
      tableName,
      tableNameVar,
      condition,
      joinType,
    });
    return this;
  }

  groupBy(fields) {
    this.groupByFields = fields;
    return this;
  }

  having(conditions) {
    this.havingConditions = conditions;
    return this;
  }

  orderBy(order, direction = 'DESC') {
    this.order = order;
    this.direction = direction;
    return this;
  }

  limit(limitVal) {
    this.limitVal = limitVal;
    return this;
  }

  getQuery() {
    const fields = this.fields.join(', ');
    const joins = this.joins.map(
      (join) => `${join.joinType ? `${join.joinType} ` : ''}JOIN ${join.tableName} ${join.tableNameVar} ON ${join.condition}`,
    );

    const query = `SELECT ${fields} FROM ${this.tableName}`
      + (this.tableNameVar ? ` ${this.tableNameVar}` : '')
      + (joins.length > 0 ? ` ${joins.join(' ')}` : '')
      + (this.where ? ` WHERE ${this.where}` : '')
      + (this.groupByFields ? ` GROUP BY ${this.groupByFields}` : '')
      + (this.havingConditions ? ` HAVING ${this.havingConditions}` : '')
      + (this.order ? ` ORDER BY ${this.order} ${this.direction}` : '')
      + (this.limitVal ? ` LIMIT ${this.limitVal}` : '');
    return query;
  }

  async execute(conn) {
    const query = this.getQuery();
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

class Delete {
  constructor({
    tableName,
    where,
    whereValue,
  }) {
    this.tableName = tableName;
    this.where = where;
    this.whereValue = whereValue;
  }

  async execute(conn) {
    const query = `DELETE FROM ${this.tableName} WHERE ${this.where}`;
    return conn.execute(query, [this.whereValue]);
  }
}

class Procedure {
  constructor(procedureName) {
    this.procedureName = procedureName;
    this.procedureArguments = [];
  }

  args() {
    this.procedureArguments = Array.from(arguments);
    return this;
  }

  async call(conn) {
    const names = '?'.repeat(this.procedureArguments.length).split('').join(', ');

    const query = `CALL ${this.procedureName}(${names}, @output); SELECT @output;`;

    const result = await conn.query(query, this.procedureArguments);
    return result[0][1][0]['@output'];
  }
}

class Function {
  constructor(functionName) {
    this.functionName = functionName;
    this.functionArguments = [];
  }

  args() {
    this.functionArguments = Array.from(arguments);
    return this;
  }

  async call(conn) {
    const names = '?'.repeat(this.functionArguments.length).split('').join(', ');

    const query = `SELECT ${this.functionName}(${names})`;

    const result = await conn.query(query, this.functionArguments);
    return result[0][0][Object.keys(result[0][0])[0]];
  }
}

module.exports = {
  Insert: (args) => new Insert(args),
  Select: (args) => new Select(args),
  Update: (args) => new Update(args),
  Delete: (args) => new Delete(args),
  Procedure: (args) => new Procedure(args),
  Function: (args) => new Function(args),
};
