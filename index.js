const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
var upload = require('express-fileupload');
const bodyParser = require('body-parser');
const express = require('express');


var { isLogged } = require('./utils/authCheck');

const app = express();

//models required list
const UserModal = require('./modals/userModal');
const PropertyModal = require('./modals/propertyModal');
//

//routes list
const { login, register } = require('./services/authServices');
const propertyRouter = require('./routers/propertyRouter');
const accountRouter = require('./routers/adminRouter');
const profileRouter = require('./routers/profileRouter');
const cityModal = require('./modals/cityModal');
const { randomInt } = require('crypto');


//...

//app config
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

require('dotenv').config();

app.use(upload({
    preserveExtension: true,
    // preserveExtension: 3,
    useTempFiles: true,
    tempFileDir: 'tmp'
}));

// CONNECTION MONGO
mongoose.connect(
    'mongodb+srv://ranafaisal989301:Q4w3CKdMuTq5ZIRt@cluster0.bcczg5l.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on('error', error => console.log(error))
db.once('open', () => console.log('connected to mongodb'))

//routes


//home page website
app.get("/", async function (req, res) {
    //get cities
    const cities = await cityModal.find();

    res.render("website/home",{cities})
});

//list of properties page
app.get("/properties", async function (req, res) {
    //searchOptions
    var searchOptions = {};
   
    if(req.query.name  != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    console.log(searchOptions);
    try {
       const properties = await PropertyModal.find(searchOptions).populate('userId').populate('city').sort('price').exec();

        res.render("website/properties",{properties, query:req.query.name })
    } catch (error) {
        res.status(401).send({ success: false, error: error });
    }
   
});

//view properties by city
app.get("/city/:id", async function (req, res) {
    //property id
   const {id} = req.params;
// let id = '649bdb2bff38edb586abfecd';
    try {
        console.log(id);
       const properties = await PropertyModal.find({city:id}).populate('userId').populate('city').exec();
        console.log(properties);
        res.render("website/properties",{properties,query:"city"})
    } catch (error) {
        res.status(401).send({ success: false, error: error });
    }
   
});
//view property - single
app.get("/viewProperty/:id", async function (req, res) {
    //property id
   const {id} = req.params;
    try {

       const property = await PropertyModal.findOne({_id:id}).populate('userId').populate('city').exec();
 
        res.render("website/viewProperty",{property})
    } catch (error) {
        res.status(401).send({ success: false, error: error });
    }
   
});

app.get("/admin/:id",isLogged, async function (req, res) {

   try {
    let {id }= req.params;
    var userData = await UserModal.findOne({_id:id});
    var properties = await PropertyModal.find({userId:id}).populate('city');
    var cities = await cityModal.find();
    console.log(userData, properties);
    res.render("panel/adminPanel/adminPanel", {id,userData, properties, cities});
    // if(id == '6499ae6212c108c62b6f1f68'){
    //     //when logged in, token should be uploaded to admin and when api is accessed 
    //     //then token should be matched with mongo.token;
    // }
    //J39SLKJVL3429FJ3IRQSLWOQ2E
} catch (error) {
    res.status(401).send({ success: false, error: error });
}
});

app.get("/login", async function (req, res) {
    res.render("panel/auth/login")
});

app.get("/register", async function (req, res) {
    res.render("panel/auth/register")
});


app.get('/logout',isLogged,  async function (req, res) {
   try {
    res.clearCookie('token');
    res.clearCookie('ad');
    res.redirect('/login');
} catch (error) {
    res.status(401).send({ success: false, error: error });
}
})

//post part//
app.post("/login", async function (req, res) {
    const { phone, password } = req.body;
    try {
       login(phone, password,res);
      
    } catch (error) {
        res.status(401).send({ success: false, error: error });
    }
});

app.post("/register", async function (req, res) {
    const { phone, name, email, description, password, ePassword } = req.body;
    console.log(req.body);
    try {
        let result = await register(phone, name, email, description, password, ePassword)
          
        if (result) {
            res.status(200).send({ success: true, message: "Registered successfully, Your account will be activated within 24 hours!" });

        } else {
            res.status(401).send({ success: false, message: 'User already Registered with this email!' });

        }
    } catch (error) {
        res.status(401).send({ success: false, error: error });
    }
});


//routers route
app.use('/property', propertyRouter);
app.use('/account', accountRouter);
app.use('/profile', profileRouter);


app.listen(process.env.PORT, () => console.log('SERVER IS RUNNING...'));
