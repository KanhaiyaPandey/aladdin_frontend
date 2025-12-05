import { customerFetch } from "@/utils/helpers";
import { message, Spin } from "antd";
import Modal from "antd/es/modal/Modal";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { Input, Select } from "antd";
import { FcApproval } from "react-icons/fc";
import { LoadingOutlined } from "@ant-design/icons";
import { MdError } from "react-icons/md";

const InfoCards = ({ user, setUser }) => {
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [postalStatus, setPostalStatus] = useState("idle");

  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    houseNumber: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    phoneNumber: "",
    isDefault: false,
  });

  const handleCancel = () => {
    setOpenModal(false);
    resetForm();
  };

  const resetForm = () =>
    setNewAddress({
      firstName: "",
      lastName: "",
      houseNumber: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      email: "",
      phoneNumber: "",
      isDefault: false,
    });

  const handleAddAddress = async () => {
    setConfirmLoading(true);
    console.log("hello");
    

    try {
      const res = await customerFetch.post("/add-address", newAddress);
      setUser(res.data.user);
      message.success("Address added successfully");

      handleCancel();
    } catch (err) {
      console.error("Error adding address:", err);
      message.error("Failed to add address");
    } finally {
      setConfirmLoading(false);
    }
  };

  const verifyPincode = async (pincode) => {
    if (!pincode || pincode.length !== 6) {
      setPostalStatus("error");
      return message.error("Enter a valid 6-digit pincode");
    }

    setPostalStatus("loading");

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (data[0].Status !== "Success" || !data[0].PostOffice?.length) {
        setPostalStatus("error");
        return message.error("Invalid pincode");
      }

      const info = data[0].PostOffice[0];

      setNewAddress((prev) => ({
        ...prev,
        state: info.State,
        city: info.District,
      }));

      setPostalStatus("success");
      message.success("Pincode verified");
    } catch (err) {
      setPostalStatus("error");
      message.error("Failed to verify pincode");
    }
  };

  const getPostalIcon = () => {
    switch (postalStatus) {
      case "loading":
        return <Spin indicator={<LoadingOutlined spin />} size="small" />;
      case "success":
        return <FcApproval size={20} />;
      case "error":
        return <MdError size={20} color="red" />;
      default:
        return null;
    }
  };

  // DELETE ADDRESS
  const deleteAddress = async (addressId) => {
    try {
      const res = await customerFetch.delete(`/delete-address?addressId=${addressId}`);
      setUser(res.data.user);
      message.success("Address deleted");
    } catch (err) {
      console.error(err);
      message.error("Failed to delete address");
    }
  };

  // SET DEFAULT
  const setDefaultAddress = async (addressId) => {
    try {
      const res = await customerFetch.put(`/set-default-address?addressId=${addressId}`);
      setUser(res.data.user);
      message.success("Default address updated");
    } catch (err) {
      console.error(err);
      message.error("Failed to set default address");
    }
  };

  return (
    <div className="px-6 py-3 w-full grid md:grid-cols-3 grid-cols-1 gap-6 mt-10">

      {/* ========================= ORDERS CARD ========================= */}
      <div className="flex flex-col gap-5 w-full border rounded-md p-4 h-auto">
        <h1>Orders</h1>
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex items-center justify-between border-b py-1">
            <p>Total Orders</p>
            <span>06</span>
          </div>
        </div>
      </div>

      {/* ========================= ADDRESS CARD ========================= */}
      <div className="flex flex-col gap-3 w-full border rounded-md p-4">
        <h1>Address</h1>

        {user?.addresses?.length > 0 ? (
          <div className="flex flex-col gap-3 font-slussen">
            {user.addresses.map((address) => (
              <div key={address.addressId} className="border rounded-md p-2">
                <p className=" flex items-center gap-1">
                  <span> {address.firstName}</span>
                  <span> {address.lastName}</span> 
                </p>
                <p className=" text-sm">
                  {address.houseNumber}, {address.area}, {address.city}, {address.state} - {address.pincode}
                </p>

                <p className=" text-xs">Email: {address.email}</p>
                <p className=" text-xs">Phone: {address.phoneNumber}</p>

                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`px-2 py-1 rounded-md ${
                      address.isDefault ? "bg-green-500 text-white" : "bg-gray-300"
                    }`}
                  >
                    {address.isDefault ? "Default" : "Secondary"}
                  </span>

                  <div className="flex gap-4 items-center">
                    <button onClick={() => setDefaultAddress(address.addressId)}>
                      <CiEdit />
                    </button>

                    <button onClick={() => deleteAddress(address.addressId)}>
                      <MdDelete />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No address found.</p>
        )}

        <button
          onClick={() => setOpenModal(true)}
          className="p-2 border bg-black text-white"
        >
          Add Address
        </button>

        {/* ========================= MODAL ========================= */}
        <Modal
          open={openModal}
          onCancel={handleCancel}
          onOk={handleAddAddress}
          confirmLoading={confirmLoading}
          title="Add New Address"
        >
          <div className="flex flex-col gap-4">

            <Input
              placeholder="First Name"
              value={newAddress.firstName}
              onChange={(e) =>
                setNewAddress((s) => ({ ...s, firstName: e.target.value }))
              }
            />

            <Input
              placeholder="Last Name"
              value={newAddress.lastName}
              onChange={(e) =>
                setNewAddress((s) => ({ ...s, lastName: e.target.value }))
              }
            />

            <Input
              placeholder="House Number / Street"
              value={newAddress.houseNumber}
              onChange={(e) =>
                setNewAddress((s) => ({ ...s, houseNumber: e.target.value }))
              }
            />

            <Input
              placeholder="Area / Colony"
              value={newAddress.area}
              onChange={(e) =>
                setNewAddress((s) => ({ ...s, area: e.target.value }))
              }
            />

            <Input
              placeholder="Pincode"
              maxLength={6}
              value={newAddress.pincode}
              suffix={getPostalIcon()}
              onChange={(e) => {
                const value = e.target.value;
                setNewAddress((s) => ({ ...s, pincode: value }));
                if (value.length < 6) setPostalStatus("idle");
              }}
              onBlur={() => verifyPincode(newAddress.pincode)}
            />

            <Input placeholder="City" value={newAddress.city} disabled />
            <Input placeholder="State" value={newAddress.state} disabled />

            <Input
              placeholder="Email"
              value={newAddress.email}
              onChange={(e) =>
                setNewAddress((s) => ({ ...s, email: e.target.value }))
              }
            />

            <Input
              placeholder="Phone Number"
              maxLength={10}
              value={newAddress.phoneNumber}
              onChange={(e) =>
                setNewAddress((s) => ({ ...s, phoneNumber: e.target.value }))
              }
            />

            <Select
              value={newAddress.isDefault}
              onChange={(value) =>
                setNewAddress((s) => ({ ...s, isDefault: value }))
              }
              options={[
                { value: true, label: "Set as Default Address" },
                { value: false, label: "Save as Secondary" },
              ]}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default InfoCards;
