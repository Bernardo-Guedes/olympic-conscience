function initHeader() {
    const btnLogin = document.querySelector('.btn-login');
    const btnLogout = document.querySelector('.btn-logout');
    const fotoPerfil = document.querySelector('.foto-perfil');
 
    // Recupera o usuário logado do sessionStorage
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    const usuarioCorrente = usuarioCorrenteJSON ? JSON.parse(usuarioCorrenteJSON) : {};
    const estaLogado = usuarioCorrente && usuarioCorrente.id;
 
    if (estaLogado) {
        btnLogin.classList.add('d-none');
        btnLogout.classList.remove('d-none');
        if (fotoPerfil) {
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuarioCorrente.nome)}&background=650094&color=fff&size=200&rounded=true`;
            // Foto do header
            fotoPerfil.src = avatarUrl;
            fotoPerfil.classList.remove('d-none');
        }
    } else {
        // Usuário não logado: mostra botão entrar, esconde foto e botão sair
        btnLogin.classList.remove("d-none");
        btnLogout.classList.add("d-none");
        if(fotoPerfil) fotoPerfil.classList.add("d-none");
    }
 
    // Botão Entrar -> redireciona para login.html
    if (btnLogin) {
        btnLogin.addEventListener('click', function () {
            window.location = 'login.html?form=login';
        });
    }
 
    // Botão Sair -> faz logout e redireciona para login.html
    if (btnLogout) {
        btnLogout.addEventListener('click', function () {
            usuarioCorrenteVazio = {};
            sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrenteVazio));
            window.location = 'index.html';
        });
    }
}
 

initHeader();