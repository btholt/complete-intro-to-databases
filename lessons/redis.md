---
path: "/redis"
title: "Redis"
order: "5B"
description: "Graph databases are great when you need to define relations between objects that can have complex webs of relations especially for things like social networks."
section: "Key-Value Store"
---

Let's get Redis running through Docker. Run this

```bash
docker run -dit --rm --name=my-redis -p 6379:6379 redis:6.0.8
docker exec -it my-redis redis-cli
```

This should drop you into an interactive shell with Redis. Let's start with some basic sets and gets.

## SET and GET

```redis
SET name "Brian Holt"
GET name
```

There ya go. That's it. Pack it up. Go home. We're done here.

I mean, just kidding, but pretty close. Redis commands are almost very simple like this. You send a command (e.g. `GET` and `SET`), a key (e.g. `name`) and a value (e.g. the string `"Brian Holt"`.)

## Naming Keys

Let's talk a second about naming keys. It's not sustainable to just a flat name like `name`. Unlike PostgreSQL and MongoDB where you have tables and collections to logically separate entities, with Redis it's all one mishmosh of stuff. Only the keys separate what's in there. So that means you need some sort of key system to keep things separate yet retrievable.

Let's say you cache user information. The most commons strategy is to use `:` to separate and "namespace" keys. So if you had three users named `btholt`, `sarah_edo` and `scotups`, you may store their user info in three different keys like this: `user:sarah_edo`, `user:btholt`, and `user:scotups`. Now we know we can always retrieve `user:<user name here>` whenever we want user info. We also don't have to worry that if we cache payments later that we'll overwrite the `scotups` key, we can just namespace it different like `payment:scotups`, `payment:1marc`, etc. You can even go further and have multiple layers like `user:address:btholt`. These keys can actually be up to 512MB in length (don't do that haha) so you can have very long key names. Again, Redis just see this as a key so it's up to us how we want to namespace it. Redis won't enforce anything about it.

While I see `:` mostly as the delimiter, you'll see some use `/` too.

Technically Redis keys are "binary safe" which means you could have a JPEG (like the actual image itself) as a key. In general I wouldn't using a binary like that directly since the key will be long and the key comparison it will do will slow down Redis but you could MD5 an image and use that as a key if you were using Redis to disallow-list images or something like that.

## INCR DECR INCRBY DECRBY

A very common thing is wanting to do is do some quick additions or substracts on a value in the store. One of them could be that you're tracking page views. You could do something like this:

```redis
SET visits 0
INCR visits
INCR visits
INCR visits
DECR visits
```

Every time a user hits your website, you could just send a quick command to Redis to increment its store. You don't need to know right then what the count of visits is. It's enough to blindly fire off "whatever is there, add 1". I added a `DECR` at the end just so you can see how to decrement too.

What if you need to add or subtract more than just one? One case could be that you're tracking someone's score in a (American) football game and one team scores a touchdown. You could do:

```redis
SET scor
INCRBY score:seahawks 6
DECRBY score:broncos 3
```

Same idea, you just have to tell Redis by how much you want to add or subtract.

## MSET MGET

Another thing you can do is do multiple gets at a time as well as multipe sets

```redis
MSET score:seahawks 43 score:broncos 8
MGET score:seahawks score:broncos
```

You can have a lot of keys here so this is useful if you need to write or get a lot of things at once.

There is also [pipelines][pipelines] as well as [transactions][transactions] available to you as well if you need to batch write things. That's beyond the scope of this intro but just be aware all of these are helpers for doing multiple things at once.

## EXISTS

This is very helpful for making sure you don't duplicate anything. If you're write code you're write a code that needs to explore a maze and you want to make sure you don't revisit points on a cartesian plane. You could do something like

```redis
SET plane:0:0 visited
EXISTS plane:1:0
SET plane:1:0 visited
EXISTS plane:0:0
EXISTS plane:1:1
SET plane:1:1 visited
```

So it would check each spot on the graph if it had been there, if it had, it would try the next area until it could find somewhere it hadn't been there before. EXISTS will just give you a true or false if a key exists.

## DEL

Sometimes you need to explictly need to delete something from the cache.

```redis
SET greeting hello
EXISTS greeting
DEL greeting
EXISTS greeting
```

## NX and XX

These allow you to tell Redis "fail if this key already exists" or "fail if this key doesn't already exists". Occasionally this can be helpful.

Note the `#` comments aren't valid so don't copy and paste those parts.

```redis
SET color blue XX # fails because it doesn't exist yet
SET color blue NX # succeeds because it didn't exist
SET color blue XX # succeeds because it does exist
SET color blue NX # fails because it does exist
```

Just thing that `NX` is succeeds when **n**ot e**x**ists and `XX` is the other one.

You could actually re-implement our plane explorer above with this.

```redis
SET plane:0:0 visited NX # succeeds
SET plane:1:0 visited NX # succeeds
SET plane:0:0 visited NX # fails
SET plane:1:1 visited NX # succeeds
```

And now you can just track if a read/write fails or succeeds to know if you've been there before.

## TTL

TTL stands for **t**ime **t**o **l**ive. The idea here is you can put an expiration on a key in Redis and after that time Redis will automatically clean up the record for you. MongoDB and PostgreSQL also possess this ability but it becomes essential to caching.

Let's say you run a fitness app and a user wants to see all their fitness statistics for their workouts. Let's say this calculation is fairly expensive to do so it'd be better if we didn't do it multiple times a minute if a user refreshes the page. And typically that data doesn't update so frequently; people don't work out all the time. Yet after an hour or so that data is stale: our users want to see fairly up to date information. We could do this:

```redis
SET fitness:total:btholt 750kj EX 3600
```

This will set the key of `fitness:total:btholt` to expire after an hour after which it'll delete itself. Think of `EX` meaning expires. EX is always in seconds. Then in your code you'll first try to grab the cache. If something is there, it means it's still valid so go ahead and serve that. If it's not there, it means you need to recalculate it and you go ahead and do it right then.

There is also `PX` if you need milliseconds.

If you want to see it in action, try this.

```redis
SET test_expire hi EX 5
EXISTS test_expire
```

## Thundering herd

A word of caution: the _thundering herd_ problem is something to consider. Let's say that 1,000 users hit that page all at the same time when the cache has expired. Our server will miss the cache 1,000 times and try to calculate the response 1,000 times. This is referred to as the thundering herd problem. Caching is difficult business. It's not a huge possibility here because we're just targeting one user but if it was a real possibility that multiple users could hit a cache miss then you need to mitigate that. A good way is that the server _only_ reads from the cache and then a separate background job updates the cache automatically (and thus you wouldn't use TTLs at all.)

After five seconds EXISTS will return false. Very useful for all sorts of caching strategies.

## Data types

Redis has a few differnt types of data. We won't go over all of them because most of them cover more advance usecases but so you know here they are:

- Strings (binary safe, so you could write the contents of JPEG here)
  - Technically numbers/integers are implemented as strings
- Lists (i.e. arrays)
- Sets
- Sorted sets (similar to above but every thing has a "score" to it so you can grab the top ten values. Think priority queue sort of idea)
- Hashes (think JS object or Python hash)
- HyperLogLogs (not kidding, that's the name, we're not covering them)
- Streams (basically an append-only stream of data, think an ongoing log of data)

You've already seen a string. Try running

```redis
SET name Brian
TYPE name # string
SET visits 10
TYPE visits # string
```

## Lists

I don't find myself frequently needing lists with Redis but a good use case may be notifications for a user. Let's say you have a user that has three notifications you need to add

```redis
RPUSH notifications:btholt "Call your mom" "Feed the dog" "Take out trash"
LRANGE notifications:btholt 0 -1
```

- `RPUSH` can be thought of as a push on a stack. You're adding thing(s) to the end of a list.
- `LRANGE` can be thought of as the `GET` for lists (GET doesn't work on lists). It always requires the indexes you want to get so `0 -1` gets you the whole list. You can give it `1 5` and that will be the 1 index (i.e. the second) element to the 5 index element. Negative numbers count back from the end with -1 being the last element, -2 being the penultimate, etc.

Okay, so let's say btholt dismisses the last item on the list. You could do.

```redis
RPOP mylist
```

- This, like pop on stack, will return the last item on the list and remove it from the list.
- LPOP does the same from the front of the list.
- LPUSH also works as well, adding items to the front.
- LTRIM allows you to truncate list. If I said `LTRIM notifications:btholt 0 5` it'd drop any notifications beyond five. This is useful if we don't let btholt get any more than five notifications at a time.

## Hashes

Think of hashes like an object in Redis. Maybe we could repsent btholt's user like this

```redis
HMSET btholt:profile title "principal program manager" company "Microsoft" city "Seattle" state "WA"
HGET btholt:profile city
HGETALL btholt:profile
```

Userful if we don't want to have separate keys for all of these. Do note that most of the operators like `INCR` exists for hashes as well e.g. `HINCR`. [See here][hash].

## Sets and Sorted Sets

A set is just a group of things. In our case it will be a group of strings which won't have a concept of order. For example if you had a set of colors. There's no "order" to a set of colors, it's just a group. We could do this.

```redis
SADD colors red blue green yellow
SMEMBERS colors
SISMEMBER colors green # true
SISMEMBER colors gold # false
SPOP colors # removes and returns a random element
```

There's another sort of set that's called a sorted set that allows you to add priorities so that you can ask for the top ten things in a list. We won't spend a lot of time on them but here's a quick demonstration

```redis
ZADD ordinals 3 third
ZADD ordinals 1 first
ZADD ordinals 2 second
ZADD ordinals 10 tenth
ZRANGE ordinals 0 -1
```

It's basically an array that sorts itself on the fly based on those priorities you give to it.

If you're keen to learn more [see here][sorted-sets].

## HyperLogLog

Best name ever.

So HLLs are _very similar_ conceptually to a bloom filter which you've never heard of, I already teach about in one my courses! [See here][bloom-filter].

The general gist if you have an extremely large set of data and need the ability to say something is definitely _not_ in the data set but don't care about false positives. That is to say you need the ability to say "this is not in the data set" and you have tolerance for the algorithm to say "this is not in the data set" even when it was some times. HLLs in Redis allow you to do that. HLLs have a very low false positive rate and a small memory footprint even on large data sets so if you have a problem that fits its use case it's definitely something to consider.

[See here for more docs][hll].

## Streams

Streams are fairly new and not something I've found use for. If you're adding a lot of data to a source and need to be able to subscribe to updates for it (maybe like log streams or readings from an IoT device like a temperature sensor) then this could be useful for you.

[See here][streams]

[hash]: https://redis.io/commands#hash
[sorted-sets]: https://redis.io/topics/data-types-intro#redis-sorted-sets
[bloom-filter]: https://btholt.github.io/four-semesters-of-cs-part-two/bloom-filters
[hll]: https://redis.io/topics/data-types-intro#hyperloglogs
[streams]: https://redis.io/topics/streams-intro
