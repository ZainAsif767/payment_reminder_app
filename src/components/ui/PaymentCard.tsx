/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import { EditPaymentCard } from "./EditPaymentCard";

export const PaymentCard = ({ props, fetchUserDocs }) => {
  const { title, description, dueDate, paymentStatus } = props;
  const [showModal, setShowModal] = useState(false);

  const transformedDate = new Date(dueDate?.seconds)
    .toString()
    .split(" GMT")[0];

  const handleDelete = () => {
    const docRef = doc(database, "payment", props.id);
    setDoc(docRef, { isDeleted: true }, { merge: true })
      .then((docRef) => {
        console.log("Deletion successful");
        fetchUserDocs();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="max-sm:w-full max-md:w-5/12 max-lg:w-2/6 max-xl:w-2/6 max-2xl:w-3/12 2xl:w-3/12 flex flex-col border-2 border-black rounded p-4 gap-2 ">
      <h3 className="text-2xl font-bold">{title}</h3>
      <h4 className="text-lg font-semibold">{description}</h4>
      <h4 className="text-md font-semibold">
        Payment Status: {paymentStatus ? "Paid" : "Unpaid"}
      </h4>
      <p>{transformedDate}</p>
      <div className="w-full flex justify-between mt-2">
        <button
          className="bg-green-600 border-black border-2 py-1 px-6 rounded"
          onClick={() => setShowModal((s) => !s)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 border-black border-2 py-1 px-6 rounded"
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
