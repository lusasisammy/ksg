document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const demoAccounts = {
        manager: { email: "manager@ksg.com", password: "manager123" },
        deputy:  { email: "deputy@ksg.com",  password: "deputy123" },
        admin:   { email: "admin@ksg.com",   password: "admin123" },
        guest:   { email: "guest@ksg.com",   password: "guest123" }
    };

    // Manual login (just stores email & generic role)
    form.addEventListener("submit", e => {
        e.preventDefault();
        localStorage.setItem("userEmail", email.value.trim());
        localStorage.setItem("userRole", "custom");
        window.location.href = "index.html";
    });

    // Demo buttons
    document.querySelectorAll(".demo-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const role = btn.dataset.role;
            const acc  = demoAccounts[role];
            localStorage.setItem("userEmail", acc.email);
            localStorage.setItem("userRole", role);
            window.location.href = "index.html";
        });
    });
});
