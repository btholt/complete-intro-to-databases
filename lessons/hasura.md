---
path: "/hasura"
title: "Hasura"
order: "3H"
description: "Brian gives a quick overview of a powerful tool to use with PostgreSQL, Hasura. Hasura is a service you will put in your cluster so you can query your PostgreSQL database with GraphQL."
section: "SQL"
---

[Hasura][hasura] is a tool too cool to not talk about. It's a server you will put inside your cluster of servers that allows you to treat your database like it was a GraphQL data source. If you don't know GraphQL, it's a really nice way to write queries against any data source. [Frontend Masters has an amazing class from Scott Moss on it][hasura-help] if you want to skill up at it.

I just want to show how to quickly get it up and running with what we've been doing and you can play more with it later.

Okay, so this is the tricky bit here. If the following command here doesn't work for you, you may have to mess around with your connection string to get it to work. [See here][here] if you have problems.

```bash
docker run -d -p 8080:8080 \
  -e HASURA_GRAPHQL_DATABASE_URL=postgresql://postgres:mysecretpassword@host.docker.internal:5432/message_boards \
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=true --name=my-hasura --rm \
  hasura/graphql-engine:v1.3.2
```

With any luck you'll have Hasura running in Docker. `docker ps` can confirm if it is or not. If not, maybe try their [Docker Compose][compose] and re-run our [queries][sql] to get your data replicated in a fresh database.

Once you're running, head to [http://localhost:8080](http://localhost:8080) to play around with it. Specifically you'll want to click the data tab at the top and all tables to it then head back to the GraphiQL tab to run some queries.

I'm not a GraphQL expert anymore so I won't walk you through the paces but here's an example of one if we wanted to get info about a board

```graphql
{
  boards(where: { board_id: { _eq: 39 } }) {
    board_id
    board_name
    board_description
  }
  comments(where: { board_id: { _eq: 39 } }) {
    board_id
    comment
    comment_id
    time
    user_id
  }
}
```

[scott]: https://frontendmasters.com/courses/client-graphql-react/introduction/
[hasura]: https://hasura.io/
[help]: https://hasura.io/docs/1.0/graphql/core/getting-started/index.html#get-started-using-an-existing-database
[sql]: https://btholt.github.io/complete-intro-to-databases/sample-postgresql.sql
[compose]: https://hasura.io/docs/1.0/graphql/core/getting-started/docker-simple.html
