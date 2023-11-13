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
      const { page, pageSize, searchText } = req.query;

      const keywords = await keywordService.fetchKeywords({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        userId: req.user.id,
        searchText
      });

      const totalCount = await keywordService.getTotalCount({ userId: req.user.id, searchText });
      return res.json({ success: true, data: { keywords, totalCount } });
    } catch (err) {
      next(err);
    }
  }
}
