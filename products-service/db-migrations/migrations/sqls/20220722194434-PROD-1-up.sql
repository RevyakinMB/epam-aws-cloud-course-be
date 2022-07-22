create extension if not exists "uuid-ossp";

create table products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price integer
);

create table stocks (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null,
  price integer not null default 0,
  foreign key ("product_id") references "products" ("id")
);
