import keywordService from './keyword.service.js';

export default class KeywordController {
  constructor() {}
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  async getPaginatedKeywords(req, res, next) {
    try {
      const { page, pageSize } = req.query;

      const keywords = await keywordService.fetchKeywords({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        userId: req.user.id
      });

      const totalCount = await keywordService.getTotalCount({ userId: req.user.id });
      return res.json({ success: true, data: { keywords, totalCount } });
    } catch (err) {
      next(err);
    }
  }
}
