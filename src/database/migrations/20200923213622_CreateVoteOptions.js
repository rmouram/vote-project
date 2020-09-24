exports.up = function(knex) {
  return knex.schema.createTable('votes_options', function(table) {
      table.increments()
      table.string('option', 255).notNullable()
      table.integer('num_votes', 11)
      table
          .integer('vote_id')    
          .unsigned()
          .references('id')
          .inTable('votes')
          .onUpdate('CASCADE')
          .onDelete('CASCADE')
      table.timestamps()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('votes_options')
};