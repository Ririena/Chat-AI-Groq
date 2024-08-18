import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Divider,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../libs/supabase";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";
import { Helmet } from "react-helmet-async";
export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleRegister = () => {
    navigate("/register");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!form.email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email harus diisi",
      }));
      setIsSubmitting(false);
      return;
    }

    if (!form.password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password harus diisi",
      }));
      setIsSubmitting(false);
      return;
    }

    try {
      // Authenticate the user
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

      if (authError) {
        console.log(authError);
        toast.error("Error: " + authError.message, {
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
        setIsSubmitting(false);
        return;
      }

      // Check if the user exists in the 'user' table
      const { data: userData, error: userError } = await supabase
        .from("user")
        .select("*")
        .eq("email", form.email)
        .maybeSingle();

      if (userError) {
        console.log(userError);
        toast.error("Error checking user in database: " + userError.message, {
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
        setIsSubmitting(false);
        return;
      }

      if (!userData) {
        // User does not exist, insert them
        const { error: insertError } = await supabase
          .from("user")
          .insert([{ email: form.email }]);

        if (insertError) {
          console.log(insertError);
          toast.error(
            "Failed to create user in the database: " + insertError.message,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Bounce,
            }
          );
          setIsSubmitting(false);
          return;
        }
      }

      toast.success("Login successful, redirecting...", {
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
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Unexpected error: " + error.message, {
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
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  return (
    <>
     <Helmet>
        <title>Rina AI, Login</title>
        <link rel="canonical" href="https://rina-ai.vercel.app/login" />
        <meta
          name="description"
          content="Rina AI Login "
        />
        <meta
          name="keywords"
          content="Rina AI, Rina AI Login, AI rina login, login rina ai, Vercel App, vercel app, Rina AI vercel app, rina ai, rina ai 2, rina ai adlin, rina ai ariena, SMKN 7 Baleendah, rina ai smkn 7 baleendah, AI Rina vercel app, ai rina, "
        />
      </Helmet>
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full p-6  rounded-lg"
        >
          <Card className="bg-gray-800 rounded-lg shadow-md p-4">
            <CardHeader className="text-center mb-4">
              <h1 className="text-2xl font-bold text-white">Login</h1>
            </CardHeader>

            <Divider className="bg-gray-400 mb-4" />

            <CardBody>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <Input
                    clearable
                    underlined
                    fullWidth
                    placeholder="Enter Your Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    color={errors.email ? "error" : "primary"}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="mb-6">
                  <Input
                    clearable
                    underlined
                    fullWidth
                    placeholder="Enter Your Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    color={errors.password ? "error" : "primary"}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="text-center mb-4">
                  <p
                    onClick={handleRegister}
                    className="text-white cursor-pointer hover:underline"
                  >
                    Didn't Register Yet?
                  </p>
                </div>

                <Button
                  type="submit"
                  color="primary"
                  auto
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
