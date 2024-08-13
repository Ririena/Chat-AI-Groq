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

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

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

    if (form.password !== form.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Password tidak cocok",
      }));
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) {
        console.log(error);
        alert("Registration failed");
      } else {
        alert("Registration successful! Please check your email to confirm.");
        navigate("/login");
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
            <h1 className="text-3xl font-bold text-white">Register</h1>
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
              <div className="mb-6">
                <Input
                  clearable
                  underlined
                  fullWidth
                  placeholder="Confirm Your Password"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  color={errors.confirmPassword ? "error" : "primary"}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                color="primary"
                auto
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
