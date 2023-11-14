import { parseFile } from 'fast-csv';

class FileService {
  /**
   * Validates if a csv file is uploaded
   * @param {*} fileDetails - file information added by multer middleware
   */
  validateFileUpload(fileDetails) {
    if (!fileDetails) {
      throw new Error('Please upload a file');
    }

    if (fileDetails?.mimetype !== 'text/csv') {
      throw new Error('Please upload a CSV file');
    }
  }

  /**
   * Extract data from CSV file
   * @param {*} filePath
   * @returns [] rows - parsed csv data
   */
  async parseCSVFile(filePath) {
    if (!filePath) {
      throw new Error('No file path provided to parse');
    }
    const csvRows = [];
    return new Promise((resolve, reject) => {
      parseFile(filePath, { headers: true })
        .on('error', error => {
          console.error(error);
          reject(error);
        })
        .on('data', row => {
          if (row?.Keyword) {
            csvRows.push(row.Keyword?.trim());
          }
        })
        .on('end', () => {
          resolve(csvRows);
        });
    });
  }

  async extractKeywordsFromCSV({ filePath, userId, fileId }) {
    const csvRows = await this.parseCSVFile(filePath);
    if (csvRows.length > 100) {
      throw new Error('Uploaded file has more than 100 keywords');
    }
    if (!csvRows.length) {
      throw new Error('No keywords found in File. Ensure to have data under a column with header "Keyword"');
    }
    const uniqueKeywords = [...new Set(csvRows)];

    const keywordRecords = uniqueKeywords.map(keyword => {
      return { name: keyword, userId, fileId };
    });

    return keywordRecords;
  }
}

export default new FileService();
