CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* CREATE DATABASE jwtnode; */
CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL
);

SELECT
    *
FROM
    users;

INSERT INTO
    users (user_name, user_email, user_password)
VALUES
    ('joseph', 'joe@yopmail.com', 'admin1234');

INSERT INTO
    users (user_name, user_email, user_password)
VALUES
    ('Timo', 'tim@yopmail.com', 'admin1234');

-- psql -U postgres
-- \c jwtnode
-- \dt jwtnode
-- \d users
-- \d jwtnode
-- \q
-- heroku pg:sql
CREATE TABLE news(
    news_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    headline TEXT NOT NULL,
    body TEXT NOT NULL
);

INSERT INTO
    news (headline, body)
VALUES
    (
        'bombings in Nigeria',
        '100 rescued as fight begins in Northern Nigeria'
    );