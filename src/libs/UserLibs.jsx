import { supabase } from "./supabase";



// Ambil Data User Berdasarkan Email
export const getUserByEmail = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Ambil Data User Berdasarkan Table Yakni Email Juga
export const getUserFromTable = async (email) => {
  try {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching user from table:", error);
    throw error;
  }
};
