import fileService from './file.service.js';
import * as fs from 'fs';
import prisma from '../../utils/prismaClient.js'
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
      const csvData = await fileService.parseCSVFile(req.file.path);

      const keywordRecords = csvData.map( keyword => {
        return {name: keyword}
      });

      await prisma.keyword.createMany({data:keywordRecords});
      fs.unlinkSync(req?.file?.path);
      return res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}
