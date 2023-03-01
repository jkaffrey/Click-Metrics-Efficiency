/**
 * CSVHelper.ts
 * 
 * A group of functions utilized to help with many of the operations around bitlinks within the encodes.csv file
 */
var csv = require('csvtojson'),
    fs = require('fs'),
    { descendingCountSort } = require('./Filters'),
    { validateFileExtension } = require('./Validators');

/**
 * Convert our CSV file into a useable array of objects, each object in the array must follow the structure of the BitLinkDTO.
 * 
 * @param {string} encodeFilePath - Path to the csv file we want to convert.
 * @returns An array of BitLinkDTO objects representing each entry within the CSV
 * @throws Throws an error if encodeFilePath do not exist on the system. Loose validation is used to ensure the file extension
 *  is correct but the structure of the file is not checked for validity.
 */
export async function convertCSVtoJSON(encodeFilePath: string) {

    if (!validateFileExtension(encodeFilePath, 'csv') || !fs.existsSync(encodeFilePath)) {

        throw new Error('Cannot find file or the file is not a csv file for encodeFilePath: ' + encodeFilePath);
    }

    var bitLinkJSONObj: BitLinkDTO[] = await csv().fromFile(encodeFilePath);
    return bitLinkJSONObj;
}

/**
 * Utilized to find the coresponding results between our bitlinks and our click data. Special handling attempts to 
 * take into account http and https urls as the same in respect to count.
 * 
 * @param {BitLinkDTO[]} bitlinkObjArr - Any array of objects representing our bitlinks that we care about the overall count.
 * @param {object} clickMetricTracker - An object passed in by reference containing the count of all bitlinks
 * @returns An array of objects where the keys are the long_url's of the bitlinks and the values are the total click counts.
 */
export function getOutputFromBitlinkObjectArr(bitlinkObjArr: BitLinkDTO[], clickMetricTracker: any) {

    var longUrlClickCount: any[] = [];
    bitlinkObjArr.forEach((bitlinkObj: BitLinkDTO) => {

        var http = 'http://' + bitlinkObj.domain + '/' + bitlinkObj.hash;
        var https = 'https://' + bitlinkObj.domain + '/' + bitlinkObj.hash;

        let clickCountObj: any = {};
        clickCountObj[bitlinkObj.long_url] = (clickMetricTracker[http] || clickMetricTracker[https] || 0);

        longUrlClickCount.push(clickCountObj)
    })

    longUrlClickCount.sort(descendingCountSort);

    return longUrlClickCount;
}