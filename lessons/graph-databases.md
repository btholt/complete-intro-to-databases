---
path: "/graph-databases"
title: "Graph Databases"
order: "4A"
description: "Graph databases are great when you need to define relations between objects that can have complex webs of relations especially for things like social networks."
section: "Graph"
---

Another tool in your toolbox should be graph databases. Graph databases, as the name belies, are wonderful for defining data that has complex relationships with other pieces of data in your database. The docs for Neo4j (the database we'll be learning today) uses the examples of movies, actors/actresses, and directors. A movie will have many actors and actresses, and one or more directors while the actors, actresses, and directors will all likely have been in more than one movies. Some people like Taika Waititi or Angelina Jolie have done both acting and directing! This is where a graph database can come in super handy.

## Nodes / Entities

A node in a graph database represents a thing, an entity. In our movies example above, it would either be a movie or a person. These nodes will have certain labels to denote those. In these case, a person would probably a label of Person and then one or both of Actress (I'm just going to combine Actor and Actress into Actress for brevity) and Director. This is basically saying "this is what kind of node this is."

Our example is going to be employees and employers. So a place of work would have a Company label and people could have a Person label.

## Relationships / Edges

Nodes can have relationships between each other. Companies EMPLOYED people or CONTRACTED with them, people MANAGED other people or WERE_PEERS with each other. Many of these relationships have a direction liked MANAGED, other are more biredirectional like WERE_PEERS. In Neo4j every relationship has a direction but sometimes you can just ignore it like in the case of WERE_PEERS. Other times you need two relationships to between nodes to describe adequately the graph. A good example is if you were describing who loved who in a play: if Taylor loved Sue, it wouldn't mean that Sue also loved Taylor. You'd need a relationship in both directions.

Neo4j calls these connections relationships but know that lots of graphs will call these edges.

Nodes can have a relationship with themselves. If Taylor loves herself and we want to express that, she could have a self-referential relationship of love.

## Properties

Both nodes and relationships have properties. These would be like fields or columns. For an employee it might be their full name, location, etc. For a company it could be its location, business type, and other things like that.

## Other Graph Databases

I chose to do Neo4j because it's the one I've used and it's one of the most popular if not the most popular. Other databases out there exist but the concepts will largely be the same.

This will be a much lighter overview than MongoDB and PostgreSQL. This is more to make you aware that this tool exists and may solve one of your future problems but it is a specialized tool whereas MongoDB and PostgreSQL are much more general purpose.
