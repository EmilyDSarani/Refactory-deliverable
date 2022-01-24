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
    try{
      const { id } = req.params;
      const { product, quantity } = req.body;

      const order = await Order.updateById(id, {updatedProduct: product, updatedQuantity: quantity});

      res.send(order);
    } catch (error) {
      next(error)
    }
  })

  .delete('/:id', async (req, res) => {
     //not sure if this is right either, but it seemed similiar to get Id
    //think about getting this from the params (useParams)
    const { id } = req.params;
    //we are getting the Order by the id that we sanitized in the models
    const order = await Order.deleteById(id);
    //then we want to send that order
    res.send(order);
  });
