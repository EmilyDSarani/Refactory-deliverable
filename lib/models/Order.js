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
// Erich's answer to [0] Q I asked: the SQL query will always return an array of objects (rows), even if just one row is returned
//therefore we always either rows[0] for single records or rows.map(row => ...  for multiple records


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
    //do similar to above with the deconstruction of rows
    const { rows } = await pool.query(
      //select from orders and sanitize the id
      'SELECT * FROM orders WHERE id=$1', [id]
      ); 
      //if no rows, return null
      if (!rows[0]) return null;
    //return new order
    return new Order(rows[0])
  }

  static async updateById(id, { product, quantity }) {
   //do similiar to the above with rows
   const { rows } = await pool.query(
      //select from orders and sanitize id
    'UPDATE orders SET product=$2, quantity=$3 WHERE id=$1 RETURNING *;',
    //set the values
    [id, product, quantity]
  );
  if(!rows[0]){
    const error = new Error(`Order ${id} not found`);
    error.status = 404;
    throw error;
  }
  return new Order(rows[0])
   //set and existing order
   // if there is not an existing order, through an error
   //else add order
  }

  static async deleteById(id) {
    // TODO: Implement me
  }
};
