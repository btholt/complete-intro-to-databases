---
path: "/redis-ops"
title: "Redis Ops"
order: "5G"
description: "Learn a few things about running Redis and how you as a coder can maximize your effectiveness with Redis."
section: "Key-Value Store"
---

Similar to Neo4j, I personally haven't done much administration of Redis but a lot of ther principles are the same. Redis has a primary secondary configuration as well. Their preferred terms are leader and follower (they also used to be master/slave but have since changed it so you may still see that in old documentation and StackOverflow answers.)

The leader server will accept all writes and then write those out to the followers so that all followers are exact replicas of the leader. If a leader and follower (also sometimes called replica) loses track of each other, the followers are smart enough to request the delta of changes when the follower reconnects. If a follower cannot figure out the delta, it just drops everything and totally resyncs. So this is to say you can always read from a follower with full confidence because it won't give you a response without confidence it's correct.

The exception to the above is that it's technically possible in Redis's default configuration that in the split second between a write to the leader and the read from a follower you could get the previous data (a.k.a. eventual consistency.) This is usually an acceptable tradeoff because it's usually lightning fast but sometimes that might not be enough. You can change it so Redis will write to the leader and all its followers before it will finish writing, therefore guaranteeing consistency.

You can also use a WAIT command with Redis to tell it to wait for a highly important command to wait until it's been replicated. I've never used it.

## Redis Cluster

Remember talking about MongoDB's sharding? The same thing is available to Redis via Redis Cluster. This will take your keys and shard them out amongst multiple different pockets of replicated leaders and followers. While this will increase the complexity of your Redis service and makes your Redis deployment _less consistent_ (mean it has higher dangers of dropping writes) you greatly increase how much Redis can scale. This is how you handle terabytes and petabytes of data.

## Redis Sentinel

A very cool feature set provided by the purveyors of Redis, Redis Labs. Redis Sentinenal is a service where it will monitor the health of all your Redis servers, will notify you if a server is unhealthy, and will begin failovers if a service becomes unhealthy that you don't have any down time. It can even kick off a new deploy of a new Redis server, restore itself from Redis, and automatically start serving traffic. This often called a _self-healing_ capability or a _highly available_ service.

A big key with Sentinenel is that you want these servers to live in ways that would fail indepnently. If all of your servers are running the same region of a cloud provider, if that region goes down then sentinel isn't going to much help you. But if you spread them out amongst regions you can survive even regional downtimes!
