import userService from './user.service.js';
export default class UserController {
  constructor() {}
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  async create(req, res, next) {
    try {
      const user = await userService.create(req.body);
      if (user) {
        user.token = userService.getJWTToken(user);
        delete user.password;
      }
      return res.json({ success: true, data: { user } });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new Error(`Please enter email and password to login`);
      }
      const user = await userService.login(email, password);
      if (user) {
        user.token = userService.getJWTToken(user);
      }
      return res.json({ success: true, data: { user } });
    } catch (err) {
      next(err);
    }
  }
}
