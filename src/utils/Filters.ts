/**
 * Filters.ts
 * 
 * A group of functions utilized to help with the filtering and sorting of data.
 */

/**
 * Ensures that the click meteric is within the year that we have specified, if so it's count is incremented. The function
 * is passed into the JSONStream library as part of reading in our JSON file.
 * 
 * @param {ClickMetricDTO} clickMetricObj - A click meteric containing information regarding each click
 * @param {number} year - The year that we want to sort by
 * @param {object} clickMetricTracker - An object passed in by reference containing the count of all bitlinks
 * @returns if the clickMetricObj is within the specified year, it is returned otherwise nothing is returned
 */
export function filterByYearAndCountSimilar(clickMetricObj: ClickMetricDTO, year: number, clickMetricTracker: any) {
    if (new Date(clickMetricObj.timestamp).getFullYear() === year) {
        
        var key = clickMetricObj.bitlink;
        clickMetricTracker[key] = (clickMetricTracker[key] || 0) + 1
        return clickMetricObj;
    }
}

/**
 * Sort out final array of long_urls and count in descending order.
 * 
 * @param {object} firstBitLink - an object where the key is the long_url and the value is the count.
 * @param {object} secondBitLink - an object where the key is the long_url and the value is the count.
 * @returns the second count minus the first count, used to determine sort order.
 */
export function descendingCountSort(firstBitLink: object, secondBitLink: object) {
    return Object.values(secondBitLink)[0] - Object.values(firstBitLink)[0];
}