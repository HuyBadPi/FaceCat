import { supabase } from "../lib/supabase";

export const createNotification = async (notification) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();
    if (error) {
      console.log("notification error", error);
      return { success: false, msg: "something went wrong" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("notification error", error);
    return { success: false, msg: "something went wrong" };
  }
};

export const fetchNotifications = async (receiverID) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
            *, 
            sender: senderID(id, name, image)
        `
      )
      .eq("receiverID", receiverID)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("fetch notifications error", error);
      return { success: false, msg: "could not fetch notifications" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetch notifications error", error);
    return { success: false, msg: "Could not fetch notifications" };
  }
};
