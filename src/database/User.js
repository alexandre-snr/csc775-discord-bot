const { Select, Update } = require('./queryBuilder');
const Credentials = require('./Credentials');
const Address = require('./Address');

class User {
  constructor({
    userId,
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    credentials,
    address,
  }) {
    this.userId = userId;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.credentials = credentials;
    this.address = address;
  }

  async save(conn) {
    await Update({
      tableName: 'User',
      data: {
        first_name: this.firstName,
        middle_name: this.middleName,
        last_name: this.lastName,
        date_of_birth: this.dateOfBirth,
      },
      where: 'user_id = ?',
      whereValue: this.userId,
    }).execute(conn);

    this.credentials.save(conn);
    this.address.save(conn);
  }

  static async getByName(conn, name) {
    const query = Select({
      tableName: 'User',
      tableNameVar: 'user',
      where: 'last_name = ?',
      vars: [name],
    }).join({
      tableName: 'Credential',
      tableNameVar: 'credentials',
      condition: 'credentials.credentials_id = user.credentials',
    }).join({
      tableName: 'Address',
      tableNameVar: 'address',
      condition: 'address.address_id = user.address',
    });

    const [rows] = await query.execute(conn);
    if (rows.length <= 0) {
      return null;
    }

    const row = rows[0];
    return new User({
      userId: row.user_id,
      firstName: row.first_name,
      middleName: row.middle_name,
      lastName: row.last_name,
      dateOfBirth: row.date_of_birth,
      credentials: new Credentials({
        credentialsId: row.credentials_id,
        email: row.email,
        password: row.password,
      }),
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

module.exports = User;
