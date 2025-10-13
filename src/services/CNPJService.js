import axios from 'axios';

const CNPJ_API_URL = 'https://brasilapi.com.br/api/cnpj/v1/';

const validarCNPJ = async (cnpj) => {
  try {
    // Remove formatação do CNPJ
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    
    if (cnpjLimpo.length !== 14) {
      throw new Error('CNPJ deve ter 14 dígitos');
    }

    const response = await axios.get(`${CNPJ_API_URL}${cnpjLimpo}`);
    const dados = response.data;

    // Verifica se é farmácia (código 5912)
    const isFarmacia = dados.cnae_fiscal === '4771-7/01' || 
                      dados.cnae_fiscal === '4771-7/02' || 
                      dados.cnae_fiscal === '4771-7/03' ||
                      dados.cnaes_secundarios?.some(cnae => 
                        cnae.codigo === '4771701' || 
                        cnae.codigo === '4771702' || 
                        cnae.codigo === '4771703'
                      );

    return {
      valido: true,
      isFarmacia,
      dados: {
        razaoSocial: dados.razao_social,
        nomeFantasia: dados.nome_fantasia,
        cnpj: dados.cnpj,
        situacao: dados.descricao_situacao_cadastral,
        endereco: {
          logradouro: dados.logradouro,
          numero: dados.numero,
          bairro: dados.bairro,
          municipio: dados.municipio,
          uf: dados.uf,
          cep: dados.cep
        },
        atividade: dados.cnae_fiscal_descricao
      }
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return {
        valido: false,
        erro: 'CNPJ não encontrado'
      };
    }
    return {
      valido: false,
      erro: 'Erro ao validar CNPJ: ' + error.message
    };
  }
};

const formatarCNPJ = (cnpj) => {
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

const CNPJService = {
  validarCNPJ,
  formatarCNPJ
};

export default CNPJService;