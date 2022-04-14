##### SETUP

Install package dependencies

> npm i cors express pg helmet jsonwebtoken bcrypt dotenv pino pino-pretty cookie-parser

```javascript
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  //Run this command before Creating your table

CREATE DATABASE jwtnode;

CREATE TABLE users(
user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
user_name TEXT NOT NULL,
user_email TEXT NOT NULL UNIQUE,
user_password TEXT NOT NULL
);

SELECT *
FROM
users;

INSERT INTO
users (user_name, user_email, user_password)
VALUES
('joseph', 'joe@yopmail.com', 'admin1234');
```

##### DROP TABLE

    ```javascript
    DROP TABLE users;
    ```

---

```javascript
-- psql -U postgres    ---> start postgres locally
-- \c jwtnode
-- \dt jwtnode
-- \d users
-- \d jwtnode
-- \q
-- heroku pg:sql    ---> connect to heroku

```

---

##### Create a user logic

```javascript
const { username, password, email } = req.body;
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
const newUser = await pool.query(
  "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
  [username, hashedPassword, email]
);
res.json({
  message: "User created successfully",
  user: newUser.rows[0],
});
```

##### POstman Document

[Documentation](https://documenter.getpostman.com/view/15544476/Uyr4KLBi)
