import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tabs, Avatar, Input, notification, Table, Typography, Spin, Button } from "antd";
import { CheckCircleOutlined, DeleteOutlined, LikeOutlined, SearchOutlined } from "@ant-design/icons";
import Navbar from "../component/Navbar";
import { getAllUsers } from "../services/query/user";
import { approved, deleteUser } from "../services/mutation/auth";
import { useAuth } from "../provider/AuthProvider";
import { IUser } from "../interfaces/user.interface";
import { BASE_URL } from "../utils/axios-config";

const AdminUserPage: React.FC = () => {
  const { session: { user } } = useAuth();
  const { Title, Text } = Typography;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    enabled: !!user?.id,
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [batchFilter, setBatchFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"approved" | "pending">("pending");

  const filteredData = data?.filter((item) => {
    const matchesName =
      !searchTerm ||
      item?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.firstname?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = batchFilter
      ? item?.batch?.toString()?.includes(batchFilter)
      : true;
    const matchesApproval = activeTab === "approved" ? item.isApproved : !item.isApproved;
    return matchesName && matchesBatch && matchesApproval;
  });

  const { mutate: approveUser } = useMutation({
    mutationFn: approved,
    onSuccess: () => {
      refetch();
      notification.success({
        message: "Success",
        description: "User has been approved",
      });
    },
    onError: () => {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  const { mutate: deleteUserMutation } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      refetch();
      notification.success({
        message: "Success",
        description: "User has been deleted",
      });
    },
    onError: () => {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    },
  });

  const columns = [
    {
      title: "#",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Name and Profession",
      render: (_text: any, record: IUser) => (
        <div className="flex items-center space-x-3">
          <Avatar
            src={record?.image ? BASE_URL + "/uploads/" + record.image : undefined}
            size={40}
            className="cursor-pointer"
          >
            {record.firstname?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <div>
            <Text className="font-semibold">{`${record?.firstname ?? "N/A"} ${record?.lastname ?? "N/A"}`}</Text>
            <br />
            <Text type="secondary">{record?.job || "No Job Information"}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Contact #",
      dataIndex: "contact",
    },
    {
      title: "Current Address",
      dataIndex: "address",
    },
    {
      title: "Batch",
      dataIndex: "batch",
    },
    {
      title: "Actions",
      render: (_text: any, record: IUser) => (
        <div className="flex space-x-3">
          {!record.isApproved ? (
            <LikeOutlined
              onClick={() => approveUser(record.id)}
              className="text-orange-500 cursor-pointer hover:text-orange-700"
            />
          ) : (
            <CheckCircleOutlined className="text-green-500" />
          )}
          <DeleteOutlined
            onClick={() => deleteUserMutation(record.id)}
            className="text-red-500 cursor-pointer hover:text-red-700"
          />
        </div>
      ),
    },
  ];

  const handlePrint = () => {
    // Create a temporary container for the print content
    const printContent = `
      <div>
        <center>
          <div style="font: bold">St. Christine National High School<br/>
          List of ${activeTab === "approved" ? "Approved" : "Pending"} Users<br/>
          ${batchFilter ? `Batch: ${batchFilter}` : ""}
          </div>
        </center>
        <table border="1" style="margin-top: 20px; width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Profession</th>
              <th>Contact #</th>
              <th>Current Address</th>
              <th>Batch</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData && filteredData.length > 0 && filteredData
              .map(
                (item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.firstname} ${item.lastname}</td>
                  <td>${item.job || "No Job Information"}</td>
                  <td>${item.contact}</td>
                  <td>${item.address}</td>
                  <td>${item.batch}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
    const width = 800;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    // Create a new window with calculated position
    const printWindow = window.open(
      "",
      "_blank",
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    printWindow?.document.write(printContent);
    printWindow?.document.close();
  
    printWindow?.focus();
    printWindow?.print();
    printWindow?.close();
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <Title level={3} className="text-gray-800">
            Alumni Users Management
          </Title>
          <Text type="secondary">Hi, I am William Aranas. Welcome to St.Christine Alumni Portal System.</Text>
        </div>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key as "approved" | "pending");
            setSearchTerm(""); // Clear the search filter
            setBatchFilter(null); // Clear the batch filter
          }}
          className="mb-6"
        >
          <Tabs.TabPane tab="Pending" key="pending" />
          <Tabs.TabPane tab="Approved" key="approved" />
        </Tabs>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 lg:space-x-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            size="large"
            className="w-full md:w-1/2"
          />
          <Input
            prefix={<SearchOutlined />}
            placeholder="Filter by batch"
            onChange={(e) => setBatchFilter(e.target.value)}
            value={batchFilter || ""}
            size="large"
            className="w-full md:w-1/2"
          />
          <Button onClick={handlePrint} type="primary" className="mb-4 h-[39px]">
            Print
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={filteredData}
            columns={columns}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            className="rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default AdminUserPage;
