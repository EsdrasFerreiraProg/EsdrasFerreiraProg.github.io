const bcrypt = require('bcryptjs');
const express = require('express');
const db = require('../mysqlconnection');
const router = express.Router();


router.post('/form-cadastro-pet', async (req,res)=>{
    const {nome, especie, sexo, raca} = req.body;
    db.query("INSERT INTO petsemdono SET ?", {nome: nome, instcnpj: req.session.user[0].cnpj,
    sexo: sexo, especie: especie, raca:raca}, (err, res)=>{
        if (err)
            console.log(err)
        else
            console.log("animal cadstrado")
    })
    
    res.send("<a href='/pagina-instituicao'>Obrigado por cadastrar seu pet! Clique aqui para voltar para sua pagina</a>")
});

router.post('/form-cadastro-usuario', async (req,res)=>{

    const {rg,  nome, endereco, sexo, nascimento,contato, senha} = req.body;
    
    
    let hashedPassword = await bcrypt.hash(senha, 2);

    
    db.query("INSERT INTO pessoas SET ?", {rg:rg,  senha:hashedPassword, nome:nome, nascimento:nascimento, sexo:sexo, telefone:contato, endereco:endereco}, (error,results)=>{
    
        if(error){
            console.log(error);
        }
    });

    db.query("INSERT INTO usuarios SET ?", {usuario: rg, senha: hashedPassword});

    res.send("<a href='/'>Obrigado por se cadastrar! Clique aqui para voltar ao login</a>")
});

router.post('/form-cadastro-instituicao', async (req,res)=>{
    
    const {cnpj, usuario, senha, nome, endereco, contato} = req.body;
    
    let hashedPassword = await bcrypt.hash(senha, 2);

    db.query("INSERT INTO instituicoes SET ?", {cnpj: cnpj, senha:hashedPassword, nome:nome, endereco:endereco, contato:contato}, (error,results)=>{
       
        if(error){
            console.log(error);
        }
    });

    db.query("INSERT INTO usuarios SET?", {usuario: cnpj, senha: hashedPassword});

    res.send("<a href='/'>Obrigado por se cadastrar! Clique aqui para voltar ao login</a>");
});


async function whatType(usuario){

        const h = await new Promise((resolve)=>{
            
            if (usuario.length == 18){
            db.query("SELECT * FROM instituicoes WHERE cnpj = ?", usuario, (err, result)=>{
                
                resolve(result);
                
            });
        }else{
            
            db.query("SELECT * FROM pessoas WHERE rg = ?", usuario, (err, result)=>{

                resolve(result);
            });
        }
    
    });

    return h;
}


router.post("/login", (req, res)=>{
    
    const usuario = req.body.usuario;

    const senha = req.body.senha;

    db.query("SELECT * FROM usuarios WHERE usuario = ?;", usuario,
        (err, result)=>{
            if(err){
                res.send({err:err});
            }

            if (result.length > 0){
            
                bcrypt.compare(senha, result[0].senha, async (error,response)=>{
                    if(response){
                       
                        req.session.user = await whatType(usuario);

                        if (usuario.length == 18)
                            res.redirect('/pagina-instituicao');
                        else
                            res.redirect('/adotar');

                    }else{
                        res.send({message:"NOME OU USUARIO INCORRETOS!"});
                    }
                })

            }else{
                res.send({message: "Usuario nao existe!"});
            }
        }
    );
});

module.exports = router;