/*
Data: 28/01/2020
Autor: Rodrigo Nunes Leite
Projeto: Desafio 01 do BootCamp goStack
objetivo: Armazenar projetos e suas tarefas 
 */
const express = require ('express');

const app = express();

// Habilitando o node para entender a estrutura json
app.use(express.json())

// Variavel array para receber o json
const projects = [];

// Middleware global para contagem de requisiçoes
app.use((req, res, next) => {
  console.count("Número de requisições");
  return next();
})

// Middleware para verificar se o id que estão tentando alterar existe
function checkProjects (req, res, next){
  const {id} = req.params;

  const project = projects.find(obj => obj.id == id);

  if (projects.indexOf(project) < 0) {
    return res.status(400).json({error: `Ola, o Id ${id} não foi encontrado!`});
  }

  return next();
}

// Middleware para não permitir o cadastro de ids repetidos
function checkProjectsExist (req, res, next) {
  const {id} = req.body;

  const project = projects.find(obj => obj.id == id);

  if (projects.indexOf(project) >= 0 ){
    return res.status(400).json({error:`O Id ${id} já consta em nossa base`});
  }

  return next();
}

/* Rota de cadastro */
app.post('/projects', checkProjectsExist, (req, res) => {
  const { id, title } = req.body;
  
  // cadastro da requisição no array
  projects.push({id,
                  title,
                  tasks: []
                });

  return res.json(projects);
});

/* Cadastro de tasks */
app.post('/projects/:id/tasks', checkProjects, (req,res) =>{
  const {id} = req.params;
  const {title} = req.body;

  const updt_tasks = projects.find(obj => obj.id == id);

  updt_tasks.tasks.push(title);

  return res.json(updt_tasks);
})


// lista todos os projetos cadastrados
app.get('/projects', (req, res) =>{
  return res.json(projects);
});

// atualiza o titulo do projeto
app.put('/projects/:id', checkProjects, (req, res) => {
  const {id} = req.params;
  const {title} = req.body;

  // Armazena o json que vai ser alterado de acordo com o id
  // obs: No lugar do obj poderia ser qualquer nome
  const update_pjt = projects.find(obj => obj.id == id);

  update_pjt.title = title;
  
  return res.json(update_pjt);
});

app.delete('/projects/:id', checkProjects, (req, res) => {
  const {id} = req.params;
  let del_pjt = projects.find(obj => obj.id == id);

  projects.splice(projects.indexOf(del_pjt),1);

  return res.json(projects);
})



/* Iniciando o servidor */
app.listen(3000);