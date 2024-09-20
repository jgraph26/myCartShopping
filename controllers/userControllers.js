import services from "../services/userService.js";

const registerSystem = async (req, res) => {
  try {
    const { email, user_name, full_name, password } = req.body;

    await services.register(email, user_name, full_name, password);
    res.status(200).json("register user sussesfull!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, user_name, password } = req.body;

    const resulted = await services.login(email, user_name, password);

    if (resulted.status !== 200) {
      return res.status(resulted.status).json(resulted.error);
    }
    res.status(200).json({
      message: "Login successful!",
      token: resulted.token,
      user: resulted.user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changuePassword = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const { actualPassword, newPassword, repeatPassword } = req.body;
    if (!repeatPassword)
      return res.status(401).json({ error: " password confirm required" });

    if (!newPassword && (!token || token === null)) {
      return res
        .status(500)
        .json({ error: "required actual password and new password" });
    }
    const result = await services.changuePassword(
      token,
      actualPassword,
      newPassword,
      repeatPassword
    );
    if (result.status !== 200) {
      res.status(result.status).json(result.error);
    }

    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const changueUserName = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const { password, user_name } = req.body;

    if (!user_name && (!token || token === null)) {
      return res
        .status(500)
        .json({ error: "required actual password and new password" });
    }
    const result = await services.changueUserName(token, password, user_name);
    if (result.status !== 200) {
      res.status(result.status).json(result.error);
    }

    res.status(200).json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clientFilterProduct = async (req, res) => {
  const { tags, brand, minPrice, maxPrice } = req.body;

  if (
    (!tags || tags.length === 0) &&
    (!brand || brand === null) &&
    !minPrice &&
    (!maxPrice || maxPrice === 0)
  ) {
    return res.status(400).json({ error: "Tags, prices or brand  required!" });
  }
  const products = await services.clientFilterProducts(
    tags,
    brand,
    minPrice,
    maxPrice
  );

  if (products.status !== 200)
    return res.status(products.status).json(products.error);

  console.log(`productos encontrados: ${products.length} ${products}`);

  res.status(200).json(products);
};

const methods = {
  registerSystem,
  login,
  changuePassword,
  clientFilterProduct,
  changueUserName,
};

export default methods;
