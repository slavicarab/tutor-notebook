
document.getElementById("forgotForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = e.target.email.value;
    console.log("Email submitted:", email);

    try {
        const res = await fetch("/reset/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        const data = await res.json();
        console.log("Response from server:", data);
        document.getElementById("message").innerText = data.message || "Check your email.";
    } catch (err) {
        document.getElementById("message").innerText = "Something went wrong.";
        console.error(err);
      }
    });
  