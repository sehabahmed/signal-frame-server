import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { TestValidations } from "./test.validaiton";
import { TestControllers } from "./test.controller";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

router.post(
  "/create-test",
  parseBody,
  validateRequest(TestValidations.createTestSchema),
  TestControllers.createTest
);

router.get("/", TestControllers.getAllItems);

export const TestRoutes = router;
