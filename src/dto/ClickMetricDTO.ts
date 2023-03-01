/**
 * An interface used to express the expected expected key, value pair structure of each object of a click metric inside the decodes.json file.
 */
interface ClickMetricDTO {

    bitlink: string
    user_agent: string
    timestamp: string
    referrer: string
    remote_ip: string
}