---
path: "/json-in-postgresql"
title: "JSON in PostgreSQL"
order: "3E"
description: "One of PostgreSQL's super powers is that it's able to store and query JSON"
section: "SQL"
---

Sometimes you have data that just doesn't have a nice schema to it. If you tried to fit it into a table database like PostgreSQL, you would end having very generic field names that would have to be interprepted by code or you'd end up with multiple tables to be able describe different schemas. This is one place where document based databases like MongoDB really shine; their schemaless database works really well in these situations.

However PostgreSQL has a magic superpower here: the JSON data type. This allows you to put JSON objects into a column and then you can use SQL to query those objects.

Let's make an example for our message board. You want to add a new feature that allows users to do rich content embeds in your message board. For starters they'll be able to embed polls, images, and videos but you can imagine growing that in the future so they can embed tweets, documents, and other things we haven't dreamed up yet. You want to maintain that future flexibility.

This would be possible to model with a normal schema but it'd come out pretty ugly and hard to understand, and it's impossible to anticipate all our future growth plans now. This is where the `JSON` data type is going to really shine. These are the queries we ran to create them. (you don't need to run them again)

```sql
DROP TABLE IF EXISTS rich_content;

CREATE TABLE rich_content (
  content_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  comment_id INT REFERENCES comments(comment_id) ON DELETE CASCADE,
  content JSON NOT NULL
);

INSERT INTO rich_content
  (comment_id, content)
VALUES
  (63, '{ "type": "poll", "question": "What is your favorite color?", "options": ["blue", "red", "green", "yellow"] }'),
  (358, '{ "type": "video", "url": "https://youtu.be/dQw4w9WgXcQ", "dimensions": { "height": 1080, "width": 1920 }}'),
  (358, '{ "type": "poll", "question": "Is this your favorite video?", "options": ["yes", "no", "oh you"] }'),
  (410, '{ "type": "image", "url": "https://btholt.github.io/complete-intro-to-linux-and-the-cli/WORDMARK-Small.png", "dimensions": { "height": 400, "width": 1084 }}'),
  (485, '{ "type": "image", "url": "https://btholt.github.io/complete-intro-to-linux-and-the-cli/HEADER.png", "dimensions": { "height": 237 , "width": 3301 }}');
```

- The `JSON` data type is the shining star here. This allows us to insert JSON objects to be queried later.
- PostgreSQL won't let you insert malformatted JSON so it does validate it for you.
- Notice you can have as much nesting as you want. Any valid JSON is valid here.

So let's do some querying! We're going to use two new symbols, `->` and `->>`. The `->` means "give me back the JSON object". The return type will be a JSON object, even if it's just a string. It's basically a black box to PostgreSQL and it treats all JSON the same, whether it's an array, object, or just a string. The `->>` means "give me this back as a string."

Find the all the different types of rich content.

```sql
SELECT content -> 'type' FROM rich_content;
```

You'll get something like this

```md
## ?column?

"poll"
"video"
"poll"
"image"
"image"
```

It repeats poll and image twice because there's two of those. What if we just wanted the distinct options and no repeats? GROUP BY would work but let's detour to talk about `SELECT DISTINCT`. SELECT DISTINCT will deduplicate your results for you. Try this (this will error)

```sql
SELECT DISTINCT content -> 'type' FROM rich_content;
```

PostgreSQL doesn't actually know what data type it's going to get back from JSON so it refuses to do any sort of comparisons with the results. We have to tell PostgreSQL "this is definitely going to be text.

```sql
SELECT DISTINCT CAST(content -> 'type' AS TEXT) FROM rich_content;
```

However this is a ton easier if you just `->>`

```sql
SELECT DISTINCT content ->> 'type' FROM rich_content;
```

That's the key difference between `->` and `->>`.

What if we wanted to only query for polls?

```sql
SELECT content ->> 'type' AS content_type, comment_id FROM rich_content WHERE content ->> 'type' = 'poll';
```

Unfortunately due to the execution order (WHERE happens before SELECT) you can't reference content_type and have to give it the full expression.

Okay, last one. What if we wanted to find all the widths and heights?

```sql
SELECT
  content -> 'dimensions' ->> 'height' AS height,
  content -> 'dimensions' ->> 'width' AS width,
  comment_id
FROM
  rich_content;
```

You can use the `->` and `->>` multiple times to look at nested values. This will give you back the ones that don't have heights and widths too. To filter those out just do:

```sql
SELECT
  content -> 'dimensions' ->> 'height' AS height,
  content -> 'dimensions' ->> 'width' AS width,
  comment_id
FROM
  rich_content
WHERE
  content -> 'dimensions' IS NOT NULL;
```
