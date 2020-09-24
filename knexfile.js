// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: 'vote_project',
      user:     'root',
      password: '',
      port: 3306,
      host: 'localhost'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
    seeds: {
      directory: './src/database/seeds'
    }
  }
};
