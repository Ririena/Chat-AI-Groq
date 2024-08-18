import React from "react";
import { Button, Input, Card, CardBody, Divider } from "@nextui-org/react";
import { useStashes } from "../libs/useStashes";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const CreateStash = () => {
  const {
    stashName,
    setStashName,
    loading,
    fetching,
    stashesData,
    error,
    handleCreateStash,
  } = useStashes();

  const navigate = useNavigate();
  const handleStashClick = (id) => {
    navigate(`/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>Rina AI</title>
        <link rel="canonical" href="https://rina-ai.vercel.app/" />
        <meta
          name="description"
          content="Rina AI, Sebuah Aplikasi Chat Assistant Yang Ditenagai oleh Groq dan Model Dari Meta"
        />
        <meta
          name="keywords"
          content="Rina AI, Vercel App, vercel app, Rina AI vercel app, rina ai, rina ai 2, rina ai adlin, rina ai ariena, SMKN 7 Baleendah, rina ai smkn 7 baleendah, AI Rina vercel app, ai rina, "
        />
      </Helmet>
      <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col md:flex-row">
        {/* Sidebar Section */}
        <aside className="bg-gray-800 text-gray-100 w-64 p-4 fixed top-0 left-0 h-full overflow-y-auto transition-transform duration-300 transform md:translate-x-0 -translate-x-full md:block hidden">
          <h2 className="text-2xl font-semibold mb-6">Your Existing Stashes</h2>
          <Divider className="my-4 border-gray-600" />
          <div className="flex flex-col gap-4">
            {stashesData.map((stash) => (
              <Card
                key={stash.id}
                isHoverable
                isPressable
                onClick={() => handleStashClick(stash.id)}
                className="cursor-pointer bg-gray-700 hover:bg-gray-600 transition duration-300"
              >
                <CardBody className="p-4">
                  <p className="text-white font-medium">{stash.title}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:ml-64">
          {/* Mobile Existing Stashes */}
          <div className="block md:hidden mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              Your Existing Stashes
            </h2>
            <Divider className="my-4 border-gray-600" />
            <div className="flex flex-col gap-4">
              {stashesData.map((stash) => (
                <Card
                  key={stash.id}
                  isHoverable
                  isPressable
                  onClick={() => handleStashClick(stash.id)}
                  className="cursor-pointer bg-gray-700 hover:bg-gray-600 transition duration-300"
                >
                  <CardBody className="p-4">
                    <p className="text-white font-medium">{stash.title}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-5xl font-bold mb-4">Welcome to Rina AI</h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Rina AI revolutionizes the way you organize and manage your
                notes and messages. Create, manage, and access your stashes
                seamlessly with our intuitive platform.
              </p>
              <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg mx-auto">
                <h2 className="text-3xl font-semibold mb-6">
                  Create Your First Stash
                </h2>
                {error && <div className="text-red-400 mb-4">{error}</div>}
                {fetching ? (
                  <div className="text-center text-gray-400">Loading...</div>
                ) : (
                  <div>
                    <Input
                      clearable
                      underlined
                      placeholder="Enter stash name"
                      value={stashName}
                      onChange={(e) => setStashName(e.target.value)}
                      aria-label="Stash Name"
                      className="mb-4 bg-gray-700 text-gray-200 border-gray-600"
                    />
                    <Button
                      onClick={handleCreateStash}
                      color="primary"
                      auto
                      className="w-full bg-blue-700 hover:bg-blue-800 transition duration-300"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Stash"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-gray-800 text-white py-16 px-4 mt-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Why Choose Rina AI?</h2>
              <p className="text-lg max-w-2xl mx-auto">
                Rina AI provides a powerful and user-friendly way to manage your
                notes. Here’s why you'll love it:
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-xs text-center">
                <h3 className="text-2xl font-semibold mb-4">
                  Easy Organization
                </h3>
                <p>
                  Organize your notes with ease using intuitive features and a
                  clean interface.
                </p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-xs text-center">
                <h3 className="text-2xl font-semibold mb-4">Seamless Access</h3>
                <p>Access your stashes from any device, anywhere, anytime.</p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-xs text-center">
                <h3 className="text-2xl font-semibold mb-4">
                  Secure and Private
                </h3>
                <p>Your data is protected with top-notch security measures.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CreateStash;
