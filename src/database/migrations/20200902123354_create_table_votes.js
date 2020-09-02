exports.up = function(knex) {
    return knex.schema.createTable('votes', function(table) {
        table.increments('voteId')
        table.string('title', 255).notNullable()

        table.integer('userId').notNullable()

        table.foreign('userId').references('id').inTable('users').onDelete('CASCADE')
            

        table.timestamps(true, true)
    })
  };
  
exports.down = function(knex) {
    return knex.schema.dropTable('votes')
};
