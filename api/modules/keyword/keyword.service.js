import prisma from '../../utils/prismaClient.js';

class KeywordService {
  /**
   * Get paginated results from database
   * @param {*} params
   * @returns
   */
  async fetchKeywords({ page = 1, pageSize = 10, userId }) {
    const skip = (page - 1) * pageSize;

    return prisma.keyword.findMany({
      skip,
      take: pageSize,
      where: {
        userId: 1,
        scrapeStatus: { not: 'PENDING' }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Get total count of keywords
   * @param {*} params
   * @returns
   */
  async getTotalCount({ userId }) {
    return prisma.keyword.count({
      where: {
        userId: 1,
        scrapeStatus: { not: 'PENDING' }
      }
    });
  }
}

export default new KeywordService();
