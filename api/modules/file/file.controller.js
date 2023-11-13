import fileService from './file.service.js';
import * as fs from 'fs';
import prisma from '../../utils/prismaClient.js';
import workerUtils from '../../utils/workerUtils.js';
export default class FileController {
  constructor() {}
  /**
   * Handle upload of keywords file
   * @param {*} req
   * @param {*} res
   */
  async uploadFile(req, res, next) {
    try {
      fileService.validateFileUpload(req.file);

      const fileUpload = await prisma.fileUpload.create({ data: { userId: req.user.id } });

      const keywordRecords = await fileService.extractKeywordsFromCSV({
        filePath: req.file.path,
        userId: req.user.id,
        fileId: fileUpload.id
      });

      await prisma.keyword.createMany({ data: keywordRecords });
      await workerUtils.addJob('scraper', { fileId: fileUpload.id, userId: req.user.id });

      return res.json({ success: true, uploadId: fileUpload.id, totalCount: keywordRecords.length });
    } catch (err) {
      next(err);
    } finally {
      fs.unlinkSync(req?.file?.path);
    }
  }

  /**
   * Get progress status of uploaded file
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getUploadStatus(req, res, next) {
    try {
      const uploadId = parseInt(req.params.uploadId);
      const completedKeywords = await prisma.keyword.count({
        where: {
          userId: req.user.id,
          fileId: uploadId,
          scrapeStatus: { not: 'PENDING' }
        }
      });

      res.json({
        success: true,
        completedCount: completedKeywords
      });
    } catch (err) {
      next(err);
    }
  }
}
