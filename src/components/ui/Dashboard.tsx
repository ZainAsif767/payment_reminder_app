/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  query,
  collection,
  getDocs,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { database, auth, logout, messaging } from "../../firebase/firebase";
import Powerbutton from "../../assets/power-icon.svg";
import { PaymentCard } from "./PaymentCard";
import { AddPaymentCard } from "./AddPaymentCard";
import { getToken, onMessage } from "firebase/messaging";
import { MySwal, toast } from "../utils/swal";

async function requestPermission(docId) {
  const permission = await Notification.requestPermission();
  if (permission === "denied" || permission === "default") {
    toast.fire({
      icon: "warning",
      text: "Notification permission denied.",
    });
    return;
  }
  if (docId) {
    try {
      const token = await getToken(messaging, {
        vapidKey:
          "BF1tVVetk1cdNgYb8Hfaa_fzVOuNGmWYkOIILgxF7CEKvYXxOrb2eXOIA34mcU2TJcAUTqdgMLAhQuR-ukHB2gg",
      });
      localStorage.setItem("firebaseMessagingToken", token);
      const docRef = doc(database, `users/${docId}`);
      await setDoc(docRef, { fcmToken: token }, { merge: true });
      toast.fire({
        icon: "success",
        text: "Permission granted, you will get notifications about unpaid payments.",
      });
    } catch (error) {
      console.error("Error getting permission for notifications:", error);
      toast.fire({
        icon: "error",
        text: "An error occurred while requesting notification permissions.",
      });
    }
  }
}

export default function Dashboard() {
  const [name, setName] = useState("");
  const [docId, setDocId] = useState<string>("");
  const [payments, setPayments] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDocs();
    requestPermission(docId);
  }, [docId]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      MySwal.fire({
        icon: "error",
        title: "Access Denied",
        text: "you must sign in to continue",
        timer: 10000,
        timerProgressBar: true,
      }).then(() => {
        navigate("/");
      });
    }
    if (error) console.error(error.message);
    fetchUserName();
  }, [user, loading, error]);

  const fetchUserName = async () => {
    try {
      const q = query(
        collection(database, "users"),
        where("uid", "==", user?.uid)
      );
      const doc = await getDocs(q);
      const data = doc.docs[0]?.data();
      setName(() => data?.name);
      setDocId(() => doc.docs[0]?.id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserDocs = async () => {
    try {
      const q = query(collection(database, "payment"));
      const doc = await getDocs(q);
      let userDocs: {
        data: any;
        id: string;
      }[] = doc.docs.filter(
        (d) => d.data().user === `/users/${docId}` && !d.data().isDeleted
      );
      userDocs = userDocs.map((d) => {
        const res = d.data();
        return { ...res, id: d.id };
      });
      setPayments(() => [...userDocs]);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user documents");
    }
  };

  const handleClick = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
        toast.fire("", "signed out successfully!");
      }
    });
  };

  return (
    <div className="w-full min-h-screen	 absolute bg-slate-400">
      <header className="w-full bg-slate-800 py-2 text-lg text-gray-100 capitalize flex justify-between items-center">
        <span className="pl-6">Welcome, {name?.split(" ")[0]}</span>
        <div className="contents content-center items-center w-full">
          <AddPaymentCard
            docId={`users/${docId}`}
            fetchUserDocs={fetchUserDocs}
          />
        </div>
        <button onClick={() => handleClick()}>
          <img
            className="my-4 mr-8"
            src={Powerbutton}
            alt="logout"
            width={25}
            height={25}
            style={{
              filter:
                "invert(100%) sepia(96%) saturate(15%) hue-rotate(307deg) brightness(106%) contrast(103%)",
            }}
          />
        </button>
      </header>
      <main className="w-full mb-4">
        {payments.length > 0 ? (
          <div className="w-11/12 mt-4 mx-auto">
            <div className="w-full mx-auto flex flex-wrap gap-8 ">
              {payments.map((payment) => (
                <PaymentCard
                  props={payment}
                  key={payment.id}
                  fetchUserDocs={fetchUserDocs}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full absolute flex justify-center mt-60">
            <h1>There are no payments, try creating one.</h1>
          </div>
        )}
      </main>
    </div>
  );
}
