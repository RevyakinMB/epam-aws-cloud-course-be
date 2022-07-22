# epam-aws-cloud-course-be
EPAM AWS course backend monorepo

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
