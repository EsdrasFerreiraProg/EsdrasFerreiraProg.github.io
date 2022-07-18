var express = require('express');
var router = express.Router();
const db = require('./mysqlconnection');

router.get("/css/styles.css", (req, res)=>{
    
    res.sendFile(__dirname + '/css/styles.css');

});

router.get("/css/style-cadastro-institucional.css", (req, res)=>{
    
    res.sendFile(__dirname + '/css/style-cadastro-institucional.css');

});

router.get("/css/style-adotar-animal.css", (req, res)=>{
    
    res.sendFile(__dirname + '/css/style-adotar-animal.css');

});
router.get("/css/style-cadastra-pet.css", (req, res)=>{
    
    res.sendFile(__dirname + '/css/style-cadastra-pet.css');

});
router.get("/css/style-cadastro-nao-institucional.css", (req, res)=>{
    
    res.sendFile(__dirname + '/css/style-cadastro-nao-institucional.css');

});
router.get("/css/style-listar-animais.css", (req, res)=>{
    
    res.sendFile(__dirname + '/css/style-listar-animais.css');

});


const redirectLogin = (req, res, next)=>{
    if(!req.session.user)
        res.redirect('/login');
    else
        next();
};

const redirectHome = (req, res, next)=>{

    var tryUser = "";

    try{

        if(req.session.user[0].rg)
            tryUser = req.session.user[0].rg;
        else
            tryUser = req.session.user[0].cnpj;
        
    }catch(e){
        
    }

    if (req.session.user && tryUser.length < 18)

        res.redirect('/adotar');

    else if (req.session.user)
        
        res.redirect('/pagina-instituicao');
    else
        next();
};

router.get("/login", redirectHome, (req, res)=>{
    
    res.sendFile(__dirname + '/index.html');
    
});

router.get("/cadastro-usuario",  (req, res)=>{
    res.sendFile(__dirname + '/cadastraUsuario.html');
});

router.post('/mostra-animal-adotado' , async (req, res)=>{
    
    var animalNome = req.body.nomeAnimal;
    
    var queryPetNameRes;
    
    var responseArray = [];

    const promise = await new Promise((resolve)=>{

        db.query("SELECT * FROM petsadotados WHERE nome = ?", animalNome, async (err, res)=>{
        
            if (err)
                res.send(err);
            
            resolve(queryPetNameRes = res[0]);
            
        });
    });
    
    
    responseArray.push(queryPetNameRes.nome, queryPetNameRes.sexo, queryPetNameRes.especie, queryPetNameRes.raca);
    
    res.send(JSON.stringify(responseArray));
});

router.post('/mostra-animal-nao-adotado' , async (req, res)=>{
    var animalNome = req.body.nomeAnimal;
    
    var queryPetNameRes;
    var instName;
    var responseArray = [];

    const promise = await new Promise((resolve)=>{

        db.query("SELECT * FROM petsemdono WHERE nome = ?", animalNome, async (err, res)=>{
        
            if (err)
                res.send(err);
    
            resolve(queryPetNameRes = res[0]);
            
        });
    });

    const promiseInstCNPJ = await new Promise((resolve)=>{

        db.query("SELECT * FROM instituicoes WHERE cnpj = ?", queryPetNameRes.instcnpj, async (err, res)=>{
        
            if (err)
                res.send(err);
    
            resolve(instName = res[0].nome)
            
        });
    });
    
    responseArray.push(queryPetNameRes.nome, queryPetNameRes.sexo, instName, queryPetNameRes.especie, queryPetNameRes.raca);
    
    res.send(JSON.stringify(responseArray));
});

router.post("/adotar-animal", async (req, res)=>{
    var date = new Date();

    const promise = await new Promise((resolve)=>{
        db.query("SELECT * FROM petsemdono WHERE nome = ?", req.body.nome, async (err, response)=>{
            resolve(response[0]);
        })
    })

    db.query("DELETE FROM petsemdono WHERE nome = ?", req.body.nome, async (err, response)=>{
        console.log("Animal deletado");
    })

    const nome = promise.nome;
    var adocaoData = date.getDate() + "/" + (date.getMonth()+1) + "/" +  date.getFullYear();
    const sexo = promise.sexo;
    const especie = promise.especie;
    const raca = promise.raca;
    const rg = req.session.user[0].rg;

    console.log(sexo + adocaoData+especie+raca+rg);

    db.query("INSERT INTO petsadotados SET ?",{nome:nome, adocaodata: adocaoData, sexo:sexo, especie:especie,
    raca:raca, donorg: rg} ,(err, response)=>{
        if (err)
            console.log(err);
        else
            console.log("Animal adotado!");
    })

    //tem que pegar o cara que foi mandado, colocar ele na outra tabela com o rg da pessoa que está adotando e apagar ele das instituicoes;
})
router.get("/adotar", redirectLogin, (req, res)=>{
    if (req.session.user[0].cnpj)
        res.redirect('/pagina-instituicao');
    else if (!req.session.user)
        res.redirect('/login');
    else   
        res.sendFile(__dirname + '/adotarAnimal.html');
});

router.get("/pets-para-adocao", async (req,res)=>{
    
    let arrayPetsSendToFrontEnd = [];

    const promise = await new Promise((resolve)=>{

        db.query("SELECT * FROM petsemdono", async (err, res)=>{
        
            if (err)
                res.send(err);
    
            res.forEach((item)=>{
                resolve(arrayPetsSendToFrontEnd.push(item.nome));
                
            })
        });
    });

    res.send(arrayPetsSendToFrontEnd);
});

router.get("/animais-instituicao", async (req,res)=>{

    let arrayPetsSendToFrontEnd = [];

    const promise = await new Promise((resolve)=>{

        db.query(`SELECT * FROM petsemdono WHERE instcnpj = ?`, req.session.user[0].cnpj, async (err, res)=>{
        
            if (err)
                res.send(err);
    
            res.forEach((item)=>{
                resolve(arrayPetsSendToFrontEnd.push(item.nome));
                
            })
        });
    });

    res.send(arrayPetsSendToFrontEnd);
    
    
});

router.post("/mostra-animal-cnpj", async (req,res)=>{
    
    let arrayPetsSendToFrontEnd = [];
    let nome = req.body.nome;
    let cnpj = req.session.user[0].cnpj;
    let query = "SELECT * FROM petsemdono WHERE instcnpj = ? AND nome = ?";

    const promise = await new Promise((resolve)=>{

        db.query(query, [cnpj, nome], async (err, res)=>{
        
            if (err)
                res.send(err);
            resolve(res);
        });

    });
    arrayPetsSendToFrontEnd.push(promise[0].nome, promise[0].sexo, promise[0].especie,promise[0].raca);
    res.send(arrayPetsSendToFrontEnd);
});

router.get("/pets-com-dono", async (req, res)=>{
    
    const donorg = req.session.user[0].rg;

    let arrayPetsSendToFrontEnd = [];

    const promise = await new Promise((resolve)=>{

        db.query(`SELECT * FROM petsadotados WHERE donorg = ?`, donorg, async (err, res)=>{
        
            if (err)
                res.send(err);
    
            res.forEach((item)=>{
                resolve(arrayPetsSendToFrontEnd.push(item.nome));
                
            })
        });
    });
    res.send(arrayPetsSendToFrontEnd);
});

router.get("/cadastro-pet", redirectLogin, (req, res)=>{
    
    res.sendFile(__dirname + '/cadastraPet.html');
});

router.get("/cadastro-instituicao", redirectHome, (req, res)=>{

    res.sendFile(__dirname + '/cadastraInstituicao.html');
});

router.post("/deleta-animal-instituicao", async (req,res)=>{
    
    db.query("DELETE FROM petsemdono WHERE nome = ?", req.body.nome, (err, response)=>{

        if (err)
            console.log(err)
            
    })
    
    res.send(`res.send(<script>window.alert("${req.body.nome} DELETADO COM SUCESSO!")</script><script>
    window.location.href = '/pagina-instituicao';</script>)`);
})

router.get('/deleta-animal-instituicao', (req,res)=>{
    res.redirect("/pagina-instituicao");
})

router.get("/pagina-instituicao",  redirectLogin, (req, res)=>{
    if (req.session.user[0].rg)
        res.redirect('/adotar');
    else
        res.sendFile(__dirname + '/listarAnimaisInstituicao.html');
});

router.get("/logout", redirectLogin, (req, res)=>{
    req.session.destroy(err=>{
        if (err)
            return res.redirect('/pagina-instituicao')
        else
            res.clearCookie(req.session);
            res.redirect("/login");
    });
});

router.get("*", (req,res)=>{
    
    res.redirect('/login');

});

module.exports = router;