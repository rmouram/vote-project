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
      const optsFinal = opts.map(op => {
        let percent = ((op.num_votes/vote.vote)*100).toFixed(1)
        percent = percent == 'NaN' ? 0 : percent
        return {
          ...op,
          percent
        }
      })
      return {
        ...vote,
        opts: optsFinal,
        
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
    const {vote_id} = request.params
    const {id_opt} = request.body

    console.log(vote_id)
    console.log(id_opt)
    if (!request.user) {
      request.session.error = 'Você não está logado'
      request.statusCode = 401
      return response.redirect('back')  
    }


    try{
      const voteopt = await connection('votes_options').where("id",id_opt).increment('num_votes',1)
      if(voteopt){
        await connection('votes').where("id",vote_id).increment('vote',1)
      }
    }catch (error) {
      console.log(error)
      
    }

    return response.redirect('/votar/'+vote_id)

  },
  async delete(request, response){

  },
  async show(request, response){
    const {vote_id} = request.params

    const results = await connection('votes').select().where('id',vote_id)
    console.log(results)
    const votes = await Promise.all(results.map(async vote => {
      const opts = await connection('votes_options').select().where({vote_id: vote.id})
      const optsFinal = opts.map(op => {
        let percent = ((op.num_votes/vote.vote)*100).toFixed(1)
        console.log(percent)
        percent = percent == 'NaN' ? 0 : percent
        return {
          ...op,
          percent
        }
      })
      return {
        ...vote,
        opts: optsFinal,
        
      }
    }))

    request.session.error = ''
    request.statusCode = 200
    return response.render('result', {
      user:request.user,
      votes
    })

  }
}