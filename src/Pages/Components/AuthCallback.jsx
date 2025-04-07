import { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const error = query.get("error");
    const state = query.get("state");

    if (error) {
      navigate("/start?error=auth_failed");
      return;
    }

    // ✅ Decode state and validate it
    let fromAuth = false;
    try {
      const stateObj = JSON.parse(atob(state));
      fromAuth = stateObj.fromAuth;
      const savedState = localStorage.getItem("oauth_state");
      if (savedState !== stateObj.random) {
        throw new Error("Invalid state value");
      }
    } catch (e) {
      console.error("State mismatch or decoding error", e);
      navigate("/start?error=auth_failed");
      return;
    }

    // ✅ If code exists and state is valid, exchange for token
    if (code) {
      axios
        .post("http://localhost:4000/auth/token", { code })
        .then((res) => {
          localStorage.setItem("access_token", res.data.access_token);
          navigate(`/start?auth_success=true&fromAuth=${fromAuth}`);
        })
        .catch(() => {
          navigate(`/start?error=auth_failed&fromAuth=${fromAuth}`);
        });
    }
  }, [location, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      Authorizing with Todoist...
    </div>
  );
};

export default AuthCallback;
