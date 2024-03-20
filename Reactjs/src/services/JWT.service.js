import jwt_decode from "jwt-decode";

let decode_token_exp = (token) => {
    try {
        let decoded = jwt_decode(token)
        if (decoded) {

            return decoded.exp
        }
    } catch (e) {
        return 0
    }
}

export {
    decode_token_exp
}