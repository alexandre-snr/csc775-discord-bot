const { Select, Delete } = require('./queryBuilder');
const Address = require('./Address');

class Customer {
  constructor({
    customerId,
    name,
    address,
  }) {
    this.customerId = customerId;
    this.name = name;
    this.address = address;
  }

  async remove(conn) {
    if (this.customerId === null) {
      return;
    }

    await Delete({
      tableName: 'Customer',
      where: 'customer_id = ?',
      whereValue: this.customerId,
    }).execute(conn);
    this.customerId = null;
  }

  static async getByName(conn, name) {
    const query = Select({
      tableName: 'Customer',
      tableNameVar: 'customer',
      where: 'name = ?',
      vars: [name],
    }).join({
      tableName: 'Address',
      tableNameVar: 'address',
      condition: 'address.address_id = customer.address',
    });

    const [rows] = await query.execute(conn);
    if (rows.length <= 0) {
      return null;
    }

    const row = rows[0];
    return new Customer({
      customerId: row.customer_id,
      name: row.name,
      address: new Address({
        addressId: row.address_id,
        country: row.country,
        state: row.state,
        city: row.city,
        street: row.street,
        postalCode: row.postal_code,
      }),
    });
  }
}

module.exports = Customer;
