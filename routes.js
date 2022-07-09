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

router.get("/cadastro-usuario", (req, res)=>{
    
    res.sendFile(__dirname + '/index.html');
    
});

router.get("/adotar", (req, res)=>{
    console.log(__dirname);
    res.sendFile(__dirname + '/adotarAnimal.html');
})

router.get("/cadastro-pet", (req, res)=>{
    console.log(__dirname);
    res.sendFile(__dirname + '/cadastraPet.html');
})

router.get("/cadastro-instituicao", (req, res)=>{
    console.log(__dirname);
    res.sendFile(__dirname + '/cadastraInstituicao.html');
})

router.get("/pagina-instituicao", (req, res)=>{
    console.log(__dirname);
    res.sendFile(__dirname + '/paginaInstitucional.html');
})

router.get("/listar-animais", (req,res)=>{
    res.sendFile(__dirname + "/listarAnimaisInstituicao.html");
})

module.exports = router;