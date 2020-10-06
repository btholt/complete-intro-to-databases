---
path: "/querying-mongodb"
title: "Querying MongoDB"
order: "2C"
description: "After inserting documents into MongoDB, you are going to want to be able to query those documents. Brian shows you how in this section to write find queries for MongoDB."
section: "NoSQL"
---

So now that we've put a lot of documents into our database, it's time to query our database to get information out of it. There are a variety of reasons and methods you can query a database. You could be querying a database to get one a specific record, like if you're querying for a user object to show a profile page, or you could be querying for a bunch of things at once, like if a user was searching for pets and you wanted to show five results.

## findOne

Let's start with basic querying. Run this in the console.

```javascript
db.pets.findOne();
```

This will go out and find the first item in the database that matches your query and return that. In this case we didn't give it a query which is the same as saying "give me anything." You'll probably get back the first item you inserted into your database which in my case is going to be a Havanese dog named Luna.

Okay, so let's we want to find the 1337 item we put in the database. Try this:

```javascript
db.pets.findOne({ index: 1337 });
```

This will find you one item (of which there is only one anyway) where the index is equal to 1337. Okay, one more, let's find one where it's a dog named Spot.

```javascript
db.pets.findOne({ name: "Spot", type: "dog" });
```

## find

So far we've only been looking at finding one record at time. If you want to find all documents that match your query, you'll have to use find instead of findOne. Let's try it.

```javascript
db.pets.find({ type: "dog" });
```

Notice this only giving you twenty results. What MongoDB does by default is only hand you twenty results at a time in the form of what's called an **iterator** or a **cursor**. An iterator will give you twenty records at a time and allow you to iterate over your results. Frequently this is a useful pattern because you could in theory want to iterate over your whole collection and this allows you to do it piece by piece.

Try iterating now. Run this:

```
it
it
it
```

You'll notice that you're getting twenty different records each time. `it` will tell your iterator that you want it to iterate again on the last iterator you queried for.

## count, limit, and toArray

Okay, so let's try this:

```javascript
db.pets.count({ type: "dog" }); // probably pretty big number
db.pets.find({ type: "dog" }).limit(40);
it; // after this the cursor will end
```

`count` lets you figure our how many of something there are. `limit` lets the cursor know when you want to stop. But what if you just want to get everything all at once? Try `toArray`

```javascript
db.pets.find({ type: "dog" }).limit(40).toArray();
```

This will just dump everything out into an array which is nice if you just want everything all at once. There's a myriad of other things you can do that determine how the data is returned but you can find those fairly easily when you need them.

## Query operators

What if we wanted to find all senior-aged cats in our data set? MongoDB will let you do that! Let's try this

```javascript
db.pets.count({ type: "cat", age: { $gt: 12 } });
```

Note you can use these [query operators][operators] anywhere you're providing a query e.g. findOne, find, etc. The ones you're primarily going to be interested in are

- \$gt - greater than
- \$gte - greater than or equal to
- \$lt - less than
- \$lte - less than or equal to
- \$eq - equals (usually not necessary)
- \$ne - not equals
- \$in - has the value in the array (MongoDB can store arrays and objects too!)
- \$nin - does not have the value in the array

If you wanted to see all Fidos that are not dogs you could do:

```javascript
db.pets.find({
  type: { $ne: "dog" },
  name: "Fido",
});
```

## Logical operators

Taking it a step further, you can do logical operators as well. Let's say you want to find birds between 4 and 8 years old

```javascript
db.pets.find({
  type: "bird",
  $and: [{ age: { $gte: 4 } }, { age: { $lte: 8 } }],
});
```

You also have $or, $nor, and \$not available to you. Keep in mind that $not and $ne are different. The former is the logical operator and the latter is `!==`.

## Special operators

These won't be useful now but I just wanted to let you know that you can query by type (see if something is a number, array, object, etc.) with $type and you can query if a document has a field or not with $exists.

There's a bunch more you can do too. MongoDB even has [geospatial operators][geo] so you can query if two points on the globe are close to each other!

## Sorts

Frequently you'll need to do different sorts with your queries. Let's say you're making a search page for these pets (foreshadowing what we're about to do!) Maybe the person who searching on your website is a kind soul and looking to adopt some senior dogs. They could say sort by age, descending.

```javascript
db.pets.find({ type: "dog" }).sort({ age: -1 });
```

The `-1` means descending and, as you probably guessed, 1 means ascending.

## Projections

Lastly, to conclude our little lesson querying (there's still a lot more you can do), let's talk about projections. The simplest way to use projections is just to limit which fields you return.

```javascript
db.pets.find({ type: "dog" }, { name: 1, breed: 1 });
```

The `1` means "definitely include this". In thise case, we're only including name and breed. If you leave something out (like age) then it doesn't come along for the ride. Notice that `_id` does come along. If you don't want that, you have to explictly exclude it

```javascript
db.pets.find({ type: "dog" }, { name: 1, breed: 1, _id: 0 });
db.pets.find({ type: "dog" }, { name: true, breed: true, _id: false }); // note that true and false work too
```

It also works to just exclude fields which means include everything I haven't excluded

```javascript
db.pets.find({ type: "dog" }, { _id: 0 });
```

[operators]:
[geo]:
