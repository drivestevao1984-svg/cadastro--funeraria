const fs = require('fs');

// Lista de cargos e turnos válidos da empresa
const CARGOS_VALIDOS = [
  'Agente Funerário',
  'Tanatopraxista',
  'Motorista Funerário',
  'Atendente',
  'Gerente',
  'Desenvolvedor',
  'Analista de Sistemas',
  'QA',
  'Tech Lead',
  'Suporte TI'
];

const TURNOS_VALIDOS = ['Manhã', 'Tarde', 'Noite', 'Integral', 'Plantão'];

// 1. Valida dados pessoais e formato do e-mail (@ e domínio)
function validarDadosPessoais(nome, endereco, email, telefone) {
  if (!nome || !endereco || !email || !telefone) {
    return false;
  }

  if (
    String(nome).trim() === '' ||
    String(endereco).trim() === '' ||
    String(email).trim() === '' ||
    String(telefone).trim() === ''
  ) {
    return false;
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
}

// 2. Valida se o cargo existe na lista da empresa e se apenas 1 turno válido foi selecionado
function validarCargoETurno(cargo, turno) {
  if (Array.isArray(turno) || !turno) {
    return false;
  }

  const cargoValido = CARGOS_VALIDOS.includes(cargo);
  const turnoValido = TURNOS_VALIDOS.includes(turno);

  return cargoValido && turnoValido;
}

// 3. Confirma se o salário é numérico e maior que zero
function validarSalario(salario) {
  const valor = Number(salario);
  if (isNaN(valor) || valor <= 0) {
    return false;
  }
  return true;
}

// 4. Reúne as validações, formata o salário em Real (R$) e salva no arquivo .txt
function cadastrarFuncionario(dados, caminhoArquivo) {
  const { nome, endereco, email, telefone, cargo, turno, salario } = dados;

  if (!validarDadosPessoais(nome, endereco, email, telefone)) {
    throw new Error('Dados pessoais inválidos ou incompletos.');
  }

  if (!validarCargoETurno(cargo, turno)) {
    throw new Error('Cargo ou turno inválido.');
  }

  if (!validarSalario(salario)) {
    throw new Error('Salário inválido. Deve ser numérico e maior que zero.');
  }

  const salarioFormatado = Number(salario).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const linha = `Nome: ${nome} | Endereço: ${endereco} | E-mail: ${email} | Telefone: ${telefone} | Cargo: ${cargo} | Turno: ${turno} | Salário: ${salarioFormatado}\n`;

  fs.appendFileSync(caminhoArquivo, linha, 'utf8');
  return true;
}

module.exports = {
  validarDadosPessoais,
  validarCargoETurno,
  validarSalario,
  cadastrarFuncionario,
};
