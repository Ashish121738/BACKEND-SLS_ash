import {Router} from "express"
import {chatWithAI} from "../controllers/Ai-Chatbot.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
const router = Router()

router.route("/chat").post(chatWithAI)

export default router