---
path: "/terminology"
title: "Terminology"
order: "1C"
section: "Welcome"
description: "Brian discusses what databases are, what the various type we will cover, and get you in the mindset of storing data."
---

Before we hop in to working with these various sorts of database I want to make sure we are clear on some common terminology and what the goals are for today, what we are going to cover and what we are not.

## What is a database and other common terms

A database is a place to store data. Another way to think about this is that it is a place to save your application's state so that it can be retrieved later. This allows you to make your servers stateless since your database will be storing all the information. A lot of things can be thought of as a type of database, like an Excel spreadsheet or even just a text file with data in it.

A query is a command you send to a database to get it to do something, whether that's to get information out of the database or to add/update/delete something in the database. It can also aggregate information from a database into some sort of overview.

## Schema

If a database is a table in Microsoft Excel, then a schema is the columns. It's a rigid structure used to model data.

If I had a JSON object of user that looked like `{ "name": "Brian", "city": "Seattle", "state": "WA" }` then the schema would be name, city, and state. It's the shape of the data. Some databases like PostgreSQL have strict schemas where you have to know the shape of your data upfront. Others like MongoDB let you invent it on the fly.

## What are the types of databases

There are many types of database available today. We're only going to cover four types but it's good to know what else is other there. Today we're covering relational databases (often called RDBMS or SQL databases,) document-based databases (often called NoSQL,) a graph database, and a key-value store. Here's a few we are _not_ covering.

- **Search engines** like Solr or Sphinx are often paired with databases to make search possible. If your database doesn't support full-text search this is a tool you could pair with a database to make a site-wide search engine possible.
- **Wide Column Databases** uses the concepts of tables, rows, and columns like a relational database but has a dynamic nature to those formats of rows and names. As such it can sorta be interepted like a two dimensional key-value store. Apache Cassandra and Google Bigtable are two famous examples of this. These databases are famous for being able to be massive scale and very resilient.
- **Message brokers** are a vastly underutilized piece of architecture by Node.js developers that can really improve your flexibility and scalability without greatly increasing complexity. They allow apps and services to publish events/messages on a system and allow the message broker to publish/inform subscribers to those events that something happened. It's a powerful paradigm. Apache Kafka, RabbitMQ, and Celery are all related to this paradigm.
- **Multi model databases** are databases that can actually operate in multiple different ways, fulfilling more than one of these paradigms. Azure Cosmos DB and ArangoDB are two primary examples of this. MongoDB and PostgreSQL technically are these as well since they have features that allow you to bend them into different shapes.

## ACID

This stands for atomicity, consistency, isolation, durability. It's an acronym that's frequently used when talking about databases as it's four of the key factors one should think about when thinking about writing queries.

- Does this query happen all at once? Or is it broken up into multiple actions? Sometimes this is a very important question. If you're doing financial transactions this can be paramount. Imagine if you have two queries: one to subtract money from one person's account and one to add that amount to another person's account for a bank transfer. What if the power went out in between the two queries? Money would be lost. This is an unacceptable trade-off in this case. You would need this to be _atomic_. That is, this transaction cannot be divided.
- If I have five servers running with one running as the primary server (sometimes called master but we prefer leader or primary) and the primary server crashes, what happens? Again, using money, what if a query had been written to the primary but not yet to the secondaries? This could be a disaster and people could lose money. In this case, we need our servers to be _consistent_.
- _Isolation_ says that we can have a multi-threaded database but it needs to work the same if a query was ran in parallel or if it was ran sequentially. Otherwise it fails the isolation test.
- _Durability_ says that if a server crashes that we can restore it to the state that it was in previously. Some databases only run in memory so if a server crashes, that data is gone. However this is slow; waiting for a DB to write to disk before finishing a query adds a lot of time.

Not everything you do needs to be ACID compliant. ACID is safe but slow. You need to make the right trade-offs for every app and query you're making. Many of these databases allow you to be flexible per-query what level of ACID you need your query is. Some queries you want to make sure get written out to the secondary before moving on. Others it's fine with a small amount of risk that it could be lost. Some queries need to be atomic, others partial failures aren't the end of the world. It's about balancing your needs.

## Transactions

Along with atomicity is the idea of transaction. Some queries just need multiple things to happen at once. The way this happens is transcations. A transaction is like an envelope of transactions that get to happen all at the same time with a guarantee that they will all get ran at once or none at all. If they are run, it guarantees that no other query will happen between them. Like the bank transfer example, these can be critical in some places because a partial failure is a disaster, it either needs to all happen or not happen at all.
