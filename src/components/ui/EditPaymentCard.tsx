import { setDoc, doc } from "firebase/firestore";
import { database } from "../../firebase/firebase";
import { useState } from "react";

export const EditPaymentCard = ({
  props,
  fetchUserDocs,
  showModal,
  setShowModal,
}) => {
  const [title, setTitle] = useState(props.title);
  const [desc, setDesc] = useState(props.description);
  const [paymentStatus, setPaymentStatus] = useState(props.paymentStatus);
  const givenDate = new Date(props.dueDate?.seconds);
  let day = givenDate.getDate();
  let month = givenDate.getMonth() + 1;
  const year = givenDate.getFullYear();

  if (month < 10) month = 0 + month;
  if (day < 10) day = 0 + day;

  const finalDate = year + "-" + month + "-" + day;
  const [date, setDate] = useState(finalDate);
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

      const res = await setDoc(docRef, changingData, { merge: true });
      fetchUserDocs();
      console.log(res);
    } catch (e) {
      console.error(e);
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
                className="border-0 rounded-lg shadow-lg relative flex flex-col w-auto max-sm:w-11/12 mx-auto bg-gray-700 outline-none focus:outline-none"
                onSubmit={(e) => handleSubmit(e)}
              >
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t text-white">
                  <h3 className="text-3xl font-semibold mr-40">
                    Edit Your Payment
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="mb-6">
                    <label
                      htmlFor="title"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Once upon a time in a descriptive payment land"
                      onChange={(e) => setDesc(() => e.target.value)}
                      required
                      defaultValue={desc}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="date"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Due Date
                    </label>
                    <div className="relative max-w-sm">
                      <input
                        type="date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Select date"
                        onChange={(e) => setDate(() => e.target.value)}
                        defaultValue={date}
                      />
                    </div>
                    <div className="text-white mt-4 -mb-10">
                      <input
                        type="checkbox"
                        name="payment"
                        value="paymentStatus"
                        onChange={(e) => setPaymentStatus(() => e.target.value)}
                        defaultChecked={paymentStatus}
                      />
                      <label htmlFor="payment"> Payment Completed</label>
                    </div>
                    <br></br>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
