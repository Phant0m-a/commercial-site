const express = require('express');
const {
    postNewProperty, getPropertiesList, getPropertyById,
    getUserProperties, editPropertyById,
    deletePropertyById
} = require('../services/propertiesServices');
const { isLogged } = require('../utils/authCheck');
const { saveImage, deleteImage } = require('../utils/imageFunction');

const propertyRouter = express.Router();

//get all properties
propertyRouter.get('/', isLogged, async (req, res) => {
    try {
        let result = getPropertiesList();
        if (result) {
            res.render('panel/adminPanel/properties', { properties: result });
        }
    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }
});

//get user properties list
propertyRouter.get('/property?', isLogged, async (req, res) => {
    try {
        const { user } = req.query;
        let result = getUserProperties(user);
        if (result) {
            res.render('panel/adminPanel/properties', { properties: result });
        }
    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }
});

propertyRouter.post('/property', isLogged, async (req, res) => {
    //do your thing and render properties again
    try {
        var image = null;
        var image2 = null;
        var image3 = null;
        var image4 = null;

        if (req.files && req.files.imgSrc) {
            console.log(req.files);

            let url = await saveImage(req.files.imgSrc);
            let url2 = await saveImage(req.files.imgSrc2);
            let url3 = await saveImage(req.files.imgSrc3);
            let url4 = await saveImage(req.files.imgSrc4);
          
                image = url;
                image2 = url2;
                image3 = url3;
                image4 = url4;

        }

    let result = null;
    if( image && image2 && image3 && image4){
        result =await postNewProperty(req.body, image, image2, image3, image4);
    }
    if (result) {
        res.redirect(`/admin/${req.body.userId}`);
    } else {
        res.status(401).send({ success: false, error: 'invalid data entered' })
    }
} catch (error) {
    res.status(401).send({ success: false, error: error })

}
});

propertyRouter.post('/editProperty', isLogged, async (req, res) => {
    //do your thing and render properties again
    try {
        console.log(req.files);
        console.log(req.body);
        var image, image2, image3, image4 = "";

        if (req.files && req.files.imgSrc) {
            // console.log(req.files.imgSrc.name);

            let url = await saveImage(req.files.imgSrc);
            if (url != false)
                image = url;
        }
        if (req.files && req.files.imgSrc2) {
            console.log(req.files.imgSrc2.name);

            let url2 = await saveImage(req.files.imgSrc2);
            if (url2 != false)
                image2 = url2;
        }
        if (req.files && req.files.imgSrc3) {
            // console.log(req.files.imgSrc.name);

            let url3 = await saveImage(req.files.imgSrc3);
            if (url3 != false)
                image3 = url3;
        }
        if (req.files && req.files.imgSrc4) {
            // console.log(req.files.imgSrc.name);

            let url4 = await saveImage(req.files.imgSrc4);
            if (url4 != false)
                image4 = url4;
        }
        let result= null;
   
         result = await editPropertyById(req.body.id, req.body,
            image,
            image2,
            image3,
            image4,

        );
        
        if (result) {
            res.redirect(`/admin/${req.body.userId}`);
        } else {
            res.status(401).send({ success: false, error: 'invalid data entered' })
        }
    
     
    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }
});

propertyRouter.post('/deleteProperty', isLogged, async (req, res) => {
    //get id and userId
    const { id, userId } = req.body;
    console.log(req.body);
    try {
        const result = await deletePropertyById(id);
        if (result) {
            res.redirect(`/admin/${userId}`);
        } else {
            res.status(401).send({ success: false, error: 'invalid data entered' })
        }
    } catch (error) {
        res.status(401).send({ success: false, error: error })

    }

});


module.exports = propertyRouter;