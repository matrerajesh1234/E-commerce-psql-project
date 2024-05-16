class RequestError extends Error{
constructor(message,statusCode){
    super(message);
    this.message = message;
    this.statusCode = statusCode;
}
}

class BadRequestError extends Error{
    constructor(message) {
        super(message,400)
        this.message;
    }
}

class NotFoundError extends Error{
    constructor(message){
        super(message,404);
        this.message;
    }
}

export {RequestError,BadRequestError,NotFoundError}