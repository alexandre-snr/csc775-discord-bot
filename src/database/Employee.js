const { Select } = require('./queryBuilder');
const Credentials = require('./Credentials');
const Address = require('./Address');

class Employee {
  constructor({
    employeeId,
    user,
  }) {
    this.employeeId = employeeId;
    this.user = user;
  }

  static async findEmployeesWithMaxCertifications(conn, maxCertifications) {
    const query = Select({
      tableName: 'Employee',
      tableNameVar: 'employee',
      vars: [maxCertifications],
      fields: [
        'COUNT(acquiredCertification.acquired_certification_id) AS CertificationsCount',
        'first_name',
        'employee_id',
        'user.user_id',
        'first_name',
        'middle_name',
        'last_name',
        'date_of_birth',
        'credentials_id',
        'email',
        'password',
        'address_id',
        'country',
        'state',
        'city',
        'street',
        'postal_code',
      ],
    }).join({
      tableName: 'AcquiredCertification',
      tableNameVar: 'acquiredCertification',
      condition: 'acquiredCertification.employee = employee.employee_id',
      joinType: 'LEFT',
    }).join({
      tableName: 'User',
      tableNameVar: 'user',
      condition: 'user.user_id = employee.user_id',
    }).join({
      tableName: 'Credential',
      tableNameVar: 'credentials',
      condition: 'credentials.credentials_id = user.credentials',
    })
      .join({
        tableName: 'Address',
        tableNameVar: 'address',
        condition: 'address.address_id = user.address',
      })
      .groupBy('employee.employee_id')
      .having('CertificationsCount <= ?');

    const [rows] = await query.execute(conn);

    return rows.map((row) => new Employee({
      employeeId: row.employee_id,
      user: {
        userId: row['user.user_id'],
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
      },
    }));
  }

  static async findEmployeesWithMinHolidays(conn, minHolidays) {
    const query = Select({
      tableName: 'HolidayTaken',
      tableNameVar: 'holidayTaken',
      vars: [minHolidays],
      fields: [
        'COUNT(holidayTaken.holiday_taken_id) AS HolidaysTaken',
        'first_name',
        'employee_id',
        'user.user_id',
        'first_name',
        'middle_name',
        'last_name',
        'date_of_birth',
        'credentials_id',
        'email',
        'password',
        'address_id',
        'country',
        'state',
        'city',
        'street',
        'postal_code',
      ],
    }).join({
      tableName: 'Employee',
      tableNameVar: 'employee',
      condition: 'employee.employee_id = holidayTaken.employee',
    }).join({
      tableName: 'User',
      tableNameVar: 'user',
      condition: 'user.user_id = employee.user_id',
    }).join({
      tableName: 'Credential',
      tableNameVar: 'credentials',
      condition: 'credentials.credentials_id = user.credentials',
    })
      .join({
        tableName: 'Address',
        tableNameVar: 'address',
        condition: 'address.address_id = user.address',
      })
      .groupBy('employee.employee_id')
      .having('HolidaysTaken > ?');

    const [rows] = await query.execute(conn);

    return rows.map((row) => new Employee({
      employeeId: row.employee_id,
      user: {
        userId: row['user.user_id'],
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
      },
    }));
  }

  static async getMostFilledPod(conn) {
    const res = await Select({
      fields: [
        'pod_leader',
      ],
      tableName: 'Employee',
    }).groupBy('pod_leader')
      .orderBy('COUNT(pod_leader)')
      .limit(1)
      .execute(conn);
    return res[0][0].pod_leader;
  }

  static async findEmployeesFromPod(conn, pod) {
    const query = Select({
      tableName: 'Employee',
      tableNameVar: 'employee',
      vars: [pod],
      where: 'pod_leader = ?',
    }).join({
      tableName: 'User',
      tableNameVar: 'user',
      condition: 'user.user_id = employee.user_id',
    });

    const [rows] = await query.execute(conn);

    return rows.map((row) => new Employee({
      employeeId: row.employee_id,
      user: {
        userId: row['user.user_id'],
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
      },
    }));
  }
}

module.exports = Employee;
