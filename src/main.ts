/**
 * main.ts
 * This is the file that first file that node calls in order for the program to begin.
 */
var { countClicksFromYear } = require('./utils/ClickMetericHelper');


function main() {
    countClicksFromYear('./resources/encodes.csv', './resources/decodes.json', 2021).then((bitlinkClicks: any) => {

        console.log(bitlinkClicks);
    })
}

main();