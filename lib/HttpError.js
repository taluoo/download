class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpError);
        }

        this.statusCode = statusCode;
        this.message = message;
    }

    toString() {
        return `(${this.statusCode}): ${this.message}`;
    }
}

module.exports = HttpError;