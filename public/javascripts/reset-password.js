


document.getElementById("resetForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const password = e.target.password.value;

    const res = await fetch(`/reset/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
    });

    const data = await res.json();
      document.getElementById("message").innerText = data.message;
    });
  