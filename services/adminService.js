const db = require("../models");
const SKU_PATTERN = /^[A-Z]{3}\d{3}-[A-Z]{2}-[A-Z]$/;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const getAllProducts = async () => {
  try {
    const list = await db.Product.findAll();
    return { status: 200, data: list };
  } catch (error) {
    return { status: 500, error: "error to get products" };
  }
};

const addProduct = async (
  name,
  price,
  brand,
  condition,
  quantity,
  sku,
  tags
) => {
  try {
    // Validar el formato del SKU
    if (!SKU_PATTERN.test(sku)) {
      return { status: 400, error: `Invalid SKU format: ${sku}` };
    }

    // Verificar si el producto ya existe
    let item = await db.Product.findOne({ where: { sku }, include: [db.Tag] });

    if (item) {
      // Si el producto existe, actualizar la cantidad
      const quantityBefore = item.quantity;
      item.quantity = quantityBefore + quantity;
      await item.save();

      // Asociar las nuevas etiquetas si no están ya asociadas
      const existingTagNames = item.Tags.map((tag) => tag.name);
      const newTags = tags.filter((tag) => !existingTagNames.includes(tag));

      if (newTags.length > 0) {
        const newTagInstances = await Promise.all(
          newTags.map(async (name) => {
            const [newTagInstance] = await db.Tag.findOrCreate({
              where: { name },
              defaults: { name },
            });
            return newTagInstance;
          })
        );

        // Asociar las nuevas etiquetas al producto
        await item.addTags(newTagInstances);
      }

      return {
        status: 200,
        data: `Item updated: quantity added ${quantity}, in stock before update: ${quantityBefore}, in stock now: ${item.quantity}`,
      };
    }

    // Si el producto no existe, crear uno nuevo
    item = await db.Product.create({
      name,
      price,
      quantity,
      brand,
      condition,
      sku,
    });

    // Asociar las etiquetas
    if (tags.length > 0) {
      const tagInstances = await Promise.all(
        tags.map(async (name) => {
          const [tagInstance] = await db.Tag.findOrCreate({
            where: { name },
            defaults: { name },
          });
          return tagInstance;
        })
      );
      const existingTags = await item.getTags();
      const existingTagIds = existingTags.map((tag) => tag.id);
      const newTagInstances = tagInstances.filter(
        (tag) => !existingTagIds.includes(tag.id)
      );

      if (newTagInstances.length > 0) {
        await item.addTags(newTagInstances);
      }
    }

    return { status: 200, data: item };
  } catch (error) {
    console.error("Error adding product:", error);
    return { status: 500, error: "Error adding product" };
  }
};

const addAdminService = async (email, user_name, token, password) => {
  if (!token) return { status: 500, error: "token don't exist" };
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tokenId = decoded.userId;

    if (decoded.role !== "admin") {
      return { status: 403, error: "Access denied (you'r not an admin)" };
    }
    const passUseer = await db.User.findOne({
      where: { id: tokenId },
    });

    const isMatch = await bcrypt.compare(password, passUseer.password);

    if (!isMatch)
      return { status: 403, error: "Access denied, passwords do not match" };

    const nameLogin = email || user_name;

    const user = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ user_name: nameLogin }, { email: nameLogin }],
      },
    });

    if (!user) {
      return { status: 500, error: "The user  don't exist" };
    }

    await db.User.update(
      { role: "admin" }, // Columna y valor a modificar
      {
        where: {
          [db.Sequelize.Op.or]: [
            { user_name: nameLogin },
            { email: nameLogin },
          ],
        },
      }
    );

    return { status: 200, data: "Admin added sussesfull!" };
  } catch (error) {
    console.error("Error adding admin:", error);
    return { status: 500, error: error.message };
  }
};

const deleteProduct = async (sku, quantity) => {
  try {
    if (!db.Product) return { status: 404, error: error.message };

    const item = await db.Product.findOne({ where: { sku } });
    if (!item) return { status: 404, error: error.message };

    if (item) {
      if (item.quantity < quantity) {
        return {
          status: 400,
          error: `is stock there are only ${item.quantity}  `,
        };
      }
      const quantityBefore = item.quantity;
      const quantityAfter = item.quantity - quantity;
      item.quantity = quantityAfter;
      item.save();
      return {
        status: 200,
        data: `item  update: quantity deleted ${quantity}, in stock before Update:${quantityBefore}, in stock now:${quantityAfter}`,
      };
    }

    return {
      status: 500,
      date: `item in code sku: ${sku} don't exist`,
    };
  } catch (error) {
    return { status: 404, error: `error when delleting item` };
  }
};

const adminFilterProducts = async (tags, brand, minPrice, maxPrice) => {
  // filter by category
  if (tags) {
    try {
      if (!db.Tag)
        return { status: 404, error: "Model Tag not found in the database" };

      const tagInstances = await db.Tag.findAll({ where: { name: tags } });

      if (!tagInstances.length) {
        return { status: 404, error: "No tags found" };
      }

      console.log(tagInstances);
      const tagIds = tagInstances.map((tag) => tag.id);

      const products = await db.Product.findAll({
        include: [
          {
            model: db.Tag,
            where: { id: tagIds },
            through: { attributes: [] },
          },
        ],
      });

      return {
        status: 200,
        data: `products found:${products.length}`,
        products,
      };
    } catch (error) {
      return {
        status: 500,
        error: `Error when filtering products: ${error.message}`,
      };
    }
  }

  //filter by brand
  if (brand) {
    try {
      if (!db.Product)
        return {
          status: 404,
          error: "Model Product not found in the database",
        };

      const products = await db.Product.findAll({ where: { brand: brand } });

      if (products.length === 0) {
        return { status: 404, error: "No products found" };
      }

      return {
        status: 200,
        data: `products found:${products.length}`,
        products,
      };

      // return { status: 200,data: `llego el brand ${brand}`}
    } catch (error) {
      return { status: 500, error: error.message };
    }
  }

  // filter by prices
  if (minPrice && maxPrice) {
    try {
      if (!db.Product)
        return {
          status: 404,
          error: "Model Product not found in the database",
        };

      const products = await db.Product.findAll({
        where: { price: { [Op.between]: [minPrice, maxPrice] } },
      });

      if (products.length === 0) {
        return { status: 404, error: "Product not found" };
      }

      return {
        status: 200,
        data: `products found:${products.length}`,
        products,
      };
    } catch (error) {
      return { status: 500, error: error.message };
    }
  }
};

module.exports = {
  addAdminService,
  addProduct,
  deleteProduct,
  getAllProducts,
  adminFilterProducts,
};
