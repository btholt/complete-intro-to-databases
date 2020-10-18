module.exports = {
  siteMetadata: {
    title: "Complete Intro to Databases",
    subtitle: "",
    description:
      "Complete intro to using databases from Brian Holt on MongoDB, PostgreSQL, Redis, and Neo4j",
    keywords: [
      "node.js",
      "javascript",
      "mongodb",
      "postgresql",
      "sql",
      "nosql",
      "neo4j",
      "redis",
      "caching",
      "graph",
    ],
  },
  pathPrefix: "/complete-intro-to-databases",
  plugins: [
    `gatsby-plugin-layout`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/lessons`,
        name: "markdown-pages",
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-prismjs`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              linkImagesToOriginal: true,
              sizeByPixelDensity: false,
            },
          },
        ],
      },
    },
  ],
};
