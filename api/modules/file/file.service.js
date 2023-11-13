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
          if(row?.Keyword){
            csvRows.push(row.Keyword?.trim());
          }
        })
        .on('end', _ => {
          resolve(csvRows);
        });
    });
  }
}

export default new FileService();
