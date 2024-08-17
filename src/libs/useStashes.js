import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { getUserByEmail, getUserFromTable } from "../libs/UserLibs";
import {toast, Bounce} from 'react-toastify'
export const useStashes = () => {
  const [stashName, setStashName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [stashesData, setStashesData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserByEmail();
        if (!user) {
          navigate("/login");
          return;
        }
  
        const userDataFromTable = await getUserFromTable(user.email);
        setUserData(userDataFromTable);
  
        const { data, error } = await supabase
          .from("stashes")
          .select("*")
          .eq("userId", userDataFromTable.id)
          .order("created_at", { ascending: false }) // Fetch the 3 most recent stashes
          .limit(3);
  
        if (error) {
          throw new Error(error.message);
        }
        setStashesData(data);
        setError("");
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError("Failed to fetch data, Data Belum Ada.");
      } finally {
        setFetching(false);
      }
    };
  
    fetchUserData();
  }, [navigate]);
  

  const handleCreateStash = async () => {
    if (stashName.trim()) {
      setLoading(true);
      setError("");
      try {
        const user = await getUserByEmail();
        const userDataFromTable = await getUserFromTable(user.email);

        const { data, error } = await supabase
          .from("stashes")
          .insert({ title: stashName, userId: userDataFromTable.id })
          .select();

        if (error) {
          throw new Error(error.message);
        }

        toast.success('Stash Created, redirecting...', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });

        const newStashId = data[0].id;
        navigate(`/${newStashId}`);
      } catch (err) {
        console.error("Error creating stash:", err.message);
        setError("Failed to create stash. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter a stash name.");
    }
  };

  return {
    stashName,
    setStashName,
    loading,
    fetching,
    stashesData,
    error,
    handleCreateStash,
  };
};
