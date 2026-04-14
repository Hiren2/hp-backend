const express=require("express");
const router=express.Router();

const {authenticate}=require("../middleware/authMiddleware");

const {
createReview,
getReviews
}=require("../controllers/reviewController");

/* GET REVIEWS */

router.get("/service/:serviceId",getReviews);

/* ADD REVIEW */

router.post("/",authenticate,createReview);

module.exports=router;