import React, { useState, useEffect } from "react";
import api from "../../../config/axios";
import { Button, Modal, Table, Form, Input, Popconfirm, Select } from "antd";
import { toast } from "react-toastify";

function ManageKoiFish() {
  const [datas, setDatas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  //Get
  const fetchData = async () => {
    try {
      const response = await api.get(`v1/fish`);
      console.log(response.data.result.data);
      setDatas(response.data.result.data);
    } catch (err) {
      toast.error(err.response.data.result.data);
    }
  };

  const handleSubmit = async (values) => {
    console.log(values);

    try {
      setLoading(true);

      if (values._id) {
        // update
        const response = await api.put(
          `v1/fish/updateKoi/${values._id}`,
          values
        );
      } else {
        const response = await api.post("v1/fish/createKoi", values);
      }

      toast.success("Successfully saved!");
      fetchData();
      form.resetFields();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response.data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (_id) => {
    try {
      await api.delete(`v1/fish/deleteKoi/${_id}`);
      toast.success("Successfully deleted!");
      fetchData();
    } catch (err) {
      toast.error(err.response.data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const elementMap = {
    1: "Earth",
    2: "Metal",
    3: "Water",
    4: "Wood",
    5: "Fire",
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Koi Name",
      dataIndex: "koiName",
      key: "koiName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "20%",
      render: (text) => {
        // Set a limit for the description length
        const maxLength = 35; // Adjust the length as needed
        return text.length > maxLength
          ? `${text.slice(0, maxLength)}...`
          : text;
      },
    },
    {
      title: "Colors",
      dataIndex: "colors",
      key: "colors",
    },

    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} alt="Koi" style={{ width: 100, height: "auto" }} />
      ),
    },

    {
      title: "Element",
      dataIndex: "elementID",
      key: "elementID",
      render: (elementID) => elementMap[elementID] || "Unknown",
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (_id, koi) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setShowModal(true);
              form.setFieldsValue(koi);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete"
            description="Do you want to delete this Koi?"
            onConfirm={() => handleDelete(_id)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  return (
    <div>
      <Button
        onClick={() => {
          form.resetFields(); // Clear form fields when adding a new member
          setShowModal(true);
        }}
      >
        Add
      </Button>
      <Table dataSource={datas} columns={columns}></Table>

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        title="Create Koi"
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="koiName"
            label="Koi Name"
            rules={[
              { required: true, message: "Please enter the Koi fish name!" },
            ]}
          >
            <Input placeholder="Enter the name of the Koi fish" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter the description!" },
            ]}
          >
            <Input.TextArea placeholder="Enter a description of the Koi fish" />
          </Form.Item>

          <Form.Item
            name="colors"
            label="Colors"
            rules={[
              {
                required: true,
                message: "Please enter the colors of the Koi fish!",
              },
            ]}
          >
            <Input placeholder="Enter the colors of the Koi fish" />
          </Form.Item>
          <Form.Item
            name="elementID"
            label="Element"
            rules={[{ required: true, message: "Please select an element!" }]}
          >
            <Select placeholder="Select an element">
              <Select.Option value="1">Earth</Select.Option>
              <Select.Option value="2">Metal</Select.Option>
              <Select.Option value="3">Water</Select.Option>
              <Select.Option value="4">Wood</Select.Option>
              <Select.Option value="5">Fire</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="image"
            label="Image"
            rules={[{ required: true, message: "Please enter the image!" }]}
          >
            <Input placeholder="Enter the path or URL of the image" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageKoiFish;
