const express = require('express');
const { postNewProperty } = require('../services/propertiesServices');
const { isLogged, newToken } = require('../utils/authCheck');
const userModal = require('../modals/userModal');
const propertyModal = require('../modals/propertyModal');
const cityModal = require('../modals/cityModal');
const { saveImage, deleteImage } = require('../utils/imageFunction');
const { populate } = require('../modals/userModal');
const adminRouter = express.Router();

//dashboard page for administrator
adminRouter.get('/:id/dashboard', isLogged, async (req, res) => {
    try {
        const { id } = req.params;

        //check if user is really an admin?
        const result = await userModal.findOne({ _id: id, token: 'J39SLKJVL3429FJ3IRQSLWOQ2E' })
        if (result) {

            //load all users
            const allUsers = await userModal.find({});

            res.render('panel/adminPanel/accounts', { id, allUsers });
        } else {
            res.status(401).send({ success: false, error: error })
        }
    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }

});

//new users route
adminRouter.get('/:id/newUsers', isLogged, async (req, res) => {
    try {
        const { id } = req.params;

        //check if user is really an admin?
        const result = await userModal.findOne({ _id: id, token: 'J39SLKJVL3429FJ3IRQSLWOQ2E' })
        if (result) {

            //load all new users
            const allUsers = await userModal.find({ isEnabled: false });

            res.render('panel/adminPanel/newUsers', { id, allUsers });
        } else {
            res.status(401).send({ success: false, error: error })
        }
    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }

});

//all properties route
adminRouter.get('/:id/allProperties', isLogged, async (req, res) => {
    try {
        const { id } = req.params;

        //check if user is really an admin?
        const result = await userModal.findOne({ _id: id, token: 'J39SLKJVL3429FJ3IRQSLWOQ2E' })
        if (result) {

            //load all new users
            const allProperties = await propertyModal.find().populate('userId').exec();

            res.render('panel/adminPanel/allProperties', { id, allProperties });
        } else {
            res.status(401).send({ success: false, error: error })
        }
    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }

});

//all users status enable or disable
adminRouter.post('/changeUserstatus', isLogged, async (req, res) => {
    try {
        const { id, userId } = req.body;
        console.log(id);
        var user = await userModal.findOne({ _id: userId });
        user.isEnabled = !user.isEnabled;
        await user.save();

        res.redirect(`/account/${id}/dashboard`);
    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }
});

//for new users status enable or disable
adminRouter.post('/changeDisabledUserStatus', isLogged, async (req, res) => {
    try {
        const { id, userId } = req.body;
        console.log(id);
        var user = await userModal.findOne({ _id: userId });
        user.isEnabled = !user.isEnabled;
        await user.save();

        res.redirect(`/account/${id}/newUsers`);
    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }
});

//change property status enable or disable
adminRouter.post('/changePropertyStatus', isLogged, async (req, res) => {
    try {
        const { id, propertyId } = req.body;
        console.log(id);
        var property = await propertyModal.findOne({ _id: propertyId });
        property.isEnabled = !property.isEnabled;
        await property.save();

        res.redirect(`/account/${id}/allProperties`);
    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }
});

//all cities route
adminRouter.get('/:id/allCities', isLogged, async (req, res) => {
    try {
        const { id } = req.params;

        //check if user is really an admin?
        const result = await userModal.findOne({ _id: id, token: 'J39SLKJVL3429FJ3IRQSLWOQ2E' })
        if (result) {

            //load all new users
            const allCities = await cityModal.find();

            res.render('panel/adminPanel/allCities', { id, allCities });
        } else {
            res.status(401).send({ success: false, error: error })
        }
    } catch (error) {
        res.status(401).send({ success: false, error: error })
    }
});

//add new city
adminRouter.post('/newCity', isLogged, async (req, res) => {
    try {
        console.log(req.body);
    const { id, cityId,cityName } = req.body;
    var city = await cityModal({ name:cityName });
    //saveImage
    if (req.files && req.files.imgSrc) {

        //saving image in our server and getting its url
        let url = await saveImage(req.files.imgSrc);
        if (url != false)
            //  update image in document in db
            city.imgSrc = url;
    }

    let result = await city.save();

    if (result) {
        res.redirect(`/account/${id}/allCities`);
    } else {
        res.status(401).send('something went wrong, Try again later!');
    }
    } catch (error) {
        res.status(401).send({ success: false, error: error })
    }
});

//delete city
adminRouter.post('/deleteCity', isLogged, async (req, res) => {
    try {
    const { id, cityId } = req.body;

    var city = await cityModal.findById({ _id: cityId });


    var result = null;
    //delete document from db - bad approach unless there are zero properties associated with it
    var cityPropertiesCount = await propertyModal.find({ city: cityId }).count();
    if (cityPropertiesCount == 0) {

        //delete city from server public storage
        if (city.imgSrc !== "") {
            await deleteImage(city.imgSrc);
        }
        result = await cityModal.deleteOne({ _id: cityId });

    } else {
        //instead softdelete it
        city.isDeleted = true;
        result = await city.save();
    }

    if (result) {
        res.redirect(`/account/${id}/allCities`);
    } else {
        res.status(401).send('something went wrong, Try again later!');
    }

    } catch (error) {
        res.status(401).send({ success: false, error: error })
    }
});

//update city
adminRouter.post('/updateCity', isLogged, async (req, res) => {
    try {
    const { id, cityId, cityName } = req.body;

    var city = await cityModal.findOne({ _id: cityId });
    //saveImage
    if (req.files && req.files.imgSrc) {

        if (city.imgSrc !== "") {
            await deleteImage(city.imgSrc);
        }
        //saving image in our server and getting its url
        let url = await saveImage(req.files.imgSrc);
        if (url != false)
            //  update image in document in db
            city.imgSrc = url;
    }
    city.name = cityName;
    const result = await city.save();
    if (result) {
        res.redirect(`/account/${id}/allCities`);
    } else {
        res.status(401).send('something went wrong, Try again later!');
    }

    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }
});

//change city status
adminRouter.post('/updateCityStatus', isLogged, async (req, res) => {
    try {
    const { id, cityId } = req.body;

    var city = await cityModal.findOne({ _id: cityId });

    city.isEnabled = !city.isEnabled;
    
    const result = await city.save();
    if (result) {
        res.redirect(`/account/${id}/allCities`);
    } else {
        res.status(401).send('something went wrong, Try again later!');
    }

    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }
});



module.exports = adminRouter;