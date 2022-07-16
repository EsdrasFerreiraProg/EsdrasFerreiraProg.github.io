var express = require('express');
var router = express.Router();

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

router.get("/", (req, res)=>{

    res.redirect('/login');

})

const redirectLogin = (req, res, next)=>{
    if(!req.session.user)
        res.redirect('/login');
    else
        next();
};

const redirectHome = (req, res, next)=>{
    if(req.session.user)
        res.redirect('/pagina-instituicao');
    else
        next();
};

router.get("/login", redirectHome, (req, res)=>{
    
    res.sendFile(__dirname + '/index.html');
    
});

router.get("/cadastro-usuario", redirectHome, (req, res)=>{
    res.sendFile(__dirname + '/cadastraUsuario.html');
});

router.get("/adotar", redirectLogin, (req, res)=>{
    
    res.sendFile(__dirname + '/adotarAnimal.html');
})

router.get("/cadastro-pet", (req, res)=>{
    
    res.sendFile(__dirname + '/cadastraPet.html');
})

router.get("/cadastro-instituicao", redirectHome, (req, res)=>{

    res.sendFile(__dirname + '/cadastraInstituicao.html');
})

router.get("/pagina-instituicao", redirectLogin, (req, res)=>{
    
    res.sendFile(__dirname + '/listarAnimaisInstituicao.html');
})

router.get("/logout", redirectLogin, (req, res)=>{
    req.session.destroy(err=>{
        if (err)
            return res.redirect('/pagina-instituicao')
        else
            res.clearCookie(req.session);
            res.redirect("/login");
    })
})

module.exports = router;