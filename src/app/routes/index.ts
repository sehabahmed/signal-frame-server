import express from "express";
import { TestRoutes } from "../modules/testModule/test.route";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/tests",
        route: TestRoutes
    }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;