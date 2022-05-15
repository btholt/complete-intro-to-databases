---
path: "/nodejs-app-with-mongodb"
title: "Write a Node.js app with MongoDB"
order: "2G"
description: "Brian shows you a quick project to demonstrate how to translate these command line concepts into code with a Node.js app to query our pets database"
section: "NoSQL"
---

Let's quickly write up a quick Node.js project to help you transfer your skills from the command line to the coding world.

[You can access all samples for this project here][samples].

Make a new directory. In that directory run:

```bash
npm init -y
npm i express mongodb@3.6.2 express@4.17.1
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
    <title>MongoDB Sample</title>
  </head>
  <body>
    <input type="text" placeholder="Search" id="search" />
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
const { MongoClient } = require("mongodb");

const connectionString =
  process.env.MONGODB_CONNECTION_STRING || "mongodb://localhost:27017";

async function init() {
  const client = new MongoClient(connectionString, {
    useUnifiedTopology: true,
  });
  await client.connect();

  const app = express();

  app.get("/get", async (req, res) => {
    const db = await client.db("adoption");
    const collection = db.collection("pets");

    const pets = await collection
      .find(
        {
          $text: { $search: req.query.search },
        },
        { _id: 0 }
      )
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .toArray();

    res.json({ status: "ok", pets }).end();
  });

  const PORT = process.env.PORT || 3000;
  app.use(express.static("./static"));
  app.listen(PORT);

  console.log(`running on http://localhost:${PORT}`);
}
init();
```

**Potential problem you may see:** if you're seeing the error `UnhandledPromiseRejectionWarning: MongoError: text index required for $text query (no such collection 'adoption.pets')` you may have the wrong database name in your code. In my example, I called my database `adoption`. If you didn't change the name of your database, it will be called `test`. If you don't know the name of your database, run `db` in your mongo shell and it should tell you. Once you discover the name of your database, change the line `const db = await client.db("<the name of your database here>");` so that it matches the name of your database.  

Another potential source for this error could be connecting to a prexisting MongoDB project that is shadowing port 27017.  If you have taken Scott Moss' [API Design in Node.js course][API Course] on Frontend Masters, you may have an instance of MongoDB still active and using port 27017 (Example: MongoDB GUI - Compass).  If this is the case, you can stop your MongoDB container, and update the port number to another open port such as port 27018.  Don't forget to update your connection string to the new port number.

```
// At the terminal you are using for Docker:
// See running processes
docker ps 

// Stop the container
docker stop test-mongo

// Update the port number for the image, where 27018 is the new port exposed outside the container
docker run --name test-mongo -dit -p 27018:27017 --rm Mongo:4.4.1

// Start up the container again
docker exec -it test-mongo mongo

// Now follow the course steps to repopulate the documents, and recreate the text index
```

Let's go over a few notes here. To be clear, this is mostly to show you how to connect to MongoDB from code and to show you that all those queries that you learned over the last section apply almost without modification (there are some small differences)

- We grab a MongoDB connection string out of an environment variable (so you can do that if it's running on a server out in the cloud) otherwise it'll use a local running copy like we will right now.
- You need to connect to the DB, then to a db (database), then to a collection.
- You run all the queries at the collection level
- find, sort, limit, toArray, deleteOne, findOneAndReplace, etc. all work the way you'd expect them to.

That's it! That's a quick Node.js server that connects to MongoDB!

[samples]: https://github.com/btholt/db-samples
[API Course]: https://frontendmasters.com/courses/api-design-nodejs-v3/
