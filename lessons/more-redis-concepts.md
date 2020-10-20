---
path: "/more-redis-concepts"
title: "More Redis Concepts"
order: "5E"
description: "This course only covers some of Redis's core capabilties but there a few more use cases a developer should know about Redis."
section: "Key-Value Store"
---

Redis has a pretty large surface area of capabilties and power that you should be aware of. These are going to be for advance to very-advance use cases of Redis (as in I have never shipped anything with these in them.)

## EVAL and Lua

Redis has a built in interpreter for Lua which is a fairly simple scripting language. If you need to do a lot of things all at once or for whatever reason need a bit more logic than a simple command that the built-in Redis commands can handle, this is an option.

I'll say once you're in the territory of "I need Redis to evaluate Lua for me", you may want to be asking some questions about what you're doing. 😅

Let's run one for fun, try this one

```redis
EVAL "for i = 0,9,1 do redis.call('SET', 'lua_key_' .. i, i * 5) end" 0
```

`EVAL` allows us to pass some Lua to Redis. In this case we're doing a loop and setting ten keys in Redis, `lua_key_0` through `lua_key_9`. Don't worry too much about learning Lua. It's meant to be a very straightforward language to pick up when you need to.

The 0 at the end represents we're not giving any of the keys that Redis is meant to operating on to Redis to know in advance. Redis wants to know the key names in advance so that if it's in Redis Cluster mode (aka sharded) it can know where to send these queries. If we don't give it those keys in advance it makes this incompatible with Redis Cluster. But we're not in Cluster mode so it's fine.

Let's see a bit more complicated.

```redis
SET lua_key_name cool_stuff_
EVAL "for i = 0,9,1 do redis.call('SET', redis.call('get', KEYS[1]) .. i, i * ARGV[1]) end" 1 lua_key_name 100
```

Here we're referencing the key we're passing (so we're still not fully Cluster compatible since we're making up keys on the fly) and an argument via the `KEYS` and `ARGV` arrays. Keep in mind Lua arrays start at 1, not 0. Same idea at then end though!

There's also the ability to load whole scripts into Redis externally so you can track the scripts separately and then SHA check them. Feel free to look into that yourself.

## Pub/Sub

In several capacities, Redis can do publish / subscribe messaging. You can subscribe to a namespace of keys and then whenver those keys update, you can receive a notification to all listening clients. Very useful for real time notifications where you want your code to react to changes instead of some sort of polling strategy. [See here][pubsub] for more details.

## Transactions

On some occasions you'll want some sort of all-or-nothing sort of behavior from Redis but you don't have the ability to send all those commands at once. Like maybe you need to set multiple keys, delete others, and increments yet different ones all at the same time, and you don't anything happening in the middle of it. This is called a _transaction_. With Redis you can be guaranteed that either all of the commands in a transaction will be run, or none will, and nothing _else_ will happen in the middle of those commands. In this sense these transactions are _atomic_ or cannot be broken up.

You'll used the `MULTI`, `EXEC`, `DISCARD`, and `WATCH` commands to execute transactions in Redis. [See here][transactions] to read more.

## LRU

Some times you just want Redis to act as a simple cache (like Memcached) where you can just write an infinite number of things to Redis and it'll just keep evicting old stuff from memory like a capped collection in MongoDB.

Redis has this capability through a feature called LRU or **l**east **r**ecently **u**sed where Redis will kick out the least recently used thing in its store to make way for new things.

Imagine you have a service that serves users' profile pictures that gets hit a lot (maybe like Gravatar.) You have all these in a database somewhere but you want to serve most of your traffic from Redis only some from your other database. You could use an LRU cache for this. Let's say you have 100 million users. You may not want to keep all those in Redis all at once.

The first thing you would do is set how big you want Redis to get. 100MB, 1GB, 10GB, whatever you have space for. Then in your code you first check to see if the request URL is in the cache. If it is, serve it, if it's not, find in it in the other database, write it to Redis, and serve it to the user. Then Redis, once it reached its space limit, when you wrote to it would evict the least recently used key. The idea is that you will keep the most used keys easily since those users will be using them a lot and users who rarely use it will just have to hit the database and therefore you'll maximize your cache hits!

What I just described is exactly how Memcached works and if that's _all_ you need (and don't mind if you have to rewarm (aka repopulate) that cache again if Redis crashes) then I'd suggest Memcached because it's so fast. However Redis has many ways of doing key eviction and I'll just leave this here for you to peruse later. [See here][lru].

[pubsub]: https://redis.io/topics/notifications
[transactions]: https://redis.io/topics/transactions
[lru]: https://redis.io/topics/lru-cache
