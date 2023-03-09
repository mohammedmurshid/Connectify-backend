import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getTimelinePosts,
  reactPost,
  updatePost,
} from "../controllers/PostController.js";

const router = express.Router();

router.post("/", createPost);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/react", reactPost);
router.get("/:id/timeline", getTimelinePosts);

export default router;
