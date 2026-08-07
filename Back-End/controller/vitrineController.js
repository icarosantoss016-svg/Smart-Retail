const { error } = require("node:console");
const Vitrine = require("../models/vitrine");

exports.criarVitrine = async (req, res) => {
  try {
    const { localizacao, statusVitrine } = req.body;
    if (
      !localizacao ||
      localizacao === null ||
      localizacao === undefined ||
      !localizacao.trim()
    ) {
      return res.status(400).json({ error: "Localização é obrigatória" });
    }

    const novaVitrine = await Vitrine.create({
      localizacao,
      statusVitrine: statusVitrine || "ATIVA",
    });

    res.status(201).json(novaVitrine);
  } catch (error) {
    console.error("erro ao criar uma vitrine:", error);

    return res.status(500).json({ error: "Erro interno ao criar vitrine." });
  }
};

exports.listarVitrines = async (req, res) => {
  try {
    const vitrine = await Vitrine.findAll();
    return res.status(200).json(vitrine);
  } catch (error) {
    console.error("Erro ao lista vitrines:", error);
    return res.status(500).json({ error: "Erro interno ao listar vitrinres." });
  }
};

exports.buscarVitrineId = async (req, res) => {
  try {
    const vitrine = await Vitrine.findByPk(req.params.id);
    if (!vitrine) {
      return res.status(404).json({ error: "Vitrine não encontrada." });
    }
    res.status(200).json(vitrine);
  } catch (error) {
    console.error("Erro ao buscar vitrine:", error);
    return res.status(500).json({ error: "Erro interno ao buscar vitrine." });
  }
};

exports.deletarVitrine = async (req, res) => {
  try {
    const linhasDeletadas = await Vitrine.destroy({
      where: { idVitrine: req.params.id },
    });

    if (linhasDeletadas === 0) {
      return res.status(404).json({ error: "Vitrine não encontrada." });
    }
    res.status(200).json({ mensagem: "Vitrine deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar a vitrine:", error);
    return res.status(500).json({ error: "Erro interno ao deletar a vitrine" });
  }
};

exports.atualizarVitrine = async (req, res) => {
  try {
    const vitrine = await Vitrine.findByPk(req.params.id);

    if (!vitrine) {
      return res.status(404).json({ error: "Vitrine não encontrada." });
    }

    const { localizacao, statusVitrine } = req.body;

    if (
      !localizacao ||
      localizacao === null ||
      localizacao === undefined ||
      !localizacao.trim()
    ) {
      return res.status(400).json({ error: "Localização é obrigatória." });
    }

    await vitrine.update({
      localizacao,
      statusVitrine: statusVitrine || vitrine.statusVitrine,
    });

    res.status(200).json({ mensagem: "Vitrine atualizada:", vitrine });
  } catch (error) {
    console.error("Error ao atualizar vitrine", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao atualizar vitrine." });
  }
};

exports.atualizarStatusVitrine = async (req, res) => {
  try {
    const vitrine = await Vitrine.findByPk(req.params.id);

    if (!vitrine) {
      return res.status(404).json({ error: "Vitrine não encontrada." });
    }

    const { statusVitrine } = req.body;
    if (
      !statusVitrine ||
      statusVitrine === null ||
      statusVitrine === undefined ||
      !statusVitrine.trim()
    ) {
      return res.status(400).json({ error: "Status é obrigatório." });
    }

    const statusFormatado = statusVitrine.toUpperCase();

    if (!["ATIVA", "DESATIVADA", "MANUTENÇÃO"].includes(statusFormatado)) {
      return res
        .status(400)
        .json({
          error:
            "Status inválido. Os valores permitidos são: ATIVA, DESATIVADA, MANUTENÇÃO.",
        });
    }

    await vitrine.update({ statusVitrine: statusFormatado });

    res
      .status(200)
      .json({ mensagem: "Status de vitrine atualizado com sucesso", vitrine });
  } catch (error) {
    console.error("Erro ao atualizar status da vitrine:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao atualizar status da vitrine" })
  }
}
