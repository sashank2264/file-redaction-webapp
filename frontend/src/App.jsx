import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  if (!user) {
    return showSignup ? (
      <>
        <Signup />
        <div style={{ textAlign: "center" }}>
          <button onClick={() => setShowSignup(false)}>
            Back to Login
          </button>
        </div>
      </>
    ) : (
      <>
        <Login setUser={setUser} />
        <div style={{ textAlign: "center" }}>
          <button onClick={() => setShowSignup(true)}>
            Go to Signup
          </button>
        </div>
      </>
    );
  }

  return <Dashboard user={user} setUser={setUser} />;

}
