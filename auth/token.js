const jwt = require('jsonwebtoken');


exports.generateTokenForUser = (shopId, email) => {
    const token = jwt.sign({
        shopId,
        email
    }, process.env.JWT_SECRET,
    {
        expiresIn: '2h'
    });

    return token;
}


exports.verifyTokenWithUser = (token, shop) => {
    try {
        const {shopId, email} = jwt.verify(token, process.env.JWT_SECRET);
        if (shopId === shop.dataValues.id && email === shop.dataValues.email) return true;
        return false;

    } catch (err) {
        return false;
    }
}


exports.generateTokenForCustomSecret = (payload, secret) => {
    try {
        const token = jwt.sign(payload, secret, {
            expiresIn: 60*10 //10 mins
        });
        return token;
    } catch (err) {
        return null;
    }
}


exports.verifyTokenWithCustomSecret = (token, secret) => {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded
    } catch (err) {
        return null;
    }
}
