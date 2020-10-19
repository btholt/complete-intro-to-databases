---
path: "/nodejs-app-with-neo4j"
title: "Node.js App with Neo4j"
order: "4F"
description: "Time to put some of that graph magic into practice! Put together with Brian an app to find the smallest path between two people in a graph."
section: "Graph"
---

Let's quickly write up a quick Node.js project to help you transfer your skills from the command line to the coding world.

[You can access all samples for this project here][samples].

Make a new directory. In that directory run:

```bash
npm init -y
npm i express neo4j-driver@4.1.2 express@4.17.1
mkdir static
touch static/index.html server.js
code . # or open this folder in VS Code or whatever editor you want
```

Let's make a dumb front end that just makes search queries against the backend. In static/index.html put:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Neo4j Sample</title>
  </head>
  <body>
    <input type="text" placeholder="Person 1" id="person1" />
    <input type="text" placeholder="Person 2" id="person2" />
    <button id="btn">Search</button>
    <pre>
        <code id="code"></code>
    </pre>

    <script>
      const btn = document.getElementById("btn");
      const code = document.getElementById("code");
      const person1 = document.getElementById("person1");
      const person2 = document.getElementById("person2");

      btn.addEventListener("click", async () => {
        code.innerText = "loading";

        const res = await fetch(
          `/get?person1=${encodeURIComponent(
            person1.value
          )}&person2=${encodeURIComponent(person2.value)}`
        );
        const json = await res.json();

        code.innerText = "\n" + JSON.stringify(json, null, 4);
      });
    </script>
  </body>
</html>
```

- Normally I'd say don't put a big script tag in there but we're going for simplicity right now. You can refactor this later to something better.
- It'd be way better if we had a dropdown of all actors, actresses, and directors in the graph instead of freeform text. I'll leave you to make that query and update the UI.

In server.js, put this:

```javascript
const express = require("express");
const neo4j = require("neo4j-driver");

const CONNECTION_STRING =
  process.env.NEO4J_CONNECTION_STRING || "bolt://localhost:7687";

const driver = neo4j.driver(NEO4J_CONNECTION_STRING);

async function init() {
  const app = express();

  app.get("/get", async (req, res) => {
    const session = driver.session();
    const result = await session.run(
      `
        MATCH path = shortestPath(
            (First:Person {name: $person1 })-[*]-(Second:Person {name: $person2 })
        )
        UNWIND nodes(path) as node
        RETURN coalesce(node.name, node.title) as text;
    `,
      {
        person1: req.query.person1,
        person2: req.query.person2,
      }
    );

    res.json({
      status: "ok",
      path: result.records.map((record) => record.get("text")),
    });

    await session.close();
  });

  app.use(express.static("./static"));
  app.listen(process.env.PORT || 3000);
}
init();
```

- Neo4j has its own transfer protocol (as opposed to HTTP) called bolt. Both PostgreSQL and MongoDB have their own too.
- Like PostgreSQL's pools, Neo4j's driver does that for you and gives you a client via a session. Make sure you close sessions when you're done so connections can be reused.
- We're doing a parameterized query just like PostgreSQL. As you can see you're sending a string to Neo4j which is the interpreting that string as a command. Any time this is happening you could suffer an injection attack. Luckily you can do the same thing here with a parameterized query so the driver ensures nothing bad can be injected.
- This is basically the Kevin Bacon query but generalized to be any two people.
- Neo4j gives you back a list of Record objects and you have to call `get()` on each of the records to get the attributes you want which is what we did with the map statement to get each of the names and titles.
