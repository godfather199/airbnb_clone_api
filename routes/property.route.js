import { Router } from "express";
import { verify_Token } from "../middlewares/verifyToken.js";
import {
  create_New_Property,
  fetch_All_Properties,
  fetch_Property_By_Category,
  fetch_Single_Property,
  logged_In_User_Property,
  property_Filters,
  search_Property,
} from "../controllers/property.controller.js";



const router = Router();

router.post("/new-property", verify_Token, create_New_Property);
router.get("/all-properties", fetch_All_Properties);
router.get("/search", search_Property);
router.get("/single-property/:propertyId", fetch_Single_Property);
router.get("/filters", property_Filters);
router.get("/user-properties", verify_Token, logged_In_User_Property);
router.get("/:category", fetch_Property_By_Category);

export default router;
