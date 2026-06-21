const LOGIN_URL = "login.html";
const apiUrl = 'http://localhost:3000/usuarios';


var db_usuarios = {};
var usuarioCorrente = {};


function generateUUID() {
    var d = new Date().getTime();
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function exibirFormulario() {
    const formLogin = document.getElementById('login-form');
    const formCadastro = document.getElementById('register-form');
    const params = new URLSearchParams(window.location.search);
    const formulario = params.get('form');
 
    if (formulario === 'login') {
        formLogin.classList.remove("d-none")
        formCadastro.classList.add("d-none");
    } else {
        formLogin.classList.add("d-none");
        formCadastro.classList.remove("d-none");
    }
}

function configurarToggleSenha(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon  = document.getElementById(iconId);

    input.type = 'password';
    icon.addEventListener('click', function () {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
}

function initLoginApp() {
    // PARTE 1 - INICIALIZA USUARIOCORRENTE A PARTIR DE DADOS NO SESSION STORAGE, CASO EXISTA
    usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    }
 
    // PARTE 2 - INICIALIZA BANCO DE DADOS DE USUÁRIOS
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            db_usuarios = data;
        })
        .catch(error => {
            console.error('Erro ao ler usuários via API JSONServer:', error);
            displayMessage("Erro ao ler usuários");
        });
 
    // PARTE 3 - EXIBE APENAS O FORMULÁRIO DE LOGIN INICIALMENTE
    exibirFormulario('login');
 
    // PARTE 4 - CONFIGURA OS LINKS DE ALTERNÂNCIA ENTRE FORMULÁRIOS
    document.getElementById('link-cadastrar').addEventListener('click', function () {
        window.location = 'login.html?form=register';
    });
 
    document.getElementById('link-entrar').addEventListener('click', function () {
        window.location = 'login.html?form=login';
    });
 
    document.getElementById('cu-btn-cancel').addEventListener('click', function () {
        document.getElementById('form-cadastro-usuario').reset();
        window.location = 'login.html?form=login';
    });
 
    // PARTE 5 - CONFIGURA O FORMULÁRIO DE LOGIN
    document.getElementById('form-login').addEventListener('submit', function (event) {
        event.preventDefault();

        const form = this
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
 
        var login = document.getElementById('input-login-user').value;
        var senha = document.getElementById('input-login-password').value;
 
        if (loginUser(login, senha)) {
            window.location = 'index.html';
        } else {
            alert("Login ou senha incorretos. Tente novamente.");
        }
    });
 
    // PARTE 6 - CONFIGURA O FORMULÁRIO DE CADASTRO
    document.getElementById('form-cadastro-usuario').addEventListener('submit', function (event) {
        event.preventDefault();

        const form = this;
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        
        var nome = document.getElementById('input-name').value;
        var email = document.getElementById('input-email').value;
        var username = document.getElementById('input-user').value;
        var senha = document.getElementById('input-password').value;
        var confirma = document.getElementById('input-confirm-password').value;
 
        if (senha !== confirma) {
            alert("As senhas não coincidem.");
            return;
        }
 
        if (senha.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres.");
            return;
        }
 
        addUser(nome, username, senha, email);
    });

    configurarToggleSenha('input-password', 'icon-password');
    configurarToggleSenha('input-confirm-password', 'icon-confirm-password');
    configurarToggleSenha('input-login-password', 'icon-login-password');
}


// Verifica se o login do usuário está ok e, se positivo, salva na sessão
function loginUser(login, senha) {
 
    // Verifica todos os itens do banco de dados de usuarios
    // para localizar o usuário informado no formulário de login
    for (var i = 0; i < db_usuarios.length; i++) {
        var usuario = db_usuarios[i];
 
        // Se encontrou login (por username ou email), carrega usuário corrente e salva no Session Storage
        if ((login == usuario.username || login == usuario.email) && senha == usuario.senha) {
            usuarioCorrente.id = usuario.id;
            usuarioCorrente.username = usuario.username;
            usuarioCorrente.email = usuario.email;
            usuarioCorrente.nome = usuario.nome;
            usuarioCorrente.admin = usuario.admin;
            usuarioCorrente.id_noticias_favoritas = usuario.id_noticias_favoritas || [];
 
            // Salva os dados do usuário corrente no Session Storage
            sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
 
            // Retorna true para usuário encontrado
            return true;
        }
    }
 
    // Se chegou até aqui é porque não encontrou o usuário e retorna falso
    return false;
}

// Apaga os dados do usuário corrente no sessionStorage e redireciona para o login
function logoutUser() {
    usuarioCorrente = {};
    sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
    window.location = LOGIN_URL;
}


function addUser(nome, username, senha, email) {
 
    // Cria um objeto de usuário para o novo usuário
    let newId = generateUUID();
    let usuario = {
        "id": newId,
        "username": username,
        "nome": nome,
        "email": email,
        "senha": senha,
        "admin": false,
        "id_noticias    _favoritas": [],
        "pontos": 0,
        "pontos_semana": 0,
        "nivel": "Iniciante"
    };
 
    // Envia dados do novo usuário para ser inserido no JSON Server
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
        .then(response => response.json())
        .then(data => {
            // Adiciona o novo usuário na variável db_usuarios em memória
            db_usuarios.push(usuario);
            alert("Usuário cadastrado com sucesso! Faça login para continuar.");
            exibirFormulario('login');
        })
        .catch(error => {
            console.error('Erro ao inserir usuário via API JSONServer:', error);
            alert("Erro ao cadastrar usuário");
        });
}

initLoginApp();