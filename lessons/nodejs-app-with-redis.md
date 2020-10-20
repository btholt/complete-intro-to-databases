---
path: "/nodejs-app-with-redis"
title: "Node.js App with Redis"
order: "5F"
description: "Take the learnings from how to use Redis as a key-value store and cache from the command line to code! Brian whips up two examples of how and why you'd want to use Redis with Node.js."
section: "Key-Value Store"
---

Let's quickly write up a quick Node.js project to help you transfer your skills from the command line to the coding world.

[You can access all samples for this project here][samples].

Make a new directory. In that directory run:

```bash
npm init -y
npm i express redis@3.0.2 express@4.17.1
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
    <title>Redis Sample</title>
  </head>
  <body>
    <h1 id="visitors">…</h1>
    <script>
      async function registerPageView() {
        const res = await fetch("/pageview");
        const { views } = await res.json();
        document.getElementById("visitors").innerText = `${views} visitors!`;
      }
      registerPageView();
    </script>
  </body>
</html>
```

Then let's make a server.js. Put this in there

```javascript
const { promisify } = require("util");
const express = require("express");
const redis = require("redis");
const client = redis.createClient();

const rIncr = promisify(client.incr).bind(client);

async function init() {
  const app = express();

  app.get("/pageview", async (req, res) => {
    const views = await rIncr("pageviews");

    res.json({
      status: "ok",
      views,
    });
  });

  const PORT = process.env.PORT || 3000;
  app.use(express.static("./static"));
  app.listen(PORT);

  console.log(`running on http://localhost:${PORT}`);
}
init();
```

- The Redis client for Node.js _still_ doesn't support promises natively so we can use a function called `promisify` from the Node.js built in `utils` library to make it do promises. That's what `const rIncr = promisify(client.incr).bind(client);` does.
- From there it's really easy to just call an increment function from Redis.

Okay let's add one more caching function to our app. In server.js add this

```javascript
// under rIncr
const rGet = promisify(client.get).bind(client);
const rSetex = promisify(client.setex).bind(client);

function cache(key, ttl, slowFn) {
  return async function (...props) {
    const cachedResponse = await rGet(key);
    if (cachedResponse) {
      return cachedResponse;
    }
    const result = await slowFn(...props);
    await rSetex(key, ttl, result);
    return result;
  };
}

async function verySlowAndExpensiveFunction() {
  // imagine this is like a really big join on PostgreSQL
  // or a call to an expensive API

  console.log("oh no an expensive call!");
  const p = new Promise((resolve) => {
    setTimeout(() => {
      resolve(new Date().toUTCString());
    }, 5000);
  });

  return p;
}

const cachedFn = cache("expensive_call", 10, verySlowAndExpensiveFunction);

// inside init, under app.get pageviews
app.get("/get", async (req, res) => {
  const data = await cachedFn();

  res.json({
    data,
    status: "ok",
  });
});
```

- This is a bit contrived example. Normally these would be separated amongst a bunch of files.
- Imagine our `verySlowAndExpensiveFunction` is something we're trying to call as infrequently as possible. In this case we're just having it wait and then resolve a promise but imagine it was an expensive database query or a call to an expensive-to-call API endpoint
- `cache` is a generic caching function. With this you could cache anything. All it does is take in a redis key, how long to cache it, and some function to call when it doesn't find the item in the cache. It returns a function that makes it seamless to the call point: either it will immediately give you back what's in the cache or it will make you wait for the result of the `verySlowAndExpensiveFunction`.
- This definitely has thundering herd potential. What would be better is to have a second lock key that says "hey, we're already trying to calculate/retrieve this answer." Then you can either have the backend poll that key for an answer or you could return a 503 to the frontend and have a frontend that will poll until the 503 clears. Lots of ways to handle this.

There are lots of ways to use Redis in code and this just two. In summary though you will primarily use it for caching and non-mission critical, high-throughput data like telemetry.

[samples]: https://github.com/btholt/db-samples
