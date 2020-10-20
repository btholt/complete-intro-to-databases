---
path: "/neo4j-ops"
title: "Neo4j Ops"
order: "4G"
description: "Brian talks for a second about what things to consider with Neo4j running in production."
section: "Graph"
---

I admittedly know far less about running Neo4j in production. The biggest consideration here is that if you want to run anything other than a single server of Neo4j at a time (which is basically anyone who want to run Neo4j in production) then you need to buy an enterprise license from them. The Community edition is suitable for hobby tasks and very-small scale things but any sort of real product dev at a company means you need to pay them (which to me isn't the worst thing.) All the core functionality of the graph database does exist in the community edition. Everything we just did was on the community edition.

The enterprise edition has support for clusters of server (primaries and secondaries.) Its other key is its ability to do backups without downtime. The Community version does do backups but it has to stop the server while it does it.

There's a bunch of other features that enterprise has that companies will need like ActiveDirectory integration, unlimited size (Community does have a cap, a large cap, but still a cap on the graph size), and some other stuff.

That's it for Neo4j! Hope you liked it!
