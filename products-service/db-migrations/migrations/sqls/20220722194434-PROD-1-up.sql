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
  count integer not null default 0,
  foreign key ("product_id") references "products" ("id")
);

select * from products

insert into products (
  title, description, price
) values (
  'Microservices Foundations',
  'Microservices is a major architectural pattern in the software industry, and having an overview of what this architecture is - and what it isn’t - is critical as a starting point to evaluating this model. This course covers the basic concepts of microservices, to help you determine if this architectural model is the right fit for you and your team. Instructor Frank Moley kicks off the course by briefly discussing how microservices fit into the history of software architecture, and going into some of the other notable patterns that have emerged in recent years. Frank then helps to familiarize you with some core concepts of microservices, including bounded contexts and the API layer. He also goes over some of the more advanced areas of the architecture, as well as the importance of embracing a DevOps culture should you choose to move to microservices.',
  5.5
), (
  'Learning HashiCorp Vault',
  'Secrets management refers to the practices, techniques, and technology used to keep sensitive data safe from prying eyes. Tools like HashiCorp Vault—an open-source solution that provides secrets management and encryption capabilities—offer features that can help organizations large and small securely access their passwords, certificates, and other secrets. In this course, learn how Vault can solve key problems related to secrets management, how to run and use Vault, and how to securely implement Vault without putting your secrets at risk.',
  9.5
), (
  'AWS Essential Training for Developers',
  'Modern companies need developers who can accomplish business objectives with Amazon Web Services (AWS) without over-engineering in-house solutions. But with AWS now listing over a hundred different service offerings, getting a holistic sense of the platform can seem daunting. In this course, Jeremy “JV” Villeneuve breaks down key AWS services, giving developers a high-level look at the different ways they can host applications within AWS, as well as how to decide which services will fit their use case.',
  5.5
), (
  'Learning the OWASP Top 10',
  'An overview of the 2021 OWASP Top 10, presenting information about each vulnerability category, its prevalence, and its impact.',
  0.5
), (
  'Practical Cybersecurity for IT Professionals',
  'Learn how to protect your network from cyberattacks through practical, hands-on demonstrations.',
  6.5
), (
  'Cybersecurity with Cloud Computing',
  'More and more companies are migrating their applications and infrastructure to the cloud, shifting operational aspects to service providers such as Microsoft and Amazon. However, cloud computing is a shared responsibility, especially when it comes to keeping your data, users, and systems safe',
  6.5
);

insert into stocks (
  product_id, count
) values (
  (select id from products where title = 'Microservices Foundations'),
  10
), (
  (select id from products where title = 'Learning HashiCorp Vault'),
  4
), (
  (select id from products where title = 'AWS Essential Training for Developers'),
  8
), (
  (select id from products where title = 'Learning the OWASP Top 10'),
  18
), (
  (select id from products where title = 'Practical Cybersecurity for IT Professionals'),
  5
), (
  (select id from products where title = 'Cybersecurity with Cloud Computing'),
  6
);
