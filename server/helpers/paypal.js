// server/helpers/paypal.js
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox', // or 'live'
  client_id: "AVl3AeKT8dqQlHAs92ZP9-8ljMvQZ33B3PB6dcmU8D8RtH4rKdxbSW5O0YluEUTZ54K-r5naiERwkq1v",
  client_secret: "EAAroQKXij6-xHvI5yxMqxBP4kaD4-xOHPYJToZWeowuKBxB1sYuE8_CVNeG0IjcwNR9jQ1qD5HxgvCx",
});

module.exports = paypal;
