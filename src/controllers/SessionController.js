const connection = require("../database/connections")

module.exports = {
    async create(request, response){
        const { email, password } = request.body

        if (email && password) {
            const user = await connection("users")
            .where({"email":email, "password":password})
            .select("name","id")
            .first()

            if( !user ){
                return response.render('login', { notification: 'Usuário ou senha incorretos!', email })
            }
            console.log(user.name)
            request.session.loggedin = true
            request.session.name = user.name
            response.redirect('/');
        }
        else {
		    return response.render('login', { notification: 'Por favor entre com usuário e senha', email })
	    }
    }
 
}