---
path: "/mongodb"
title: "MongoDB"
order: "2B"
description: "MongoDB is a document-based NoSQL database that allows developers to write unstructured data to be queried later. Brian goes into what this means for a developer and when you might want to use it"
section: "NoSQL"
---

[MongoDB][jetbrains] is one of the most popular databases in the world today. Over the past decade it has established itself as a reliable custodian of database workloads both small and large. I think it's a fairly uncontroversial thing to say it is one of the most popular NoSQL database in the world, if not the most popular one.

If you look through MongoDB's history, you will find some rough patches. There was the one time it ended up dropping a lot of data and a lot of people wrote it off after that. You may come across stories or upset people if you Google MongoDB. That was a long time ago and they've had a very solid record since then so I wouldn't worry too much about it.

## Let's get MongoDB going

Let's dive into it. If you're running Docker like me, run the following commands

```bash
docker run --name test-mongo -dit -p 27017:27017 --rm mongo:4.4.1

docker exec -it test-mongo mongo
```

This will run a new MongoDB container at version 4.4.1 and call it `test-mongo` so we can reference it by name. We then on the second command run the command `mongo` inside of that `test-mongo` container so we can do things inside of the container. The `mongo` container (which is the official container put together by MongoDB Inc themselves) runs MongoDB automatically so we don't need to do anything. We just need to connect inside the container and run our commands from within the container. At this point you should be dropped into an interactive MongoDB shell. Let's get ourselves acquainted with MongoDB!

## Databases and Collections

Like other databases, MongoDB has the concept of databases inside of it. A database is an overarching group of smaller collections of data. It's up to you how you want to structure your databases and collections but in general you want to keep like-things together. If you have a collection of user information and user notifications, you might consider storing those in the same database but different collections. If you have a user information collection and a collection of items for sale in your store, you might consider storing those in separate databases. Or not! There isn't a hard-and-fast rule here. Organize it how you see fit. One small consideration (don't even have to follow this either) is that if you have one large collection that gets a lot of traffic and a small collection that gets little traffic, it can be logically easier to scale those two servers separately if you put them in separate database.

Collections are groups of documents. A group of objects. Almost always you want each of these objects to represent one thing. If you have a `users` collection, one object should represent one user. I've seen people do things like have throw unlike things in a collection (like putting users and items-for-sale in one collection) and it does not turn out well. Use multiple collections.

Collections also have some fun capabilities. You can do capped collections where you can say "only have 100 items in this collection and toss out the oldest one when you get the 101st". You can also add indexes but we'll get there.

## Let's insert some documents

Inside your MongoDB console run `show dbs`. This will allow you to see all the existing databases. In order to start using one, you do `use <database name>`. Let's make our own. Run `use adoption`. If you run `db` now it'll show you're using the `adoption` database.

Let's make a collection called `pets`. Run `db.pets.insertOne({name: "Luna", type: "dog", breed: "Havanese", age: 8})`. Let's break this down.

The `db` refers to the database you chose with `use adoption`. If you want to use a different database, you just `use` something else.

The `pets` is the name of a collections that we're creating right now on the fly. If a collection doesn't exist, it's created instantly. If it does exist, it'll just insert into that collection. We could have called `pets` anything.

The `insertOne` is a function that exists on collections. As the name implies it allows you to insert one document at a time. There are a lot of ways to insert documents. Just run `db.pets.help()` to see everything available to you. Since the query language is JavaScript, the `()` are just to invoke the function.

The `{name: "Luna", type: "dog", breed: "Havanese", age: 8}` is the actual object being inserted into the collection. Here we're just using strings and numbers, but you can see all the available types [here][bson].

Good so far? Great! Try running `db.pets.count()`. You'll see it returns `1` because we have one pet in our pets collection. Try running `db.pets.findOne()` and you'll see it'll give us Luna back. We'll get more into querying in a second.

Let's insert a lot of documents. Like, 10,000. Since we're querying with JavaScript, we can write some Array fanciness to generate an array of random objects. Copy and paste this into the MongoDB console.

```javascript
db.pets.insertMany(
  Array.from({ length: 10000 }).map((_, index) => ({
    name: [
      "Luna",
      "Fido",
      "Fluffy",
      "Carina",
      "Spot",
      "Beethoven",
      "Baxter",
      "Dug",
      "Zero",
      "Santa's Little Helper",
      "Snoopy",
    ][index % 9],
    type: ["dog", "cat", "bird", "reptile"][index % 4],
    age: (index % 18) + 1,
    breed: [
      "Havanese",
      "Bichon Frise",
      "Beagle",
      "Cockatoo",
      "African Gray",
      "Tabby",
      "Iguana",
    ][index % 7],
    index: index,
  }))
);
```

Basically this makes 10000 pet objects in an array. Because we used modulo, everyone will get the same objects every time. Now run you're `db.pets.count()` and see what you get. You should get back that you have 10,000 items in your database. Great! Let's start querying it.

[jetbrains]: https://www.jetbrains.com/lp/devecosystem-2020/databases/
[bson]: https://docs.mongodb.com/manual/reference/bson-types/
