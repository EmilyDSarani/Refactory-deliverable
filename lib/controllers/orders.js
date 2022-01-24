const { Router } = require('express');
const { updateById } = require('../models/Order');
const Order = require('../models/Order');
const pool = require('../utils/pool');

module.exports = Router()
  .post('/', async (req, res) => {
    //refactored
   const order = await Order.insert({
     product: req.body.product,
     quantity: req.body.quantity
   });
   res.send(order)
  })

  .get('/:id', async (req, res) => {
    //refactored
    //think about getting this from the params (useParams)
    const { id } = req.params;
    //we are getting the Order by the id that we sanitized in the models
    const order = await Order.getById(id);
    //then we want to send that order
    res.send(order);
  })

  .get('/', async (req, res) => {
    //refactored
  const orders = await Order.getAll();
  res.send(orders);
  })

  .patch('/:id', async (req, res, next) => {
    //not sure if I refactored right, left the code in just in case
      const { id } = req.params;
      const order = new Order(updateById(id));
      res.send(order)
    // try {
    //   const { id } = req.params;
    //   const result = await pool.query(
    //     `
    //     SELECT * FROM orders WHERE id=$1;
    //     `,
    //     [id]
    //   );
    //   const existingOrder = result.rows[0];

    //   if (!existingOrder) {
    //     const error = new Error(`Order ${id} not found`);
    //     error.status = 404;
    //     throw error;
    //   }

    //   const product = req.body.product ?? existingOrder.product;
    //   const quantity = req.body.quantity ?? existingOrder.quantity;
    //   const { rows } = await pool.query(
    //     'UPDATE orders SET product=$2, quantity=$3 WHERE id=$1 RETURNING *;',
    //     [id, product, quantity]
    //   );
    //   const order = new Order(rows[0]);

    //   res.json(order);
    // } catch (error) {
    //   next(error);
    // }
  })

  .delete('/:id', async (req, res) => {
    const { rows } = await pool.query(
      'DELETE FROM orders WHERE id=$1 RETURNING *;',
      [req.params.id]
    );

    if (!rows[0]) return null;
    const order = new Order(rows[0]);

    res.json(order);
  });
