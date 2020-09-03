exports.up = function(knex) {
    return knex.schema.createTable('votes', function(table) {
        table.increments()
        table.string('title', 255).notNullable()
        table.integer('vote', 11)
        table.string('description', 255).notNullable()
        table
            .integer('user_id')    
            .unsigned()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table.integer('status').defaultTo(1)
        table.timestamps()
    })
  };
  
exports.down = function(knex) {
    return knex.schema.dropTable('votes')
};
