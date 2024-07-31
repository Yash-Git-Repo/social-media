const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const { error, success } = require('../utils/responseWrapper')

const signUpController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.send(error(400, "All Fields are required"));
        }
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.send(error(409, 'User is already registered'));
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email: email,
            password: hashedPassword
        });
        return res.send(success(201, "User created successfully"))

    } catch (e) {
        res.send(error(500, e.message))
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.send(error(400, "All fields are required"))
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.send(error(404, 'User is not registered'))
        }

        const passwordMatched = await bcrypt.compare(password, user.password)
        if (!passwordMatched) {
            return res.send(error(403, 'Password is incorrect'))
        }

        const accessToken = generateAccessToken({ _id: user._id })
        const refreshToken = generateRefreshToken({ _id: user._id })

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })
        return res.send(success(200, { accessToken }))

    } catch (e) {
        res.send(error(500, e.message))
    }
}

const logoutController = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        })
        return res.send(success(200, "User logged out"))
    } catch (e) {
        res.send(error(500, e.message))
    }
}

//This api will check the access token validity and generate a new access token
const refreshAccessTokencontroller = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies || !cookies.jwt) {
        return res.send(error(401, "Refresh Token is required"));
    }

    const refreshToken = cookies.jwt;
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
        const _id = decoded._id;
        const accessToken = generateAccessToken({ _id });

        return res.send(success(201, { accessToken })
        );
    } catch (err) {
        console.log(err);
        return res.send(error(401, "Invalid refresh key"));
    }
};

//Internal functions
const generateAccessToken = (data) => {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
        expiresIn: '15m'
    })
    return token
}
const generateRefreshToken = (data) => {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
        expiresIn: '1y'
    })
    return token
}

module.exports = {
    signUpController,
    loginController,
    logoutController,
    refreshAccessTokencontroller
}