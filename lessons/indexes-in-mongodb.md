---
path: "/indexes-in-mongodb"
title: "Indexes in MongoDB"
order: "2E"
description: "When querying against MongoDB, query performance can be very important. Brian shows you how to think about indexing a MongoDB database to improve performance and capabilities."
section: "NoSQL"
---

Databases are honestly marvels of technology. I remember in my computer science program I had to write one and it could barely run the rudimentary queries it needed to pass the class. These databases are powering everything around you and munging through petabytes of data at scale.

Frequently these databases can accommodate these queries without any sort of additional configurations; out of the box they're very fast and flexible. However sometimes you'll run into some performance issues for various different reasons. The queries will either be very slow, will cause a lot of load on the server running, make the server run unreliably, or even all of the above. In these cases **indexes** can help you. Indexes are a separate data structure that a database maintains so that it can find things quickly. The tradeoff here is that indexes can cause inserts, updates, and deletes to be a bit slower because they also have to update indexes as well as they just take up more room on disk. But in exchange you get very fast queries as well as some other neat properties we'll explore like enforcing unique keys.

## Explain

Let's start by saying I'm definitely not an a DBA, a database admin or a database architect depending on who you ask. There are people whose entire jobs are doing things like this: knowing how to optimize databases to fit usecases. Instead, I'm going to walk you through a few use cases and show you the tools I know to probe for better solutions. From there it's best to work with people who have a deep knowledge of what you're trying to.

Consider this fairly simple query:

```javascript
db.pets.find({ name: "Fido" });
```

Pretty simple: find all pets named Fido. However this query does a really dastardly thing: it will actually cause the database to look at **every single record** in the database. For us toying around on our computer this isn't a big deal but if you're running this a lot in production this going to be very expensive and fragile. In this case, it'd be much more helpful if there was an index to help us. Let's first see what explain can tell us.

```javascript
db.pets.find({ name: "Fido" }).explain("executionStats");
```

The two things to notice here are the strategy it used to do our query and how many records it looked at. In this case it looks at _every_ record in our database and it used a `COLLSCAN` strategy which is the same as a linear search aka a log n search. Not good! Let's build an index to make this work a lot better!

## Create an Index

```javascript
db.pets.createIndex({ name: 1 });
db.pets.find({ name: "Fido" }).explain("executionStats");
db.pets.find({ name: "Fido" }).count();
db.pets.getIndexes();
```

Notice that it went faster. In my case the speedup was about 300%. Then notice that the number of records examined is the same number as the count. Lastly you can always inspect what indexes exist using getIndexes.

## Compound Indexes

If you are frequently using two keys together, like type and breed for example, you could consider using a compound index. This will make an index of those two things together. In the specific case that you are querying with those things together it will perform better than two separate indexes of the two things. Since this isn't meant to be an in-depth treatise of indexes, I'll let you explore that when you need it.

## Unique Indexes

Frequently you want to enforce uniqueness on one of the fields in your database. A good example is that an email in your user database should be unique i.e. a user should not be able to sign up twice with the same email address. Our database of pets doesn't really have a good use case for a unique index but let's do one on index to show you how to make one. Since `_id` already exists it's a redundant to make another number unique index.

```javascript
db.pets.createIndex({ index: 1 }, { unique: true });
```

If you get an error like the one below, run a deleteOne on the duplicate key to drop one of them and then try again.

```json
{
  "ok": 0,
  "errmsg": "Index build failed: 681332bb-c753-45fb-80c2-00ef2ec1a4e7: Collection test.pets ( 2aa18781-33ae-4aa8-846b-934594558b72 ) :: caused by :: E11000 duplicate key error collection: test.pets index: index_1 dup key: { index: 10000.0 }",
  "code": 11000,
  "codeName": "DuplicateKey",
  "keyPattern": {
    "index": 1
  },
  "keyValue": {
    "index": 10000
  }
}
```

Once you have it indexed try this query:

```javascript
db.pets.insertOne({ name: "Doggo", index: 10 });
```

Now this will fail because 10 already exists. As a bonus, now `index` is indexed so can easily query by it.

```javascript
db.pets.find({ index: 1337 }).explain("executionStats");
```

Notice it only looks at one record!

## Text Index

Frequently something you want to do is called "full text search." This is the similar to what happens you search Google for something: you want it to drop "stop words" (things like a, the, and, etc.) and you want it to fuzzy match things. Like if I was searching for "Luna Havanese dog" I'd expect to match all dogs named Luna that are Havanese.

First of all, this is directly possible in MongoDB (it used to not be.) However there is entire style of database that does this for you, called search engines. [Apache Solr][solr] is the one I used to use at my old job. There are tradeoffs and things that a full separate server can do for you that MongoDB can't. And you can scale them separately which can be helpful.

So in MongoDB you'll create a text index. Each collection can only have one text index so make sure you're indexing all the fields you want to in the one you choose. In our case let's index type, breed, and name.

Also bears mentioning that by default it does text search in English. It's possible to set it to other languages or no language at all. [See here][text-index].

```javascript
db.pets.createIndex({
  type: "text",
  breed: "text",
  name: "text",
});
```

Okay, so now we've indexed it, how do we search it? You'll use a special \$text operator.

```javascript
db.pets.find({ $text: { $search: "dog Havanese Luna" } });
```

Okay, so notice this is doing an "any" match and not sorting on the most accurate score. Frequently this isn't what you want: you want the thing that matches most closely with your search terms. We can do that, it just doesn't do that by default.

```javascript
db.pets
  .find({ $text: { $search: "dog Havanese Luna" } })
  .sort({ score: { $meta: "textScore" } });
```

This will now send you back the ones that most closely resemble what you're looking for. If you want to see the actual text scores, here's how you can see them.

```javascript
db.pets
  .find(
    { $text: { $search: "dog Havanese Luna" } },
    { score: { $meta: "textScore" } }
  )
  .sort({ score: { $meta: "textScore" } });
```

One more note, the `""` and `-` operators from Google do work here. If you want to search for all Lunas that are not cats you can do this:

```javascript
db.pets
  .find({ $text: { $search: "-cat Luna" } })
  .sort({ score: { $meta: "textScore" } });
```

There's more to the \$text search operator which I'll leave you to explore. [See here][text].

[solr]: https://lucene.apache.org/solr/
[text-index]: https://docs.mongodb.com/manual/tutorial/specify-language-for-text-index/
[text]: https://docs.mongodb.com/manual/reference/operator/query/text/index.html
