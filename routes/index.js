const express=require("express")
const router=express.Router()
const isLoggedIn = require('../middlewares/isLoggedIn')
const productModel=require("../models/product-model")
const userModel = require("../models/user-model")

router.get('/',(req,res)=>{
   let error=req.flash("error")
   res.render("index",{error,loggedin:false})
})


router.get("/shop", isLoggedIn, async (req, res) => {
    try {
        const products = await productModel.find();
        res.render("shop", { products,success:req.flash("success") });
    } catch (err) {
        console.log(err);
        res.status(500).send("Products fetch nahi ho paaye");
    }
});

router.get("/cart", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel
            .findOne({ email: req.user.email })
            .populate("cart");

        const bill = user.cart.reduce((total, item) => {
            return total + Number(item.price) - Number(item.discount);
        }, 0) + 20;

        res.render("cart", { user, bill });

    } catch (err) {
        console.log(err);
        res.status(500).send("Cart fetch nahi ho paya");
    }
});

router.post("/removefromcart/:id", isLoggedIn, async (req, res) => {
    try {
        await userModel.updateOne(
            { email: req.user.email },
            { $pull: { cart: req.params.id } }
        );

        res.redirect("/cart");

    } catch (err) {
        console.log(err);
        res.status(500).send("Product remove nahi ho paya");
    }
});



router.get("/addtocart/:productid", isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findOne({
            email: req.user.email
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.cart.push(req.params.productid);

        await user.save();

        req.flash("success", "Added to cart");
        res.redirect("/shop");
    } catch (err) {
        console.log(err);
        res.status(500).send("Product cart mein add nahi ho paya");
    }
});


module.exports=router