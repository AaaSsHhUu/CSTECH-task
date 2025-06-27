class ErrorHandler extends Error {
    constructor(message = "Something went wrong!!!", statusCode) {
        super(message);
        this.statusCode = statusCode || 500; 
        this.stack = Error.captureStackTrace(this, this.constructor);
    }
}
export default ErrorHandler;