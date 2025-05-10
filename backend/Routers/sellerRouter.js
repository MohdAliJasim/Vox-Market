const express = require("express");
const Model = require("../models/SellerModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "topsecret";
const maxAge = 60 * 60 * 24 * 1;

const jwtSignature = (id,name,email) => {
  const payload = { id,name,email };
  return jwt.sign(payload, JWT_SECRET, {expiresIn: '1h' });
};

router.get("/getById/:id", (req, res) => {
  Model.findById(req.params.id)
    .then((seller) => {
      if (!seller) return res.status(404).json({ message: "Seller not found" });
      res.status(200).json(seller);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    });
});

router.put("/update/:id", (req, res) => {
  Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updated => res.status(200).json(updated))
    .catch(err => res.status(500).json(err));
});

// Add these to your existing seller routes
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});
// Get seller profile
router.get('/profile', async (req, res) => {
   console.log('Profile request headers:', req.headers);
  
  try {
    // 1. Verify Authorization header exists
    if (!req.headers.authorization) {
      console.log('No authorization header');
      return res.status(401).json({ message: 'Authorization header required' });
    }

    // 2. Extract token
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Token required' });
    }

    // 3. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded token:', decoded);
    } catch (verifyError) {
      console.log('Token verification failed:', verifyError);
      return res.status(401).json({ 
        message: 'Invalid token',
        error: verifyError.message 
      });
    }

    // 4. Find seller
    const seller = await Model.findById(decoded.id).select('-password');
    if (!seller) {
      console.log('Seller not found for ID:', decoded.id);
      return res.status(404).json({ message: 'Seller not found' });
    }

    console.log('Found seller:', seller.email);
    
    // 5. Return seller data
    res.status(200).json({
      id: seller._id,
      name: seller.name,
      email: seller.email,
      phoneNumber: seller.phoneNumber,
      businessName: seller.businessName,
      businessAddress: seller.businessAddress,
      profileImage: seller.profileImage,
      // Add other fields as needed
    });
    
  } catch (err) {
    console.error('Server error in profile route:', err);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Update seller profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const updatedSeller = await Model.findByIdAndUpdate(
      decoded.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.status(200).json(updatedSeller);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get("/getAll", (req, res) => {
  Model.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
      console.log(err);
    });
});

router.post("/addSeller",(req, res) => {
  console.log(req.body);
  // const { name, email, password, phoneNumber } = req.body;
  //asynchronous that why we will get promise obj
  const sellerData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password, // Ensure this is hashed
    phoneNumber: req.body.phoneNumber
  };
  new Model(sellerData)
    .save()
    //thenc is the shortcut
    .then((result) => {
      const token = jwtSignature(result._id,result.name,result.email);
      console.log(`Signup :-->${token}`);
      res.status(200).json({token: token,
        seller:{ name: result.name,
          email: result.email,
          avatar: result.avatar}
       });  
      
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/authenticate", (req, res) => {
  Model.findOne({ email: req.body.email })
    .then((result) => {
      if (result) {
        //JWT to generate and verify the token and .env is used
        //payload , secretkey, expiry

        const { _id,name,email,password } = result;
        if (password === req.body.password) {
          const payload = { id:_id,name,email };
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
              if (err) {
                console.log(err);
                return res.status(500).json(err);
              } else {
                console.log(`login :-->${token}`);
                console.log(payload);
                return res.status(200).json({ token: token,
                  seller:{name:result.name,
                  email:result.email,
                  avatar:result.avatar }
                });
              }
            }
          );
        }
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/test", (req, res) => {
  res.send("User Route working");
});

module.exports = router;
