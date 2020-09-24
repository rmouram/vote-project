const connection = require('../database/connections')
const Vote = require('../models/Vote')

module.exports = {
  async index(request, response){
    const results = await connection('votes')
    return response.render('index', {
      votes: results,
      user: request.user
    })
  },
  async create(request, response){
    const { title, description, opts } = request.body
    const user_id = request.user.id
    console.log(user_id)

    try {
      const voteId = await connection('votes').insert({
        title,
        description,
        user_id,
        status: 1,
        vote: 0
      }, "id")
      vote_id = voteId[0]
      console.log(vote_id)
  
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

  }
}