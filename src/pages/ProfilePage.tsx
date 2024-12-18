import { useEffect, useState } from "react";
import { Avatar, Button, Form, Input, notification, Select, Spin, Typography } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateProfile } from "../services/mutation/auth";
import { getProfile } from "../services/query/user";
import Navbar from "../component/Navbar";
import { UploadOutlined } from "@ant-design/icons";
import { useAuth } from "../provider/AuthProvider";
import { BASE_URL } from "../utils/axios-config";

interface Payload {
  username: string;
  password: string;
  batch: number;
  contact: string;
  employmentStatus: string;
  job: string;
  address: string;
  firstname: string;
  lastname: string;
  role: "ADMIN" | "USER";
}

const ProfilePage: React.FC = () => {
  const { session: { user } } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const employmentOptions = [
    { label: "Employed", value: "Employed" },
    { label: "Self-employed", value: "Self-employed" },
    { label: "Unemployed", value: "Unemployed" },
    { label: "Student", value: "Student" },
  ];
  const [employmentStatus, setEmploymentStatus] = useState<string>("");

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(String(user?.id)),
  });

  useEffect(() => {
    if (profile?.image) {
      setPreviewUrl(BASE_URL + "/uploads/" + profile.image);
    }
  }, [profile]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (profile) {
      form.setFieldsValue(profile);
      setEmploymentStatus(profile.employmentStatus);
    }
  }, [profile, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      const preview = URL.createObjectURL(selectedFile);
      setPreviewUrl(preview);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: FormData) => updateProfile(payload),
    onSuccess: () => {
      notification.success({
        message: "Success",
        description: "Profile has been updated!",
      });
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  const submit = (values: Payload) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "job" && employmentStatus !== "Employed") {
        formData.append(key, employmentStatus); // Use employment status for job
      } else if (key !== "job") {
        formData.append(key, (values as any)[key]);
      }
    });
    if (file) formData.append("image", file);
    formData.append("role", user?.role || "");
    formData.append("id", user?.id || "");
    formData.append("job", employmentStatus !== "Employed" ? employmentStatus : values.job);
    mutate(formData);
  };

  return (
    <div className="w-full bg-slate-200 min-h-screen">
      <Navbar />
      {isProfileLoading ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="w-full flex justify-center py-8">
          <div className="bg-white shadow-md rounded-lg p-8 w-[90%] max-w-[600px]">
            <div className="flex flex-col items-center mb-6">
              <Typography.Title level={3} className="text-center">
                Profile
              </Typography.Title>
              <div className="relative">
                <label htmlFor="file-input">
                <Avatar
                  size={150}
                  src={previewUrl || undefined}
                  style={{ borderRadius: "8px" }}
                  className="cursor-pointer hover:opacity-90 transition shadow-md"
                >
                  {!previewUrl && <UploadOutlined />}
                </Avatar>
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
            <Form
              onFinish={submit}
              layout="vertical"
              form={form}
              initialValues={profile}
            >
              {error && <Typography.Text type="danger">{error}</Typography.Text>}
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="username"
                  label="Username"
                  className="col-span-2 sm:col-span-1"
                  rules={[{ required: true, message: "Username is required" }]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  className="col-span-2 sm:col-span-1"
                  rules={[{ required: true, message: "Password is required" }]}
                >
                  <Input.Password autoComplete="off" size="large" />
                </Form.Item>
                <Form.Item
                  name="firstname"
                  label="First Name"
                  className="col-span-2 sm:col-span-1"
                  rules={[{ required: true, message: "First Name is required" }]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  name="lastname"
                  label="Last Name"
                  className="col-span-2 sm:col-span-1"
                  rules={[{ required: true, message: "Last Name is required" }]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  name="batch"
                  label="Year Graduated"
                  className="col-span-2 sm:col-span-1"
                  rules={[
                    { required: true, message: "Year graduated is required" },
                    { 
                      validator: (_, value) => {
                        const currentYear = new Date().getFullYear();
                        if (value < 1900 || value > currentYear) {
                          return Promise.reject(new Error(`Please enter a year between 1900 and ${currentYear}`));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input type="number" min="1900" max={new Date().getFullYear()} size="large" />
                </Form.Item>
                <Form.Item
                  name="contact"
                  label="Mobile number"
                  className="col-span-2 sm:col-span-1"
                  rules={[
                    { required: true, message: "Mobile number is required" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Mobile number must be exactly 10 digits",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    addonBefore="+63"
                    maxLength={10}
                    minLength={10} 
                  />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Current Address"
                  className="col-span-2 sm:col-span-1"
                  rules={[{ required: true, message: "Address is required" }]}
                >
                  <Input size="large" />
                </Form.Item>
                <Form.Item
                  name="employmentStatus"
                  label="Employment Status"
                  className="col-span-2 sm:col-span-1"
                  rules={[
                    { required: true, message: "Employment status is required" },
                  ]}
                >
                  <Select
                    options={employmentOptions}
                    size="large"
                    onChange={(value) => setEmploymentStatus(value)}
                    placeholder="Select employment status"
                  />
                </Form.Item>
                {employmentStatus === "Employed" && (
                    <Form.Item
                      name="job"
                      label="Job/Profession"
                      className="col-span-2 sm:col-span-1"
                      rules={[
                        { required: employmentStatus === "Employed", message: "Job is required" },
                      ]}
                    >
                      <Input size="large" disabled={employmentStatus !== "Employed"} />
                    </Form.Item>
                )}
              </div>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full mt-4"
                size="large"
                loading={isPending || isProfileLoading}
              >
                Update
              </Button>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
