import { customerFetch } from "@/utils/helpers";
import { message, Spin } from "antd";
import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { Input, Select } from "antd";
import { FcApproval } from "react-icons/fc";
import { LoadingOutlined } from '@ant-design/icons';
import { MdError } from "react-icons/md";





const InfoCards = ({ user, setUser, handleUpdate }) => {
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [postalStatus, setPostalStatus] = useState("idle");

  useEffect(() => {

  }, []);

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    alternateNumber: "",
    active: true,
  });

  const handleCancel = () => {
    setOpenModal(false);
    setNewAddress({
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      alternateNumber: "",
      active: true,
    });
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    try {
      const updatedAddresses = Array.isArray(user.addresses)
        ? [...user.addresses, newAddress]
        : [newAddress];

      const updatedUser = {
        ...user,
        addresses: updatedAddresses,
      };
      // Send updated user to backend
      await handleAddressUpdate(updatedUser);
      setUser(updatedUser);
      setOpenModal(false);
      setNewAddress({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        alternateNumber: "",
        active: true,
      });
    } catch (err) {
      console.error("Error adding address:", err);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleAddressUpdate = async (updatedUser) => {
          localStorage.removeItem("user_info");
    try {
      const response = await customerFetch.put("/update-profile", updatedUser);
      setUser(response.data.data);
      message.success("Addresses updated successfully");
    } catch (error) {
      console.error("Error updating addresses:", error);
    }
  }


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
          country: info.Country,
          city: info.District,
        }));

        setPostalStatus("success");
        message.success("Pincode verified ✓");
      } catch (err) {
        console.error(err);
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



  return (
    <div className="px-6 py-3 w-full grid md:grid-cols-3 grid-cols-1 gap-6 mt-10">
      <div className="flex flex-col gap-5 w-full border rounded-md p-4 h-auto">
        <h1>Orders</h1>
        <div className="flex w-full flex-col gap-2">
          <div className="w-full flex items-center justify-between border-b py-1">
            <p>Total Orders</p>
            <span>06</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full border rounded-md p-4 ">
        <h1>Address</h1>

        {user?.addresses?.length > 0 ? (
          <div className="flex w-full flex-col gap-3 font-slussen ">
            {user.addresses.map((address, index) => (
              <div key={index} className=" border rounded-md p-2">
                <p>
                  {address.street}, {address.city}, {address.state} -{" "}
                  {address.postalCode}
                </p>
                <p>{address.country}</p>
                <p>Mobile: {address.alternateNumber}</p>
                <div className=" flex w-full items-center justify-between">
                  <p className=" flex gap-2 items-center">
                    <span>Status:</span>
                    <span className={` px-2 rounded-md ${address.active ? " bg-green-500 text-white" : " bg-slate-400 text-black"} `}>{address.active ? "Active" : "Inactive"}</span>
                   </p>
                  <p className=" flex items-center gap-4">
                    <button><CiEdit/></button>
                    <button><MdDelete/></button>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No address found..</p>
        )}

        <button
          onClick={() => setOpenModal(true)}
          className="p-2 border bg-black text-white"
        >
          Add Address
        </button>

        <Modal
          open={openModal}
          onCancel={handleCancel}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          title="Add New Address"
        >
          <div className="flex flex-col gap-4">

            <Input
              placeholder="Street and house number"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress((s) => ({ ...s, street: e.target.value }))
              }
            />

            <Input
              placeholder="City"
              value={newAddress.city}
          
            />

            {/* PINCODE – triggers verification onBlur */}
           <Input
              placeholder="Postal Code"
              value={newAddress.postalCode}
              maxLength={6}
              suffix={getPostalIcon()}
              onChange={(e) => {
                const value = e.target.value;

                setNewAddress((s) => ({ ...s, postalCode: value }));

                // Reset status while typing
                if (value.length < 6) {
                  setPostalStatus("idle");
                } else {
                  setPostalStatus("loading");
                }
              }}
              onBlur={() => verifyPincode(newAddress.postalCode)}
            />

            {/* AUTO-FILLED STATE */}
            <Input
              placeholder="State"
              value={newAddress.state}
              
            />

            {/* AUTO-FILLED COUNTRY */}
            <Input
              placeholder="Country"
              value={newAddress.country}
              
            />

            <Input
              placeholder="Mobile Number"
              value={newAddress.alternateNumber}
              onChange={(e) =>
                setNewAddress((s) => ({ ...s, alternateNumber: e.target.value }))
              }
            />

            <Select
              value={newAddress.active}
              onChange={(value) =>
                setNewAddress((s) => ({ ...s, active: value }))
              }
              options={[
                { value: true, label: "Active" },
                { value: false, label: "Inactive" },
              ]}
            />

          </div>

        </Modal>
      </div>
    </div>
  );
};

export default InfoCards;
