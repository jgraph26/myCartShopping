const services = require("../services/userService");
const db = require("../models");

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

    const result = await services.login(email, user_name, password);

    if (result.status !== 200) {
      return res.status(result.status).json({ error: result.error });
    }
    res.status(200).json("login sussesfull! user: ");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerSystem,
  login,
};
