import prisma from '../../utils/prismaClient.js';

class KeywordService {
  /**
   * Get paginated results from database
   * @param {*} params
   * @returns
   */
  async fetchKeywords({ page = 1, pageSize = 10, userId, searchText }) {
    const skip = (page - 1) * pageSize;

    const keywords = await prisma.keyword.findMany({
      skip,
      take: pageSize,
      where: {
        userId,
        scrapeStatus: { not: 'PENDING' },
        ...(searchText && { name: { contains: searchText, mode: 'insensitive' } })
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        createdAt: true,
        name: true,
        userId: true,
        linkCount: true,
        resultCount: true,
        adwordCount: true
      },
    
    });

    const serializedResult = keywords.map(row => {
      return {
        ...row,
        resultCount: row.resultCount.toString() // Convert BigInt to string
      };
    });
    return serializedResult;
  }

  /**
   * Get total count of keywords
   * @param {*} params
   * @returns
   */
  async getTotalCount({ userId, searchText }) {
    return prisma.keyword.count({
      where: {
        userId,
        scrapeStatus: { not: 'PENDING' },
        ...(searchText && { name: { contains: searchText } })
      }
    });
  }
}

export default new KeywordService();
