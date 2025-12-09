import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Collapse, Modal, Radio, message } from "antd";
import Image from "next/image";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { customerFetch, ordersFetch } from "@/utils/helpers";

const CheckoutModal = ({ open, setOpen }) => {
  const { user_info, cart, setCart, setUserInfo, handleUpdateUser } = useUser();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  // LOAD RAZORPAY SCRIPT
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onerror = () =>
      message.error("Failed to load Razorpay. Refresh and try again.");
    document.body.appendChild(script);
    console.log("cart", cart);
    
  }, []);

  // CALCULATE TOTAL
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + Number(item.price) * Number(item.quantity);
    }, 0);
  };

  // HANDLE PAYMENT SUCCESS → BACKEND VERIFY
  const handlePaymentSuccess = async (paymentResponse, orderData) => {
    setLoading(true);
    try {
      const verificationPayload = {
        razorpay_order_id: orderData.razorpayOrderId,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        idempotencyKey: localStorage.getItem("idempotencyKey"),
        orderRequest: {
          items: cart.map((item) => ({
            productId: item.productId,
            variantId: item?.variantId || null,
            quantity: item.quantity,
            title: item.title,
            attributes:item.attributes,
            options: item.options,
            media: item.image,
          })),
          paymentMethod: "RAZORPAY",
          address: user_info.addresses[selectedAddressIndex],
        },
      };

      const response = await customerFetch.post(
        "/payment/verify",
        verificationPayload
      );

      if (response.data?.success) {
        message.success("Order placed successfully!");

        setCart([]);
        const updatedUser = await handleUpdateUser({...user_info, cartItems: []})
        setUserInfo(updatedUser);
      }
    } catch (error) {
      console.error(error);
      message.error("Payment verification failed.");
    } finally {
      setLoading(false);
      setOpen(false)
    }
  };

  // INITIALIZE RAZORPAY POPUP
  const initializeRazorpay = async (orderData) => {
    if (!window.Razorpay) {
      message.error("Razorpay not loaded. Refresh and try again.");
      return;
    }

    // console.log("order data", orderData?.amount);
    // return;
    

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: "INR",
      name: "ALADDIN",
      description: `Order for ${cart.length} item(s)`,
      order_id: orderData.razorpayOrderId,

      handler: (response) => {
        handlePaymentSuccess(response, orderData);
      },

      prefill: {
        name:
          user_info?.name ||
          user_info?.addresses[selectedAddressIndex]?.firstName ||
          "",
        email:
          user_info?.email ||
          user_info?.addresses[selectedAddressIndex]?.email ||
          "",
        contact:
          user_info?.phoneNumber ||
          user_info?.addresses[selectedAddressIndex]?.phoneNumber ||
          "",
      },

      notes: {
        address: user_info?.addresses[selectedAddressIndex],
        items: cart,
      },

      theme: {
        color: "#000000",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.error("Payment failed:", response);
      message.error("Payment failed. Try again.");
    });

    razorpay.open();
  };

  // MAIN PLACE ORDER HANDLER
  const handlePlaceOrder = async () => {
    if (selectedAddressIndex === null)
      return message.warning("Select address required");
    if (!paymentMethod) return message.warning("Select payment method");

    // COD HANDLER
    if (paymentMethod === "CASH_ON_DELIVERY") {
      setLoading(true);
      try {
        const orderPayload = {
          items: cart.map((item) => ({
            productId: item.productId,
            media:item?.productMedias[0]?.url,
            title:item.title,
            variantId: item?.variantId || null,
            quantity: item.quantity,
            attributes:item.attributes,
            options: item.options,
            media: item.image,
          })),
          paymentMethod: "CASH_ON_DELIVERY",
          address: user_info.addresses[selectedAddressIndex],
        };

        const response = await ordersFetch.post("/create", orderPayload);

        if (response.data) {
          message.success("Order placed successfully!");
          setCart([]);
          const updatedUser = await handleUpdateUser({...user_info, cartItems: []})
          setUserInfo(updatedUser);
          setOpen(false);
        }
      } catch (err) {
        console.error(err);
        message.error("Failed to place order.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // RAZORPAY PAYMENT FLOW
    if (paymentMethod === "RAZORPAY") {
      setLoading(true);

      try {
        const totalAmount = calculateTotal();
        const idempotencyKey = crypto.randomUUID();
        localStorage.setItem("idempotencyKey", idempotencyKey);
        console.log("total amount", totalAmount);
        

        const res = await customerFetch.post("/payment/create-order", null, {
          params:{
              amount: totalAmount,
              currency: "INR",  
            },
              headers: {
              "Idempotency-Key": idempotencyKey
            }
        });

        const backendOrder = res.data?.data;

        await initializeRazorpay({
          razorpayOrderId: backendOrder.orderId,
          amount: backendOrder.amount,
          currency: backendOrder.currency,
        });
      } catch (err) {
        console.error(err);
        message.error("Failed to initialize payment.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      title={<h1 className="font-michroma text-xl font-bold">ALADDIN</h1>}
      open={open}
      onCancel={() => setOpen(false)}
      centered
      footer={[
        <button
          key="place-order"
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full p-4 border text-white bg-black rounded-md disabled:opacity-50"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>,
      ]}
    >
      <div className="w-full font-slussen flex flex-col h-[80vh] overflow-auto hide-scrollbar gap-2">
        {/* ORDER SUMMARY */}
        <Collapse
          size="large"
          items={[
            {
              key: "1",
              label: (
                <div className="font-semibold text-lg flex justify-between">
                  <h1>Order Summary</h1>
                  <h1>
                    ₹
                    {calculateTotal().toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </h1>
                </div>
              ),
              children: (
                <div className="flex flex-col gap-2 p-0">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start border rounded-md p-1 gap-2 justify-between"
                    >
                      <Image
                        src={item.image}
                        alt="product"
                        width={40}
                        height={40}
                        className="rounded-md shadow-sm object-cover"
                      />

                      <div className="flex flex-col gap-1 w-8/12">
                        <p className="text-sm font-semibold">{item.title}</p>

                        <div className="text-xs flex gap-1">
                          {item.options?.map((o, i) => (
                            <span key={i}>• {o}</span>
                          ))}
                        </div>

                        <p className="text-xs">
                          Qty: <strong>{item.quantity}</strong>
                        </p>
                      </div>

                      <div className="w-2/12 text-end">
                        <span className="text-sm font-bold">
                          ₹
                          {(item.price * item.quantity).toLocaleString(
                            "en-IN",
                            { minimumFractionDigits: 2 }
                          )}
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
          {user_info?.addresses?.map((address, idx) => (
            <div key={idx} className="flex flex-col rounded-md border p-2">
              <div className="flex justify-between">
                <h1 className="font-semibold">Home</h1>
                <Radio
                  checked={selectedAddressIndex === idx}
                  onChange={() => setSelectedAddressIndex(idx)}
                />
              </div>

              <p>
                {address.firstName} {address.lastName}
              </p>
              <p className="text-sm">
                {address.houseNumber}, {address.area}, {address.city},{" "}
                {address.state} - {address.pincode}
              </p>

              <p className="text-xs">Email: {address.email}</p>
              <p className="text-xs">Phone: {address.phoneNumber}</p>
            </div>
          ))}
        </div>

        {/* PAYMENT METHOD */}
        <div className="flex flex-col gap-1 rounded-md border p-4">
          <h1 className="font-semibold text-lg">Payment options</h1>

          <div className="flex  border p-2 rounded-md">
            <Radio
              checked={paymentMethod === "RAZORPAY"}
              onChange={() => setPaymentMethod("RAZORPAY")}
            />
            <p>
              <strong>Pay Now</strong>
              <br />
              <span className="text-xs">UPI / Card / Net Banking</span>
            </p>
          </div>

          <div className="flex  border p-2 rounded-md">
            <Radio
              checked={paymentMethod === "CASH_ON_DELIVERY"}
              onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
            />
            <p>
              <strong>Cash on Delivery</strong>
              <br />
              <span className="text-xs">Pay cash/UPI upon delivery</span>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CheckoutModal;
