---
path: "/updating-mongodb"
title: "Updating MongoDB"
order: "2D"
description: "Brian shows you how to update and delete the documents that have been inserted into the database."
section: "NoSQL"
---

## insert, insertOne, and insertMany

You already encountered insert at the beginning of this section but I just wanted to disambiguate insertOne and insertMany for you. insert essentially does the job of both insertMany and insertOne: if you give it an array it will insert many and if you give it an object it will insert one. The insertOne and insertMany methods are nice because if you accidentally give it the wrong thing (like giving it an object when you meant to give it an array) it will cause an error and make you fix it. With insert, you have a higher chance of it doing the wrong thing.

In general use insertOne and insertMany. This also applies to delete vs deleteMany/deleteOne, update vs updateMany/updateOne, etc.

## Updates

When you do updates, you'll have to give a filter as well as what you want to update. Let's just do an example

```javascript
db.pets.updateOne(
  { type: "dog", name: "Luna", breed: "Havanese" },
  { $set: { owner: "Brian Holt" } }
);
```

The first object is the query. This is the same sort of query you'd use in a `.find()`. The second is your update object. Here you have a few options with the various update operators. Let's try another one. Let's say today is **every dog's** birthday 🎂. How could we increase all of their ages with one update?

```javascript
db.pets.updateMany({ type: "dog" }, { $inc: { age: 1 } });
```

This will increase the age of all dogs by 1. There are many more sorts of updates but you can take a look at the docs. [Here are the available update operators][update].

Also worth noting there is an extra parameter you can updateOne and updateMany with additional options. We're about to talk about one of them in the next section, upsert.

Also do note there is a replaceOne as well. This works just like updateOne but it will delete any fields you omit in your update document that exist already in the doc.

## upsert

MongoDB does have a concept of "upserting". This is a portmanteau of the words update and insert and means "insert a new document with these things if you don't find one that exists with that." Like maybe you want to create a new user with an email address if you haven't already, and if it does exist you want to update it with new information.

Let's see how to do that. Let's say you want to want to find a dog named "Sudo" and update its owner to "Sarah Drasner" if it exists (it doesn't in our case) and create a new record with that if there isn't one.

```javascript
db.pets.updateOne(
  {
    type: "dog",
    name: "Sudo",
    breed: "Wheaten",
  },
  {
    $set: {
      type: "dog",
      name: "Sudo",
      breed: "Wheaten",
      age: 5,
      index: 10000,
      owner: "Sarah Drasner",
    },
  },
  {
    upsert: true,
  }
);
```

We're playing this a bit fast and lazy. We should really make sure that we're querying for a unique object based on some sort of a unique key (we'll get into that next.) But yes, make sure you're providing a whole document with an upsert, otherwise on the insert side of upsert you'll get incomplete documents.

## Deletes

Deletes work almost identically to finds except instead of returning documents it deletes them. Both `deleteOne` and `deleteMany` exist (as does `delete` which is discouraged.) Let's say you wanted to delete all Havanese reptiles because that doesn't make sense.

```javascript
db.pets.deleteMany({ type: "reptile", breed: "Havanese" });
```

## findAnd\*

Occasionally you need to find a document _and_ update/delete/replace it at the same time. Instead of having to do two queries and thus have a race-condition of something modifying your document in the interim there are three commands that will allow you to do just that, findOneAndUpdate,
findOneAndReplace, and findOneAndDelete. These work basically identically to updateOne, replaceOne, and deleteOne, they just return it at thend.

## bulkWrite

Particularly when you're writing code, sometimes you need to run a series of queries all at once. That's probably going to be several inserts or maybe a few updates and deletes. Instead of doing a query, waiting, then serially doing the next one, etc. you can do what's called a bulkWrite. bulkWrite allows you to queue up an array of queries and it will execute those queries in the order that you provide them to MongoDB. It's possible but weird to do in the mongo CLI shell so we'll get into it once we're doing code. Suffice to say, it's just what we've been doing but instead of one query object, you provide an array of those same query objects.

[update]: https://docs.mongodb.com/manual/reference/operator/update/#id1
