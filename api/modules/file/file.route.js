import express from 'express';
import FileController from './file.controller.js';
import upload from '../../middlewares/multer.js';

export const router = express.Router();
export const path = 'file';
const fileController = new FileController();

router.post('/upload', upload.single('keywordsFile'), fileController.uploadFile.bind(this));
router.get('/upload-status/:uploadId', fileController.getUploadStatus.bind(this));
