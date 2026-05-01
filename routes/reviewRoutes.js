const express=require("express");
const router=express.Router();

const {authenticate}=require("../middleware/authMiddleware");

const {
createReview,
getReviews
}=require("../controllers/reviewController");



router.get("/service/:serviceId",getReviews);



router.post("/",authenticate,createReview);

module.exports=router;