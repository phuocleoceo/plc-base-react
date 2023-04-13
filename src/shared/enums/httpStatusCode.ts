export enum HttpStatusCode {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  UnprocessableEntity = 422,
  InternalServerError = 500,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504
}
