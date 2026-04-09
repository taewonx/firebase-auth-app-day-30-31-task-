import { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const getKoreanErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "이미 사용 중인 이메일입니다.";
    case "auth/weak-password":
      return "비밀번호는 6자 이상 입력해주세요.";
    case "auth/network-request-failed":
      return "네트워크 연결이 원활하지 않습니다.";
    case "auth/invalid-email":
      return "올바른 이메일 형식이 아닙니다.";
    case "auth/too-many-requests":
      return "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
    default:
      return "회원가입 중 오류가 발생했습니다.";
  }
};

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("회원가입 성공");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      alert(getKoreanErrorMessage(err.code));
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
      <button onClick={handleRegister}>회원가입</button>
    </div>
  );
}

