const Usuario = require("../models/usuarios");
const bcrypt = require("bcrypt");

exports.criarUsuario = async (req, res) => {
  try {
    const { login, senha } = req.body;

    
    if (!login || typeof login !== 'string' || !login.trim()) {
      return res.status(400).json({ error: "Login é obrigatório." });
    }

    if (!senha || typeof senha !== 'string' || !senha.trim()) {
      return res.status(400).json({ error: "Senha é obrigatória." });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const novoUsuario = await Usuario.create({
      login: login.trim(),
      senha: senhaCriptografada,
    });

    return res.status(201).json({ 
      mensagem: "Usuário criado com sucesso.",
      id: novoUsuario.id
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ error: "Erro interno ao criar usuário." });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['senha'] }
    });
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return res.status(500).json({ error: "Erro interno ao listar usuários." });
  }
};

exports.buscarUsuarioId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['senha'] }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error("Erro ao buscar o usuário:", error);
    return res.status(500).json({ error: "Erro interno ao buscar usuário." });
  }
};

exports.deletarUsuario = async (req, res) => {
  try {
    const linhasDeletadas = await Usuario.destroy({
      where: { id: req.params.id }
    });

    if (linhasDeletadas === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.status(200).json({ mensagem: "Usuário deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar o usuário:", error);
    return res.status(500).json({ error: "Erro interno ao deletar usuário." });
  }
};

exports.atualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const { senha } = req.body;
    if (!senha || typeof senha !== 'string' || !senha.trim()) {
      return res.status(400).json({ error: "Senha é obrigatória." });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    await usuario.update({ senha: senhaCriptografada });

    return res.status(200).json({ mensagem: "Usuário atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ error: "Erro interno ao atualizar o usuário." });
  }
};