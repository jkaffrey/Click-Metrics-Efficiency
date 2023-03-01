/**
 * An interface used to express the expected key, value pair structure of each BitLink inside the encodes.csv file
 */
interface BitLinkDTO {
    long_url: string
    domain: string
    hash: string
    count: number
}