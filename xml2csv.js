const fs = require('fs');
const path = require('path');
const CONFIG = require('./config.json');
const json2csv = require('json2csv').parse;
const { transform } = require('camaro');

// xml parser
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "attr" });

// path to xml files
const xmlDir = path.join(CONFIG.baseDir, CONFIG.xmldir);

//output dir
const csvDir = path.join(CONFIG.baseDir, CONFIG.csvdir) + '/';

//console.log(xmlDir);

let xmlFilesArray = [...fs.readdirSync(xmlDir)];

xmlFilesArray.forEach(file => {
    let filePath = xmlDir + "/" + file;

    let xml_string = fs.readFileSync(filePath, "utf-8");

    const normalizeXml = async () => {

        console.log(CONFIG.template_order);
        const result = await transform(xml_string, CONFIG.template_order);
        const csvData = json2csv(result.data);

        const xmlFileName = path.basename(filePath, '.xml');

        if (!fs.existsSync(csvDir)) fs.mkdirSync(csvDir);

        const csvFile = csvDir + xmlFileName + '-' + Date.now() + '.csv';

        fs.writeFileSync(csvFile, csvData)
        console.log(csvData);
    };

    normalizeXml();
})

const closeFileSystem = () => fs.close(2, () => {
    console.log("file is closed");
});

closeFileSystem();
