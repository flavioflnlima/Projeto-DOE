//configurar o servidor
const express = require("express");
const nunjucks = require("nunjucks");

const server = express();

//configurar o servidor para aprensetar arquivos státicos(CSS, HTML)
server.use(express.static("public"));

//habilitar o body
server.use(express.urlencoded({ extended: true }));

//configurar a conexão com o BD
const Pool = require("pg").Pool;
const db = new Pool({
  user: "postgres",
  password: "1819",
  host: "localhost",
  port: "5432",
  database: "doe"
});

//configurando a templete engine
nunjucks.configure("./", {
  express: server,
  noCache: true
});

//configurar a aprensentação da pagina
server.get("/", function(req, res) {
  db.query(`select * from donors`, function(err, result) {
    if (err) res.end("erro no BD");
    const donors = result.rows;
    return res.render("index.html", { donors });
  });
});
server.post("/", function(req, res) {
  //pegar dados do formulario
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios");
  }

  //inserindo valores do BD
  const query = `INSERT INTO "donors" ("name", "email","blood") VALUES($1,$2,$3)`;
  const values = [name, email, blood];
  db.query(query, values, function(err) {
    //fluxo de erro
    if (err) return res.send("erro no BD" + err);
    //fluxo de erro
    return res.redirect("/");
  });
});

//Ligar o Servidor e permitir o acesso na porta 3000
server.listen(3000);