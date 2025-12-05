import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Collapse, Modal, Radio } from "antd";
import Image from "next/image";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { customerFetch, ordersFetch } from "@/utils/helpers";

const CheckoutModal = ({ open, setOpen }) => {
  const { user_info, cart } = useUser();

  // FIXED STATES
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // PLACE ORDER HANDLER
  const handlePlaceOrder = async () => {
    if (selectedAddressIndex === null) {
      return alert("Please select an address");
    }

    if (!paymentMethod) {
      return alert("Please select a payment method");
    }

    const orderPayload = {
      items: cart.map((item) => ({
        productId: item.productId,
        variantId: item?.variantId ? item?.variantId : null,
        quantity: item.quantity,
        media: item.image
      })),
      paymentMethod,
      address: user_info.addresses[selectedAddressIndex],
    };

    const response = await ordersFetch.post("/create", orderPayload)
    console.log(response);
    

  };

  return (
    <Modal
      title={<h1 className="font-michroma text-xl font-bold">ALADDIN</h1>}
      open={open}
      onCancel={() => setOpen(false)}
      centered
      onOk={() => setOpen(false)}
      width={{
        xs: "90%",
        sm: "80%",
        md: "70%",
        lg: "60%",
        xl: "50%",
        xxl: "40%",
      }}
      footer={[
        <div className="w-full">
          <button
            onClick={handlePlaceOrder}
            className="w-full p-4 border text-white bg-black rounded-md"
          >
            Place Order
          </button>
        </div>,
      ]}
    >
      <hr className="my-2" />

      <div className="w-full font-slussen flex flex-col h-[80vh] overflow-auto hide-scrollbar gap-2">

        {/* ORDER SUMMARY */}
        <Collapse
          size="large"
          items={[
            {
              key: "1",
              label: (
                <div className="font-semibold text-lg flex items-center justify-between w-full">
                  <h1>Order Summary</h1>
                  <h1>₹1000</h1>
                </div>
              ),
              children: (
                <div className="flex flex-col gap-2 p-0">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start border rounded-md w-full p-1 gap-2 justify-between"
                    >
                      <Image
                        src={item?.image}
                        alt={item?.name || "product image"}
                        width={40}
                        height={40}
                        className="rounded-md shadow-sm object-cover w-1/12"
                      />

                      <div className="flex flex-col gap-1 w-8/12 h-auto">
                        <p className="text-sm font-semibold">{item.title}</p>

                        <div className="text-xs flex gap-0.5">
                          {item?.options?.map((option, idx) => (
                            <span key={idx}>• {option}</span>
                          ))}
                        </div>

                        <p className="font-medium text-xs flex items-center gap-1">
                          <span>Qty:</span>
                          <span>{item.quantity}</span>
                        </p>
                      </div>

                      <div className="w-2/12 flex items-center justify-end flex-col">
                        <span className="text-sm font-bold">
                          ₹
                          {Number(
                            item.price * item.quantity
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />

        {/* ADDRESS SECTION */}
        <div className="flex flex-col gap-1 rounded-md border p-4">
          <h1 className="font-semibold text-lg">Addresses</h1>
          <p className="text-xs mb-3">Select the delivery address</p>

          {user_info?.addresses?.map((address, index) => (
            <div key={index} className="flex flex-col rounded-md border p-2">
              <div className="flex items-center justify-between w-full">
                <h1 className="font-semibold">Home</h1>

                <Radio
                  checked={selectedAddressIndex === index}
                  onChange={() => setSelectedAddressIndex(index)}
                />
              </div>

              <div className="">
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
            </div>
          ))}
        </div>

        {/* PAYMENT SECTION */}
        <div className="flex flex-col gap-1 rounded-md border p-4">
          <h1 className="font-semibold text-lg">Payment options</h1>
          <p className="text-xs mb-3">Select your payment method</p>

          {/* PAY NOW */}
          <div className="flex w-full items-center justify-between rounded-md border p-2">
            <div className="flex items-center gap-2">
              <Radio
                checked={paymentMethod === "RAZORPAY"}
                onChange={() => setPaymentMethod("RAZORPAY")}
              />
              <p className="flex flex-col gap-1">
                <span className="font-bold">Pay Now</span>
                <span className="text-xs">UPI / Card / Net Banking</span>
              </p>
            </div>
          </div>

          {/* COD */}
          <div className="flex w-full items-center justify-between rounded-md border p-2">
            <div className="flex items-center gap-2">
              <Radio
                checked={paymentMethod === "CASH_ON_DELIVERY"}
                onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
              />
              <p className="flex flex-col gap-1">
                <span className="font-bold">Cash on delivery</span>
                <span className="text-xs">
                  Pay cash/UPI upon delivery
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CheckoutModal;
