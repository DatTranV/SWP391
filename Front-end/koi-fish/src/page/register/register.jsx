// eslint-disable-next-line no-unused-vars
import React from "react";
// import "./register.scss";
import { useState } from "react";
import { Button, Divider, Form, Input, Select } from "antd";
// import Link from "antd/es/typography/Link";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
const { Option } = Select; // Thay đổi ở đây

function RegisterPage() {
  const [name, setName] = useState();
  const [gender, setGender] = useState();
  const [Year, setYear] = useState();
  const [email, setEmail] = useState();
  const [Phone, setPhone] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const handleRegister = async (values) => {
    //submit xuong backend
    try {
      values.role = "CUSTOMER"; //cho nay dang de tam la customer de test
      const response = await api.post("/v1/auth/register", values);
      toast.success("Successfully register new account!");
      navigate("/login");

    } catch (err) {
      // console.log
      toast.error(err.response.data);
    }
  };
   const handleLogin = async (values) => {
     try {
       const response = await api.post("/v1/auth/login", values);
       console.log(values);
       console.log(response.data);
       const { admin, accessToken } = response.data;

       localStorage.setItem("token", accessToken);
       localStorage.setItem("user", JSON.stringify(response.data));
       if (admin) {
         navigate("/dashboard");
       } else {
         navigate("");
       }
     } catch (err) {
       toast.err(err.response.data);
     }
   };

   const handleLoginSuccess = (response) => {
     const token = jwtDecode(response.credential);
     console.log(token);
     sendTokenToAPI(token);
     // Bạn có thể gửi mã token để xác thực ở backend
   };

   const handleLoginError = () => {
     console.log("Login Failed");
   };

   const sendTokenToAPI = async (data) => {
     console.log(import.meta.env.API_SIGNIN);

     try {
       const response = await api.post(
         "http://localhost:8081/v1/Oauth/signin",
         {
           data: data, // Gửi token trong body của request
         }
       );
       const { accessToken } = response.data;

       console.log("API Response:", response.data);
       if (response.data) {
         localStorage.setItem("token", accessToken);
         localStorage.setItem("user", JSON.stringify(response.data));

         navigate("/?status=login_gg_success", {
           state: { message: JSON.stringify(response.data.message) },
         });
       }
     } catch (error) {
       toast.error("Error");
     }
   };


  return (
    <div className="w-full h-full flex items-center min-h-screen bg-cover bg-center bg-no-repeat bg-[url('https://res.cloudinary.com/ddqgjy50x/image/upload/v1726740184/live-koi-fish-mtvpcoc3yknxrj5g_fsuwik.jpg')]">
      <div className="w-full max-w-2xl lg:max-w-3xl bg-white mx-auto rounded-3xl my-14">
        <div className="px-20 ">
          <h1 className="text-3xl font-normal mb-4 text-center mt-7">
            Sign up
          </h1>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_ClIENT_ID}>
            <div className="App">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
            </div>
          </GoogleOAuthProvider>
          <div className="divider mt-9">
            <Divider style={{ marginTop: "0" }}>
              <span className="font-light">OR</span>
            </Divider>
          </div>
        </div>
        <div className="px-28 ">
          <Form labelCol={{ span: 24 }} onFinish={handleRegister}>
            <Form.Item
              name="userName"
              label={<span className="text-[#716767] pb-0">Username</span>}
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input onChange={(e) => setName(e.target.value)} />
            </Form.Item>
            <Form.Item
              name="name"
              label={<span className="text-[#716767] pb-0">Full Name</span>}
              rules={[
                { required: true, message: "Please input your full name!" },
              ]}
            >
              <Input onChange={(e) => setName(e.target.value)} />
            </Form.Item>
            <div className="flex space-x-4">
              <Form.Item
                name="gender"
                label={<span className="custom-label">Gender</span>}
                className="w-1/2"
                rules={[{ required: true, message: "Please select gender!" }]}
              >
                <Select
                  placeholder="Select"
                  onChange={(value) => setGender(value)}
                >
                  <Option value="0">Male</Option>
                  <Option value="1">Female</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="birthDate"
                label={<span className="custom-label">Year of birth</span>}
                className="w-1/2"
                rules={[
                  {
                    required: true,
                    message: "Please input your year of birth!",
                  },
                  {
                    validator: (_, value) => {
                      if (value && isNaN(Number(value))) {
                        return Promise.reject(
                          new Error("Year of birth must be a number!")
                        );
                      }
                      const year = Number(value);
                      if (year < 1900 || year > 2050) {
                        return Promise.reject(
                          new Error(
                            "Year of birth must be between 1900 and 2050!"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  placeholder="YYYY"
                  onChange={(e) => setYear(e.target.value)}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="email"
              label={<span className="custom-label">Email address</span>}
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item
              name="phone"
              label={<span className="custom-label">Phone number</span>}
              rules={[
                {
                  required: true,
                  message: "Please Input Your Phone Number!",
                },
                {
                  validator: (_, value) => {
                    const phoneRegex = /^[0-9]{10}$/;
                    if (!phoneRegex.test(value)) {
                      return Promise.reject(
                        new Error(
                          "Please enter a valid phone number with 10 digits!"
                        )
                      );
                    }

                    // Nếu tất cả các điều kiện đều hợp lệ
                    return Promise.resolve();
                  },
                },
              ]}
              validateTrigger={["onBlur", "onPressEnter"]}
            >
              <Input onChange={(e) => setPhone(e.target.value)} />
            </Form.Item>
            <Form.Item
              name="password"
              label={<span className="custom-label ">Password</span>}
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },

                {
                  min: 6,
                  max: 20,
                  message: "Password must be between 6 and 20 characters!",
                },
              ]}
              hasFeedback
            >
              <Input.Password onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>
            <Form.Item
              name="c_password"
              label={<span className="custom-label ">Confirm password</span>}
              rules={[
                {
                  required: true,
                  message: "Please input your Confirm password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>
            <Form.Item style={{ marginTop: "28px" }}>
              <Button
                className="mt-5"
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  border: "none",
                  borderRadius: "2rem",
                  width: "100%",
                  height: "50px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "red")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "gray")
                }
              >
                Sign up
              </Button>
            </Form.Item>
            <div className="link-login mb-5 mt-5">
              <Link to="/login">
                Already have Account?{" "}
                <span className="underline text-red-500 ">Go to Login!</span>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
