const connection = require('../database/connections')
const Vote = require('../models/Vote')

module.exports = {
  async index(request, response){
    const user_id = request.user.id
    const { index=0 } = request.query
    let results
    console.log(request.user)
    if (request.user.type == 'adm') {
      results = await connection('votes').select()
    }else{
      results = await connection('votes').select().where({user_id})
    }
    const votes = await Promise.all(results.map(async vote => {
      const opts = await connection('votes_options').select().where({vote_id: vote.id})
      return {
        ...vote,
        opts: opts
      }
    }))

    const vote = votes.find((_,i) => i == index)
   return response.render('my-vote', {
    user: request.user,
    votes,
    vote
   })
  },
  async create(request, response){
    
  },
  async update(request, response){

  },
  async delete(request, response){

  },
  async show(request, response){

  }
}