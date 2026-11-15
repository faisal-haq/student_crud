// ===== Config =====
// Spring Boot backend ka URL. Port alag ho to yahin change karo.
const BASE_URL = "";

const API = {
  create: `${BASE_URL}/api/student_info/create`,
  get:    (rollno) => `${BASE_URL}/api/student_info/get/${encodeURIComponent(rollno)}`,
  update: (rollno) => `${BASE_URL}/api/student_info/update/${encodeURIComponent(rollno)}`,
  // NOTE: delete endpoint tumne nahi diya tha - ye assumed hai, backend ke hisaab se change karo
  remove: (rollno) => `${BASE_URL}/api/student_info/delete/${encodeURIComponent(rollno)}`
};

const FIELDS = ["name", "age", "rollno", "email", "course", "department", "domain", "year"];

// ===== Helpers =====
const msgBox = document.getElementById("message");

function showMessage(text, type) {
  msgBox.textContent = text;
  msgBox.className = "message " + type; // success ya error
}
function clearMessage() { msgBox.className = "message hidden"; }

// Form se JSON object banata hai (age aur year ko number me convert karke)
function formToObject(form) {
  const data = {};
  FIELDS.forEach((f) => {
    let v = form.elements[f].value.trim();
    data[f] = (f === "age" || f === "year") ? Number(v) : v;
  });
  return data;
}

// Common fetch wrapper: error aaye to readable message throw karta hai
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (status ${res.status})`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null; // empty body handle
}

// ===== Page 2 logic (sirf students.html par chalega) =====
if (document.querySelector(".menu")) {

  // 4 buttons: click par sirf related section dikhao
  document.querySelectorAll(".menu-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".section").forEach((s) => s.classList.add("hidden"));
      document.querySelectorAll(".menu-btn").forEach((b) => b.classList.remove("active"));
      document.getElementById(btn.dataset.target).classList.remove("hidden");
      btn.classList.add("active");
      clearMessage();
    });
  });

  // 1) UPLOAD -> POST
  document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await request(API.create, { method: "POST", body: JSON.stringify(formToObject(e.target)) });
      showMessage("Student data upload ho gaya!", "success");
      e.target.reset();
    } catch (err) {
      showMessage("Upload failed: " + err.message, "error");
    }
  });

  // 2) VIEW -> GET
  document.getElementById("viewForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const out = document.getElementById("viewResult");
    out.innerHTML = "";
    try {
      const s = await request(API.get(document.getElementById("viewRollno").value.trim()));
      clearMessage();
      const rows = FIELDS.map((f) => `<tr><td>${f.toUpperCase()}</td><td>${s[f] ?? "-"}</td></tr>`).join("");
      out.innerHTML = `<table>${rows}</table>`;
    } catch (err) {
      showMessage("Student nahi mila: " + err.message, "error");
    }
  });

  // 3) UPDATE step 1 -> GET karke form fill karo
  const updateForm = document.getElementById("updateForm");
  document.getElementById("fetchForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const s = await request(API.get(document.getElementById("updateRollno").value.trim()));
      FIELDS.forEach((f) => { updateForm.elements[f].value = s[f] ?? ""; });
      updateForm.classList.remove("hidden");
      clearMessage();
    } catch (err) {
      updateForm.classList.add("hidden");
      showMessage("Student nahi mila: " + err.message, "error");
    }
  });

  // 3) UPDATE step 2 -> PUT
  updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = formToObject(updateForm);
    try {
      await request(API.update(data.rollno), { method: "PUT", body: JSON.stringify(data) });
      showMessage("Student data update ho gaya!", "success");
    } catch (err) {
      showMessage("Update failed: " + err.message, "error");
    }
  });

  // 4) DELETE -> DELETE
  document.getElementById("deleteForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const rollno = document.getElementById("deleteRollno").value.trim();
    if (!confirm(`Roll no ${rollno} delete karna hai?`)) return;
    try {
      await request(API.remove(rollno), { method: "DELETE" });
      showMessage("Student delete ho gaya!", "success");
      e.target.reset();
    } catch (err) {
      showMessage("Delete failed: " + err.message, "error");
    }
  });
}
