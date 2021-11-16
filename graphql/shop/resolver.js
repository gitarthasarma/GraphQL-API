const Shop = require('../../models/shop');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const auth = require('../../auth/token');


module.exports = {
    getShopDetails: async ({ getShopInput }) => {
        const { email, token } = getShopInput;

        const shop = await Shop.findOne({
            where: {
                email
            }
        });

        if (!shop) {
            const error = new Error('Shop not found'); // if shop not found throw error
            error.code = 410;
            throw error
        }

        if (auth.verifyTokenWithUser(token, shop)) {
            
            return {
                message: "successfull",
                shopId: shop.id,
                name: shop.name,
                address: shop.address,
                phNum: shop.phNum,
                email: shop.email,
                status: 200
            }
        }

        const error = new Error('Invalid token');
        error.code = 403;
        throw error;
    },


    getToken: async ({getTokenInput})=> {
        const {email, password} = getTokenInput;
        const shop = await Shop.findOne({
            where: {
                email
            }
        });

        if (shop && await bcrypt.compare(password, shop.enPassword)) {
            //authorized
            const token = auth.generateTokenForUser(shop.id, shop.email);
            return {
                message: "Token generated successfully",
                shopId: shop.id,
                name: shop.name,
                address: shop.address,
                phNum: shop.phNum,
                email: shop.email,
                token,
                status: 200
            }
            
        }

        const error = new Error('Invalid Credentials');
        error.code = 409;
        error.data = {email};
        throw error;
    },


    postRegisterShop: async ({ postRegisterShopInput }) => {
        const { name, address, phNum, email, password } = postRegisterShopInput;
        const errors = [];

        // validations
        if (!validator.isEmail(email)) {
            errors.push({ message: "E-mail is invalid"});
        }

        if (!validator.isLength(phNum, {min:10,max:10})){
            errors.push({ message: "Phone number is invalid"});
        }

        if (errors.length > 0) {
            const error = new Error('invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const enPassword = await bcrypt.hash(password, 10);

        // console.log(enPassword);
        const shop = await Shop.findOne({
            where: {
                email
            }
        });

        if (shop) {
            const error = new Error('Shop already exists with the given email');
            error.code = 409;
            throw error;
        }

        const newShop = await Shop.create({
            name,
            address,
            phNum,
            email,
            enPassword
        });

        return {
            message: "Shop creation successful",
            shopId: newShop.id,
            name: newShop.name,
            address: newShop.address,
            phNum: newShop.phNum,
            email: newShop.email,
            status: 201
        }
    },


    deleteShop: async function({ shopDeleteInput }) {
        const { email, password } = shopDeleteInput;
        const shop = await Shop.findOne({
            where: {
                email
            }
        });

        if (shop && await bcrypt.compare(password, shop.enPassword)) {
            shop.destroy();
            return {
                message: "Shop deleted successfully",
                status: 202
            }
          ;
        }

        if (!shop) {
            const error = new Error('Invalid email ');
            error.code = 410;
            throw error
        }
        const error = new Error('Invalid password ');
            error.code = 410;
            throw error
    }
}
