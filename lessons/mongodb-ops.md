---
path: "/mongodb-ops"
title: "MongoDB Ops"
order: "2H"
description: "While developers don't necessarily need to know how to run a database cluster in production, it can be important to know how and why databases are being run the way they are. Brian gives a brief treatise on the various features of MongoDB's operations aspects."
section: "NoSQL"
---

I am not going to teach you how to run a MongoDB cluster in production. Chances are high you don't need to know how and chances are even higher that I wouldn't know how to teach you anyway!

But before we move on to SQL I wanted to teach you a tiny bit about some of the concepts of how MongoDB servers get run in production so you can understand what's happening, understand what can go wrong, and make yourself a better developer

## Primaries, Secondaries, and Replica Sets

A replica set is a set of MongoDB servers (all running the `mongod` process) that all have the same set of data on them. This is done so that if one of the servers goes down, there are other servers available to step up and continue running without downtime as well as making sure that if a server blows up that you're not losing data.

The primary server is the server that can accept reads (queries that don't modify anything e.g. find) and writes (queries that do modify things e.g. deleteOne, insertMany, etc.). Because it is the only server that can accept writes, it is usually the server under the most load. There is only one primary server per replica set at a time. It always has the most up-to-date information, guaranteed. It is the source of truth.

The secondary servers can only accept reads. All writes must go through the primary. However if you're just doing a read operation you can freely use the secondary. It does end up storing all the information from the primary eventually but it's key to note the MongoDB has **eventual consistency**. That means the secondaries may have a lag time between when you write to the primary and when it updates the secondary. Some times this is acceptable (like storing a social feed of pictures) and some times it's not (like storing banking transactions.) MongoDB does have the ability to set write priorities so you can make your app pause until it can guarantee that all secondaries have received the write.

## Arbiters and Elections

When a primary server goes down, your remaining MongoDB servers hold an election. I won't go into the whole process but through an algorithm the secondaries will decide on a new primary and resume from there. This is MongoDB's failover strategy.

Sometimes it's necessary to have another vote in the election, like if you're only running one primary and one secondary. In these cases you'll have another server that will be an arbiter. An arbiter just votes, it doesn't store data and cannot become a primary. You'd do this so that elections don't become deadlocked. You don't always need arbiters if you have a sufficient amount of secondaries.

## Sharding

Sometimes your data sets so large that it wouldn't be wise to store all of it on set of servers due to resources like RAM and CPU. In these cases it becomes necessary to shard your data. This adds a non-trivial amount of complexity to your app so I'd suggest great caution before jumping into sharding.

For example let's say you're storing all the personal social media information for every person in your country. How would you shard that data across multiple replica sets? One could be tempted to say all users with last names A-M go to one set and N-Z go to another. But is that really 50/50? No, and it's not close. Frequently you'll end up with a hashing strategy of some variety. In any case, just know it's an added layer of complexity and don't adopt it without some forethought.

## Managed Cloud Version

In all honesty, as a developer, it's much easier to just use a managed cloud service like [MongoDB Atlas][atlas], [Microsoft Azure Cosmos DB][cosmosdb], or [Amazon Web Services DocumentDB][documentdb]. These services will manage literally everything for you so you can just focus on writing your app. It's what I do every time I go run a production database.

[documentdb]: https://aws.amazon.com/documentdb/
[cosmosdb]: https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction
[atlas]: https://www.mongodb.com/cloud/atlas
