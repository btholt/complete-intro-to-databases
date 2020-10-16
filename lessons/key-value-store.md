---
path: "/key-value-store"
title: "Key-Value Store"
order: "5A"
description: "Graph databases are great when you need to define relations between objects that can have complex webs of relations especially for things like social networks."
section: "Key-Value Store"
---

A key-value store is a very different beast than what we've been looking at so far. The first thing to realize is that very rarely will a key-value store be your primary database. It will almost always be a supplementary tool to another database that you're using. There are examples of people _just_ using a key-value store so I can be proven wrong but I'll say that's a very advance and rarer use case. You'd best know what you're doing.

Key-value stores have a few interesting characteristics of what makes them interesting. One of their biggest pluses is they tend to be very simple in terms of their APIs and capabilities. This is a feature in the sense they're easy to understand and easy to use. Due to their simple nature and simple operations, this makes them highly scalable and able to deals with extreme amounts of traffic (even more than our other databases) because they can't do complicated queries. Whereas you can send an SQL query to PostgreSQL to join multiple tables and aggregate them into fascinating insights, with a key-value store you're limited more-or-less to "write this to the database" and "read this from the database". They do a few more things but that's the gist.

I like to think of a key-value store as a giant JavaScript object. You can `store['my-key'] = 5` and then later you can come back later and ask for `store['key']` and get `5` back. Honestly that's 90% of the use right there. You store a value under a key and then later you can ask for that key back. There are a few other operations you can too and we'll get there, but that's the general idea.

## Use cases

Key-value stores are commonly used as caches. Imagine you have a very expensive PostgreSQL query that takes five seconds to run, is commonly needed by users, and rarely updates. If your app ran that five second query every single time a user needed to see that data it would bring down your servers. Since it rarely updates what we could do is only run that query once a day and then store the result in Redis. Instead of your app running the query against PostgreSQL, it would read first from the key-value store. If it found it, it would use that instead. This is an extreme example of when to use caching but it can be a very useful mechanism for increasing app performance.

Another good use case is non-essential data that is frequently used but it would be okay if it went away. A really good example of that is storing session data for users browsing your site. If your entire cache dropped every use would log out. It's not ideal but it's not the end of the world either. We'll get into in a second but you normally don't want mission critical data in one of these key-value stores.

Another good use case is analytics or telemetry. Most of these key-value stores are very good at quick arithmetic operations like increment, decrement, and other such number-modifying operations. So if you're counting page views on a high traffic site, a key-value is possibly a good place to put it.

There are plenty of other use cases and we'll do a few so you can see but keep an open mind. People do a lot of amazing things with key-value stores.

## Key-value stores to choose from

You have a few options to choose from but I'll highlight a few quick ones for you.

### PostgreSQL hstore

Our old friend PostgreSQL does have a built in key-value store mechanism called hstore! We won't be focusing too much on this feature of PostgreSQL but it's worth you knowing about. hstore is more about the paradigm of using keys to store values than it is for caching and high scale like the other key-vaue stores are. You don't want to do high-traffic caching or sessions via hstore, for example. However if you're interested in storing some of your in key-value pairs instead of in a table, hstore is a good idea for that.

### Memcached

One of the oldest key-value store databases still heavily in use. Like SQLite, its strength is its simplicity. Unlike all the other databases we've talked about, it is not designed to have clusters, it doesn't have a ton of features, and it won't even write to disk! Everything in Memcached is always kept in memory and if it runs out of memory it just starts evicting old stuff out of the store. Memcached is perfect for sessions and caching where it's data where it's accessed a lot but it's not the end of the world if it gets evicted since if your server shuts down it will lose everything. Very high performance but has its down sides.

Memcached only stores strings. You can put anything in the strings but it doesn't do any validation whatsoever. People will frequently store JSON objects stringified to get other data types into it.

### Redis

This is the tool we'll be focusing on and one I've used a lot in my career. Redis stands for **re**mote **di**ctionary **s**erver. It has many similar facets that Memcached does but it's more feature-rich product. It can do multiple servers (calle clusters), has multiple data types, will actually write your cache to disk so it can restore state after a server restarts, and lots of other features. It's meant to be a bit less volatile than Memcached but still be aware you don't get the same sort of data guarantees that get with a database like MongoDB or PostgreSQL.
