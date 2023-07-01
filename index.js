const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Chave secreta para assinar os tokens JWT
const chaveSecreta = 'chave-secreta';
let tokenGerado = "";

// Rota de autenticação
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  // Verificar as credenciais de login
  if (usuario === 'miguel' && senha === 'adm123') {
    // Gerar um token com duração de 1 hora
    const tokenLogin = jwt.sign({ usuario }, chaveSecreta, { expiresIn: '1h' });
    tokenGerado = tokenLogin;
    res.json({ tokenLogin });
  } else {
    res.status(401).json({ mensagem: 'Credenciais inválidas' });
  }
});

// Middleware de autenticação
function autenticarToken(req, res, next) {
  const token = req.headers.authorization;
  console.log("token passado no request: " , req.headers.authorization)
  console.log("token gerado na autenticação: " , tokenGerado)

  if (!token) {
    return res.status(401).json({ mensagem: 'Token de autenticação não fornecido' });
  }

  jwt.verify(token, chaveSecreta, (err, decoded) => {
    if (err) {
      return res.status(403).json({ mensagem: 'Falha na autenticação do token' });
    }
    req.usuario = decoded.usuario;
    next();
  });
}

// Rota para listar todas as salas
app.get('/salas', (req, res) => {
  const fs = require('fs');
  fs.readFile('salas.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo de texto:', err);
      res.status(500).json({
        mensagem: 'Erro ao buscar as salas'
      });
      return;
    }

    const salas = data.split('\n').filter(sala => sala.trim() !== '').map(sala => JSON.parse(sala));
    res.json(salas);
  });
});

// Rota para obter os dados de uma sala específica pelo nome completo
app.get('/salas/:id', (req, res) => {
  const idSala = parseInt(req.params.id);

  fs.readFile('salas.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo de texto:', err);
      res.status(500).json({
        mensagem: 'Erro ao obter os dados da sala'
      });
      return;
    }

    let salas = data.split('\n').filter(sala => sala.trim() !== '');
    let salaEncontrada = false;
    let sala = null;

    // Procura a sala pelo ID
    for (let i = 0; i < salas.length; i++) {
      const salaAtual = JSON.parse(salas[i]);
      if (salaAtual.id === idSala) {
        sala = salaAtual;
        salaEncontrada = true;
        break;
      }
    }

    if (salaEncontrada) {
      res.json(sala);
    } else {
      res.status(404).json({ mensagem: 'Sala não encontrada' });
    }
  });
});

//rota para cadastrar uma sala
app.post('/salas', autenticarToken, (req, res) => {
  const novaSala = req.body;

  console.log("valor do request: ", novaSala);

  // Verifica se todos os campos obrigatórios estão presentes e não estão vazios
  if (
    novaSala &&
    novaSala.abreviado &&
    novaSala.nomeCompleto &&
    novaSala.horarioFuncionamento &&
    novaSala.diaFuncionamento &&
    novaSala.responsavel &&
    novaSala.descricao &&
    novaSala.abreviado.trim() !== '' &&
    novaSala.nomeCompleto.trim() !== '' &&
    novaSala.horarioFuncionamento.trim() !== '' &&
    novaSala.diaFuncionamento.trim() !== '' &&
    novaSala.responsavel.trim() !== '' &&
    novaSala.descricao.trim() !== ''
  ) {
    // Lê o arquivo de texto para obter o último ID salvo
    const fs = require('fs');
    fs.readFile('salas.txt', 'utf8', (err, data) => {
      if (err) {
        console.error('Erro ao ler o arquivo de texto:', err);
        res.status(500).json({
          mensagem: 'Erro ao salvar os dados'
        });
        return;
      }

      let id = 1; // ID inicial
      if (data) {
        const salas = data.split('\n');
        const ultimaSala = JSON.parse(salas[salas.length - 2]);
        id = ultimaSala.id + 1; // Incrementa o ID
      }

      // Salva os dados informados em um objeto, incluindo o ID
      const dadosSalvos = {
        id: id,
        abreviado: novaSala.abreviado,
        nomeCompleto: novaSala.nomeCompleto,
        horarioFuncionamento: novaSala.horarioFuncionamento,
        diaFuncionamento: novaSala.diaFuncionamento,
        responsavel: novaSala.responsavel,
        descricao: novaSala.descricao
      };

      // Verifica se o ID já existe no arquivo
      if (data.includes(`"id":${id}`)) {
        res.status(400).json({
          mensagem: 'Erro: ID já existe'
        });
        return;
      }

      // Exibe uma mensagem de sucesso com os dados salvos
      res.status(200).json({
        mensagem: 'Dados salvos com sucesso',
        dadosSalvos
      });

      // Salva os dados em um arquivo de texto
      fs.appendFile('salas.txt', JSON.stringify(dadosSalvos) + '\n', (err) => {
        if (err) {
          console.error('Erro ao salvar os dados no arquivo de texto:', err);
        } else {
          console.log('Dados salvos no arquivo de texto.');
        }
      });
    });
  } else {
    // Caso algum campo obrigatório esteja faltando ou vazio
    res.status(400).json({
      mensagem: 'Erro: Campos obrigatórios faltando ou inválidos'
    });
  }
});

//rota para atualizar uma sala
app.put('/salas/:id', (req, res) => {
  const id = req.params.id;
  const novosValores = req.body;

  // Verifica se todos os campos obrigatórios estão presentes e não estão vazios
  if (
    novosValores &&
    novosValores.abreviado &&
    novosValores.nomeCompleto &&
    novosValores.horarioFuncionamento &&
    novosValores.diaFuncionamento &&
    novosValores.responsavel &&
    novosValores.descricao &&
    novosValores.abreviado.trim() !== '' &&
    novosValores.nomeCompleto.trim() !== '' &&
    novosValores.horarioFuncionamento.trim() !== '' &&
    novosValores.diaFuncionamento.trim() !== '' &&
    novosValores.responsavel.trim() !== '' &&
    novosValores.descricao.trim() !== ''
  ) {
    const fs = require('fs');
    fs.readFile('salas.txt', 'utf8', (err, data) => {
      if (err) {
        console.error('Erro ao ler o arquivo de texto:', err);
        res.status(500).json({
          mensagem: 'Erro ao buscar as salas'
        });
        return;
      }

      let salas = data.split('\n').filter(sala => sala.trim() !== '').map(sala => JSON.parse(sala));

      // Procura a sala com o campo "id" correspondente
      const salaAtualizar = salas.find(sala => String(sala.id) === String(id));

      if (!salaAtualizar) {
        res.status(404).json({
          mensagem: 'Sala não encontrada'
        });
        return;
      }

      // Atualiza os valores da sala
      salaAtualizar.abreviado = novosValores.abreviado;
      salaAtualizar.nomeCompleto = novosValores.nomeCompleto;
      salaAtualizar.horarioFuncionamento = novosValores.horarioFuncionamento;
      salaAtualizar.diaFuncionamento = novosValores.diaFuncionamento;
      salaAtualizar.responsavel = novosValores.responsavel;
      salaAtualizar.descricao = novosValores.descricao;

      // Salva as salas atualizadas no arquivo de texto
      const salasAtualizadas = salas.map(sala => JSON.stringify(sala)).join('\n');
      fs.writeFile('salas.txt', salasAtualizadas, 'utf8', (err) => {
        if (err) {
          console.error('Erro ao salvar os dados no arquivo de texto:', err);
          res.status(500).json({
            mensagem: 'Erro ao atualizar a sala'
          });
        } else {
          res.status(200).json({
            mensagem: 'Sala atualizada com sucesso',
            sala: salaAtualizar
          });
        }
      });
    });
  } else {
    res.status(400).json({
      mensagem: 'Erro: Campos obrigatórios faltando ou inválidos'
    });
  }
});

//rota para deletar uma sala
app.delete('/salas/:id', autenticarToken, (req, res) => {
  const idSala = parseInt(req.params.id);

  fs.readFile('salas.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo de texto:', err);
      res.status(500).json({
        mensagem: 'Erro ao excluir a sala'
      });
      return;
    }

    let salas = data.split('\n').filter(sala => sala.trim() !== '');
    let salaEncontrada = false;

    // Procura a sala pelo ID e a remove do array de salas
    for (let i = 0; i < salas.length; i++) {
      const sala = JSON.parse(salas[i]);
      if (sala.id === idSala) {
        salas.splice(i, 1);
        salaEncontrada = true;
        break;
      }
    }

    if (salaEncontrada) {
      // Atualiza o arquivo de texto com as salas restantes
      const novoConteudo = salas.join('\n');
      fs.writeFile('salas.txt', novoConteudo, 'utf8', err => {
        if (err) {
          console.error('Erro ao escrever o arquivo de texto:', err);
          res.status(500).json({
            mensagem: 'Erro ao excluir a sala'
          });
          return;
        }
        res.json({ mensagem: 'Sala excluída com sucesso' });
      });
    } else {
      res.status(404).json({ mensagem: 'Sala não encontrada' });
    }
  });
});

//iniciar o servidor 
const port  = 8081;
app.listen(process.env.PORT || port);