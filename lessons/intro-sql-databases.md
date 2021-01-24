---
path: "/intro-to-sql-databases"
title: "Intro to SQL Database"
order: "3A"
description: "The most common databases today are relational databases. Brian goes over the landscape of current SQL-based relational databases and some of their features."
section: "SQL"
---

First things first: when I say "SQL databases" I mean relational databases (also frequently abbreviated as RDBMS, relational database management system.) It's important to note that not all relational databases use SQL and not all non-relational databases don't use SQL (i.e. some NoSQL databases do use SQL.) However I'm using the most common terminology here to help you integrate with the information already out on the Internet. This is a case (like serverless) where marketing won and we ended up with weird terminology.

## What is a relational database

The best way I can think of to describe a relational database is to think of a spreadsheet like Excel, Numbers, or Sheets. It's a big table with many columns and rows. Each row reprents one entry in the database and each column represents one field in the database.

Most relational databases have structured schema to them; you can't just make stuff up on the fly like MongoDB. You have to follow a pre-made schema when you insert into the database. For example, when you create your address database, it will have address, city, and state on it. If someone tries to insert a "comment" column into it, it won't let them because it's outside of your pre-defined schema. This can be a benefit because it enforces some discipline in your app but it also can be inflexible.

The secret power of relational databases is in their name: you can have multiple databases that all relate to each other. I guess if it's in the name it's not that secret. Whereas in MongoDB it's a bad idea to try and JOIN together documents across collections, it's a great idea for multiple tables in a relational databases to JOIN together.

## What is SQL

SQL stands for structured query language. It's basically a way of forming questions and statements to send to a database to create, read, update, and delete records. Each relational database has its own flavor of how it wants that SQL to look but in general they're mostly withing spitting distance of each other. Whereas with MongoDB we were sending JSON query objects, here we'll send query strings that the database will read and execute for us. It's a very powerful and flexible language but this is a deep ocean. [Technically SQL is Turing Complete][turing]. I remember my very first job, an internship actually, I was spending all day crafting enormous (dozens of lines) queries. We're not going that deep. We'll cover the basics here and then you can go deeper when you need to.

The key here is that you understand how a relational databases work, can break data architectures down into relations, and know how to write proper queries to a relational databases.

## The SQL Landscape

Today we're going to be talking about PostgreSQL and I want to justify that decision to you. There were a lot to choose from here (whereas MongoDB was really only the choice in the NoSQL space.) Before I extol the virtues of PostgreSQL to you, let's explore what we could have chosen.

## MySQL / MariaDB

The other "obvious" choice would have been MySQL and honestly it's the one I've used the most personally in my career. It also backs the wildly popular WordPress and is just really popular in general with companies like Facebook, Google, and Netflix being known for being big users of them. It is absolutely a valid choice to use them today; it's highly scalable, a very well understood and mature codebase, and has plenty features to keep you happy. It is owned by Oracle which does offer some users pause (they acquired it via their Sun acquisition.)

Some of the original creators of MySQL forked it after the Oracle acquisition to make MariaDB which is mostly a drop-in replacement for MySQL. It's also a very good choice and widely used today.

## SQLite

Another very, very common database. SQLite is a stripped down, very small, and very performant database. It's actually meant to ship with whatever server it's running with; it's not meant to be its own server. Gutting all the necessary network code and replication code makes it a tiny database easy to ship with IoT devices, on operating systems, game consoles (both PlayStation and Xbox use it!), fridges, and literally everywhere around you.

It's not terribly useful for web development. While easy to run, it falls over with any sort of scale and can't be scaled independently. Useful to know for embedded scenarios but not for shipping to production

## Microsoft SQL Server / Oracle / DB2

All of these are commercial products. They're all fairly old products (my father actually worked on DB2!) that work well at huge scales but their price tags can be very hefty. And since I've never used them nor would I because of the great open source databases available, I'll leave you to explore them on your times.

## PostgreSQL

This takes us to PostgreSQL (said "post-gress"). PostgreSQL is another wonderful open source database that continues to gain lots of marketshare and how some absolutely killer features to it. We'll get into those as we go but know it scales, it is reach with great features, and is a very popular. It has illustrious users such as Apple, Microsoft, Etsy, and many others.

[turing]: https://stackoverflow.com/a/7580013
