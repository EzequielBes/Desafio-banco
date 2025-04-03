export type HttpError = {
    message: string,
    statusCode: number
}


export const USER_NOT_FOUNDED:HttpError = {
    message:"no user found with that email address",
    statusCode:404
}

export const INSUFFICIENT_BALANCE:HttpError = {
    message: "Insufficient transfer balance",
    statusCode: 422
}

export const Receiver_NOT_FOUND:HttpError = {
    message: "User informed for transaction not found",
    statusCode: 404
}

export const USER_INVALID: HttpError = {
    message: "INVALID USERNAME OR PASSWORD",
    statusCode: 402
}

export const ACCOUNT_EXISTS: HttpError = {
    message: "AN ACCOUNT WITH THIS EMAIL ALREADY EXISTS",
    statusCode: 402
}

                
// -> logar -> token  id -> id outra = saldo
// -> logar -> token -> id outra -> id

// --> login -> token => fazer transacao -> sender_id , receiver_id amount 
// --> login -> token => fazer transacao -> receiver, sender amount 