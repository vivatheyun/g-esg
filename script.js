function checkLogin() {
    const name = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    const VALID_NAME = "sayuri";
    const VALID_PASS = "!seoyoung12";

    if (name === VALID_NAME && pass === VALID_PASS) {
        const overlay = document.getElementById('login-overlay');
        const main = document.getElementById('main-content');
        
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            main.style.display = 'block';
        }, 500);
    } else {
        alert("이름 또는 암호가 올바르지 않습니다.");
    }
}

// Enter 키 지원
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkLogin();
    }
});
