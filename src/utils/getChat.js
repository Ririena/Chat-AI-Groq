import { supabase } from "../libs/supabase";
import { useState, useEffect } from "react";

const [chat, setChat] = useState([]);
export const getData = async (datalist) => {
  try {
    const { data, error } = await supabase.from("chat").select("*");

    if (error) return error;
    setChat(data);

    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
};

useEffect(() => {
  getData();
}, []);
