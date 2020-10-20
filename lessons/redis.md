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
