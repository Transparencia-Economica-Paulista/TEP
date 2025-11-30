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

    var emailSeguro = protegerTexto(email);
    var senhaSegura = protegerTexto(senha);


    usuarioModel.autenticar(emailSeguro, senhaSegura)
        .then(function (resultado) {
            if (resultado.length === 0) {
               
                res.status(403).json({ 
                    message: 'Email ou senha incorretos' 
                });
            } else if (resultado.length === 1) {
                res.json(resultado[0]);
            } else {
                
                res.status(403).json({ 
                    message: 'Erro no sistema: múltiplos usuários encontrados' 
                });
            }
        })
        .catch(function (erro) {
            res.status(500).json({ 
                message: 'Erro interno do servidor', 
                erro: erro.sqlMessage 
            });
        });
}


function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var idEmpresa = req.body.idEmpresaVincularServer;
    var ehAdministrador = req.body.admServer;

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

    usuarioModel.cadastrar(nomeSeguro, emailSeguro, senhaSegura, numeroEmpresa, administrador)
        .then(function (resultado) {
            res.status(201).json({ 
                message: 'Usuário cadastrado com sucesso', 
                id: resultado.insertId 
            });
        })
        .catch(function (erro) {
            res.status(500).json({ 
                message: 'Erro interno ao cadastrar usuário', 
                erro: erro.sqlMessage 
            });
        });
}

function listar(req, res) {
    var idEmpresa = req.params.idEmpresa;

    if (!idEmpresa || idEmpresa === '') {
        return res.status(400).json({ 
            message: 'ID da empresa é obrigatório' 
        });
    }

    var numeroEmpresa = Number(idEmpresa);
    if (!Number.isInteger(numeroEmpresa) || numeroEmpresa <= 0) {
        return res.status(400).json({ 
            message: 'ID da empresa deve ser um número válido' 
        });
    }

    usuarioModel.listarPorEmpresa(numeroEmpresa)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            res.status(500).json({ 
                message: 'Erro ao listar usuários', 
                erro: erro.sqlMessage 
            });
        });
}

function deletar(req, res) {
    var idUsuario = req.params.id;

    if (!idUsuario || idUsuario === '') {
        return res.status(400).json({ 
            message: 'ID do usuário é obrigatório' 
        });
    }

    var numeroUsuario = Number(idUsuario);
    if (!Number.isInteger(numeroUsuario) || numeroUsuario <= 0) {
        return res.status(400).json({ 
            message: 'ID do usuário deve ser um número válido' 
        });
    }

    usuarioModel.deletar(numeroUsuario)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                res.status(404).json({ 
                    message: 'Usuário não encontrado' 
                });
            } else {
                res.json({ 
                    message: 'Usuário deletado com sucesso' 
                });
            }
        })
        .catch(function (erro) {
            res.status(500).json({ 
                message: 'Erro ao deletar usuário', 
                erro: erro.sqlMessage 
            });
        });
}

function atualizarCargo(req, res) {
    var idUsuario = req.params.id;
    var ehAdministrador = req.body.adm;

    if (!idUsuario || idUsuario === '') {
        return res.status(400).json({ 
            message: 'ID do usuário é obrigatório' 
        });
    }

    var numeroUsuario = Number(idUsuario);
    if (!Number.isInteger(numeroUsuario) || numeroUsuario <= 0) {
        return res.status(400).json({ 
            message: 'ID do usuário deve ser um número válido' 
        });
    }

    if (ehAdministrador === undefined) {
        return res.status(400).json({ 
            message: 'Cargo é obrigatório' 
        });
    }

    var administrador = 0;
    if (ehAdministrador === 1 || ehAdministrador === true || ehAdministrador === 'true') {
        administrador = 1;
    }

    usuarioModel.atualizarCargo(numeroUsuario, administrador)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                res.status(404).json({ 
                    message: 'Usuário não encontrado' 
                });
            } else {
                res.json({ 
                    message: 'Cargo atualizado com sucesso' 
                });
            }
        })
        .catch(function (erro) {
            res.status(500).json({ 
                message: 'Erro ao atualizar cargo', 
                erro: erro.sqlMessage 
            });
        });
}

module.exports = {
    autenticar,
    cadastrar,
    listar,
    deletar,
    atualizarCargo
}
