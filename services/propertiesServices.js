const bcrypt = require("bcryptjs");
const UserModal = require('../modals/userModal');
const PropertyModal = require('../modals/propertyModal');
const {saveImage, deleteImage} = require('../utils/imageFunction');

///to add new property
const postNewProperty = async (data,image, image2, image3, image4) => {
    const newProperty = new PropertyModal({
        name:data.name,
        userId: data.userId,
        city:data.city,
        price:data.price,
        rooms:data.rooms,
        size:data.size,
        baths:data.bath,
        description:data.description,
        // userName:data.userName
    });
    //all images valid?
    if(image != null){
        newProperty.imgSrc = image;   
    }
    if(image2 != null){
        newProperty.imgSrc2 = image2;   
    }
    if(image3 != null){
        newProperty.imgSrc3 = image3;   
    }
    if(image4 != null){
        newProperty.imgSrc4 = image4;   
    }

    const result = await newProperty.save();
    console.log(result);
    return result;
}
///to get all properties
const getPropertiesList = async () => {
    var result = await PropertyModal.find({});
    console.log(result);
    return result;
}

///to get specific property by Id
const getPropertyById = async (_id) => {
    var result = await PropertyModal.find({_id});
    console.log(result);
    return result;
}

///to get ALl properties of specific user Id
const getUserProperties = async (user) => {
    var result = await PropertyModal.find({user});
    console.log(result);
    return result;
}

///to edit specific property by Id
const editPropertyById = async (_id,data, image, image2, image3, image4) => {

    const property = await PropertyModal.findOne({_id});
    if(image != null){
        //delete previous image
        if(property.imgSrc !== ""){
            await deleteImage(property.imgSrc);
        }
        data.imgSrc = image; 
        
    }
    if(image2 != null){
         //delete previous image
         if(property.imgSrc2 !== ""){
            await deleteImage(property.imgSrc2);
        }
        data.imgSrc2 = image2; 
       
    }
    if(image3 != null){
         //delete previous image
         if(property.imgSrc3 !== ""){
            await deleteImage(property.imgSrc3);
        }
        data.imgSrc3 = image3; 
       
    }
    if(image4 != null){
          //delete previous image
          if(property.imgSrc4 !== ""){
            await deleteImage(property.imgSrc4);
        }
        data.imgSrc4 = image4; 
      
    }
   
    var result = await PropertyModal.findOneAndUpdate({_id},{
        name:data.name,
        userId: data.userId,
        city:data.city,
        price:data.price,
        rooms:data.rooms,
        size:data.size,
        baths:data.bath,
        description:data.description,
        imgSrc:data.imgSrc,
        imgSrc2:data.imgSrc2,
        imgSrc3:data.imgSrc3,
        imgSrc4:data.imgSrc4,
    },{new:true});

    console.log(result);
    return result;
}

///to delete specific property by Id
const deletePropertyById = async (_id) => {
    
    //if image exists
    const property = await PropertyModal.findById({_id});
    console.log(property);
    if(property.imgSrc !== ""){
        await deleteImage(property.imgSrc);
    }
    if(property.imgSrc2 !== ""){
        await deleteImage(property.imgSrc2);
    }
    if(property.imgSrc3 !== ""){
        await deleteImage(property.imgSrc3);
    }
    if(property.imgSrc4 !== ""){
        await deleteImage(property.imgSrc4);
    }
   const result = await property.deleteOne({ _id });
    return result;
}



// TODo: add population


module.exports = {
    postNewProperty,getPropertiesList, getPropertyById,
     getUserProperties, editPropertyById,
     deletePropertyById
}