const bcrypt = require("bcryptjs");
const { random } = require("uuid-v4");
const UserModal = require('../modals/userModal');
const {
    isLogged, newToken
} = require('../utils/authCheck');

const login = async (phone, password,res) => {
    try {
        const user = await UserModal.findOne({
            phone: phone
        });
   
       
        if (user && user.isEnabled == true) {
            if (bcrypt.compareSync(password, user.password)) {
             
                const token = newToken(user);
                res.cookie('token', token);
                if (user.phone == process.env.ADMINNUMBER) {
                    res.cookie('ad', true);
                  
                    //admin
                    var adminData = await UserModal.findOne({phone:phone});
                    // res.render('panel/adminPanel/adminPanel', { admin: true });
                    res.redirect(`/account/${adminData.id}/dashboard`);
                } else {
                    // var products = await productModal.find({ sellerId: user.id });
                    res.cookie('ad', false);
                    var userData = await UserModal.findOne({phone});
                    res.redirect(`/admin/${userData.id}`); 
                 }

            } else {
                res.status(401).send({ success: false, message: "User record not found!" });

            }
        } else {
            res.status(401).send({ success: false, message: "User record not found!" });

        }
    } catch (error) {
        res.status(401).send({ success: false, message: 'failed! ', error });

    }

}

const register = async (phone,name,email, description,
     password, ePassword) => {

    const user = await UserModal.findOne({ phone });
        
      
    if (!user && password === ePassword) {
        console.log('password matched');
        const ePassword = bcrypt.hashSync(password, 8);

        const newUser = new UserModal({
            name: name,
            phone: phone,
            // imgSrc:imgSrc,
            email:email,
            imgSrc: '',
            description: description,
            password: ePassword,
        });
       const response = await newUser.save();
    
 
        // if (bcrypt.compareSync(password, newUser.password)) {
        //     const token = newToken(newUser);
        //     res.cookie('token', token);
        //     console.log('redirecting');
        //     // res.status(200).send({ success: true, message: "Registered and Login Successfully", user: newUser });
        //     res.redirect('/auth/login')
        // } else {
        //     res.status(401).send({ success: false, message: "User record not found!" });
        //     // res.render("admin/login/login", {
        //     //     errorMessage: 'Incorrect credentials'
        //     // });
        // }
       return response;
    } else {
       return false;
    }

}



module.exports = {
    login, register
}