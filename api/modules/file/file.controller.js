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
      const csvData = await fileService.parseCSVFile(req.file.path);

      
      const fileUpload = await prisma.fileUpload.create({data: {userId: 1}});
      console.log(fileUpload);
      const keywordRecords = csvData.map( keyword => {
        return {name: keyword, userId: 1, fileId: fileUpload.id}
      });
      await prisma.keyword.createMany({data:keywordRecords});
      await workerUtils.addJob("scraper", { fileId: fileUpload.id, userId: 1 });

      return res.json({ success: true });
    } catch (err) {
      next(err);
    }finally{
      fs.unlinkSync(req?.file?.path);
    }
  }

}
