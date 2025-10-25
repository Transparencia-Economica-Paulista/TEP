var usuarioModel = require("../models/usuarioModel");


function protegerTexto(texto) {
    if (texto == undefined || texto == null) {
        return '';
    }
    

    var textoSeguro = String(texto);
    var resultado = '';
    
    for (var i = 0; i < textoSeguro.length; i++) {
        if (textoSeguro[i] === "'") {
            resultado = resultado + "''";
        } else {
            resultado = resultado + textoSeguro[i];
        }
    }
    
    return resultado;
}


function emailEValido(email) {
   
    if (!email) {
        return false;
    }
    
    var temArroba = false;
    var posicaoArroba = -1;
    for (var i = 0; i < email.length; i++) {
        if (email[i] === '@') {
            temArroba = true;
            posicaoArroba = i;
            break;
        }
    }
    
    if (!temArroba || posicaoArroba === 0) {
        return false;
    }
    
    
    var parteDepoisArroba = email.substring(posicaoArroba + 1);
    
    var temPonto = false;
    for (var j = 0; j < parteDepoisArroba.length; j++) {
        if (parteDepoisArroba[j] === '.') {
            temPonto = true;
            break;
        }
    }
    
    return temPonto;
}


function senhaEValida(senha) {
   
    
    if (!senha || senha.length < 8) {
        return {
            valida: false,
            mensagem: 'Senha deve ter pelo menos 8 caracteres'
        };
    }


    var temMinuscula = false;
    for (var i = 0; i < senha.length; i++) {
        var letra = senha[i];
        if (letra >= 'a' && letra <= 'z') {
            temMinuscula = true;
            break;
        }
    }
    
    if (!temMinuscula) {
        return {
            valida: false,
            mensagem: 'Senha deve ter pelo menos uma letra minúscula'
        };
    }

    var temMaiuscula = false;
    for (var i = 0; i < senha.length; i++) {
        var letra = senha[i];
        if (letra >= 'A' && letra <= 'Z') {
            temMaiuscula = true;
            break;
        }
    }
    
    if (!temMaiuscula) {
        return {
            valida: false,
            mensagem: 'Senha deve ter pelo menos uma letra maiúscula'
        };
    }


    var temNumero = false;
    for (var i = 0; i < senha.length; i++) {
        var caractere = senha[i];
        if (caractere >= '0' && caractere <= '9') {
            temNumero = true;
            break;
        }
    }
    
    if (!temNumero) {
        return {
            valida: false,
            mensagem: 'Senha deve ter pelo menos um número'
        };
    }

    var caracteresEspeciais = '@$!%*?&';
    var temEspecial = false;
    
    for (var i = 0; i < senha.length; i++) {
        var caractere = senha[i];
        for (var j = 0; j < caracteresEspeciais.length; j++) {
            if (caractere === caracteresEspeciais[j]) {
                temEspecial = true;
                break;
            }
        }
        if (temEspecial) {
            break;
        }
    }
    
    if (!temEspecial) {
        return {
            valida: false,
            mensagem: 'Senha deve ter pelo menos um caractere especial (@$!%*?&)'
        };
    }

    
    return {
        valida: true,
        mensagem: 'Senha válida'
    };
}


function autenticar(req, res) {
    console.log('Usuário tentando fazer login');
    
    
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;


    if (email == undefined || email == null || email === '') {
        return res.status(400).json({ 
            message: 'Email é obrigatório' 
        });
    }
    

    if (senha == undefined || senha == null || senha === '') {
        return res.status(400).json({ 
            message: 'Senha é obrigatória' 
        });
    }

    console.log('Dados recebidos:', { 
        email: email, 
        tamanhoSenha: senha.length 
    });


    var emailSeguro = protegerTexto(email);
    var senhaSegura = protegerTexto(senha);


    usuarioModel.autenticar(emailSeguro, senhaSegura)
        .then(function (resultado) {
            console.log('Usuários encontrados:', resultado.length);
            
            if (resultado.length === 0) {
               
                res.status(403).json({ 
                    message: 'Email ou senha incorretos' 
                });
            } else if (resultado.length === 1) {
                
                console.log('Login realizado com sucesso');
                res.json(resultado[0]);
            } else {
                
                res.status(403).json({ 
                    message: 'Erro no sistema: múltiplos usuários encontrados' 
                });
            }
        })
        .catch(function (erro) {
            console.log('Erro ao fazer login:', erro);
            res.status(500).json({ 
                message: 'Erro interno do servidor', 
                erro: erro.sqlMessage 
            });
        });
}


function cadastrar(req, res) {
    console.log('Tentativa de cadastro de usuário');
    

    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var idEmpresa = req.body.idEmpresaVincularServer;
    var ehAdministrador = req.body.admServer;

    console.log('Dados recebidos:', { 
        nome: nome, 
        email: email, 
        idEmpresa: idEmpresa, 
        ehAdministrador: ehAdministrador,
        tamanhoSenha: senha ? senha.length : 0 
    });


    if (!nome || nome.trim() === '') {
        return res.status(400).json({ 
            message: 'Nome é obrigatório' 
        });
    }
    
    
    if (!email || email.trim() === '') {
        return res.status(400).json({ 
            message: 'Email é obrigatório' 
        });
    }
    
    
    if (!senha) {
        return res.status(400).json({ 
            message: 'Senha é obrigatória' 
        });
    }
    

    if (idEmpresa == undefined || idEmpresa === '') {
        return res.status(400).json({ 
            message: 'Empresa é obrigatória' 
        });
    }


    if (!emailEValido(email.trim())) {
        return res.status(400).json({ 
            message: 'Email deve ter formato válido (exemplo@dominio.com)' 
        });
    }

    var validacaoSenha = senhaEValida(senha);
    if (!validacaoSenha.valida) {
        return res.status(400).json({ 
            message: validacaoSenha.mensagem 
        });
    }


    var nomeSeguro = protegerTexto(nome.trim());
    var emailSeguro = protegerTexto(email.trim());
    var senhaSegura = protegerTexto(senha);
    
    var numeroEmpresa = Number(idEmpresa);
    if (!Number.isInteger(numeroEmpresa) || numeroEmpresa <= 0) {
        return res.status(400).json({ 
            message: 'ID da empresa deve ser um número válido' 
        });
    }

    var administrador = 0;
    if (ehAdministrador === 1 || ehAdministrador === true || ehAdministrador === 'true') {
        administrador = 1;
    }

    console.log('Dados processados - Enviando para cadastro');

    usuarioModel.cadastrar(nomeSeguro, emailSeguro, senhaSegura, numeroEmpresa, administrador)
        .then(function (resultado) {
            console.log('Usuário cadastrado com sucesso');
            res.status(201).json({ 
                message: 'Usuário cadastrado com sucesso', 
                id: resultado.insertId 
            });
        })
        .catch(function (erro) {
            console.log('Erro ao cadastrar usuário:', erro);
            res.status(500).json({ 
                message: 'Erro interno ao cadastrar usuário', 
                erro: erro.sqlMessage 
            });
        });
}

module.exports = {
    autenticar,
    cadastrar
}
