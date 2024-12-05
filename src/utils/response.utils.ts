import { HttpStatusMessage } from "../enums/http-status-message.enums.ts";
import { HttpStatusCode } from "../enums/http-status-code.enums.ts";

/**
 * Sends a JSON response with a specified HTTP status and additional data.
 * 
 * @param {HTTPStatusCode} status - The HTTP status code to be returned in the response.
 * @param {any} data - The additional data to include in the response body. This data is spread into the response object.
 * 
 * @returns {Response} A JSON response containing the `statusCode`, a easy readable `status` message,
 * and any additional data provided.
 * 
 * @example
 * Example usage
 * const response = getResponse(200, { message: "Request successful" });
 * Returns a JSON response with { "statusCode": 200, "status": "Ok", "data": { "message": "Request successful" } }
 */
export const getResponse = (status: HttpStatusCode, data: any) =>
  Response.json(
    { statusCode: status, status: HttpStatusMessage[status], ...data },
    { status },
  );

