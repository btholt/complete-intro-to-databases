---
path: "/aggregation"
title: "Aggregation"
order: "2F"
description: ""
section: "NoSQL"
---

MongoDB has a fun feature called aggregation. There's two ways of doing it, aggregation pipelines and map-reduce. Map-reduce is exactly what you'd expect if you're from a functional programming background: you provide MongoDB a map function that it will run every item in the array and then a reduce function to aggregate your collection into a smaller set of data.

MongoDB also released a newer feature of aggregation pipelines that tend to perform better and can also be easier to maintain. With these you provide a configuration object to the `aggregation` pipeline

What if we wanted to know how many puppies, adult, and senior dogs we have in our pets collection? Let's try just that

```javascript
db.pets.aggregate([
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 3, 9, 15],
      default: "very senior",
      output: {
        count: { $sum: 1 },
      },
    },
  },
]);
```

- With the aggregation piplelines, you provide a step of things to do. In this case we only have one step, bucket pets into 0-2 years old, 3-8 years old, 9-15 years, and "very senior" (which is the default bucket.)
- With the output you're defining what you want to pass to the next step. In this case we just want to sum them up by adding 1 to the count each time we see a pet that matches a bucket.

This is all pets. We want just dogs. Let's add another stage.

```javascript
db.pets.aggregate([
  {
    $match: {
      type: "dog",
    },
  },
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 3, 9, 15],
      default: "very senior",
      output: {
        count: { $sum: 1 },
      },
    },
  },
]);
```

Using the `$match` stage of the aggregation, we can exclude every pet that isn't a dog.

Last one, what if we wanted to sort the results by which group had the most pets?

```javascript
db.pets.aggregate([
  {
    $match: {
      type: "dog",
    },
  },
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 3, 9, 15],
      default: "very senior",
      output: {
        count: { $sum: 1 },
      },
    },
  },
  {
    $sort: {
      count: -1,
    },
  },
]);
```

As you can see, you just add more stages to the aggregation until you gather the insights you're looking for. There are many more things you can do, so [here's a link to all the existing aggregation stages][stages].

This is definitely one of the most fun parts about MongoDB. We used to use MongoDB's aggregation features to catch fraudsters in our classifieds app!

[stages]: https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
