const bycrypt = require("bcrypt");
const hashing = async (value) => {
    try {
        let salt = await bycrypt.genSalt(10);
        let hash = await bycrypt.hash(value, salt)
        return hash
    } catch (error) {
        return error
    }
}

const hashCompare = async (password, hashvalue) => {
    try {
        return await bycrypt.compare(password, hashvalue)
    } catch (error) {
        return error
    }
}

module.exports = { hashCompare, hashing }