const { Update } = require('./queryBuilder');

class Address {
  constructor({
    addressId,
    country,
    state,
    city,
    street,
    postalCode,
  }) {
    this.addressId = addressId;
    this.country = country;
    this.state = state;
    this.city = city;
    this.street = street;
    this.postalCode = postalCode;
  }

  async save(conn) {
    await Update({
      tableName: 'Address',
      data: {
        country: this.country,
        state: this.state,
        city: this.city,
        street: this.street,
        postal_code: this.postalCode,
      },
      where: 'address_id = ?',
      whereValue: this.addressId,
    }).execute(conn);
  }
}

module.exports = Address;
