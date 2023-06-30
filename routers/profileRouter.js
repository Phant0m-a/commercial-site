const express = require('express');
const bcrypt = require('bcryptjs');
const UserModal = require('../modals/userModal');
const { postNewProperty } = require('../services/propertiesServices');
const { isLogged, newToken } = require('../utils/authCheck');
const { saveImage, deleteImage } = require('../utils/imageFunction');
const profileRouter = express.Router();

profileRouter.get('/:userId', isLogged, async (req, res) => {

    try {
        const { userId } = req.params;
        const userData = await UserModal.findOne({ _id: userId });
        
        res.render('panel/adminPanel/profile', { userId, userData });
    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }
});

profileRouter.post('/editProfile', isLogged, async (req, res) => {
    try {
        const { userId } = req.body;
        const body = req.body;

        //delete previous image from mongoDB so we can add new
        const property = await UserModal.findOne({ _id: userId });
        //if image then update 
        if (req.files && req.files.imgSrc) {

            if (property.imgSrc !== "") {
                await deleteImage(property.imgSrc);
            }
            //saving image in our server and getting its url
            let url = await saveImage(req.files.imgSrc);
            if (url != false)
                //  update image in document in db
                property.imgSrc = url;
        }

        //update remaining info
        property.name = body.name;
        property.email = body.email;
        property.description = body.description;

        let result = await property.save();
        if (result) {
            res.redirect(`/profile/${userId}`);
        } else {
            {
                res.status(401).send({ success: false, error: 'something went wrong' })

            }
        }

    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }
});

profileRouter.post('/changePassword', isLogged, async (req, res) => {
    try {
        const { userId,
            currentPassword,
            newPassword,
            confirmPassword } = req.body;

        console.log(req.body);
        const user = await UserModal.findOne({ _id: userId });
        console.log(user);
        if (user) {

            //hash currentPassword and get match with previous password mongo
            let valid = bcrypt.compareSync(currentPassword, user.password);
            var passwordsMatch = (newPassword === confirmPassword);

            if (valid && passwordsMatch) {
                const hash = bcrypt.hashSync(newPassword, 8);

                var updateUser = await UserModal.findOneAndUpdate(
                    { _id: userId },
                    { password: hash },
                    { new: true }
                );
                console.log(updateUser);
                res.redirect(`/profile/${userId}`);
            } else {
                res.status(401).send({ success: false, message: 'validation failed!' });
            }

        }
        else {
            res.status(401).send({ success: false, message: 'User not found!' });

        }


    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }
});




module.exports = profileRouter;