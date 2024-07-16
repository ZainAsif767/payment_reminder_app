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
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { database, auth, logout, messaging } from "../../firebase/firebase";
import Powerbutton from "../../assets/power-icon.svg";
import { PaymentCard } from "./PaymentCard";
import { AddPaymentCard } from "./AddPaymentCard";
import { getToken } from "firebase/messaging";

export const Dashboard = () => {
  const [name, setName] = useState("");
  const [docId, setDocId] = useState<string>("");
  const [payments, setPayments] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDocs();
    requestPermission();
  }, [docId]);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    console.log(permission);
    if (permission === "denied") {
      console.error("Notification permission denied");
      return;
    }
    if (permission === "default") {
      console.warn("User did not grant Permission");
      return;
    }
    if (docId)
      try {
        const token = await getToken(messaging, {
          vapidKey:
            "BF1tVVetk1cdNgYb8Hfaa_fzVOuNGmWYkOIILgxF7CEKvYXxOrb2eXOIA34mcU2TJcAUTqdgMLAhQuR-ukHB2gg",
        });
        localStorage.setItem("firebaseMessagingToken", token);
        const docRef = doc(database, `users/${docId}`);
        const res = await setDoc(docRef, { fcmToken: token }, { merge: true });
      } catch (error) {
        console.error(error);
      }
  }

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
      alert("An error occured while fetching user data");
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
    const signout = confirm("Do you want to signout?");
    if (signout) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="w-full min-h-screen	 absolute bg-slate-400">
      <header className="w-full bg-slate-800 py-2 text-lg text-gray-100 capitalize flex justify-between items-center">
        <span className="pl-6">Welcome, {name?.split(" ")[0]}</span>
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
              <AddPaymentCard
                docId={`users/${docId}`}
                fetchUserDocs={fetchUserDocs}
              />
            </div>
          </div>
        ) : (
          <div className="w-full absolute flex justify-center mt-60">
            <AddPaymentCard
              docId={`users/${docId}`}
              fetchUserDocs={fetchUserDocs}
            />
          </div>
        )}
      </main>
    </div>
  );
};
