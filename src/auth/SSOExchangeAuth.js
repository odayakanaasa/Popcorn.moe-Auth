import Strategy from 'passport-strategy'
import jwt from 'jsonwebtoken'

const secret = 'secret';

export default class SSOExchangeAuth extends Strategy {
    constructor() {
        super()
        this.name = 'ssoExchange'
    }

    authenticate({ body: { token }}, options) {
        if(!token) {
            this.fail('Missing token in body')
        }
        jwt.verify(token, secret, { audience: 'ssoExchange' }, (err, user) => {
            if (err) this.fail('Invalid jwt')
            else this.success({
                '_id': user._id,
                provider: this.name
            })
        })
    }

    createToken(user) {
        return new Promise((resolve, reject) => jwt.sign({
            '_id': user._id
        }, secret, {
            expiresIn: '1m',
            audience: 'ssoExchange'
        }, (err, token) => {
            if (err) reject(err)
            else resolve(token)
        }));
    }
}