const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const securePassword = async (password) => {
    try {
        // console.log(password);
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message);

    }
}

const loadRegister = async (req, res) => {
    try {
        res.render('registration')
    } catch (error) {
        console.log(error.message)

    }

}


const insertUser = async (req, res) => {

    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            res.render("registration", { message: "Email already registered" });
        } else {
        

            const spassword = await securePassword(req.body.password)
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mno,
                password: spassword,
                is_admin: 0
            })

            const userData = await user.save()

            if (userData) {
                res.render('registration', { message: "your registration has been successfull" })
            } else {
                res.render('registration', { message: "your registration is failed" })
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

// login user method 

const loginLoad = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        // look single data doc that matches query
        const userData = await User.findOne({ email: email })

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)

            if (passwordMatch) {

                if (userData.is_verified === 0) {
                    res.render('login', { message: "email verification required" })
                } else {
                    req.session.user_id = userData._id
                    res.redirect('/home')
                }

            } else {
                res.render('login', { message: "Oops..username and password is incorrect" })
            }
        } else {
            res.render('login', { message: "Oops..username and password is incorrect" })
        }
    } catch (error) {
        console.log(error.message)

    }
}

const loadHome = async (req, res) => {

    try {
        const userData = await User.findById({ _id: req.session.user_id })
        res.render('home', { User: userData })
    } catch (error) {
        console.log(error.message);
    }
}

const userLogout = async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout
}