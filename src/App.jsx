import Register from "./Register";
import Login from "./Login";
import { useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";


export default function App() {
  const [users, setUsers] = useState([]);

  // 데이터 추가 함수
  const addUser = async () => {
    if (!auth.currentUser) return alert("로그인이 필요합니다!");
    
    try {
      await addDoc(collection(db, "users"), {
        uid: auth.currentUser.uid,
        name: "테스트 유저",
        email: auth.currentUser.email,
        createdAt: new Date()
      });
      alert("데이터 저장 완료!");
      fetchUsers(); // 저장 후 목록 갱신
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // 데이터 조회 함수
  const fetchUsers = async () => {
    const q = collection(db, "users");
    const querySnapshot = await getDocs(q);
    const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userList);
  };

  return (
    <div>
      <div>
        <h1>DAY 30 task: Firebase Auth App</h1>
        <Register />
        <Login />
      </div>
      <div>
        <h1>DAY 31 task: Firebase Hosting & Firestore 보안</h1>
        <button onClick={addUser}>내 정보를 Firestore에 저장</button>
        <button onClick={fetchUsers}>사용자 목록 가져오기</button>
        <ul>
          {users.map(u => (
            <li key={u.id}>이메일: {u.email} / 가입날짜: {u.createdAt?.toDate().toLocaleString()}</li>
          ))}
        </ul>
      </div>
    </div>
  )
};