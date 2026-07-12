import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SignupScreen({ onGoLogin, onSignupSuccess }) {
  const [step, setStep] = useState("form"); // "form" | "verify"
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.email || !form.username || !form.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { username: form.username },
        },
      });

      if (signUpError) throw signUpError;

      // Success
      onSignupSuccess(data.user);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        .signup-root {
          min-height: 100vh;
          background: #070B14;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Background glow blobs */
        .signup-root::before {
          content: '';
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(0, 180, 255, 0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .signup-root::after {
          content: '';
          position: absolute;
          bottom: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(0, 210, 255, 0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .signup-card {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 1;
        }

        /* Logo */
        .signup-logo {
          text-align: center;
          margin-bottom: 40px;
        }

        .signup-logo-text {
          font-size: 42px;
          font-weight: 700;
          letter-spacing: -1px;
          color: #fff;
          text-shadow:
            0 0 20px rgba(0, 200, 255, 0.8),
            0 0 40px rgba(0, 200, 255, 0.4),
            0 0 80px rgba(0, 200, 255, 0.2);
        }

        .signup-logo-sub {
          font-size: 13px;
          color: rgba(0, 200, 255, 0.6);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-top: 4px;
          font-weight: 300;
        }

        /* Title */
        .signup-title {
          font-size: 22px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 6px;
        }

        .signup-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 32px;
          font-weight: 300;
        }

        /* Form */
        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group {
          position: relative;
        }

        .input-label {
          font-size: 11px;
          font-weight: 500;
          color: rgba(0, 200, 255, 0.7);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 7px;
          display: block;
        }

        .signup-input {
          width: 100%;
          background: rgba(0, 180, 255, 0.05);
          border: 1px solid rgba(0, 180, 255, 0.15);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 15px;
          font-family: 'Outfit', sans-serif;
          color: #fff;
          outline: none;
          transition: all 0.2s ease;
        }

        .signup-input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .signup-input:focus {
          border-color: rgba(0, 200, 255, 0.5);
          background: rgba(0, 180, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(0, 200, 255, 0.08), 0 0 20px rgba(0, 200, 255, 0.05);
        }

        /* Error */
        .signup-error {
          font-size: 13px;
          color: #ff6b6b;
          background: rgba(255, 107, 107, 0.08);
          border: 1px solid rgba(255, 107, 107, 0.2);
          border-radius: 10px;
          padding: 10px 14px;
          text-align: center;
        }

        /* Button */
        .signup-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 4px;
          background: linear-gradient(135deg, #00c8ff, #0088cc);
          color: #fff;
          box-shadow: 0 0 20px rgba(0, 200, 255, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3);
          letter-spacing: 0.3px;
        }

        .signup-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 0 30px rgba(0, 200, 255, 0.5), 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .signup-btn:active:not(:disabled) {
          transform: translateY(0px);
        }

        .signup-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Divider */
        .signup-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 8px 0;
        }

        .signup-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .signup-divider-text {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          font-weight: 400;
        }

        /* Social buttons */
        .social-btn {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
        }

        .social-btn:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.18);
          color: #fff;
        }

        .social-row {
          display: flex;
          gap: 10px;
        }

        .social-row .social-btn {
          flex: 1;
        }

        /* Login link */
        .signup-login-row {
          text-align: center;
          margin-top: 28px;
          font-size: 14px;
          color: rgba(255,255,255,0.35);
        }

        .signup-login-link {
          color: #00c8ff;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          margin-left: 4px;
          transition: opacity 0.2s;
        }

        .signup-login-link:hover {
          opacity: 0.8;
        }

        /* Spinner */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          margin-right: 8px;
          vertical-align: middle;
        }

        /* Fade in */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .signup-card {
          animation: fadeUp 0.4s ease forwards;
        }
      `}</style>

      <div className="signup-root">
        <div className="signup-card">

          {/* Logo */}
          <div className="signup-logo">
            <div className="signup-logo-text">wavo</div>
            <div className="signup-logo-sub">meet people around you</div>
          </div>

          <div className="signup-title">Create your account</div>
          <div className="signup-subtitle">Join thousands of people connecting nearby</div>

          <form className="signup-form" onSubmit={handleSignup}>

            <div className="input-group">
              <label className="input-label">Username</label>
              <input
                className="signup-input"
                type="text"
                name="username"
                placeholder="your_username"
                value={form.username}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                className="signup-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                className="signup-input"
                type="password"
                name="password"
                placeholder="min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            {error && <div className="signup-error">{error}</div>}

            <button className="signup-btn" type="submit" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <div className="signup-divider">
              <div className="signup-divider-line" />
              <div className="signup-divider-text">or continue with</div>
              <div className="signup-divider-line" />
            </div>

            <div className="social-row">
              <button type="button" className="social-btn">
                {/* Facebook */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                Facebook
              </button>
              <button type="button" className="social-btn">
                {/* Apple */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Apple
              </button>
            </div>

          </form>

          <div className="signup-login-row">
            Already have an account?
            <span className="signup-login-link" onClick={onGoLogin}>Sign in</span>
          </div>

        </div>
      </div>
    </>
  );
}