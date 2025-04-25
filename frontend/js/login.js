const toggleRegister = document.querySelector("#toggle-register");
const toggleLogin = document.querySelector("#toggle-login");

const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");


const errorMessage = document.querySelector("#error-message");
const successMessage = document.querySelector("#success-message");

document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("token")){
        window.location.href = "../pages/dashboard.html";
    }
});

function clearBox(){
    const usernameBox = document.querySelector("#username-register");
    const passwordBox = document.querySelector("#password-register");
    const emailBox = document.querySelector("#email-register");
    const passwordConfirmBox = document.querySelector("#password-confirm")
    const usernameLoginBox = document.querySelector("#username");
    const passwordLoginBox = document.querySelector("#password");

    usernameBox.value = '';
    passwordBox.value = '';
    emailBox.value = '';
    passwordConfirmBox.value = '';
    usernameLoginBox.value = '';
    passwordLoginBox.value = '';
}

toggleRegister.addEventListener("click", (e) =>{
    clearBox()
    registerForm.classList.toggle("hidden");
    loginForm.classList.toggle("hidden");
    errorMessage.innerHTML = "";
    successMessage.innerHTML = ""
})

toggleLogin.addEventListener("click", (e) =>{
    clearBox()
    registerForm.classList.toggle("hidden");
    loginForm.classList.toggle("hidden");
    errorMessage.innerHTML = "";
    successMessage.innerHTML = "";
});

registerForm.addEventListener("submit", async (e) =>{
    e.preventDefault();

    const username = document.querySelector("#username-register").value;
    const password = document.querySelector("#password-register").value;
    const email = document.querySelector("#email-register").value;
    const passwordConfirm = document.querySelector("#password-confirm").value;
    if(password !== passwordConfirm){
        errorMessage.innerHTML = "As senhas não coincidem!";
        return;
    }
    if(!username || !password || !passwordConfirm){
        errorMessage.innerHTML = "Preencha todos os campos!";
        return;
    }

    const response = await fetch("http://localhost:3000/api/auth/register",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password,
            email
        })
    });
    const data = await response.json();
    if(data.error){
        errorMessage.innerHTML = data.error;
        return;
    }else{
        successMessage.innerHTML = data.message;
        clearBox()
        return;
    }
})

loginForm.addEventListener("submit", async (e) =>{
    e.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    if(!username || !password){
        errorMessage.innerHTML = "Preencha todos os campos!";
        return;
    }
    const response = await fetch("http://localhost:3000/api/auth/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });
    const data = await response.json();
    if(data.error){
        errorMessage.innerHTML = data.error;
        return;
    }
    console.log(data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", data.username);
    window.location.href = "../pages/dashboard.html";
})
