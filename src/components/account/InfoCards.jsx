import { customerFetch } from "@/utils/helpers";
import { message } from "antd";
import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";



const InfoCards = ({ user, setUser, handleUpdate }) => {
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
            <input
              type="text"
              placeholder="Street and house number"
              className="p-2 border rounded w-full"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress((s) => ({ ...s, street: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="City"
              className="p-2 border rounded w-full"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress((s) => ({ ...s, city: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="State"
              className="p-2 border rounded w-full"
              value={newAddress.state}
              onChange={(e) =>
                setNewAddress((s) => ({ ...s, state: e.target.value }))
              }
            />

            <input
              type="text"
              placeholder="Postal Code"
              className="p-2 border rounded w-full"
              value={newAddress.postalCode}
              onChange={(e) =>
                setNewAddress((s) => ({ ...s, postalCode: e.target.value }))
              }
            />

            <input
              type="text"
              placeholder="Country"
              className="p-2 border rounded w-full"
              value={newAddress.country}
              onChange={(e) =>
                setNewAddress((s) => ({ ...s, country: e.target.value }))
              }
            />

            <input
              type="text"
              placeholder="Mobile Number"
              className="p-2 border rounded w-full"
              value={newAddress.alternateNumber}
              onChange={(e) =>
                setNewAddress((s) => ({ ...s, alternateNumber: e.target.value }))
              }
            />

            <select
              className="p-2 border rounded w-full"
              value={newAddress.active}
              onChange={(e) =>
                setNewAddress((s) => ({
                  ...s,
                  active: e.target.value === "true",
                }))
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default InfoCards;
