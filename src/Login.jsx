import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

const getKoreanErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "이메일 또는 비밀번호가 일치하지 않습니다.";
    case "auth/network-request-failed":
      return "네트워크 연결이 원활하지 않습니다.";
    case "auth/invalid-email":
      return "올바른 이메일 형식이 아닙니다.";
    case "auth/too-many-requests":
      return "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
    default:
      return "로그인 중 오류가 발생했습니다.";
  }
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginState, setLoginState] = useState("로그아웃됨");
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 성공");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      alert(getKoreanErrorMessage(err.code));
      setPassword("");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("로그아웃 성공");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoginState("로그인됨");
      setCurrentUser(user);
    } else {
      setLoginState("로그아웃됨");
      setCurrentUser(null);
    }
  });
    return unsubscribe;
  },[]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Google 로그인 성공");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
      <button onClick={handleLogin}>로그인</button>
      <button onClick={handleLogout}>로그아웃</button>
      <button onClick={handleGoogleLogin}>Google 로그인</button>
      <div>로그인 상태: {loginState} / 사용자 이메일: {currentUser?.email || "없음"}</div>

    </div>
  );
}