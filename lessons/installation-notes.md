---
path: "/installation-notes"
title: "Installation Notes"
order: "1B"
description: "Brian gives you notes on how you can install the various databases you will be using in this course."
section: "Welcome"
---

In this course we will be using four different databases: MongoDB, PostgreSQL, Neo4j, and Redis. These are software packages that you will have to download and get running and you have several options to do that. All of these will work on macOS, Windows, and Linux. I'll be sure to cover in depth how to do it on macOS and Windows and I assume all my Linux friends can adapt the macOS instructions to themselves.

In every case, make sure you are getting the same version I am using. If you don't you will likely run into problems as the syntax and queries can change from version to version. Here are the version I'm using for this course.

- MongoDB v4.4.1
- PostgreSQL v13.0
- Neo4j v4.1.3
- Redis v6.0.8

Here are a few of your options:

## Docker

This is going to be how I'm going to do it and I will show you the correct Docker commands to run it this way. If you are unfamiliar with Docker and containers, [I have a course here][containers] that will quickly get you up to speed on this. Even if containers aren't super familiar to you, if you install Docker and follow the commands everything should just work. [Head here][docker] to install Docker Desktop which will handle everything you need.

## Package manager

Another perfectly good option is to install the databases from a package manager. If you're on macOS, that will be [homebrew][brew] on macOS and if you're on Windows that will can be either [winget][winget] (this is still in public preview so it may not work totally well yet) or [Chocolatey][choc]. As of writing, winget only has MongoDB and PostgreSQL. Homebrew and Chocolatey have all of the requisite databases.

For Linux, you will be using whatever your distro's package manager is. If you're using Linux as your desktop I assume you know how to do that. 😄

## Download and install the binary yourself.

You can just head to all of the websites and install them yourself! I prefer to do this through a package manager but there's no reason you can't do it this way if you prefer. Here are all the correct URLs for you. Make sure you downloading the version I'm listing or you may have issues (it likely won't be the current version.)

- [MongoDB][mongodb] – v4.4.1
- [PostgreSQL][postgresql] -v13.0
- [Neo4j][neo4j] - v4.1.3
- [Redis][redis] - v6.0.8

## Cloud solutions

I'm going to throw this out as a possibility if your computer simply cannot run a database. Chromebooks and iPads could potentially have this problem. All of these databases do run in the cloud and you could probably get a free trial version of each of these running in the cloud and just connect remotely to these databases. This could be difficult because it'll be a lot of managing connection strings and firewall rules and the like. I'll let you look for these on your own since I have a bit of a conflict of interest here in which one you choose (as of present I work for Microsoft's cloud, Azure.)

## Node.js Version

We will be running some code samples with Node.js. It's less important which version of Node.js you choose as long you're above version 10. I will be using the latest LTS for this course, v12.18.4. Feel free to install through [the website][node] or through some sort of version manager like [nvm][nvm].

[containers]: https://frontendmasters.com/courses/complete-intro-containers/
[docker]: https://www.docker.com/products/docker-desktop
[winget]: https://docs.microsoft.com/en-us/windows/package-manager/winget/#install-winget
[choc]: https://chocolatey.org/
[brew]: https://brew.sh/
[mongodb]: https://www.mongodb.com/try/download/community
[postgresql]: https://www.postgresql.org/download/
[neo4j]: https://neo4j.com/download-center/#community
[redis]: https://redis.io/download
[nvm]: https://github.com/nvm-sh/nvm
[node]: https://nodejs.org/download/release/v12.18.4/
