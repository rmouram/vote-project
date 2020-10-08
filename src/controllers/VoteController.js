const { countDistinct } = require('../database/connections')
const connection = require('../database/connections')
const Vote = require('../models/Vote')

module.exports = {
  async index(request, response){
    const results = await connection('votes')
    const users = await connection('users')
    return response.render('index', {
      votes: results,
      user: request.user,
      users
    })
  },
  async create(request, response){
    const { title, description, opts } = request.body
    const user_id = request.user.id

    try {
      const voteId = await connection('votes').insert({
        title,
        description,
        user_id,
        status: 1,
        vote: 0
      }, "id")
      vote_id = voteId[0]
  
      await Promise.all(opts.map(async opt => {
        await connection('votes_options').insert({
          option: opt,
          num_votes: 0,
          vote_id
        })
      }))
      return response.redirect('/meus-votos')
      
    } catch (error) {
      console.log(error)
    }
  },
  async update(request, response){  
    const { id } = request.params
    const { title, description, opts } = request.body
    await connection('votes').select().where('id',id).update({
      title,
      description
    })
    
    const optFind = await connection('votes_options').select().where('vote_id',id).orderBy('id', 'asc')
    await Promise.all(opts.map(async (opt, i) => {
      await connection('votes_options').select().where('id', optFind[i].id).update({
        option: opt,
      })
    }))

    return response.redirect('/meus-votos')
  },
  async delete(request, response){
    const {id} = request.params
    await connection('votes').select().where({id}).delete()
    return response.redirect('/meus-votos')

  },
  async show(request, response){
    const {vote_id} = request.params

    const results = await connection('votes').select().where('id',vote_id)
    
    const votes = await Promise.all(results.map(async vote => {
      const opts = await connection('votes_options').select().where({vote_id: vote.id})
      return {
        ...vote,
        opts: opts
      }
    }))
    return response.render('vote-single', {
      user:request.user,
      votes,
      error: request.session.error,
      statusCode: 401
     })
   
  }
}