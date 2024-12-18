// Import necessary React hooks and components.
import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useAuth } from "../provider/AuthProvider";// Custom authentication context/provider.
import { useNavigate } from "react-router-dom";// Navigation for routing.
import { useMutation } from "@tanstack/react-query";// React Query for handling API mutations.
import { signin } from "../services/mutation/auth";// Service for signing in.
import { ISessionData } from "../interfaces/auth.interface";// Interface for session data.
import { IUser } from "../interfaces/user.interface";// Interface for user data.
import LoginImage from "../assets/scnhs-bg.jpg";// Background image for the login page.
import ScnhsLogo from "../assets/scnhs-logo.jpg";// SCNHS logo for branding.

// Interface for the login payload structure.
interface Payload {
  username: string;// Username input from the user.
  password: string; // Password input from the user.
}

// Functional component for the Login page.
const Login: React.FC = () => {
  // Local state to manage error messages.
  const [error, setError] = useState(false);
  // Hook for programmatic navigation.
  const navigate = useNavigate();
  // Destructure session data and login method from the custom AuthProvider.
  const { session: {user}, login } = useAuth();
  console.log("Session", user); // Log current session data for debugging.

  // Effect to handle redirection if the user is already logged in.
  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        navigate("/admin"); // Redirect to admin dashboard.
      } else if (user.role === "USER") {
        navigate("/user"); // Redirect to user dashboard.
      }
    }
    //logout();
  }, [user, navigate]);

   // Define the mutation for signing in.
  const { mutate, isPending} = useMutation({
    mutationFn: async (payload: Payload) => {
      return await signin(payload); // API call to perform sign-in.
    },
    onSuccess: (data: ISessionData) => {
      const token = data?.token;// Extract token from the response.
      const user = data?.user;// Extract user details from the response.
      login(String(token), user as IUser);// Store token and user data in the AuthProvider.
      
      // Redirect based on user role.
      if(user?.role === "ADMIN") {
        navigate("/admin");
      } else if(user?.role === "USER") {
        navigate("/user");
      }
    },
    onError: (error: any) => {
      setError(error.message);// Display error message on failure.
    },
  });

  // Function to handle form submission.
  const submit = async (payload: Payload) => {
    mutate(payload);// Trigger the mutation with the provided payload.
  };

  return (
    <>
    {/* Main container for the login page. */}
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-300">
      <div className="w-[800px] flex rounded-[20px] shadow-lg bg-white p-0">
        <div className="w-full">{/* Left section with a background image. */}
          <img src={LoginImage} alt="" className="w-full h-full object-cover rounded-[20px]" />
        </div>

        {/* Right section with login form and branding. */}
        <div className="w-full flex flex-col items-center p-5">
          {/* Logo and heading for branding. */}
          <img src={ScnhsLogo} alt="" className="w-40" />
          <h1 className="font-semibold text-2xl mb-5">Alumni System</h1>
          {/* Login form with Ant Design components. */}
          <div className="w-full">
            <Form onFinish={submit} layout="vertical">
              {error && (
                <p className="mb-2 text-red-500">
                  {error}
                </p>
              )}

              {/* Input for username. */}
              <Form.Item name="username">
                <Input size="large" placeholder="username"/>
              </Form.Item>

              {/* Input for password. */}
              <Form.Item name="password">
                <Input.Password type="password" placeholder="password" autoComplete="off" size="large"/>
              </Form.Item>

              {/* Submit button with loading state. */}
              <Button
                type="primary"
                title="Login using credentials"
                htmlType="submit"
                className="w-full"
                size="large"
                loading={isPending}
                disabled={isPending}
              >
                LOGIN
              </Button>
            </Form>
          </div>
          {/* Registration link for users without an account. */}
          <div className="mt-10 text-gray-500">Don't have an account? 
            <span className="cursor-pointer text-blue-500 hover:text-gray-500" onClick={() =>navigate("/register")}> Register</span>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Login;
