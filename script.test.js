const fs = require('fs');
const path = require('path');
const {
  validarDadosPessoais,
  validarCargoETurno,
  validarSalario,
  cadastrarFuncionario,
} = require('./cadastro');

const ARQUIVO_TESTE = path.join(__dirname, 'funcionarios_teste.txt');

// Apaga o arquivo de teste antes e depois para não deixar lixo na pasta
beforeEach(() => {
  if (fs.existsSync(ARQUIVO_TESTE)) {
    fs.unlinkSync(ARQUIVO_TESTE);
  }
});

afterAll(() => {
  if (fs.existsSync(ARQUIVO_TESTE)) {
    fs.unlinkSync(ARQUIVO_TESTE);
  }
});

describe('Testes Unitários - Cadastro de Funcionários', () => {
  // Caso 1
  test('Caso 1: Deve validar dados pessoais corretamente quando todos os campos são válidos', () => {
    const resultado = validarDadosPessoais(
      'João Silva',
      'Rua Direita, 10',
      'joao@funeraria.com',
      '(32) 99999-0000'
    );
    expect(resultado).toBe(true);
  });

  // Caso 2
  test('Caso 2: Deve rejeitar dados pessoais quando algum campo obrigatório estiver vazio', () => {
    const resultado = validarDadosPessoais(
      '',
      'Rua Direita, 10',
      'joao@funeraria.com',
      '(32) 99999-0000'
    );
    expect(resultado).toBe(false);
  });

  // Caso 3
  test('Caso 3: Deve rejeitar e-mail com formato inválido (sem @ ou domínio)', () => {
    const resultado = validarDadosPessoais(
      'João Silva',
      'Rua Direita, 10',
      'joaofuneraria.com',
      '(32) 99999-0000'
    );
    expect(resultado).toBe(false);
  });

  // Caso 4
  test('Caso 4: Deve validar cargo pertencente à lista da empresa e turno único válido', () => {
    const resultado = validarCargoETurno('Agente Funerário', 'Manhã');
    expect(resultado).toBe(true);
  });

  // Caso 5
  test('Caso 5: Deve rejeitar cargo inexistente ou múltiplos turnos selecionados', () => {
    expect(validarCargoETurno('Cargo Inexistente', 'Manhã')).toBe(false);
    expect(validarCargoETurno('Atendente', ['Manhã', 'Noite'])).toBe(false);
  });

  // Caso 6
  test('Caso 6: Deve validar salário numérico maior que zero', () => {
    expect(validarSalario(2500.50)).toBe(true);
    expect(validarSalario('3200')).toBe(true);
  });

  // Caso 7
  test('Caso 7: Deve rejeitar salário zero, negativo ou não numérico', () => {
    expect(validarSalario(0)).toBe(false);
    expect(validarSalario(-500)).toBe(false);
    expect(validarSalario('mil reais')).toBe(false);
  });

  // Caso 8
  test('Caso 8: Deve cadastrar funcionário completo, formatar salário em R$ e salvar no .txt', () => {
    const funcionario = {
      nome: 'Maria Oliveira',
      endereco: 'Av. Tiradentes, 200',
      email: 'maria@funeraria.com',
      telefone: '(32) 98888-1111',
      cargo: 'Tanatopraxista',
      turno: 'Plantão',
      salario: 3800,
    };

    const resultado = cadastrarFuncionario(funcionario, ARQUIVO_TESTE);
    expect(resultado).toBe(true);
    expect(fs.existsSync(ARQUIVO_TESTE)).toBe(true);

    const textoSalvo = fs.readFileSync(ARQUIVO_TESTE, 'utf8');
    expect(textoSalvo).toContain('Maria Oliveira');
    expect(textoSalvo).toContain('R$');
    expect(textoSalvo).toContain('3.800,00');
  });
});
