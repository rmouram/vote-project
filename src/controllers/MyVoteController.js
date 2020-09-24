const connection = require('../database/connections')
const Vote = require('../models/Vote')

module.exports = {
  async index(request, response){
    const user_id = request.user.id
    const { index=0 } = request.query
    const results = await connection('votes').select().where({user_id})
    const votes = await Promise.all(results.map(async vote => {
      const opts = await connection('votes_options').select().where({vote_id: vote.id})
      console.log(opts)
      return {
        ...vote,
        opts: opts
      }
    }))

    const vote = votes.find((_,i) => i == index)
    console.log(vote, index)
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