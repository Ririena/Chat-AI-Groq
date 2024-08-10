import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../libs/supabase";
import { Divider, Button, Input, Card, CardBody } from "@nextui-org/react";

export default function CreateStash() {
  const [stashName, setStashName] = useState("");
  const [loading, setLoading] = useState(false);
  const [stashesData, setStashesData] = useState([]);
  const [error, setError] = useState(""); // Error state to track errors
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStashes() {
      try {
        const { data, error } = await supabase.from("stashes").select("*");

        if (error) {
          throw new Error(error.message);
        }

        setStashesData(data);
      } catch (error) {
        console.error("Error fetching stashes:", error.message);
        setError("Failed to fetch stashes. Refreshing the page...");
      }
    }
    fetchStashes();
  }, []);

  const handleCreateStash = async () => {
    if (stashName.trim()) {
      setLoading(true);
      setError(""); // Clear previous errors
      try {
        const { data, error } = await supabase
          .from("stashes")
          .insert({ title: stashName })
          .select();

        if (error) {
          throw new Error(error.message);
        }

        const newStashId = data[0].id;
        navigate(`/${newStashId}`);
      } catch (err) {
        console.error("Error creating stash:", err.message);
        setError("Failed to create stash. Refreshing the page...");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter a stash name.");
    }
  };

  const handleStashClick = (id) => {
    navigate(`/${id}`);
  };

  useEffect(() => {
    if (error) {
      // Refresh the page after a short delay to allow the user to see the error message
      const timer = setTimeout(() => {
        window.location.reload();
      }, 500); // Adjust the delay as needed

      return () => clearTimeout(timer); // Cleanup timer on component unmount or when error changes
    }
  }, [error]);

  if (loading) {
    return <h1 className="text-center">Creating Stash...</h1>;
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-4xl mb-4 text-center">Create or Select a Stash</h1>

        {error && <h1 className="text-red-500 mb-4">{error}</h1>}

        <div className="mb-6">
          <Input
            clearable
            underlined
            placeholder="Enter stash name"
            value={stashName}
            onChange={(e) => setStashName(e.target.value)}
            aria-label="Stash Name"
            className="mb-4"
          />
          <Button
            onClick={handleCreateStash}
            color="primary"
            auto
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Stash"}
          </Button>
        </div>
        <Divider />
        <h2 className="text-2xl mb-4 text-center">Your Existing Stashes</h2>
        <ul className="list-disc list-inside space-y-2">
          {stashesData.map((stash) => (
            <Card
              key={stash.id}
              isHoverable
              isPressable
              onClick={() => handleStashClick(stash.id)}
              className="cursor-pointer"
            >
              <CardBody className="w-[450px]">
                <p className="text-black">{stash.title}</p>
              </CardBody>
            </Card>
          ))}
        </ul>
      </div>
    </div>
  );
}
