async function fetchItems() {
    const [noticias, olimpiadas] = await Promise.all([
        fetch("http://localhost:3000/noticias").then(res => res.json()),
        fetch("http://localhost:3000/olimpiadas").then(res => res.json())
    ]);
    return { noticias, olimpiadas };
}


async function removerFavorito(noticiaId, col) {
    const usuarioLocalJSON = sessionStorage.getItem('usuarioCorrente');
    const usuarioLocal = usuarioLocalJSON ? JSON.parse(usuarioLocalJSON) : null;

    if (!usuarioLocal || !usuarioLocal.id) {
        window.location.href = 'login.html?form=login';
        return;
    }

    try {
        const usuario = await fetch(`http://localhost:3000/usuarios/${usuarioLocal.id}`)
            .then(res => res.json());

        const novosFavoritos = (usuario.id_noticias_favoritas || [])
            .map(String)
            .filter(id => id !== String(noticiaId));

        const response = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_noticias_favoritas: novosFavoritos })
        });

        if (!response.ok) throw new Error("Erro ao remover favorito");

        usuario.id_noticias_favoritas = novosFavoritos;
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuario));

        col.remove();

        const container_cards_fav = document.getElementById("container-cards-fav");
        const lista_cards = container_cards_fav.querySelector(".lista-noticias");
        if (lista_cards && lista_cards.children.length === 0) {
            container_cards_fav.innerHTML = `
                <p class="text-center fw-semibold py-5">
                    Você ainda não tem notícias favoritas. Explore as notícias e favorite as que mais combinam com você!
                </p>
            `;
        }

    } catch (error) {
        console.error("Erro ao remover favorito:", error);
        alert("Não foi possível remover dos favoritos.");
    }
}

function createCardFav(noticia, olimpiada) {
    const col = document.createElement("div");
    col.classList.add("col-12", "mb-1");

    const wrapper = document.createElement("div");
    wrapper.classList.add("d-flex", "align-items-center", "gap-3", "py-3", "border-bottom", "rounded-2");

    // Imagem
    const div_img = document.createElement("div");
    div_img.classList.add("col-3", "p-0", "flex-shrink-0", "d-none", "d-md-block");

    const img_card = document.createElement("img");
    img_card.classList.add("rounded-2", "object-fit-cover", "w-100", "ms-3", "abrir-detalhes");
    img_card.style.height = "100%";
    img_card.style.minHeight = "100px"
    img_card.style.minWidth = "160px"
    img_card.src = noticia.img_card;
    img_card.alt = noticia.titulo;

    div_img.appendChild(img_card);

    // Conteúdo central
    const div_conteudo = document.createElement("div");
    div_conteudo.classList.add("col", "py-1", "px-0", "ms-3");

    const div_meta = document.createElement("div");
    div_meta.classList.add("d-flex", "align-items-center", "gap-2", "mb-1");

    const etiqueta = document.createElement("span");
    etiqueta.classList.add("etiqueta-olimpiada-card-fav", "bg-personalize", "text-light", "rounded-2", "fw-bold", "px-2", "py-1");
    etiqueta.style.fontSize = "0.75rem";
    etiqueta.textContent = olimpiada.nome;

    const data_card = document.createElement("small");
    data_card.textContent = noticia.data;

    div_meta.append(etiqueta, data_card);

    const titulo_card = document.createElement("h3");
    titulo_card.classList.add("titulo-card-fav", "abrir-detalhes", "fw-bold", "mb-1");
    titulo_card.style.fontSize = "1.2rem";
    titulo_card.style.cursor = "pointer";
    titulo_card.textContent = noticia.titulo;

    const descricao_card = document.createElement("p");
    descricao_card.classList.add("descricao-card-fav", "mb-1", "d-none", "d-sm-block");
    descricao_card.textContent = noticia.descricao;

    const btn_detalhes = document.createElement("a");
    btn_detalhes.classList.add("abrir-detalhes", "fw-semibold", "text-decoration-none");
    btn_detalhes.style.color = "#650094";
    btn_detalhes.style.fontSize = "0.85rem";
    btn_detalhes.style.cursor = "pointer";
    btn_detalhes.textContent = "Ler mais →";

    div_conteudo.append(div_meta, titulo_card, descricao_card, btn_detalhes);

    // Botão remover favorito
    const btn_favorito = document.createElement("button");
    btn_favorito.classList.add("btn", "rounded-2", "flex-shrink-0", "col-auto", "me-2");
    btn_favorito.style.width = "36px";
    btn_favorito.style.height = "36px";
    btn_favorito.style.color = "#650094"
    btn_favorito.innerHTML = `<i class="fa-solid fa-bookmark"></i>`;

    wrapper.append(div_img, div_conteudo, btn_favorito);
    wrapper.style.backgroundColor = "rgb(214, 212, 212)"
    col.appendChild(wrapper);

    const elementosClique = col.querySelectorAll(".abrir-detalhes");
    for (const elemento of elementosClique) {
        elemento.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = `details.html?id=${noticia.id}`;
        });
    }

    btn_favorito.addEventListener("click", () => {
        removerFavorito(noticia.id, col);
    });

    return col;
}

function renderCardsFav(noticias, olimpiadas, idsFavoritas) {
    const container_cards_fav = document.getElementById("container-cards-fav");
    container_cards_fav.innerHTML = "";

    const noticiasFavoritas = noticias.filter(noticia =>
        idsFavoritas.includes(String(noticia.id))
    );

    if (noticiasFavoritas.length === 0) {
        container_cards_fav.innerHTML = `
            <p class="text-center fw-semibold py-5">
                Você ainda não tem notícias favoritas. Explore as notícias e favorite as que mais combinam com você!
            </p>
        `;
        return;
    }

    const lista_cards = document.createElement("div");
    lista_cards.classList.add("lista-noticias", "d-flex", "flex-wrap", "justify-content-around", "pb-4", "pt-2", "px-3");
    container_cards_fav.appendChild(lista_cards);

    noticiasFavoritas.forEach(noticia => {
        const olimpiada = olimpiadas.find(o => o.id == noticia.olimpiada_id);
        const card = createCardFav(noticia, olimpiada);
        lista_cards.appendChild(card);
    });
}

async function initFavoritos() {
    const container_cards_fav = document.getElementById("container-cards-fav");

    // Recupera o usuário logado do sessionStorage
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    const usuarioCorrente = usuarioCorrenteJSON ? JSON.parse(usuarioCorrenteJSON) : {};
    const estaLogado = usuarioCorrente && usuarioCorrente.id;

    if (!estaLogado) {
        container_cards_fav.innerHTML = `
            <p class="text-center fw-semibold py-5">
                Você precisa estar logado para ver suas notícias favoritas.
                <a href="login.html?form=login">Entrar</a>
            </p>
        `;
        secao_perfil_usuario = document.querySelector(".perfil-usuario")
        secao_perfil_usuario.innerHTML = ""
        secao_perfil_usuario.innerHTML = `
            <h2 class="fw-bold mb-3"><i class="fa-solid fa-user ms-2 me-2", style="color: #650094;"></i>Bem-vindo!</h2>
            <p class="mb-4 mx-4">
                Entre ou crie uma conta para acessar todos os recursos do portal e fazer parte da comunidade olímpica.
            </p>
            <button id="btn-hp-login" class="d-block w-75 mx-auto py-2 rounded-2 text-light border-0 bg-personalize mb-2">
                <i class="fa-solid fa-right-to-bracket me-2"></i>
                Entrar
            </button>
            <button id="btn-hp-register" class="d-block w-75 mx-auto py-2 rounded-2 border-1 bg-transparent mb-4" style="border-color: #650094; color: #650094;">
                <i class="fa-solid fa-user-plus me-2"></i>
                Criar conta
            </button>
        `;
         if(document.getElementById('btn-hp-login')){
            document.getElementById('btn-hp-login').addEventListener('click', function () {
                window.location = 'login.html?form=login';
            });
        } 
        if(document.getElementById('btn-hp-register')){
            document.getElementById('btn-hp-register').addEventListener('click', function () {
                window.location = 'login.html?form=register';
            });
        }
        return;
    } else {
        secao_perfil_usuario = document.querySelector(".perfil-usuario")
        secao_perfil_usuario.innerHTML = ""
        secao_perfil_usuario.innerHTML = `
            <h2 class="fw-bold py-2"><i class="fa-solid fa-user ms-2 me-2", style="color: #650094;"></i>Meu perfil</h2>
            <div class="d-flex align-items-center px-3 pt-2"> <img class="foto-perfil"
                    src="" alt="">
                <div class="ms-2">
                    <h3 id="nome">Bernardo Guedes</h3>
                    <h4>Nível: Iniciante</h4>
                </div>
            </div>
            <div class="pontuacao px-3 pb-3">
                <p id="meus-pontos">Meus Pontos</p>
                <p id="num-pontos">1.250</p>
                <p id="pontos-semana"><span>+90</span> esta semana</p>
            </div>
        `
        // Foto da barra lateral (só existe no index)
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuarioCorrente.nome)}&background=650094&color=fff&size=200&rounded=true`;
        const fotoSidebar = document.querySelector('.perfil-usuario .foto-perfil');
        if (fotoSidebar) fotoSidebar.src = avatarUrl;
    }

    const idsFavoritas = (usuarioCorrente.id_noticias_favoritas || []).map(String);
    let data;
    try {
        data = await fetchItems();
        renderCardsFav(data.noticias, data.olimpiadas, idsFavoritas);
    } catch (error) {
        console.error("Erro ao buscar notícias/olimpíadas:", error);
        container_cards_fav.innerHTML = `
            <p class="text-center fw-semibold py-5 text-danger">
                Erro ao carregar notícias favoritas. Verifique se a API está rodando.
            </p>
        `;
    }
    const form_busca = document.querySelector(".busca-rapida form");
    form_busca.addEventListener("submit", function (event) {
        event.preventDefault();

        const inputs = form_busca.querySelectorAll("input[type='text']");
        const termOlimpiada = inputs[0].value.trim().toLowerCase();
        const termAno = inputs[1].value.trim();

        const noticiasFiltradas = data.noticias.filter(noticia => {
            if (!idsFavoritas.includes(String(noticia.id))) return false;

            const olimpiada = data.olimpiadas.find(o => o.id == noticia.olimpiada_id);

            const matchOlimpiada = termOlimpiada === "" ||
                olimpiada.nome.toLowerCase().includes(termOlimpiada);

            const matchAno = termAno === "" ||
                noticia.data.includes(termAno);

            return matchOlimpiada && matchAno;
        });

        renderCardsFav(noticiasFiltradas, data.olimpiadas, idsFavoritas);

        if (noticiasFiltradas.length === 0) {
            document.getElementById("container-cards-fav").innerHTML = `
                <p class="text-center fw-semibold py-5">
                    Nenhuma notícia favorita encontrada para os filtros informados.
                </p>
            `;
        }
    });
}

initFavoritos();