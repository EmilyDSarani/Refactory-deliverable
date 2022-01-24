const pool = require("../utils/pool");

module.exports = class Order {
  id;
  product;
  quantity;

  constructor(row) {
    this.id = row.id;
    this.product = row.product;
    this.quantity = row.quantity;
  }

  static async insert({ product, quantity }) {
    //deconstruct rows and await to pool that is being pulled from above
    const { rows } = await pool.query(
    //insert product and quantity and then sanitize ($1, $2, $3)
    //I think returning * means return all the values?
      'INSERT INTO orders(product, quantity) VALUES ($1, $2) RETURNING *'
    //then attach a value to the sanitations 
      [product, quantity]
    );
    //then return with the rows sub 0
    return new Order(rows[0])
  }

  static async getAll() {
    // do similiar to above with the rows 
    const { rows } = await pool.query(
      //Since it is a get all, it is select * from controller
      'SELECT * FROM orders'
    );
    //return it, dan did a map according to my notes
    //I assume this means that...go through the rows on the orders, map each row and return a new Order for each of those rows
    return rows.map((row) => new Order(row));

  }

  static async getById(id) {
    // TODO: Implement me
  }

  static async updateById(id, { product, quantity }) {
    // TODO: Implement me
  }

  static async deleteById(id) {
    // TODO: Implement me
  }
};
