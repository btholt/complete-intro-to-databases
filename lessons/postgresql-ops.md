---
path: "/postgresql-ops"
title: "PostgreSQL Ops"
order: "3I"
description: "While it is not important for a developer to know how to precisely manage a database cluster in production, a developer does need to know a bit how about how it is done so they can plan accordingly when they write their code."
section: "SQL"
---

Like the MongoDB section, my goal here is not to teach you to be a DBA. [Take a look at the documentation][docs]. There is _a lot_ to managing a database in production and I am simply not equipped to take you there.

## Primary & Secondary / Master & Slave

I expose you to the terms master & slave so that you know when reading dated docs that you know what they're talking about but don't use those terms due to horrible connotations. The better, preferred terms are primary and secondary or standby. PostgreSQL no longer has the term slave anywhere in their docs.

Like MongoDB, PostgreSQL has a replication strategy that allows you to write to a primary server (and read from it) as well as reading from the secondaries.

## User Accounts

When creating accounts for your servers to connect to PostgreSQL in production, make multiple accounts. Each account should only have access to what it needs and nothing else. Do you have one service that only works with users and a different one that only works with comments? Give them scoped access to tables and databases. Never use the superuser (like we just did) in production.

I'll leave it at this. There's a lot more to ops but these I felt are the most important points for devs to know.

[docs]: https://www.postgresql.org/docs/13/admin.html
