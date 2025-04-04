import { ApiProperty } from "@nestjs/swagger"

export type HttpError = {
    message: string,
    statusCode: number
}

export const USER_NOT_FOUNDED: HttpError = {
    message: "No user found with this email address",
    statusCode: 404
}

export const TRANSACTION_NOT_FOUNDED: HttpError = {
    message: "No transactions founded with this id",
    statusCode: 404
}

export const UNAUTHORIZED: HttpError = {
    message: "You must be logged in to make a request",
    statusCode: 401
}

export const INSUFFICIENT_BALANCE: HttpError = {
    message: "Insufficient balance for the transfer",
    statusCode: 422
}

export const Receiver_NOT_FOUND: HttpError = {
    message: "The user specified for the transaction was not found",
    statusCode: 404
}

export const USER_INVALID: HttpError = {
    message: "Invalid username or password",
    statusCode: 401
}

export const ACCOUNT_EXISTS: HttpError = {
    message: "An account with this email already exists",
    statusCode: 409
}

export const ALREADY_REFOUND: HttpError = {
    message: "The transaction has already been refunded",
    statusCode: 402
}

export const REFOUND_LIMIT: HttpError = {
    message: "The time limit for requesting a refund has expired",
    statusCode: 402
}
