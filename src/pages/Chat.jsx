import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { supabase } from "../libs/supabase";
import { useNavigate } from "react-router-dom";
import { requestToRinaAI } from "../utils/groq";
import {
  Button,
  Textarea,
  Card,
  Spacer,
  CardBody,
  Divider,
} from "@nextui-org/react";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { MdContentCopy, MdRefresh } from "react-icons/md";
import { useParams } from "react-router-dom";

export default function Chat() {
  const isMounted = useRef(true);
  const { stashId } = useParams();
  const [content, setContent] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [savedTitle, setSavedTitle] = useState("");
  const [stashes, setStashes] = useState([]);
  const [currentStashId, setCurrentStashId] = useState(stashId);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchStashes = async () => {
      setLoading(true);
      setError("");
      try {
        const { data, error } = await supabase.from("stashes").select("*");

        if (error) throw error;

        if (isMounted.current) {
          setStashes(data || []);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(`An error occurred while fetching stashes: ${err.message}`);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchStashes();
  }, []);

  if (loading) {
    <h1>Loading</h1>;
  }

  useEffect(() => {
    if (selectedHistory) {
      setContent(selectedHistory.message);
    }
  }, [selectedHistory]);

  useEffect(() => {
    if (!stashId || stashes.length === 0) return;

    const fetchResponses = async () => {
      setLoading(true);
      setError("");
      try {
        const { data, error } = await supabase
          .from("responses")
          .select("*")
          .eq("stashId", stashId)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (isMounted.current) {
          setResponses(data || []);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(
            `An error occurred while fetching responses: ${err.message}`
          );
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchResponses();
  }, [stashId, stashes]);

  useEffect(() => {
    if (error) {
      // Refresh the page after a short delay to allow the user to see the error message
      const timer = setTimeout(() => {
        window.location.reload();
      }, 500); // Adjust the delay as needed

      return () => clearTimeout(timer); // Cleanup timer on component unmount or when error changes
    }
  }, [error]);

  const handleSubmit = async () => {
    if (!stashId) {
      setError("Stash ID is missing.");
      return;
    }

    if (content.trim()) {
      setLoading(true);
      setError("");
      try {
        const { aiResponse, usage } = await requestToRinaAI(content);

        if (aiResponse) {
          const newResponse = { stashId, message: content, aiResponse, usage };

          setResponses((prevResponses) => [...prevResponses, newResponse]);

          const { error: saveError } = await supabase
            .from("responses")
            .insert([newResponse]);

          if (saveError) {
            throw new Error("Failed to save the response to the database.");
          }

          setContent("");
        } else {
          throw new Error("Invalid response from API.");
        }
      } catch (err) {
        console.error("Submit error:", err);
        setError("An error occurred while fetching the response.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter a message.");
    }
  };

  const handleRegenerate = async (index) => {
    if (responses[index]) {
      const { id, message } = responses[index];
      setLoading(true);
      setError("");
      try {
        const { aiResponse, usage } = await requestToRinaAI(message);
        const updatedResponse = { aiResponse, usage };

        // Update the specific response in Supabase
        const { error: updateError } = await supabase
          .from("responses")
          .update(updatedResponse)
          .match({ id });

        if (updateError) {
          throw new Error("Failed to update the response in the database.");
        }

        // Update the response in local state
        const newResponses = [...responses];
        newResponses[index] = { ...newResponses[index], ...updatedResponse };
        setResponses(newResponses);
      } catch (err) {
        console.error("Regenerate error:", err);
        setError("An error occurred while regenerating the response.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleHistoryClick = (index) => {
    setSelectedHistory(history[index]);
    setSidebarVisible(false);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleStashClick = (id) => {
    navigate(`/${id}`); // Adjust this path according to your routing setup
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 relative">
      <div className="fixed top-4 left-4 z-30">
        <Button
          auto
          className="bg-gray-800 text-gray-100 border-gray-600"
          onClick={toggleSidebar}
        >
          {isSidebarVisible ? <IoClose size={24} /> : <HiMenu size={24} />}
        </Button>
      </div>
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 p-4 overflow-auto transition-transform duration-300 ease-in-out ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative max-w-full w-[300px] z-30`}
      >
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-4 text-gray-100">Stashes</h2>
          {isSidebarVisible ? (
            <Button isIconOnly onClick={toggleSidebar}>
              <IoClose />
            </Button>
          ) : (
            <></>
          )}
        </div>

        <div className="space-y-2">
          {stashes.map((stash) => (
            <Card
              key={stash.id}
              variant="bordered"
              className={`bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600 ${
                stash.id === currentStashId ? "bg-gray-600" : ""
              }`}
              onClick={() => handleStashClick(stash.id)}
            >
              <CardBody onClick={() => handleStashClick(stash.id)}>
                <p className="font-bold text-gray-300">{stash.title}</p>
              </CardBody>
            </Card>
          ))}
        </div>
        <div className="space-y-2">
          {history.map((entry, index) => (
            <Card
              key={index}
              variant="bordered"
              className="bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600"
              onClick={() => handleHistoryClick(index)}
            >
              <CardBody>
                <p className="font-bold text-gray-300">You: {entry.message}</p>
                <p className="text-gray-400">
                  {entry.aiResponse.slice(0, 50)}...
                </p>
                <p className="text-gray-500 mt-2"></p>
                <p className="text-gray-500">
                  Prompt Tokens:{" "}
                  {entry.usage ? entry.usage.prompt_tokens : "N/A"}
                </p>
                <p className="text-gray-500">
                  Completion Tokens:{" "}
                  {entry.usage ? entry.usage.completion_tokens : "N/A"}
                </p>
                <p className="text-gray-500">
                  Total Time:{" "}
                  {entry.usage
                    ? entry.usage.total_time.toFixed(3) + "s"
                    : "N/A"}
                </p>
                <p className="text-gray-500">
                  Prompt Time:{" "}
                  {entry.usage
                    ? entry.usage.prompt_time.toFixed(3) + "s"
                    : "N/A"}
                </p>
                <p className="text-gray-500">
                  Completion Time:{" "}
                  {entry.usage
                    ? entry.usage.completion_time.toFixed(3) + "s"
                    : "N/A"}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
      <div
        className={`flex flex-col flex-grow ${
          isSidebarVisible ? "md:ml-1/4 lg:ml-1/4 xl:ml-1/5 2xl:ml-1/6" : ""
        }`}
      >
        <main className="flex-grow p-4 overflow-auto flex justify-center">
          <div className="max-w-2xl w-full">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-100">
              Rina AI
            </h1>
            <div className="space-y-6">
              {responses.map((res, index) => (
                <div key={index}>
                  <div className="flex justify-end">
                    <Card
                      variant="bordered"
                      className="max-w-xl bg-blue-700 text-white border-gray-600"
                    >
                      <CardBody className="whitespace-pre-wrap">
                        {res.message}
                      </CardBody>
                    </Card>
                  </div>
                  <Spacer y={1} />
                  <div className="flex justify-start">
                    <Card
                      variant="bordered"
                      className="max-w-xl bg-gray-700 text-gray-300 border-gray-600"
                    >
                      <CardBody className="whitespace-pre-wrap">
                        {res.aiResponse}
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex gap-2">
                            <Button
                              isIconOnly
                              className="bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600 rounded-sm"
                              onClick={() => handleCopy(res.aiResponse)}
                              disabled={!res.aiResponse}
                            >
                              <MdContentCopy size={"2em"} color="white" />
                            </Button>
                            <Button
                              isIconOnly
                              className="bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600 rounded-sm"
                              onClick={() => handleRegenerate(index)}
                            >
                              <MdRefresh color="white" size={"2em"} />
                            </Button>
                          </div>
                        </div>
                        <Divider className="bg-gray-100 mt-4" />
                        <p className="text-gray-500 mt-2">
                          Tokens Used:{" "}
                          {res.usage ? res.usage.total_tokens : "N/A"}
                        </p>
                        <p className="text-gray-500">
                          Prompt Tokens:{" "}
                          {res.usage ? res.usage.prompt_tokens : "N/A"}
                        </p>
                        <p className="text-gray-500">
                          Completion Tokens:{" "}
                          {res.usage ? res.usage.completion_tokens : "N/A"}
                        </p>
                        <p className="text-gray-500">
                          Total Time:{" "}
                          {res.usage
                            ? res.usage.total_time.toFixed(3) + "s"
                            : "N/A"}
                        </p>
                        <p className="text-gray-500">
                          Prompt Time:{" "}
                          {res.usage
                            ? res.usage.prompt_time.toFixed(3) + "s"
                            : "N/A"}
                        </p>
                        <p className="text-gray-500">
                          Completion Time:{" "}
                          {res.usage
                            ? res.usage.completion_time.toFixed(3) + "s"
                            : "N/A"}
                        </p>
                      </CardBody>
                    </Card>
                  </div>
                  <Spacer y={1} />
                </div>
              ))}
            </div>
          </div>
        </main>
        <div className="p-4 border-t border-gray-700 bg-gray-800 relative z-10">
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here"
              fullWidth
              minRows={1}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={loading}
              aria-label="Message Input"
              className="bg-gray-700 text-gray-300 border-gray-600"
            />
            <Button
              onClick={handleSubmit}
              isLoading={loading}
              color="primary"
              auto
              className="bg-blue-600 hover:bg-blue-700 border-gray-600"
            >
              {loading ? "Processing..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
