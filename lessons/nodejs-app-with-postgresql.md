---
path: "/nodejs-app-with-postgresql"
title: "Node.js App with PostgreSQL"
order: "3G"
description: "To help transfer learnings from the command line to code, Brian shows you how to quickly write an app for our message board tables using Node.js"
section: "SQL"
---

Let's quickly write up a quick Node.js project to help you transfer your skills from the command line to the coding world.

[You can access all samples for this project here][samples].

Make a new directory. In that directory run:

```bash
npm init -y
npm i express pg@8.4.1 express@4.17.1
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
    <title>PostgreSQL Sample</title>
  </head>
  <body>
    <input type="text" placeholder="Board ID Number" id="search" />
    <button id="btn">Search</button>
    <pre>
        <code id="code"></code>
    </pre>

    <script>
      const btn = document.getElementById("btn");
      const code = document.getElementById("code");
      const search = document.getElementById("search");

      btn.addEventListener("click", async () => {
        code.innerText = "loading";

        const res = await fetch(
          "/get?search=" + encodeURIComponent(search.value)
        );
        const json = await res.json();

        code.innerText = "\n" + JSON.stringify(json, null, 4);
      });
    </script>
  </body>
</html>
```

Normally I'd say don't put a big script tag in there but we're going for simplicity right now. You can refactor this later to something better.

In server.js, put this:

```javascript
const express = require("express");
const { Pool } = require("pg");
const pool = new Pool({
  connectionString:
    "postgresql://postgres:mysecretpassword@localhost:5432/message_boards",
});

async function init() {
  const app = express();

  app.get("/get", async (req, res) => {
    const client = await pool.connect();
    const [commentsRes, boardRes] = await Promise.all([
      client.query(
        `SELECT * FROM comments NATURAL LEFT JOIN rich_content WHERE board_id = ${req.query.search}`
        // "SELECT * FROM comments NATURAL LEFT JOIN rich_content WHERE board_id = $1",
        // [req.query.search]
      ),
      client.query("SELECT * FROM boards WHERE board_id = $1", [
        req.query.search,
      ]),
    ]);
    res
      .json({
        status: "ok",
        board: boardRes.rows[0] || {},
        posts: commentsRes.rows,
      })
      .end();
    await client.end();
  });

  const PORT = process.env.PORT || 3000;
  app.use(express.static("./static"));
  app.listen(PORT);

  console.log(`running on http://localhost:${PORT}`);
}
init();
```

- This app is intentionally very similar to MongoDB one to show you accessing a database is pretty similar across the board.
- We're using a connection pool. PostgreSQL can only handle so many connections and it's a slow process to constantly and disconnect. This instead will hold onto as many connections as it needs to and reuse them as it can.
- We're using two queries. This is common. In this case we can optimize each query individually and probably even cache each result individually for performance.
- I'm lazily requesting `*` here. You should request only what you need.
- With rich*content, it will create a new row in the response for \_each* rich_content row it gets. You'd have to combine these in the code which is okay. There are some fancier way to query to get it pre-combined or you could just do a third query.

## SQL Injection

- We're using what's a called a parameterized query with the `$1` business. Whenever you put user-given content directly into an SQL statement you need to be aware of the danger that a user can abuse that to run queries themselves against your database, potentially exposing sensitive data (like our user table) or doing destructive things (like dropping all of our tables).

Let's say we were a little less cautious and our code looked like this:

```javascript
const express = require("express");
const { Pool } = require("pg");
const pool = new Pool({
  connectionString:
    "postgresql://postgres:mysecretpassword@localhost:5432/message_boards",
});

async function init() {
  const app = express();

  app.get("/get", async (req, res) => {
    const client = await pool.connect();
    const [commentsRes, boardRes] = await Promise.all([
      client.query(
        `SELECT * FROM comments NATURAL LEFT JOIN rich_content WHERE board_id = ${req.query.search}`
        // "SELECT * FROM comments NATURAL LEFT JOIN rich_content WHERE board_id = $1",
        // [req.query.search]
      ),
      client.query("SELECT * FROM boards WHERE board_id = $1", [
        // req.query.search,
        39,
      ]),
    ]);
    res
      .json({
        status: "ok",
        board: boardRes.rows[0] || {},
        // posts: commentsRes.rows,
        posts: commentsRes,
      })
      .end();
    await client.end();
  });

  app.use(express.static("./static"));
  app.listen(process.env.PORT || 3000);
}
init();
```

- What if we put `1; SELECT * FROM users; --` as our search term. The `1;` would satisfy the first query, and then we could run a second query to show all of the users in our database. Very, very bad.
- Now, I had to change some code to actually get it to display the exfiltrated data but that's not even necessary. What if we put `1; DROP TABLE users; --`? It'd wipe out our entire users database! Hope we have a backup.
- There's actually a lot more they can do. They could add a new user to PostgreSQL, grab its IP address, and then connect to the database itself.
- Needless to say, this is a disaster if it happens to you. Parameterized queries prevent this (the way we coded it above). It won't let the thing going into the query be anything that SQL can interept as an action.

[samples]: https://github.com/btholt/db-samples
