document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem("userEmail");
    const role  = localStorage.getItem("userRole");

    // If no login, redirect back
    if (!email || !role) {
        window.location.href = "login.html";
        return;
    }

    // Show name/role in header
    document.getElementById("user-info").textContent = `Welcome, ${email} (${role})`;

    // Hide admin-only menu for non-admin
    if (role !== "admin") {
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");
    }
});

// Called by Logout button
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
