const db = require("../models");

const getCartItems = async () => {
  const list = await db.Cart.findAll({ include: "product" });
  return list;
};

const addItem = async (productId, quantity) => {
  if (!db.Cart) throw new console.error("data base don't exist");

  const item = await db.Cart.findOne({ where: { productId } });

  if (item) {
    item.quantity += quantity;
    return item.save();
  }

  return db.Cart.create({ productId, quantity });
};

const removeProduct = async (productId) => {
  await db.Cart.destroy({ where: { productId } });
};

module.exports = { getCartItems, addItem, removeProduct };
