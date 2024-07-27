/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { setDoc, doc } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import { toast } from "../utils/swal";

export const EditPaymentCard = ({
  props,
  fetchUserDocs,
  showModal,
  setShowModal,
}) => {
  const [title, setTitle] = useState(props.title);
  const [desc, setDesc] = useState(props.description);
  const [paymentStatus, setPaymentStatus] = useState(props.paymentStatus);
  const [minDate, setMinDate] = useState("");
  const [date, setDate] = useState(() => {
    const givenDate = new Date(props.dueDate?.seconds * 1000);
    const year = givenDate.getFullYear();
    let month: number | string = givenDate.getMonth() + 1;
    if (month < 10) month = `0${month}`;
    let day: number | string = givenDate.getDate();
    if (day < 10) day = `0${day}`;
    return `${year}-${month}-${day}`;
  });

  useEffect(() => {
    if (!date) return;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month: number | string = currentDate.getMonth() + 1;
    let day: number | string = currentDate.getDate();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    const minDate = `${year}-${month}-${day}`;
    setMinDate(minDate);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);

    try {
      const changingData = {
        title,
        description: desc,
        paymentStatus,
        dueDate: new Date(date),
      };
      const docRef = doc(database, "payment", props.id);
      await setDoc(docRef, changingData, { merge: true });
      fetchUserDocs();

      toast.fire({
        icon: "success",
        text: "Payment Updated Successfully!",
      });
    } catch (err) {
      console.error(err.message);

      toast.fire({
        icon: "error",
        text: "Failed to update payment details.",
        confirmButtonColor: "#f44336",
      });
    }
  };

  return (
    <div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <form
                className="border-0 rounded-lg shadow-lg relative flex flex-col w-auto max-sm:w-11/12 mx-auto bg-white outline-none focus:outline-none"
                onSubmit={(e) => handleSubmit(e)}
              >
                {/*header*/}
                <div className="text-center p-5 border-b border-solid border-slate-200 rounded-t text-black">
                  <h3 className="text-3xl font-semibold mx-12">
                    Edit Your Payment
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="mb-6">
                    <label
                      htmlFor="title"
                      className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
                    >
                      Title
                    </label>
                    <input
                      type="title"
                      id="title"
                      className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="My First Payment"
                      required
                      defaultValue={title}
                      onChange={(e) => setTitle(() => e.target.value)}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Description..."
                      onChange={(e) => setDesc(() => e.target.value)}
                      required
                      defaultValue={desc}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="date"
                      className="block mb-2 text-lg font-medium text-gray-900 dark:text-black"
                    >
                      Due Date
                    </label>
                    <div className="relative max-w-sm">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-500 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <input
                        type="date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Select date"
                        onChange={(e) => setDate(() => e.target.value)}
                        defaultValue={date}
                        // min={minDate}
                      />
                    </div>
                    <div className="text-black mt-4 -mb-10 flex content-start items-center gap-1">
                      <input
                        type="checkbox"
                        name="payment"
                        style={{
                          width: "16px",
                          height: "16px",
                        }}
                        onChange={(e) =>
                          setPaymentStatus(() => e.target.checked)
                        }
                        defaultChecked={paymentStatus}
                      />
                      <label htmlFor="payment"> Payment Completed</label>
                    </div>
                    <br></br>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b gap-8">
                  <button
                    className="bg-red-500 text-white  active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};
