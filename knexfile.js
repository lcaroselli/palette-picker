// Update with your config settings.

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
   connection: 'postgres://localhost/palettepickertest',
   migrations: {
     directory: './db/migrations'
   },
   seeds: {
     directory: './db/seeds/test'
   },
   useNullAsDefault: true
 },

 staging: {
   client: 'pg',
   connection: {
     database: 'my_db',
     user:     'username',
     password: 'password'
   },
   migrations: {
     tableName: 'knex_migrations'
   },
 },

 production: {
  client: 'pg',
  connection: process.env.DATABASE_URL + `?ssl=true`,
  migrations: {
    directory: './db/migrations'
  },
  useNullAsDefault: true
 },

};
