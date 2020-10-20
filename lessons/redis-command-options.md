---
path: "/redis-command-options"
title: "Redis Command Options"
order: "5C"
description: "Useful when using Redis is the ability to define when documents get deleted with TTLs and when a query will fail with NX and XX."
section: "Key-Value Store"
---

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
