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

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        console.log(error);
        alert("Login failed");
      } else {
        // Check if the user exists in the 'user' table
        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("*")
          .eq("email", form.email)
          .single();

        if (userError) {
          console.log(userError);
        } else if (!userData) {
          // User does not exist, insert them
          const { error: insertError } = await supabase
            .from("user")
            .insert([{ email: form.email }]);

          if (insertError) {
            console.log(insertError);
            alert("Failed to create user in the database");
          }
        }

        alert("Sukses");
        navigate("/admin");
      }
    } catch (error) {
      console.log(error);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full p-4"
      >
        <Card className="bg-gray-800">
          <CardHeader className="text-center">
            <h1 className="text-3xl font-bold text-white">Login</h1>
          </CardHeader>
          <Divider />
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
                  <p className="text-red-500 text-sm mt-2">{errors.email}</p>
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
                  <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                )}
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
  );
}
