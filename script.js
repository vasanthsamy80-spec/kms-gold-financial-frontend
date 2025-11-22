const wrapper = document.querySelector('.wrapper');
const loginLinks = document.querySelectorAll('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');

const API_URL = "https://kms-gold-financial-3.onrender.com";

// ---------- FORM SWITCH HANDLER ----------
function showForm(formClass) {
    document.querySelectorAll(".form-box").forEach(f =>
        f.classList.remove("active-box")
    );
    document.querySelector("." + formClass).classList.add("active-box");
}

// Open popup → show login
btnPopup.addEventListener("click", () => {
    wrapper.classList.add("active-popup");
    showForm("login");
});

// Register link
registerLink.addEventListener("click", () => {
    showForm("register");
});

// Both login links
loginLinks.forEach(link =>
    link.addEventListener("click", () => {
        showForm("login");
    })
);

// Forgot password link
forgotPasswordLink.addEventListener("click", () => {
    showForm("forgot-password");
});

// Close popup
iconClose.addEventListener("click", () => {
    wrapper.classList.remove("active-popup");
});


// ---------- REGISTER API ----------
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("registerEmail").value.trim();
  const phone = document.getElementById("registerPhone").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, phone, password }),
  });

  const data = await response.json();

  if (response.ok) {
    alert("Registration successful!");
    showForm("login");
  } else {
    alert(data.message || "Registration failed");
  }
});


// ---------- LOGIN API ----------
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailOrPhone = document.getElementById("emailOrPhone").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!emailOrPhone || !password) {
    alert("Email/Phone and password required");
    return;
  }

  const isEmail = emailOrPhone.includes("@");
  const body = isEmail
    ? { email: emailOrPhone, password }
    : { phone: emailOrPhone, password };

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      alert("Login successful!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", emailOrPhone);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Invalid login");
    }
  } catch (err) {
    console.error(err);
    alert("Error occurred");
  }
});


// ---------- FORGOT PASSWORD API ----------
document.getElementById("forgotPasswordForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailOrPhoneRaw = document.getElementById("resetEmailOrPhone").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();

  if (!emailOrPhoneRaw || !newPassword) {
    alert("Enter Email/Phone and New Password");
    return;
  }

  const isEmail = emailOrPhoneRaw.includes("@");

  const body = isEmail
    ? { email: emailOrPhoneRaw, newPassword }
    : { phone: emailOrPhoneRaw, newPassword };

  try {
    const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Password reset successful!");
      showForm("login");

      document.getElementById("resetEmailOrPhone").value = "";
      document.getElementById("newPassword").value = "";
    } else {
      alert(data.message || "Password reset failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error occurred");
  }
});
