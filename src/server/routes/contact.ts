import { Hono } from "hono";
import { handleContactForm } from "../controllers/ContactController";

const router = new Hono();

router.post("/", handleContactForm);

export default router;