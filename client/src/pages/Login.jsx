import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Inject reCAPTCHA script
    const script = document.createElement("script");
    script.innerHTML = `(function() {var w = window, C = '___grecaptcha_cfg', cfg = w[C] = w[C] || {}, N = 'grecaptcha';var gr = w[N] = w[N] || {};gr.ready = gr.ready || function(f) {(cfg['fns'] = cfg['fns'] || []).push(f);};w['__recaptcha_api'] = 'https://www.google.com/recaptcha/api2/';(cfg['render'] = cfg['render'] || []).push('6LfY9-4nAAAAAF1XAEEvsum_JdIVnZ-c1VnK2Qz3');(cfg['anchor-ms'] = cfg['anchor-ms'] || []).push(20000);(cfg['execute-ms'] = cfg['execute-ms'] || []).push(30000);w['__google_recaptcha_client'] = true;var d = document, po = d.createElement('script');po.type = 'text/javascript';po.async = true;po.charset = 'utf-8';var v = w.navigator, m = d.createElement('meta');m.httpEquiv = 'origin-trial';m.content = 'A7vZI3v+Gz7JfuRolKNM4Aff6zaGuT7X0mf3wtoZTnKv6497cVMnhy03KDqX7kBz/q/iidW7srW31oQbBt4VhgoAAACUeyJvcmlnaW4iOiJodHRwczovL3d3dy5nb29nbGUuY29tOjQ0MyIsImZlYXR1cmUiOiJEaXNhYmxlVGhpcmRQYXJ0eVN0b3JhZ2VQYXJ0aXRpb25pbmczIiwiZXhwaXJ5IjoxNzU3OTgwODAwLCJpc1N1YmRvbWFpbiI6dHJ1ZSwiaXNUaGlyZFBhcnR5Ijp0cnVlfQ==';if (v && v.cookieDeprecationLabel) {v.cookieDeprecationLabel.getValue().then(function(l) {if (l !== 'treatment_1.1' && l !== 'treatment_1.2' && l !== 'control_1.1') {d.head.prepend(m);}});} else {d.head.prepend(m);}po.src = 'https://www.gstatic.com/recaptcha/releases/79clEdOi5xQbrrpL2L8kGmK3/recaptcha__en.js';po.crossOrigin = 'anonymous';po.integrity = 'sha384-8ttzcqn1x3spzHELLkLBHjQJV6/TydNHFuVP0+hKYrIsPW/qumOm8LQWdez/Qzbi';var e = d.querySelector('script[nonce]'), n = e && (e['nonce'] || e.getAttribute('nonce'));if (n) {po.setAttribute('nonce', n);}var s = d.getElementsByTagName('script')[0];s.parentNode.insertBefore(po, s);})();`;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your auth logic here
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>Algaid<span style={{ color: "#3e8afa" }}>Hub</span></div>
        <h2 style={styles.heading}>Sign In</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.forgotRow}>
            <a href="#" style={{ color: "#3e8afa", fontSize: "13px" }}>Forgot password?</a>
          </div>

          {/* reCAPTCHA badge will appear automatically */}
          <div className="g-recaptcha" data-sitekey="6LfY9-4nAAAAAF1XAEEvsum_JdIVnZ-c1VnK2Qz3" data-size="invisible" />

          <button type="submit" style={styles.submitBtn}>Sign In</button>
        </form>

        <p style={styles.signupText}>
          New to AlgaidHub?{" "}
          <a href="#" style={{ color: "#3e8afa" }}>Sign up now</a>
        </p>

        <p style={styles.recaptchaNotice}>
          This site is protected by reCAPTCHA and the Google{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" style={{ color: "#3e8afa" }}>Privacy Policy</a>{" "}
          and{" "}
          <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" style={{ color: "#3e8afa" }}>Terms of Service</a>{" "}
          apply.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f0f0f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e0-ecd7979cc88b/web/IN-en-20240101-popsignuptwoweeks-perspective_alpha_website_large.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  card: {
    background: "rgba(0,0,0,0.82)",
    borderRadius: "8px",
    padding: "48px 56px",
    width: "100%",
    maxWidth: "440px",
    color: "#fff",
  },
  logo: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "28px",
    color: "#fff",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "28px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  input: {
    height: "50px",
    background: "#333",
    border: "1px solid #444",
    borderRadius: "5px",
    color: "#fff",
    padding: "0 16px",
    fontSize: "15px",
    outline: "none",
    transition: "border 0.2s",
  },
  forgotRow: {
    textAlign: "right",
    marginTop: "-8px",
  },
  submitBtn: {
    height: "50px",
    background: "#3e8afa",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
    transition: "background 0.2s",
  },
  signupText: {
    textAlign: "center",
    marginTop: "24px",
    color: "#aaa",
    fontSize: "14px",
  },
  recaptchaNotice: {
    marginTop: "20px",
    fontSize: "11px",
    color: "#666",
    textAlign: "center",
    lineHeight: "1.5em",
  },
};
