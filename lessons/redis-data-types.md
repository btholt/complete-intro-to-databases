---
path: "/redis-data-types"
title: "Redis Data Types"
order: "5D"
description: "Redis has a few different data types. Brian goes over when and where you would use each of them."
section: "Key-Value Store"
---

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

So HLLs are _very similar_ conceptually to a bloom filter which if you've never heard of, I already teach about in one my courses! [See here][bloom-filter].

The general gist if you have an extremely large set of data and need the ability to say something is definitely _not_ in the data set but don't care about false positives. That is to say you need the ability to say "this is not in the data set" and you have tolerance for the algorithm to say "this is not in the data set" even when it was some times. HLLs in Redis allow you to do that. HLLs have a very low false positive rate and a small memory footprint even on large data sets so if you have a problem that fits its use case it's definitely something to consider.

[See here for more docs][hll].

## Streams

Streams are fairly new and not something I've found use for. If you're adding a lot of data to a source and need to be able to subscribe to updates for it (maybe like log streams or readings from an IoT device like a temperature sensor) then this could be useful for you.

[See here][streams].

[hash]: https://redis.io/commands#hash
[sorted-sets]: https://redis.io/topics/data-types-intro#redis-sorted-sets
[bloom-filter]: https://btholt.github.io/four-semesters-of-cs-part-two/bloom-filters
[hll]: https://redis.io/topics/data-types-intro#hyperloglogs
[streams]: https://redis.io/topics/streams-intro
