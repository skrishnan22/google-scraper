import path from 'path';
import chai from 'chai';
import { fileURLToPath } from 'url';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import fileService from '../modules/file/file.service.js';

describe('extractKeywordsFromCSV Tests', function() {
    let __dirname = path.dirname(fileURLToPath(import.meta.url));

  beforeEach(function() {
  });

  it('should handle files with less than 100 keywords', async function() {
    const filePath = path.join(__dirname, 'fixtures', 'csv', 'keywords_10.csv');
    const result = await fileService.extractKeywordsFromCSV({ filePath, userId: 1, fileId: 1 });
    const allItemsValid = result.every(item => 
        item.hasOwnProperty('name') && 
        item.hasOwnProperty('fileId') && 
        item.hasOwnProperty('userId') &&
        item.fileId === 1 &&
        item.userId === 1
      );
    chai.expect(result).to.be.an('array').that.has.lengthOf(10);
    chai.expect(allItemsValid).to.be.true;

  });

  it('should throw an error for files with more than 100 keywords', async function() {
    const filePath = path.join(__dirname, 'fixtures', 'csv',  'keywords_200.csv');
    
    await chai.expect(fileService.extractKeywordsFromCSV({ filePath, userId: 1, fileId: 1 }))
      .to.eventually.be.rejectedWith('Uploaded file has more than 100 keywords');
  });

  it('should have no duplicate keywords', async function() {
    const filePath = path.join(__dirname, 'fixtures', 'csv', 'keywords_duplicate.csv'); 
    const response = await fileService.extractKeywordsFromCSV({ filePath, userId: 1, fileId: 1 });
  
    const keywords = response.map(item => item.name);
  
    const uniqueKeywordsSet = new Set(keywords);
  
    chai.expect(uniqueKeywordsSet.size).to.equal(keywords.length);
  });

});
