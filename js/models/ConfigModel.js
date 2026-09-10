/**
 * ==========================================================================
 * MODEL LAYER - CONFIG MODEL (src/js/models/ConfigModel.js)
 * ==========================================================================
 */

export const CONFIG_PADRAO = {
  nomeLoja: "Hambúrguer dos Amigos",
  whatsapp: "5579999820686",
  taxaEntrega: 0,
  chavePix: "pedrojoaquimbisposantana1897@gmail.com"
};

export class ConfigModel {
  constructor() {
    this.config = this.carregarConfig();
  }

  carregarConfig() {
    try {
      const salvos = localStorage.getItem("cardapio_pro_config");
      if (!salvos) {
        localStorage.setItem("cardapio_pro_config", JSON.stringify(CONFIG_PADRAO));
        return { ...CONFIG_PADRAO };
      }
      const config = JSON.parse(salvos);
      // Atualiza nome da loja para o novo Hambúrguer dos Amigos se tiver o nome anterior
      if (!config.nomeLoja || config.nomeLoja === "Sabor & Cia Gourmet" || config.nomeLoja === "Sabor & Arte Gourmet") {
        config.nomeLoja = CONFIG_PADRAO.nomeLoja;
      }
      // Garante atualização do número oficial do WhatsApp se for o genérico antigo
      if (!config.whatsapp || config.whatsapp === "5579999999999") {
        config.whatsapp = CONFIG_PADRAO.whatsapp;
      }
      // Força frete grátis se estiver com a taxa antiga de 5 reais ou indefinida
      if (config.taxaEntrega === 5 || config.taxaEntrega === undefined || config.taxaEntrega === null || isNaN(Number(config.taxaEntrega))) {
        config.taxaEntrega = 0;
      }
      // Atualiza chave pix antiga para a chave solicitada pelo usuário
      if (!config.chavePix || config.chavePix.includes("pix@") || config.chavePix.includes("saborearte") || config.chavePix.includes("hamburguerdosamigos")) {
        config.chavePix = CONFIG_PADRAO.chavePix;
      }
      localStorage.setItem("cardapio_pro_config", JSON.stringify(config));
      return config;
    } catch (e) {
      return { ...CONFIG_PADRAO };
    }
  }

  salvar(novosDados) {
    this.salvarConfig(novosDados);
  }

  salvarConfig(novosDados) {
    this.config = {
      ...this.config,
      ...novosDados
    };
    try {
      localStorage.setItem("cardapio_pro_config", JSON.stringify(this.config));
    } catch (e) {
      console.error("Erro ao salvar configurações:", e);
    }
  }

  obter() {
    return this.config;
  }
}
