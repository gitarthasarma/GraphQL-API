const Shop = require('../../models/shop');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const auth = require('../../auth/token');
const sendEmail = require('../../utils/email');

module.exports = {
    getTokenResetPassword: async ({getTokenResetPasswordInput}) => {
        const {email} = getTokenResetPasswordInput;
        const shop = await Shop.findOne({
            where: {
                email
            }
        });

        if (shop && validator.isEmail(email)) {
            const token = auth.generateTokenForCustomSecret({shopId: shop.id, email},shop.enPassword);
            const emailSent = await sendEmail(email, token);
        }
        return {
            message: "If your shop is registered, you will receive the token on your email",
            status: 200
        }
    },


    postResetPassword: async ({postResetPasswordInput}) => {
        const {email, newPassword, token} = postResetPasswordInput;
        const shop = await Shop.findOne({
            where: {
                email
            }
        });

        if (shop) {
            const decoded = auth.verifyTokenWithCustomSecret(token, shop.enPassword);
            if (decoded) {
                if (email == decoded.email && shop.id === decoded.shopId) {
                    const enPassword = await bcrypt.hash(newPassword, 10);
                    shop.enPassword = enPassword;
                    shop.save();
                    return {
                        message: "Password changed successfully",
                        status: 200
                    }
                }
            }

        }
        const error = new Error('Invalid Credentials');
        error.code = 410;
        throw error;

    }
}
