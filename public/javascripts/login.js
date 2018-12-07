const loginFormEl = document.getElementById('login-form');
loginFormEl.addEventListener('submit', function (e) {
    console.log("On form submit");
    e.preventDefault();  // cancel page reload
    const formData = new FormData(e.target);
    const bodyData = new URLSearchParams(formData);
    fetch("/auth/login", { method: 'POST', body: bodyData })
        .then(x => x.json())

        .then(authResult => {
            if(!authResult.user) return Promise.reject(new Error("Invalid data"));
            console.log(authResult);
            const jwt = authResult.token;
            localStorage.setItem("jwt", jwt);  // save JWT
        })
        .then(() => window.location.replace("/"))
        .catch(() => {
            window.location.replace("/auth/login");
        });
});
