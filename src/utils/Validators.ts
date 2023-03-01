/**
 * Validators.ts
 * 
 * A group of functions utilized to help with validating data.
 */

/**
 * Ensure that a path has the specified file extension.
 * 
 * @param {string} path - a local path to a file on the system
 * @param {string} expectedExtension - the extension that we expect the file in the path to have.
 * @returns true if the path matches what specifiy as the extension, false if it does not.
 */
export function validateFileExtension(path: string, expectedExtension: string) {

    var fileExt = path.split('.').pop();
    return fileExt === expectedExtension;
}