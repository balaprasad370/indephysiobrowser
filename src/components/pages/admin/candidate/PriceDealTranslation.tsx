import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import { GlobalInfo } from "./../../../../App";
import { ClientContext } from "@/hooks/Clientcontext";
import { FaChevronLeft } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import { io } from "socket.io-client";
import useAuth from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert";

const PriceDealTranslation = ({
  document_id,
  student_id,
  open,
  setOpen,
  numPages,
  document_category_id
}: {
  document_id: string;
  student_id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  numPages: number;
  document_category_id: number;
}) => {
  const context = useContext(GlobalInfo);
  const { clientDetails } = useContext(ClientContext);
  const tokenData = useAuth();
  const { client_id } = useAuth();
  const [orderDetails, setOrderDetails] = useState([]);
  const token = localStorage.getItem("token");

  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [offerDetails, setOfferDetails] = useState({
    offer_amt: ""
  });
  const [orderHistory, setOrderHistory] = useState([]);

  const [openAlert, setOpenAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [socket, setSocket] = useState(null);

  const getOrderDetails = async () => {
    const response = await axios.get(
      `${context.apiEndPoint}admin/candidate/get-order-details/${document_id}/${student_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log(response.data);
    if (response.data.length > 0) {
      setOrderDetails(response.data[0]);
    } else {
      setOrderDetails([]);
    }
  };

  const handleUpdateStatus = async () => {
    const obj = {
      status: alertStatus,
      document_id: document_id,
      student_id: student_id
    };
    try {
      const response = await axios.post(
        `${context.apiEndPoint}admin/candidate/update-order-status`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Order status updated successfully");

      let message = "";
      if (alertStatus == "accept") {
        message = "Order status updated to accepted at the current price";
      } else if (alertStatus == "reject") {
        message = "Order status updated to rejected at the current price";
      }

      const newMessage = {
        translation_doc_id: document_id,
        student_id: student_id,
        client_id: client_id,
        is_student: 0,
        message: message,
        is_file: 0,
        filepath: "",
        message_timestamp: Date.now().toString().slice(0, -3),
        admin_first_name: tokenData.first_name,
        admin_last_name: tokenData.last_name,
        student_first_name: null,
        student_last_name: null,
        is_request_order: 1
      };

      socket.emit("messageToGroupChat", {
        roomName: "indephysio" + document_id + student_id + "room",
        message: newMessage
      });

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleAdjustAmount = async () => {
    const obj = {
      offer_amt: offerDetails.offer_amt,
      reason: offerDetails.reason,
      document_id: document_id,
      student_id: student_id
    };

    try {
      const response = await axios.post(
        `${context.apiEndPoint}admin/candidate/adjust-order-amount`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(
        "Amount adjusted successfully. Waiting for Candidate's approval"
      );

      let message = "Document price adjusted. Reason: " + offerDetails.reason;
      const newMessage = {
        translation_doc_id: document_id,
        student_id: student_id,
        client_id: client_id,
        is_student: 0,
        message: message,
        is_request_order: 1,
        is_file: 0,
        filepath: "",
        message_timestamp: Date.now().toString().slice(0, -3),
        admin_first_name: tokenData.first_name,
        admin_last_name: tokenData.last_name,
        student_first_name: null,
        student_last_name: null
      };

      socket.emit("messageToGroupChat", {
        roomName: "indephysio" + document_id + student_id + "room",
        message: newMessage
      });

      setTimeout(() => {
        setShowMakeOffer(false);
        setOpen(false);
      }, 500);
    } catch (error) {
      toast.error("Failed to adjust amount");
      console.log(error);
    }
  };

  const handleGetOrderHistory = async () => {
    try {
      const response = await axios.get(
        `${context.apiEndPoint}admin/candidate/get-adjustment-history/${document_id}/${student_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      setOrderHistory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdminRequestTranslation = async () => {
    try {
      const response = await axios.post(
        `${context.apiEndPoint}admin/student/translations/order/approval`,
        {
          document_id: document_id,
          document_category_id: document_category_id,
          student_id: student_id,
          num_pages: numPages
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      toast.success("Translation requested successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to request translation");
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderDetails();
    handleGetOrderHistory();
    const socket11 = io(context.apiEndPoint);
    setSocket(socket11);
    socket11.emit(
      "joinGroupChat",
      "indephysio" + document_id + student_id + "room"
    );
  }, []);

  return (
    <>
      <Toaster richColors position="top-right" />
      {/* {"order_id":1349,"client_id":8,"translator_client_id":7,"student_id":9,"translation_doc_id":2637,"num_pages":"1","net_amt":"15","paid_amt":"0","is_approved":0,"payment_status":0,"document_status":0,"created_at":"2024-10-12 17:30:23","modified_at":"2024-10-12 17:30:23"} */}

      {orderDetails?.num_pages > 0 ? (
        <div className="flex flex-col gap-4 overflow-y-auto pb-16 pt-8">
          <div className="flex flex-col items-center justify-center ">
            <div className="flex flex-wrap justify-between w-full items-center">
              <p className="text-sm lg:text-lg font-semibold text-gray-700">
                Number of Pages
              </p>
              <p className="text-lg lg:text-2xl font-bold text-black">
                {orderDetails?.num_pages}
              </p>
            </div>
            <div className="flex flex-wrap justify-between w-full items-center">
              <p className="text-sm lg:text-lg font-semibold text-gray-700">
                Price Per Page
              </p>
              <p className="text-lg lg:text-2xl font-bold text-green-600 ">
                <span className="text-xl">€</span>
                {clientDetails.is_translator == 1 ? 15 : 30}
              </p>
            </div>
            <br />
            <div className="flex flex-wrap justify-between w-full items-center">
              <p className="text-sm lg:text-lg font-semibold text-gray-700">
                Estimated Document Price
              </p>
              <p className="text-lg lg:text-2xl font-bold text-green-600 ">
                <span className="text-xl">€</span>
                {clientDetails.is_translator == 1
                  ? orderDetails?.num_pages * 15
                  : orderDetails?.num_pages * 30}
              </p>
            </div>

            {showMakeOffer && (
              <div className="flex flex-col gap-4 w-full my-4">
                <button
                  className="bg-gray-200 max-w-fit text-gray-700 px-4 py-2 rounded-md flex flex-row gap-2 items-center"
                  onClick={() => setShowMakeOffer(false)}
                >
                  <FaChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <label
                  className="text-md break-all text-gray-500"
                  htmlFor="offer_amt"
                >
                  Enter Adjusted Amount in Euros for whole document (€)
                </label>
                <input
                  type="number"
                  placeholder="€"
                  className="border border-gray-300 rounded-md p-2"
                  id="offer_amt"
                  value={offerDetails.offer_amt}
                  onChange={(e) =>
                    setOfferDetails({
                      ...offerDetails,
                      offer_amt: e.target.value
                    })
                  }
                />
                <label className="text-md  text-gray-500" htmlFor="reason">
                  Reason for Adjustment
                </label>
                <textarea
                  placeholder="Enter Reason for Adjustment"
                  className="border border-gray-300 rounded-md p-2"
                  id="reason"
                  value={offerDetails.reason}
                  onChange={(e) =>
                    setOfferDetails({
                      ...offerDetails,
                      reason: e.target.value
                    })
                  }
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => handleAdjustAmount()}
                >
                  Adjust Amount
                </button>
              </div>
            )}

            <div className="flex flex-col gap-4 w-full my-4">
              {orderHistory.length > 0 && (
                <div>
                  <div className="flex flex-col gap-4 w-full">
                    <p className="text-sm lg:text-lg font-semibold text-gray-700">
                      Adjustment History
                    </p>
                  </div>

                  <div className="w-full overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b text-center">
                            Adjusted Amount (€)
                          </th>
                          <th className="py-2 px-4 border-b text-center ">
                            Reason for Adjustment
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderHistory.map((item, index) => (
                          <tr key={index}>
                            <td className="py-2 px-4 border-b text-green-600 font-bold text-center">
                              €{item.adjusted_amount}
                            </td>
                            <td className="py-2 px-4 border-b text-gray-500 text-center">
                              {item.adjustment_reason}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Three buttons 1) Accept 2) Reject 3) Make Offer */}

            {!showMakeOffer && (
              <div className="flex flex-row gap-4 my-4 flex-wrap">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    setOpenAlert(true);
                    setAlertStatus("accept");
                  }}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    setOpenAlert(true);
                    setAlertStatus("reject");
                  }}
                >
                  Reject
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => setShowMakeOffer(true)}
                >
                  Adjust Amount
                </button>
              </div>
            )}
          </div>

          <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to {alertStatus} this order?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleUpdateStatus(alertStatus)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        <div className="flex justify-center flex-col gap-4 items-center h-full">
          <p className="text-lg font-semibold text-gray-500">
            No order details found
          </p>

          <div className="flex flex-col gap-4 items-center justify-center">
            <button
              className=" border border-teal-600 bg-teal-600 text-white px-4 py-2 rounded-md"
              onClick={() => {
                handleAdminRequestTranslation();
              }}
            >
              Request for Translation
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PriceDealTranslation;
