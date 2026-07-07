import express from "express";
import { getUsersForSidebar , getConversationsForSidebar,getMessages,sendMessage , deleteMessage} from "../controllers/message.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js"
import {upload} from "../middleware/upload.middleware.js"

const router = express.Router();

router.use(protectRoute);

router.get("/users",getUsersForSidebar);
router.get("/conversations",getConversationsForSidebar);
router.get("/:id",getMessages);
router.post("/send/:id",upload.single("media"),sendMessage);
//whatever uh send from the frontend you should have the key media

router.delete("/:id", deleteMessage);

export default router;