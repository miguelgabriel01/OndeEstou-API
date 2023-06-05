const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

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


//JSON com as informações da sala
const salas = [
    {
      "abreviado": "Biblioteca",
      "nomeCompleto": "Biblioteca",
      "horarioFuncionamento": "8:00 - 18:00",
      "diaFuncionamento": "Segunda a Sexta",
      "responsavel": "João Silva",
      "descricao": "Local destinado ao empréstimo de livros e estudos."
    },
    {
      "abreviado": "Cradt",
      "nomeCompleto": "Centro de Referência em Artes Digitais e Tecnologia",
      "horarioFuncionamento": "9:00 - 20:00",
      "diaFuncionamento": "Segunda a Sexta",
      "responsavel": "Maria Santos",
      "descricao": "Espaço dedicado ao desenvolvimento de projetos artísticos e tecnológicos."
    },
    {
      "abreviado": "Lab01",
      "nomeCompleto": "Laboratório 01",
      "horarioFuncionamento": "8:00 - 22:00",
      "diaFuncionamento": "Segunda a Sábado",
      "responsavel": "Pedro Oliveira",
      "descricao": "Laboratório equipado para realização de experimentos e pesquisas."
    },
    {
      "abreviado": "Lab02",
      "nomeCompleto": "Laboratório 02",
      "horarioFuncionamento": "8:00 - 22:00",
      "diaFuncionamento": "Segunda a Sábado",
      "responsavel": "Ana Souza",
      "descricao": "Laboratório equipado para realização de experimentos e pesquisas."
    },
    {
      "abreviado": "Lab03",
      "nomeCompleto": "Laboratório 03",
      "horarioFuncionamento": "8:00 - 22:00",
      "diaFuncionamento": "Segunda a Sábado",
      "responsavel": "Carlos Rodrigues",
      "descricao": "Laboratório equipado para realização de experimentos e pesquisas."
    },
    {
      "abreviado": "Lab04",
      "nomeCompleto": "Laboratório 04",
      "horarioFuncionamento": "8:00 - 22:00",
      "diaFuncionamento": "Segunda a Sábado",
      "responsavel": "Mariana Almeida",
      "descricao": "Laboratório equipado para realização de experimentos e pesquisas."
    },
    {
      "abreviado": "Lab05",
      "nomeCompleto": "Laboratório 05",
      "horarioFuncionamento": "8:00 - 22:00",
      "diaFuncionamento": "Segunda a Sábado",
      "responsavel": "José Santos",
      "descricao": "Laboratório equipado para realização de experimentos e pesquisas."
    },
    {
      "abreviado": "SalaB02",
      "nomeCompleto": "Sala B02",
      "horarioFuncionamento": "8:00 - 18:00",
      "diaFuncionamento": "Segunda a Sexta",
      "responsavel": "Maria Oliveira",
      "descricao": "Sala de aula para turmas do curso B."
    },
    {
      "abreviado": "SalaB03",
      "nomeCompleto": "Sala B03",
      "horarioFuncionamento": "8:00 - 18:00",
      "diaFuncionamento": "Segunda a Sexta",
      "responsavel": "Carlos Silva",
      "descricao": "Sala de aula para turmas do curso B."
    },
    {
      "abreviado": "SalaB04",
      "nomeCompleto": "Sala B04",
      "horarioFuncionamento": "8:00 - 18:00",
      "diaFuncionamento": "Segunda a Sexta",
      "responsavel": "Ana Rodrigues",
      "descricao": "Sala de aula para turmas do curso B."
    },
    {
      "abreviado": "SalaB05",
      "nomeCompleto": "Sala B05",
      "horarioFuncionamento": "8:00 - 18:00",
      "diaFuncionamento": "Segunda a Sexta",
      "responsavel": "Pedro Almeida",
      "descricao": "Sala de aula para turmas do curso B."
    },
    {
      "abreviado": "SalaB06",
      "nomeCompleto": "Sala B06",
      "horarioFuncionamento": "8:00 - 18:00",
      "diaFuncionamento": "Segunda a Sexta",
      "responsavel": "Mariana Santos",
      "descricao": "Sala de aula para turmas do curso B."
    },
    {
      "abreviado": "SalaB07",
      "nomeCompleto": "Sala B07",
      "horarioFuncionamento": "8:00 - 18:00",
      "diaFuncionamento": "Segunda a Sexta",
      "responsavel": "José Oliveira",
      "descricao": "Sala de aula para turmas do curso B."
    },
    {
      "abreviado": "Auditorio",
      "nomeCompleto": "Auditório",
      "horarioFuncionamento": "8:00 - 22:00",
      "diaFuncionamento": "Segunda a Domingo",
      "responsavel": "Fernanda Silva",
      "descricao": "Espaço destinado a apresentações e eventos."
    },
    {
      "abreviado": "BanheiroM",
      "nomeCompleto": "Banheiro Masculino",
      "horarioFuncionamento": "24 horas",
      "diaFuncionamento": "Todos os dias",
      "responsavel": "Não aplicável",
      "descricao": "Banheiro masculino para uso público."
    },
    {
      "abreviado": "BanheiroF",
      "nomeCompleto": "Banheiro Feminino",
      "horarioFuncionamento": "24 horas",
      "diaFuncionamento": "Todos os dias",
      "responsavel": "Não aplicável",
      "descricao": "Banheiro feminino para uso público."
    },
    {
      "abreviado": "Refeitorio",
      "nomeCompleto": "Refeitório",
      "horarioFuncionamento": "11:00 - 14:00",
      "diaFuncionamento": "Segunda a Sexta",
      "responsavel": "Maria Santos",
      "descricao": "Local para refeições e alimentação dos estudantes."
    },
    {
      "abreviado": "Lanchonete",
      "nomeCompleto": "Lanchonete",
      "horarioFuncionamento": "8:00 - 18:00",
      "diaFuncionamento": "Segunda a Sexta",
      "responsavel": "Carlos Oliveira",
      "descricao": "Lanchonete que oferece opções de lanches e bebidas."
    },
    {
      "abreviado": "Copa",
      "nomeCompleto": "Copa",
      "horarioFuncionamento": "8:00 - 18:00",
      "diaFuncionamento": "Segunda a Sexta",
      "responsavel": "Carlos Oliveira",
      "descricao": "Espaço para preparo de alimentos e descanso dos funcionários."
    }
  ]

// Rota para listar todas as salas
app.get('/salas', (req, res) => {
    res.json(salas);
});

// Rota para obter os dados de uma sala específica pelo nome completo
app.get('/salas/:nome', (req, res) => {
    const nomeSala = req.params.nome;
    const sala = salas.find(s => s.nomeCompleto === nomeSala);
    if (sala) {
      res.json(sala);
    } else {
      res.status(404).json({ mensagem: 'Sala não encontrada' });
    }
});  

//Rota que vai listar todas as salas
app.post('/salas',autenticarToken, (req, res) => {
    const novaSala = req.body;
  
    console.log("valor do request: " , novaSala)
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
      // Salva os dados informados em um objeto
      const dadosSalvos = {
        abreviado: novaSala.abreviado,
        nomeCompleto: novaSala.nomeCompleto,
        horarioFuncionamento: novaSala.horarioFuncionamento,
        diaFuncionamento: novaSala.diaFuncionamento,
        responsavel: novaSala.responsavel,
        descricao: novaSala.descricao
      };
  
      // Exibe uma mensagem de sucesso com os dados salvos
      res.status(200).json({
        mensagem: 'Dados salvos com sucesso',
        dadosSalvos
      });
    } else {
      // Caso algum campo obrigatório esteja faltando ou vazio
      res.status(400).json({
        mensagem: 'Erro: Campos obrigatórios faltando ou inválidos'
      });
    }
  });

  app.put('/salas/:nomeCompleto', autenticarToken,(req, res) => {
    const nomeCompleto = req.params.nomeCompleto;
    const salaAtualizada = req.body;
  
    // Verificar se a sala existe com base no nomeCompleto
    const salaExistenteIndex = salas.findIndex(sala => sala.nomeCompleto === nomeCompleto);
    if (salaExistenteIndex === -1) {
      return res.status(404).json({ mensagem: 'Sala não encontrada.' });
    }
  
    // Validar os campos obrigatórios da sala atualizada
    if (
      !salaAtualizada.abreviado ||
      !salaAtualizada.nomeCompleto ||
      !salaAtualizada.horarioFuncionamento ||
      !salaAtualizada.diaFuncionamento ||
      !salaAtualizada.responsavel ||
      !salaAtualizada.descricao ||
      salaAtualizada.abreviado.trim() === '' ||
      salaAtualizada.nomeCompleto.trim() === '' ||
      salaAtualizada.horarioFuncionamento.trim() === '' ||
      salaAtualizada.diaFuncionamento.trim() === '' ||
      salaAtualizada.responsavel.trim() === '' ||
      salaAtualizada.descricao.trim() === ''
    ) {
      return res.status(400).json({ mensagem: 'Erro: Campos obrigatórios faltando ou inválidos' });
    }
  
    // Atualizar os valores da sala existente
    salas[salaExistenteIndex] = { ...salas[salaExistenteIndex], ...salaAtualizada };
  
    // Retornar uma mensagem de sucesso com os dados atualizados
    res.status(200).json({ mensagem: 'Sala atualizada com sucesso.', sala: salas[salaExistenteIndex] });
});

//rota para deletar uma sala
app.delete('/salas/:nomeCompleto', autenticarToken,(req, res) => {
    const nomeCompleto = req.params.nomeCompleto;
  
    // Verifica se a sala existe no array
    const salaIndex = salas.findIndex(sala => sala.nomeCompleto === nomeCompleto);
  
    if (salaIndex !== -1) {
      // Remove a sala do array
      salas.splice(salaIndex, 1);
      res.status(200).json({
        mensagem: 'Sala removida com sucesso'
      });
    } else {
      res.status(404).json({
        mensagem: 'Sala não encontrada'
      });
    }
})

//iniciar o servidor 
const port  = 8081;
app.listen(port,()=>{
    console.log("API ONDE-ESTOU");
    console.log("STATUS: Ativa");
    console.log("RESPONSAVEL: mgbs@discente.ifpe.edu.br");
    console.log(`SERVIDOR INICIADO NA PORTA: ${port}`);
})