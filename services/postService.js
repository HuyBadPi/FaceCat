import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
  try {
    if (post.file && typeof post.file === "object") {
      let isImage = post?.file?.type == "image";
      let folderName = isImage ? "postImage" : "postVideo";
      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
      if (fileResult.success) {
        post.file = fileResult.data;
      } else {
        return fileResult;
      }
    }

    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();
    if (error) {
      return { success: false, msg: error?.message };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("createPost error", error);
    return { success: false, msg: "Could not create post" };
  }
};

export const fetchPosts = async (limit = 10, userID) => {
  try {
    if (userID) {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
                *, 
                user: users(id, name, image),
                postLikes (*),
                comments (count)
            `
        )
        .order("created_at", { ascending: false })
        .eq("userID", userID)
        .limit(limit);
      if (error) {
        console.log("fetchPosts error", error);
        return { success: false, msg: "could not fetch post" };
      }
      return { success: true, data: data };
    } else {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
                *, 
                user: users(id, name, image),
                postLikes (*),
                comments (count)
            `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.log("fetchPosts error", error);
        return { success: false, msg: "could not fetch post" };
      }
      return { success: true, data: data };
    }
  } catch (error) {
    console.log("fetchPosts error", error);
    return { success: false, msg: "Could not fetch posts" };
  }
};

export const fetchPostDetails = async (postID) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
                *, 
                user: users(id, name, image),
                postLikes (*),
                comments (*, user: users(id, name, image))
            `
      )
      .eq("id", postID)
      .order("created_at", { ascending: false, foreignTable: "comments" })
      .single();

    if (error) {
      console.log("fetch PostDetails error", error);
      return { success: false, msg: "could not fetch post" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetch PostDetails error", error);
    return { success: false, msg: "Could not fetch post" };
  }
};

export const createPostLike = async (postLike) => {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();
    if (error) {
      console.log("PostLike error", error);
      return { success: false, msg: "could not like the post" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("PostLike error", error);
    return { success: false, msg: "Could not like the post" };
  }
};

export const removePostLike = async (postID, userID) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userID", userID)
      .eq("postID", postID);
    if (error) {
      console.log("PostLike error", error);
      return { success: false, msg: "could not remove the post" };
    }
    return { success: true };
  } catch (error) {
    console.log("PostLike error", error);
    return { success: false, msg: "Could not remove the post" };
  }
};

export const createComment = async (comment) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();
    if (error) {
      console.log("Comment error", error);
      return { success: false, msg: "could not create your comment" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("comment error", error);
    return { success: false, msg: "Could not create your comment" };
  }
};

export const removeComment = async (commentID) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentID);
    if (error) {
      console.log("removeComment error", error);
      return { success: false, msg: "could not remove the comment" };
    }
    return { success: true, data: { commentID } };
  } catch (error) {
    console.log("removeComment error", error);
    return { success: false, msg: "Could not remove the comment" };
  }
};

export const removePost = async (postID) => {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postID);
    if (error) {
      console.log("removePost error", error);
      return { success: false, msg: "could not remove the post" };
    }
    return { success: true, data: { postID } };
  } catch (error) {
    console.log("removePost error", error);
    return { success: false, msg: "Could not remove the post" };
  }
};
