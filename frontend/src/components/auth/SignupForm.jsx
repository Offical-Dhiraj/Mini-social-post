import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "./AuthLayout";
import Input from "../common/Input";
import Button from "../common/Button";

import useAuth from "../../hooks/useAuth";

const SignupForm = () => {
  const navigate = useNavigate();

  const { signup } = useAuth();

  const [formData, setFormData] =
    useState({
      username: "",
      email: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setError(
        "Please fill in all fields."
      );

      return;
    }

    setLoading(true);

    try {
      await signup(formData);

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join the community and start sharing posts."
      footerText="Already have an account?"
      footerLinkText="Login"
      footerLinkTo="/login"
    >

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        {error && (
          <div className="form-alert">
            {error}
          </div>
        )}

        <Input
          label="Username"
          name="username"
          type="text"
          placeholder="Enter your username"
          value={
            formData.username
          }
          onChange={
            handleChange
        }
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={
            formData.email
          }
          onChange={
            handleChange
          }
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={
            formData.password
          }
          onChange={
            handleChange
          }
          required
        />

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating account..."
            : "Create account"}
        </Button>

      </form>

    </AuthLayout>
  );
};

export default SignupForm;