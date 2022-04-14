##### SETUP

Install package dependencies

> npm i cors express pg helmet jsonwebtoken bcrypt dotenv pino pino-pretty cookie-parser

![Capture](https://user-images.githubusercontent.com/70065792/163389925-8b99fc0d-1b9f-4bd8-9bda-24c4ea36c591.PNG)




##### Folder Structure

![foler](https://user-images.githubusercontent.com/70065792/163390450-9ed85636-4ef4-4c6f-b023-8caa7d8f1ff7.PNG)

---


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
![connect ato psql db](https://user-images.githubusercontent.com/70065792/163390008-6822a10f-6468-4706-8ef8-d101ac7d94b6.PNG)

![create table](https://user-images.githubusercontent.com/70065792/163390040-246c3f73-1cce-4c85-8e0f-a1710f48f5f2.PNG)

![insert to table](https://user-images.githubusercontent.com/70065792/163390098-78ce706c-b0fb-4e4e-ac63-f0fe69b3ee7a.PNG)

![post request result](https://user-images.githubusercontent.com/70065792/163390130-9ef0ffca-b2b3-4565-ac83-549117d265d0.PNG)


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
