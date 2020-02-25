const pg = require("pg");
const express = require("express");
const { postgraphile } = require("postgraphile");
const { ApolloServer } = require("apollo-server");
const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
const PgManyToManyPlugin = require("@graphile-contrib/pg-many-to-many");

const app = express();

app.use(
  postgraphile(
    process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1/blog',
    process.env.SCHEMA_NAMES ? process.env.SCHEMA_NAMES.split(",") : ["lilac"],
    {
      appendPlugins: [ConnectionFilterPlugin, PgManyToManyPlugin],
      graphileBuildOptions: {
        connectionFilterRelations: true,
      },
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
      allowExplain(req) {
        return true;
      },
    }
  )
);

app.listen(process.env.PORT || 5002);

