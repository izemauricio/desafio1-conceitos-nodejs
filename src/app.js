const express = require("express");

const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

function middlewareLogger(request, response, next) {
  const { url, method } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  //console.time("REQUEST TIME");
  //console.log(process.memoryUsage());
  //console.log(logLabel);
  return next(); // return next;
  //console.log(process.memoryUsage());
  //console.timeEnd("REQUEST TIME");
}

app.use(express.json());
app.use(cors());
app.use(middlewareLogger);

const repositories = [];

// GET LIST OF PROJECTS
app.get("/repositories", (request, response) => {
  return response.json
  (repositories);
});

// CREATE PROJECT
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title || !url || !techs) {
    return response.send(400);
  }

  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(project);

  return response.json(project);
});

// UPDATE PROJECT
app.put("/repositories/:id", (request, response) => {
  // extract variables from request
  const { title, url, techs } = request.body;
  const { id } = request.params;
  if (!id) {
    return response.sendStatus(400);
  }

  // this does not update the array element
  /**
   * // find project
   let project = repositories.find((project) => project.id === id);
  if (!project) {
  return response.send(200);
  }
 */

  // find project index
  const projectIndex = repositories.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return response.sendStatus(400).json({ error: "Project not found :(" });
  }

  // update and save
  const oldProject = repositories[projectIndex];
  const newProject = { ...oldProject, title, url, techs };
  repositories[projectIndex] = newProject;

  return response.json(newProject);
});

// DELETE PROJECT
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const projectIndex = repositories.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found :(" });
  }

  repositories.splice(projectIndex, 1);

  return response.status(204).send();
});

// CREATE LIKE
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  if (!id) {
    return response.sendStatus(400);
  }

  // find project
  const projectIndex = repositories.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found :(" });
  }

  // update project variable
  const project = repositories[projectIndex];
  project.likes += 1;

  return response.json(project);
});

module.exports = app;
