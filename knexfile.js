module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/palettes',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/palettes_test',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    },
    useNullAsDefault: true,
  },

  // production: {
  //   client: 'pg',
  //   connection: process.env.DATABASE_URL + `?ssl=true`,
  //   migrations: {
  //     directory: './db/migrations'
  //   },
  //   seeds: {
  //     directory: './db/seeds'
  //   },
  //   useNullAsDefault: true
  // }
};
