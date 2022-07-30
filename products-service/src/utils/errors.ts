export class HttpError extends Error {
  constructor(
    // eslint-disable-next-line no-unused-vars
    readonly statusCode: number,
    message: string,
  ) {
    super(message);
  }
}
