const pgp = require("pg-promise")(/* options */);
const db = pgp("postgres://postgres:123456@localhost:8002/");
const c = require("./c");

const setupUsersTable = function () {
  const createUsersTable = `
    CREATE TABLE users (
      user_id     serial            PRIMARY KEY,
      username    VARCHAR ( 50 )    NOT NULL      UNIQUE ,
      password    VARCHAR ( 50 )    NOT NULL,
      email       VARCHAR ( 255 )   NOT NULL      UNIQUE ,
	    created_on  TIMESTAMP         NOT NULL,
      last_login  TIMESTAMP 
    );`;
  const setUsers = `
    INSERT INTO users(username, password, email, created_on)
    VALUES ('user', 'pass', 'test@gmail.com', NOW())`;
  return db
    .none(createUsersTable)
    .then(() => db.none(setUsers).then(() => true))
    .catch((err) => [true, err]);
};

const setupOrdersTable = function () {
  const createUsersTable = `
    CREATE TABLE  orders (
      order_id        serial            PRIMARY KEY,
      company_name    VARCHAR ( 255 )   NOT NULL,
      product_name    VARCHAR ( 50 )    NOT NULL,
      amount          NUMERIC           NOT NULL,
	    price           NUMERIC           NOT NULL,
      date            VARCHAR ( 50 ),
      created_on      TIMESTAMP
    );`;
  const setOrders = `
    INSERT INTO orders(company_name, product_name, amount, price, date, created_on)
    VALUES ('Test AŞ.', 'Test Product', 0, 0, NOW(), NOW())`;
  return db
    .none(createUsersTable)
    .then(() => db.none(setOrders).then(() => true))
    .catch((err) => c(true, err));
};
const setupTable = function () {
  setupUsersTable();
  setupOrdersTable();
};

const checkUser = function (username, password) {
  const userCheck = `
    SELECT user_id, email, created_on, last_login FROM users
    WHERE username = '${username}' AND password = '${password}'
  `;
  return db
    .one(userCheck)
    .then((res) => [true, res])
    .catch(() => [false, null]);
};

const getData = function () {
  const command = `
    SELECT * FROM orders;`;
  return db
    .many(command)
    .then((res) => [true, res])
    .catch((err) => [false, err]);
};

const addData = function (data) {
  const command = `
    INSERT INTO orders( company_name, product_name, amount, price, date, created_on )
    VALUES ('${data.company_name}', '${data.product_name}', '${data.amount}', '${data.price}','${data.date}', NOW())
  `;
  return db
    .none(command)
    .then(() => true)
    .catch((err) => c(false, err));
};

const removeData = function (index) {
  const command = `
    ALTER TABLE orders ADD COLUMN index serial;
    DELETE FROM orders WHERE index = ${index};
    ALTER TABLE orders DROP COLUMN index;`;
  return db
    .none(command)
    .then(() => true)
    .catch(() => false);
};
module.exports.setupTable = setupTable;
module.exports.checkUser = checkUser;
module.exports.getData = getData;
module.exports.addData = addData;
module.exports.removeData = removeData;
