const UserService = require("../services/user");

async function createUser(req, res) {
  const { email } = req.body;
  const result = await UserService.createUser(email);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  res.status(result.status).json({ user: result });
}

async function getUser(req, res) {
  const { email } = req.body;
  const result = await UserService.getUserByEmail(email);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  res.status(result.status).json({ user: result.user });
}

module.exports = {
  createUser,
  getUser,
};
