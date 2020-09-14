const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const csvParse = require('csv-parse');
const CONFIG = require('./config.json');

const csvDir = path.join(CONFIG.baseDir, CONFIG.csvdir);

const csvFiles = fs.readdirSync(csvDir);

csvFiles.forEach(file => {

    let filePath = CONFIG.csvdir + "/" + file;

    let csvData = [];

    fs.createReadStream(filePath)
        .pipe(csvParse())
        .on('data', row => {
            csvData.push(row);
        })
        .on('end', () => {

            let fileName = path.basename(csvDir + '/' + filePath, "csv") + '.xlsx';
            let xlsxFilePath = CONFIG.baseDir + CONFIG.xlsxdir + '/' + fileName;

            //console.log(csvData);
            convert2xlsx(csvData, xlsxFilePath)

        })
    console.log("\n");
})

function convert2xlsx(csvData, xlsxFile) {
    const wb = XLSX.utils.book_new();
    wb.SheetNames.push("Sheet 1");

    let ws = XLSX.utils.aoa_to_sheet(csvData);
    wb.Sheets['Sheet 1'] = ws;

    XLSX.writeFile(wb, xlsxFile);
}
