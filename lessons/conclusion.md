---
path: "/conclusion"
title: "Conclusion"
order: "6A"
description: "Brian wraps up the course and says his parting, wise words."
section: "Conclusion"
---

Congratulations! You survived a tidal wave of information coming your way about how to store data in a variety different settings. You have enough context now to make a good judgment call on the best way to store you data n a variety of different settings and needs. Let's go over a few more considerations for you to make as you're considering decisions to choose when and where.

## Paradigm

Having a decent amount of familiarity with the databases I've shown you as well as a few others, the first thing I stop to think about with which database I want to use with a project is what paradigm of data do I have?

- Do I have highly relational data where I'll many tables that need to join to other tables? SQL/Relational databases are probably best here
- Do I have highly unstructured data where I'll have collections of related objects that are differently shaped? Document-based databases are going to shine here
- Do I have data where I need to describe graphs of relationships? A graph database can work best here
- Do I have simple needs of just retreiving data based on keys? Key-value stores can be a primary database in these cases
- Do I have pipelines of information that need to filter, split, combined, and republished? Something like [Apache Kafka][kafka] could be really helpful here

Do none, some, or all of these fit? Do you have other considerations? Take a second to consider all of your data needs.

## Read-Heavy vs Write-Heavy

This has as much to do with _which database_ you're choosing as it does with _how you architect_ your data with whatever database you're choosing.

Here's a great example (shout to my conversation with [Harry Wolff], director at MongoDB Inc that inspired this.) If you have relational data but it's almost never read and more frequently read and your other usecases are more favored to using a document-based database, MongoDB is actually a fine choice to make in that case. MongoDB does do joins, it's just not so optimized as something like PostgreSQL is for it.

Think a lot about where your hotspots of reads and writes are. Optimize for those. You can tolerate slowness and inefficiency in areas where they don't get run frequently.

Also recognize that you can rarely anticipate fully where your hotspots and non-hotspots are going to be in advance so be flexible.

## Familiarity

People don't put enough wait into familiarity. We think as developer we can pick anything at the drop of a hat and that just isn't true. Learning new tech is expensive, both from a time perspective and from you're-going-to-cause-downtime-because-you-don't-know-all-the-problems perspective. I remember at Reddit we went with MySQL despite PostgreSQL being all the hotness at the time because the entire team had familiarity with MySQL and no one knew PostgreSQL at all. Be sure to properly weigh experience into your decision. Some knowledge is only won through experience.

## Quality of Drivers

Be sure to be poke around the SDKs / drivers of whatever database you may choose with the language you're going to use. If MongoDB is amazing but their Elixir SDK is nonexistant or bad (I have no idea if it, just making an example) then no matter how good the database is you're still going to be fighting the SDK. Do the homework here and you'll save yourself some pain.

## Ops Cost

Databases frequently end up being the most expensive part of your app from all perspectives: raw cost, raw time spent writing code for it, and cost of eventual downtime. Take a look at it from the perspective of how much it's going to cost you to hire ops people that know how to run this particular server in production.

In this capacity, and very biasedly, I recommend you look into using a cloud-based database. While the monetary cost of paying for a managed database-as-a-service is higher than just running a few VMs, not having to manage sharding, clusters, peering, elections, networking, firewalls, software updates, operating system updates, capacity allocations, horizontal scaling, vertical scaling, etc. frequently can make it more-than worth the cost. Again, I'm biased here due to my current employment at Microsoft Azure, but this is what I would choose even I wasn't employed here. All major cloud providers have great options here.

## Be Boring

I can't stress this enough. With your core infrastructure (a.k.a. anything that if it went down your app would go down) be as boring as you can tolerate. Instead of choosing what's hot, what's on Hacker News, what's being talked about on Twitter, what people are talking about at conferences, etc. just choose boring, tried-and-true technologies. Everything I've shown you here I think are mature enough to be considered boring. But make it boring to you by using them, finding problems, breaking them, and trying new things with them. Then they'll be boring to you too.

If you're going to do something exciting, have a damn good reason why it's much better than a boring alternative. On the bleeding edge, you're the one who is bleeding.

## Caching

We went over caching a bit but I wanted to say a few things about it.

Caching is a very, very hard problem and causes a lot of problems. Make sure you _need_ caching before you just throw it in there. Don't assume you need caching. Need caching before you put it in. It's hard to know when to cache, how to long to cache, when to invalidate caches, when not to, etc. It's just hard and make sure you need it.

Caching is frequently a band-aid on a worse problem. Instead of fixing inefficiencies in a system that would obviate the need for caching people just through a cache in front of something and ignore the problems in their systems. This often leads to bigger problems. Again, validate the need for caching and ask the question "if I just improved the performance of this system would I still need caching?"

A big reason I throw out so much caution for caching is that databases are built to handle a lot of load and if you use them with best practices you can get a lot of performance out of them. Problems often arise because we're not using the tools correctly (like writing bad queries or having something misconfigured) and if we can fix these we can achieve greater scale without the need for a cache.

Caching just adds so much indirection to your app. Now you whenver your API isn't responding correctly, you have to ask yourself "is this a stale cache?" God forbid you have multiple layers of caching (maybe you cache the database response, the external API response, and then cache the API response before it goes out) then you need to pick apart which cache was stale or if it's an underlying problem. It's also hard to avoid thundering herd problems. I taught you caching for a reason because sometimes we just do need it but it's a sharp implement; make sure you only use it when you actually need it and keep it as simple as you can.

## Next Courses to Take

Frontend Masters has so many wonderful courses and instructors to offer. Here a handful of ones that I'd recommend after taking this one if you want to further deepen skills

### From me, Brian Holt

- I want to get better at the command line: [Complete Intro to Linux and the CLI][cli]
- I want to learn about the containers we've been using this whole time: [Complete Intro to Containers][containers]

### From other amazing instructors

- I want to get better at MongoDB from Scott Moss
  - [Intro to MongoDB (including Mongoose ORM)][intro-mongo]
  - [API Design with MongoDB][mongo]
- I want to get better at GraphQL from Scott Moss
  - [From the server][server-graphql]
  - [From the client][client-graphql]
  - [Advance GraphQL][advance-graphql]
- [I want to get better at managing servers and cloud deployments][full-stack] from Jem Young

## Wrap Up

Thank you for sticking through this tutorial and congrats on your unlocked achievement of understanding databases! Be sure tweet at me your success [here][twitter]. And if you found issues, particularly with grammar, [open a pull request!][pr]

I hope you enjoyed the course!

[kafka]: https://kafka.apache.org/
[harry]: https://twitter.com/hswolff/
[twitter]: https://twitter.com/holtbt
[pr]: https://github.com/btholt/complete-intro-to-databases
[mongo]: https://frontendmasters.com/courses/api-design-nodejs-v3/
[cli]: https://frontendmasters.com/courses/linux-command-line/
[containers]: https://frontendmasters.com/courses/complete-intro-containers/
[advance-graphql]: https://frontendmasters.com/courses/advanced-graphql-v2/
[intro-mongo]: https://frontendmasters.com/courses/mongodb/
[full-stack]: https://frontendmasters.com/courses/fullstack-v2/
[client-graphql]: https://frontendmasters.com/courses/client-graphql-react/
[server-graphql]: https://frontendmasters.com/courses/server-graphql-nodejs/
