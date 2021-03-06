const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (_, res) => {
  return res.status(200).json(repositories)
});

app.post("/repositories", (req, res) => {
  const { title, techs, url } = req.body;
  try {
    if (!title || !techs || !url) {
      throw Error
    }

    const repository = {
      id: uuid(),
      likes: 0,
      title,
      techs,
      url,
    }
    repositories.push(repository)

    return res.status(200).json(repository)
  } catch (error) {
    return res.status(417).json({ err: `${Date.now()} - Não foram encaminhados todos os dados!` })
  }

});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, techs, url } = req.body;

  if (!isUuid(id)) {
    return res.status(400)
      .json({ status: 'Repository not found' })
  }
  try {
    const repositoryIndex = repositories.findIndex(repository => {
      return repository.id === id;
    });

    const repository = {
      id,
      title,
      techs,
      url,
      likes: repositories[repositoryIndex].likes
    };

    repositories[repositoryIndex] = repository;

    return res.status(200).json(repository);

  } catch (err) {
    return res.status(404).json({ error: `Update erro | ${err}` });
  }

});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;
  // Valida se o ID está conforme o uuid
  if (!isUuid(id)) {
    return res.status(400)
      .json({ status: 'Repository not found' })
  }

  const repositoryIndex = repositories.findIndex(repository => {
    return repository.id === id;
  });


  repositories.splice(repositoryIndex, 1);

  return res.status(204).end();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400)
      .json({ status: 'Repository not found' })
  }
  try {
    const repositoryIndex = repositories.findIndex(repository => {
      return repository.id === id;
    });
    ++repositories[repositoryIndex].likes; // Ajustar para ficar mais limpo código

    return res.status(200).json(repositories[repositoryIndex]);

  } catch (err) {
    return res.status(400).json({ error: `Update erro | ${err}` });
  }
});

module.exports = app;
