const { Select } = require('./queryBuilder');
const Credentials = require('./Credentials');
const Address = require('./Address');

class CoworkingSpace {
  constructor({
    coworkingSpaceId,
    address,
  }) {
    this.coworkingSpaceId = coworkingSpaceId;
    this.address = address;
  }

  static async findOverUserCoworkingSpaces(conn, minUsers) {
    const query = Select({
      tableName: 'Employee',
      tableNameVar: 'employee',
      vars: [minUsers],
      fields: [
        'COUNT(employee.employee_id) AS EmployeesCount',
        'address_id',
        'country',
        'state',
        'city',
        'street',
        'postal_code',
      ],
    })
      .join({
        tableName: 'CoworkingSpace',
        tableNameVar: 'coworkingSpace',
        condition: 'coworkingSpace.coworking_space_id = employee.coworking_space',
        joinType: 'LEFT',
      })
      .join({
        tableName: 'Address',
        tableNameVar: 'address',
        condition: 'address.address_id = coworkingSpace.address',
      })
      .groupBy('coworkingSpace.coworking_space_id, address_id, country, state, city, street, postal_code')
      .having('EmployeesCount > ?');

    const [rows] = await query.execute(conn);

    return rows.map((row) => new CoworkingSpace({
      coworkingSpaceId: row.coworking_space_id,
      address: new Address({
        addressId: row.address_id,
        country: row.country,
        state: row.state,
        city: row.city,
        street: row.street,
        postalCode: row.postal_code,
      }),
    }));
  }
}

module.exports = CoworkingSpace;
