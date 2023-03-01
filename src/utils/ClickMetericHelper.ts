/**
 * JSONHelper.ts
 * 
 * A group of functions utilized to help with many of the operations around counting the click meterics stores in our decodes.json file
 */
var fs = require('fs'),
    JSONStream = require('JSONStream'),
    { filterByYearAndCountSimilar } = require('./Filters'),
    { convertCSVtoJSON, getOutputFromBitlinkObjectArr } = require('./BitLinkHelper'),
    { validateFileExtension } = require('./Validators');

/**
 * Count the bitlinks that we are interested in based on the year that they occurred.
 * 
 * @param {string} decodeFilePath - Path to the json file repsenting the click meterics
 * @param {number} year - a number representing the year we want to query. The year cannot be in the future.
 * @param {BitLinkDTO[]} bitlinkJsonObjArr - array of BitLinkDTO's to which we want to see the resulting count.
 * @returns an array of objects, filtered by year, where the keys are the long_urls of each bitlink and the values are the count.
 * @throws Throws an error if decodeFilePath do not exist on the system. Loose validationis is used to ensure the file extension is
 * correct but the structure of the file is not checked for validity.
 */
function countClickMetricsByBitLinkAndYear(decodeFilePath: string, year: number, bitlinkJsonObjArr: BitLinkDTO[]) {

    if (!validateFileExtension(decodeFilePath, 'json') || !fs.existsSync(decodeFilePath)) {
        throw new Error('Cannot find file or the file is not a json file for decodedFilePath: ' + decodeFilePath);
    }

    // This is declared here as a global variable that is passed by reference to the JSONStream library to group and count each
    // click metric based on bitlink. It is later on used to get the count of the of the bitlinks.
    var clickMetricTracker = {};

    return new Promise((resolve, reject) => {

        try {

            var stream = fs.createReadStream(decodeFilePath),
                parser = JSONStream.parse('*', (streamObject: ClickMetricDTO) => filterByYearAndCountSimilar(streamObject, year, clickMetricTracker));

            stream.pipe(parser);
            stream.on('close', function streamFullfilled() {
                resolve(getOutputFromBitlinkObjectArr(bitlinkJsonObjArr, clickMetricTracker));
            })
        } catch (err) {

            reject(err);
        }
    })
}

/**
 * This function will take the csv file passed in via encodeFilePath and calculate the number of clicks from year for
 * each record in the data set as compared against the decodesFilePath data set.
 * After the function has been called and the calculation has been made, the output will be written to the console.
 * 
 * @param {string} encodeFilePath - a string representing a file path, it is expected to be a CSV file.
 * @param {string} decodeFilePath - a string representing a file path, it is expected to be a JSON file.
 * @param {number} year - a number representing the year we want to query. The year cannot be in the future.
 * @returns an array of objects, filtered by year, where the keys are the long_urls of each bitlink and the values are the count.
 * @throws Throws an error if either, encodeFilePath or decodeFilePath do not exist on the system. Loose validation
 *  is used to ensure the file extension is correct but the structure of the file is not checked for validity. Additionally,
 *  year cannot be in the future.
 */
export async function countClicksFromYear(encodeFilePath: string, decodeFilePath: string, year: number) {

    if (year > new Date().getFullYear()) {

        throw new Error('Attempting to find a year in the future.');
    }

    var bitlinkJsonObjArr = await convertCSVtoJSON(encodeFilePath);

    return countClickMetricsByBitLinkAndYear(decodeFilePath, year, bitlinkJsonObjArr);
}