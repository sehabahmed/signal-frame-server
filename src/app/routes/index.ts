import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { UserRoutes } from "../modules/User/user.route";
import { NewsFeedRoutes } from "../modules/NewsFeed/newsfeed.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/news",
    route: NewsFeedRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
