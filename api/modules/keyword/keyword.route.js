import express from 'express';
import KeywordController from './keyword.controller.js';

export const router = express.Router();
export const path = 'keyword';
const keywordController = new KeywordController();

router.get('/', keywordController.getPaginatedKeywords.bind(this));
