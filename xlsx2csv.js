const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');
const CONFIG = require('./config.json');


const xlsxPath = path.join(CONFIG.baseDir, CONFIG.xlsxdir);


const getFiles = (dirPath) => {

    let arr = [];
    console.log("Directory: ", dirPath);

    fs.readdirSync(dirPath).forEach(file => {
        if (path.extname(file).includes('#')) return;

        arr.push(file);
    });
    return arr;
};


const xlsxFiles = getFiles(xlsxPath);

if (xlsxFiles.length > 0) {
    xlsxFiles.forEach(file => {

        const filePath = CONFIG.xlsxdir + '/' + file;
        convertXLSX2CSV(filePath);
    });
}


function convertXLSX2CSV(file) {
    const xlsxFile = XLSX.readFile(file);
    const sheets = xlsxFile.SheetNames;


    let result = [];

    sheets.forEach(sheet => {
        let wrokSheet = xlsxFile.Sheets[sheet];
        console.log(wrokSheet);

        const range = XLSX.utils.decode_range(wrokSheet['!ref']);
        console.log(range);

        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
            let row = [];
            for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
                let nextCell = wrokSheet[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
                if (typeof nextCell === 'undefined') continue;
                else row.push(nextCell.w);
            }
            if (row.length > 0)
                result.push(row);
        }

        write2CSV(result, file);
    });
}


function write2CSV(arr, file) {

    // create csv data
    let csvStr = "";
    for (let i = 1; i < arr.length; i++) {
        csvStr += arr[i].join(",") + "\n";
    }

    // create csv dir if not exists
    let csvFilePath = "";
    let csvDir = CONFIG.baseDir + CONFIG.csvdir + "/"
    if (!fs.existsSync(csvDir)) fs.mkdirSync(csvDir);

    // create csv file
    let fileName = path.basename(file, ".xlsx");
    csvFilePath = csvDir + fileName + "-" + Date.now().toString() + ".csv";

    fs.writeFileSync(path.resolve(csvFilePath), csvStr);
}



const closeFileSystem = () => fs.close(2, () => {
    console.log("file is closed");
});

closeFileSystem();
