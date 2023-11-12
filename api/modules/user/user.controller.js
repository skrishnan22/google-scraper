import userService from './user.service.js';
import UserService from './user.service.js';

export default class UserController {
  constructor() {}
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      delete user.password;
      return res.json({ success: true, data: { user } });
    } catch (err) {
      next(err);
    }
  }
}
