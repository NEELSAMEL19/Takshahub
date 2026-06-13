export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(
    message: string,
    status: number = 500,
    errors?: Record<string, string>
  ) {
    super(message);
    this.status = status;
    this.errors = errors; 
    this.name = "ApiError";

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
