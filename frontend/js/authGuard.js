const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../pages/index.html";
}
