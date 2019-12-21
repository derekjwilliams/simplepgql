const pg = require("pg");
const { ApolloServer } = require("apollo-server");
const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");

const dbSchema = process.env.SCHEMA_NAMES
  ? process.env.SCHEMA_NAMES.split(",")
  : ["public"];

const pgPool = new pg.Pool({
  connectionString: (process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/public'),   
});

const postGraphileOptions = {
  appendPlugins: [ConnectionFilterPlugin],
  graphql: true,
  graphiql: true,
  dynamicJson: true,
  watchPg: true,
};

console.log(JSON.stringify(pgPool))

async function main() {
  // See https://www.graphile.org/postgraphile/usage-schema/ for schema-only usage guidance
  const { schema, plugin } = await makeSchemaAndPlugin(
    pgPool,
    dbSchema,
    postGraphileOptions
  );

  // See https://www.apollographql.com/docs/apollo-server/api/apollo-server.html#ApolloServer
  const server = new ApolloServer({
    schema,
    plugins: [plugin],
    tracing: true
  });

  const { url } = await server.listen(5002);
  console.log(`🚀 Server ready at ${url}/graphql, Graphiql at ${url}/graphiql`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});