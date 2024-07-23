/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import { EditPaymentCard } from "./EditPaymentCard";
import { MySwal, toast } from "../utils/swal";

export const PaymentCard = ({ props, fetchUserDocs }) => {
  const { title, description, dueDate, paymentStatus } = props;
  const [showModal, setShowModal] = useState(false);

  const transformedDate = new Date(
    dueDate?.seconds * 1000
  ).toLocaleDateString();

  const handleDelete = () => {
    MySwal.fire({
      title: "Are you sure you?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const docRef = doc(database, "payment", props.id);
        setDoc(docRef, { isDeleted: true }, { merge: true })
          .then(() => {
            toast.fire({
              icon: "success",
              position: "top-right",
              title: "Payment Deleted Successfully",
              toast: true,
              timerProgressBar: true,
            });
            fetchUserDocs();
          })
          .catch((error) => {
            toast.fire({
              icon: "error",
              position: "top-right",
              title: "Error deleting payment",
              toast: true,
              timerProgressBar: true,
            });
            console.log(error);
          });
      }
    });
  };

  return (
    <div className="max-sm:w-full max-md:w-5/12 max-lg:w-47p max-xl:w-30p max-2xl:w-31p 2xl:w-23p flex flex-col  rounded p-6 gap-4 bg-gray-100 shadow-lg">
      <h3 className="text-3xl text-center font-bold text-gray-800"> {title}</h3>
      <h4 className="text-lg font-semibold text-gray-700">{description}</h4>
      <h4 className="text-md font-semibold text-gray-600">
        Payment Status: {paymentStatus ? "Paid" : "Unpaid"}
      </h4>
      <p className="text-gray-500">Due Date: {transformedDate}</p>
      <div className="w-full flex justify-between mt-4">
        <button
          className="bg-green-600 hover:bg-green-700 text-white  py-2 px-6 rounded transition duration-200"
          onClick={() => setShowModal((show) => !show)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white  py-2 px-6 rounded transition duration-200"
          onClick={() => handleDelete()}
        >
          Delete
        </button>
      </div>
      <EditPaymentCard
        showModal={showModal}
        setShowModal={setShowModal}
        props={props}
        fetchUserDocs={fetchUserDocs}
      />
    </div>
  );
};
