
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('votes').del()
    .then(function () {
      // Inserts seed entries
      return knex('votes').insert([
        {title:"melhor bike", userId:3}
      ]);
    });
};
