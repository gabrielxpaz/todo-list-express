const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const db = require("../db/db");

const SECRET_KEY = process.env.JWT_SECRET;

exports.register = async (req, res) =>{
    const {username, email, password} = req.body;
    const strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!username || username.length < 3){
        return res.status(400).json({error: "Nome de usuário deve conter pelo menos 3 caracteres"});
    } else if(!password){
        return res.status(400).json({error: "A senha é obrigatória"});
    }else if(!email){
        return res.status(400).json({error: "O email é obrigatório"});
    }

    if(!strongPass.test(password)){
        return res.status(400).json({error: "Senha fraca demais (1 caractere especial, 1 letra minúsula e 1 letra maiúscula"});
    }else if(!emailRegex.test(email)){
        return res.status(400).json({error: "Email em formato inválido"})
    }

    db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, results) =>{
        if(err) return res.status(500).json({error: 'Erro no servidor'});
        if(results.length > 0) return res.status(400).json({error: 'Essa conta já existe'});

        const hashedPass = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPass],
            (err, result) =>{
                if (err){
                    console.log(err);
                    return res.status(500).json({error: "Erro ao registrar"});
                } 
                res.status(201).json({message: 'Usuário cadastrado com sucesso!'})
            }
        )

    })
}

exports.login = (req, res) =>{
    const {username, password} = req.body;

    db.query("SELECT * FROM users WHERE username = ?", username, async (err, results) =>{
        if (err) return res.status(500).json({error: "Erro no servidor"});
        if(results.length == 0) return res.status(400).json({error: "Usuário não encontrado"});

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({error: "Senha inválida"});

        const token = jwt.sign({
            id: user.id,
            username: user.username
        }, SECRET_KEY, {expiresIn: '1h'});

        res.json({message: 'Login realizado com sucesso', token});
    })
}
