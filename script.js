document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastro');
    const inputTelefone = document.getElementById('telefone');
    const inputSalario = document.getElementById('salario');
    const divFeedback = document.getElementById('mensagemFeedback');

    // Máscara de Telefone: (00) 00000-0000
    inputTelefone.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 11) valor = valor.slice(0, 11);

        if (valor.length > 2) {
            valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
        }
        if (valor.length > 10) {
            valor = `${valor.slice(0, 10)}-${valor.slice(10)}`;
        } else if (valor.length > 9) {
            valor = `${valor.slice(0, 9)}-${valor.slice(9)}`;
        }

        e.target.value = valor;
    });

    // Máscara de Moeda Local (R$)
    inputSalario.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor === '') {
            e.target.value = '';
            return;
        }

        const numero = parseFloat(valor) / 100;
        e.target.value = numero.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    });

    // Validação, Salvamento em TXT e Envio do Formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const endereco = document.getElementById('endereco').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = inputTelefone.value.trim();
        const cargo = document.getElementById('cargo').value;
        const salario = inputSalario.value.trim();
        const turnoSelecionado = document.querySelector('input[name="turno"]:checked');

        // Validações
        const erros = [];

        if (nome.length < 3) {
            erros.push('Informe o nome completo do funcionário.');
        }
        if (endereco.length < 5) {
            erros.push('Informe um endereço válido.');
        }
        if (!validarEmail(email)) {
            erros.push('Informe um e-mail válido.');
        }
        if (telefone.replace(/\D/g, '').length < 10) {
            erros.push('Informe um telefone completo com DDD.');
        }
        if (!cargo) {
            erros.push('Selecione um cargo na lista.');
        }
        if (!salario || salario === 'R$ 0,00') {
            erros.push('Informe um valor de salário válido.');
        }
        if (!turnoSelecionado) {
            erros.push('Selecione o turno de trabalho.');
        }

        if (erros.length > 0) {
            exibirFeedback(erros.join('<br>'), 'erro');
            return;
        }

        const turno = turnoSelecionado.value;

        // Gera e baixa o arquivo .txt
        salvarArquivoTxt({
            nome,
            endereco,
            email,
            telefone,
            cargo,
            salario,
            turno
        });

        // Sucesso no cadastro
        const resumo = `
            <strong>Funcionário cadastrado e arquivo .TXT gerado com sucesso!</strong><br><br>
            <strong>Nome:</strong> ${nome}<br>
            <strong>Cargo:</strong> ${cargo} | <strong>Turno:</strong> ${turno}<br>
            <strong>Salário:</strong> ${salario}<br>
            <strong>Contato:</strong> ${email} / ${telefone}
        `;

        exibirFeedback(resumo, 'sucesso');
        form.reset();
    });

    function salvarArquivoTxt(dados) {
        const dataHora = new Date().toLocaleString('pt-BR');
        
        const conteudoTexto = 
`==================================================
   PAX SERENA - FICHA DE CADASTRO DE COLABORADOR
==================================================
Data do Registro: ${dataHora}

DADOS PESSOAIS
--------------------------------------------------
Nome Completo : ${dados.nome}
Endereço      : ${dados.endereco}
E-mail        : ${dados.email}
Telefone      : ${dados.telefone}

DADOS PROFISSIONAIS
--------------------------------------------------
Cargo         : ${dados.cargo}
Salário       : ${dados.salario}
Turno         : ${dados.turno}
==================================================`;

        // Cria o arquivo em memória com codificação UTF-8
        const blob = new Blob([conteudoTexto], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        // Cria um link temporário para disparar o download
        const linkDownload = document.createElement('a');
        const nomeArquivoLimpo = dados.nome.replace(/\s+/g, '_');
        
        linkDownload.href = url;
        linkDownload.download = `cadastro_${nomeArquivoLimpo}.txt`;
        
        document.body.appendChild(linkDownload);
        linkDownload.click();
        
        // Limpa o elemento e a URL temporária
        document.body.removeChild(linkDownload);
        URL.revokeObjectURL(url);
    }

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function exibirFeedback(mensagem, tipo) {
        divFeedback.innerHTML = mensagem;
        divFeedback.className = `feedback ${tipo}`;
    }
});
// Permite que o Jest importe as funções para teste sem quebrar o navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validarEmail };
}
