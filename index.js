const express = require("express");
const app = express()
const connection = require('./database/database');
const Register = require('./database/Register');
const cors = require('cors');
const alert = require('alert');
const bcrypt = require("bcryptjs")

app.use(express.json({limit: '50mb'}));
app.use(cors());

//Sequelize connection
connection
    .authenticate().then(() => {
        console.log("Database connection successfull")
    })
    .catch((errorMsg) =>{
        console.log(errorMsg);
    });

app.post('/register', (req,res) =>{
    const {email,password,username,phone,confirmPassword} = req.body;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    Register.findOne({where:{email:email}}).then( user => {
        if(user == undefined && password == confirmPassword){
            Register.create({
                email,  
                password: hash,
                username,
                phone
            }).then((data) =>{
                res.json(data);
            });
        }else{
            alert("Este e-mail já foi cadastrado ou as senhas não coincidem");
        }
    })
});

app.post('/login', (req, res)=>{
    var email = req.body.email;
    var password = req.body.password;

    Register.findOne({where:{email:email}}).then(user =>{
        if(user != undefined){
            var correct = bcrypt.compareSync(password, user.password);

            if(correct){
                res.json({id: user.id, email: user.email});
            }else{
                alert("E-mail ou senha inválidos")
            }
        }else{
            alert("Credenciais inexistentes, por favor registre-se");
        }
    })
});

//Servidor
app.listen(3001, () => {
    console.log("Server running on port 3001");
});