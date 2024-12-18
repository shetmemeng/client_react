import React from "react";
import { Avatar, Badge, Dropdown, Menu, Typography } from "antd";
import { UserOutlined, LogoutOutlined, ProfileOutlined } from "@ant-design/icons";
import { useAuth } from "../provider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getProfile, getUnapprovedUsers } from "../services/query/user";
import { BASE_URL } from "../utils/axios-config";
import { useLocation, useNavigate } from "react-router-dom";
import ScnhsLogo from "../assets/scnhs-logo.jpg";

const Navbar: React.FC = () => {
  const { session: { user }, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data } = useQuery({
    queryKey: ["pending-users"],
    queryFn: getUnapprovedUsers,
    enabled: !!user?.id && user?.role === "ADMIN",
    refetchInterval: 1000,
  });

  const { Text } = Typography;

  const isActive = (path: string) => location.pathname === path;

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === "profile") {
      navigate(user?.role === "ADMIN" ? "/admin/profile" : "/user/profile");
    } else if (e.key === "logout") {
      logout();
      navigate("/");
    }
  };

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(String(user?.id)),
  });

  const profileMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<ProfileOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-white shadow-md sticky top-0 w-full z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="hidden md:flex items-center space-x-4 cursor-pointer" onClick={() => navigate("/")}>
          <img src={ScnhsLogo} alt="SCNHS Logo" className="w-12 h-12 rounded-full" />
          <div className="text-blue-500 text-xl font-bold">AlumniSystem</div>
        </div>

        {/* Navigation Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {[
            ...(user?.role === "ADMIN" ? [{ label: "Alumni", path: "/admin", hasBadge: true }] : []),
            { label: "Events", path: user?.role === "ADMIN" ? "/admin/events" : "/user" },
            { label: "Jobs", path: user?.role === "ADMIN" ? "/admin/jobs" :"/user/jobs" },
            { label: "News & Updates", path: user?.role === "ADMIN" ? "/admin/news": "/user/news" },
          ].map((menuItem) => (
            <Text
              key={menuItem.label}
              className={`cursor-pointer text-sm font-medium ${
                isActive(menuItem.path)
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-700 hover:text-blue-500"
              }`}
              onClick={() => navigate(menuItem.path)}
            >
              {menuItem.hasBadge ? (
                <Badge count={data} offset={[10, 8]} color="red">
                  {menuItem.label}
                </Badge>
              ) : (
                menuItem.label
              )}
            </Text>
          ))}
        </div>
        {/* Small Screen Menu */}
        <div className="sm:block md:hidden">
          <Dropdown
            overlay={
              <Menu>
                {[
                  ...(user?.role === "ADMIN" ? [{ label: "Alumni", path: "/admin", hasBadge: true }] : []),
                  { label: "Events", path: user?.role === "ADMIN" ? "/admin/events" : "/user" },
                  { label: "Jobs", path: user?.role === "ADMIN" ? "/admin/jobs" : "/user/jobs" },
                  { label: "News & Updates", path: user?.role === "ADMIN" ? "/admin/news" : "/user/news" },
                ].map((menuItem) => (
                  <Menu.Item key={menuItem.label} onClick={() => navigate(menuItem.path)}>
                    {menuItem.hasBadge ? (
                      <Badge count={data} offset={[10, 8]} color="red">
                        {menuItem.label}
                      </Badge>
                    ) : (
                      menuItem.label
                    )}
                  </Menu.Item>
                ))}
              </Menu>
            }
            trigger={["click"]}
          >
            <Text className="cursor-pointer text-sm font-medium">Menu</Text>
          </Dropdown>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <Text className="hidden md:block">Welcome, {profile?.firstname || "Guest"}!</Text>
          <Dropdown overlay={profileMenu} trigger={["click"]}>
            {isProfileLoading || !profile?.image ? (
              <Avatar
                className="cursor-pointer"
                size="large"
                icon={<UserOutlined />}
              />
            ) : (
              <Avatar
                className="cursor-pointer"
                size="large"
                src={BASE_URL + "/uploads/" + profile?.image}
              />
            )}
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
