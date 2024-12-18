// Import React and the Navbar component.
import React from "react";
import Navbar from "./Navbar";

// Define the interface for the Layout component's props.
interface LayoutProps {
    children: React.ReactNode; // Represents the child components to be rendered inside the layout.
  }

  // Layout component serves as a wrapper for pages, including shared elements like the Navbar.
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-full bg-gray-100 min-h-screen">
      {/* Render the Navbar component at the top of the layout. */}
      <Navbar />
      <div>{children}</div>
    </div>
  );
};

export default Layout; // Export the Layout component for use across the application.