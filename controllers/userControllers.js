const services = require("../services/userService");

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
      return res.status(resulted.status).json({ error: resulted.error });
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

module.exports = {
  registerSystem,
  login,
};
