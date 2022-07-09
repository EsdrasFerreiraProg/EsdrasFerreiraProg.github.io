const bcrypt = require('bcryptjs');
const express = require('express');
const db = require('../mysqlconnection');
const router = express.Router();

router.post('/form-cadastro-pet', (req,res)=>{
    
    res.send("<a href='/pagina-instituicao'>Obrigado por cadastrar seu pet! Clique aqui para voltar para sua pagina</a>")
});

router.post('/form-cadastro-usuario', async (req,res)=>{

    const {rg, nome, endereco, sexo, nascimento,contato, senha} = req.body;
    console.log(req.body);
    
    let hashedPassword = await bcrypt.hash(senha, 2);

    db.query("INSERT INTO pessoas SET ?", {rg:rg, senha:hashedPassword, nome:nome, nascimento:nascimento, sexo:sexo, telefone:contato, endereco:endereco}, (error,results)=>{
        if(error){
            console.log(error);
        }
    });

    res.send("<a href='/'>Obrigado por se cadastrar! Clique aqui para voltar ao login</a>")
});

module.exports = router;