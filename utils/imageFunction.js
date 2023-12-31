const path = require('path');
const fs = require('fs');
const {
    v4: uuidv4
} = require('uuid');

const saveImage = async (file) => {
    if (file) {
        const uudi = uuidv4();

        const fileUrl = `${uudi}${path.extname(file.name)}`;
        await file.mv(`./public/files/images/${fileUrl}`);
        return `files/images/${uudi}${path.extname(file.name)}`

    } else {
        return false;
    }
}

const deleteImage = async (filePath) => {
    await fs.unlinkSync(`public/${filePath}`)
}

module.exports = {
    saveImage,
    deleteImage,
}