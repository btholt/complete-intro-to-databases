---
path: "/querying-postgresql"
title: "Querying PostgreSQL"
order: "3C"
description: "SQL is a very flexible and expressive way to describe what data you want out of a database. In this section Brian talks about the various ways to read from and modify a database using SQL."
section: "SQL"
---

You'll find there's a lot of depth to SQL. There are people who most of their jobs is just writing SQL. But let's hop into the basics here. First thing I want to do is insert some dummy data into our users database.

[Click here][sql] for a sample set of tables for your database. What this query will do is drop all your existing tables and then re-set them up. At any time you can re-run this to get a fresh copy of your tables. You can literally just copy this whole thing and paste it into your command line connection to PostgreSQL (psql) and it'll work. There's a more elegant way to load it from the command line but we're in Docker and it's annoying so I'd just copy/paste it. It'll probably take 90 seconds to run.

## SELECT

Let's start with SELECT. This is how you find things in a SQL database. Let's run again the SELECT statement from our previous section and talk about it.

```sql
SELECT * FROM users;
```

This will get every field (which is what the `*` means, a.k.a. the wildcard) from the users database. This will be 1000 users.

## LIMIT

Let's select fewer users;

```sql
SELECT * FROM users LIMIT 10;
```

This will scope down to how many records you get to just 10.

## Projection

Let's just some of the columns now, not all of them (remember projections?)

```sql
SELECT username, user_id FROM users LIMIT 15;
```

In general it's a good idea to only select the columns you need. Some of these databases can have 50+ columns. Okay we've seen basic reads.

## WHERE

Let's find specific records

```sql
SELECT username, email, user_id FROM users WHERE user_id=150;
SELECT username, email, user_id FROM users WHERE last_login IS NULL LIMIT 10;
```

The first one will give us one user whose user_id is 150. The second one will give us 10 users that have never logged.

## AND plus date math

What if we wanted to see if they hadn't logged in and were created more than six months ago?

```sql
SELECT username, email, user_id, created_on FROM users WHERE last_login IS NULL AND created_on < NOW() - interval '6 months'  LIMIT 10;
```

- This shows off the AND keyword where you can query multiple conditions.
- This shows off a bit of date math too. To be honest every time I have to do date math I have to look it up but here's the scoop for this one. created_on is a timestamp and we're comparing to `NOW()` (the current time of the server) minus the time period of six months. This will give us all users who haven't ever logged in and have had accounts for six months.

## ORDER BY

What if wanted to find the oldest accounts? Let's use a sort.

```sql
SELECT user_id, email, created_on FROM users ORDER BY created_on LIMIT 10;
```

For the newest account, just add `DESC` (you can put `ASC` above, it's just implied)

```sql
SELECT user_id, email, created_on FROM users ORDER BY created_on DESC LIMIT 10;
```

## COUNT(\*)

Wondering how many records we have in our database?

```sql
SELECT COUNT(*) FROM users;
```

This will tell you how many users we have in the database total. The `*` represents that we're just looking total rows. If we wanted to look at how many users have ever logged in (since COUNT will ignore NULL values)

```sql
SELECT COUNT(last_login) FROM users;
```

## UPDATE, RETURNING

Let's say user_id 1 logged in. We'd need to go into their record and update their last_login. Here's how we'd do that.

```sql
UPDATE users SET last_login = NOW() WHERE user_id = 1 RETURNING *;
```

Tools we already know! Let's say user_id 2 choose to update their full_name and email

```sql
UPDATE users SET full_name= 'Brian Holt', email = 'lol@example.com' WHERE user_id = 2 RETURNING *;
```

- You just comma separate to do multiple sets.
- Make sure you use single quotes. Double quotes cause errors.
- RETURNING \* is optional. This is basically saying "do the update and return to me the records after they've been updated.

## DELETE

This works as you would expect based on what we've done before

```sql
DELETE FROM users WHERE user_id = 1000;
```

[sql]: https://btholt.github.io/complete-intro-to-databases/sample-postgresql.sql
