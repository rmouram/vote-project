exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {name: 'romulo', email:'romulo@gmail.com', password:'1234'},
        {name: 'hugo', email: 'hugo@gmail.com', password:'1234'}
      ]);
    });
};
