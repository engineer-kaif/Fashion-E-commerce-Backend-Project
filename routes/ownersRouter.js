// const express=require('express')
// const router=express.Router()
// const ownerModel=require('../models/owner-modle')



// if(process.env.NODE_ENV==="development"){
//     router.post('/create',async(req,res)=>{
//     res.send("Data created successfully")
//     let owners=await ownerModel.find()
//     if(owners.length>0){
//         return res.send(503).send("You don't have permission to create")
//     }
//     let {fullname,email,password}=req.body
//     let createdOwner= await ownerModel.create({
//         fullname,
//         email,
//         password,
//     })
//      res.status(201).send(createdOwner)
// })
// }
// router.get('/admin',(req,res)=>{
//     res.render("createproducts",{ success: [] })
// })

// module.exports=router
const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-modle');

if (process.env.NODE_ENV === 'development') {
    router.post('/create', async (req, res) => {
        try {
            const owners = await ownerModel.find();

            if (owners.length > 0) {
                return res.status(503).send(
                    "You don't have permission to create"
                );
            }

            const { fullname, email, password } = req.body;

            const createdOwner = await ownerModel.create({
                fullname,
                email,
                password
            });

            return res.status(201).send(createdOwner);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    });
}

router.get('/admin', (req, res) => {
   let success= req.flash("success")
    res.render('createproducts', { success });
});

module.exports = router;