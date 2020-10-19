---
path: "/neo4j-indexes"
title: "Indexes in Neo4j"
order: "4E"
description: "Query performance in a graph database is just as important as it is in any database. Brian teaches you to profile Neo4j queries and how to tune them for performance with indexes."
section: "Graph"
---

Just as with PostgreSQL and MongoDB, frequently having an index becomes very important to query performance for your "hot paths" for your database querying habits.

Let's say a new facet of our app is that people can find celebrities born the same year they are. Your query would look something like this.

```cql
MATCH (p:Person) WHERE p.born = 1967 RETURN p;
```

A fairly simple query but like we've seen before, this will look at every person on the graph to examine their birth year. Imagine you had all of IMDB's database; that query could wreck a system. Let's use EXPLAIN to see why.

```cql
EXPLAIN MATCH (p:Person) WHERE p.born = 1967 RETURN p;
```

You'll see it gives you a pretty in-depth answer that it will scan all 133 persons and then narrow it down to 13. Let's throw an index on Person's born attribute.

``cql
CREATE INDEX FOR (p:Person) ON (p.born);
EXPLAIN MATCH (p:Person) WHERE p.born = 1967 RETURN p;
MATCH (p:Person) WHERE p.born = 1967 RETURN p;

````

Now you'll see it immediately can narrow it down. My computer saw a 6x increase in query speed.

[Neo4j has a great article on query planning][query-planning] if you want to dig further into improving query performance.

Lastly, sometimes it's useful to see all existing indexes. Try this:

```cql
CALL db.indexes;
````

[query-planning]: https://neo4j.com/docs/cypher-manual/4.1/query-tuning/
