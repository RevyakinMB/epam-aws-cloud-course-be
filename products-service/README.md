## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Project setup
Create `env.serverless.ts` file, use it to export db connection settings:
```
export const serverlessDbEnvConfiguration: AwsLambdaEnvironment = {
  PG_HOST: 'HOST',
  PH_PORT: 5432,
  PG_DATABASE: 'DB',
  PG_USERNAME: 'USERNAME',
  PG_PASSWORD: 'PASSWORD',
};
```

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

### Locally

In order to test the getProductsList function locally, run the following command:

- `npx sls invoke local -f getProductsList --path src/functions/get-products-list/mock.json` if you're using NPM
- `yarn sls invoke local -f getProductsList --path src/functions/get-products-list/mock.json` if you're using Yarn

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

### Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl --location --request POST 'https://myApiEndpoint/dev/hello' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Frederic"
}'
```

## DB Migration
`db-migrate` package is used to manage database migration.

Specify db connection parameters:
```
cd ./db-migrations
cp config/default.json config/dev.json
```

Create new migration
`npx db-migrate create TICKET_ID --config ./configs/dev.json`

Apply new migrations to the database:
`npx db-migrate up --config ./configs/dev.json`

Rollback the last migration:
`npx db-migrate up --config ./configs/dev.json`

## Template features

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`
