async function fetchItems(){
    const [noticias, olimpiadas] = await Promise.all([
        fetch("http://localhost:3000/noticias").then(res => res.json()),
        fetch("http://localhost:3000/olimpiadas").then(res => res.json())
    ]);
    const data = { noticias, olimpiadas }
    return data
}

function renderCards(noticias, olimpiadas){
    const container_cards = document.getElementById("container-cards")
    container_cards.innerHTML = ""
    const lista_cards = document.createElement("div")
    lista_cards.classList.add("lista-noticias", "d-flex", "flex-wrap", "justify-content-around", "pb-4", "pt-2", "px-3")

    container_cards.appendChild(lista_cards)
    const carousel_inner = document.querySelector(".carousel-inner")
    const carousel_indicators = document.querySelector(".carousel-indicators")
    let slideIndex = 0

    noticias.forEach((noticia) => {
        const resultado = createCard(noticia, olimpiadas, slideIndex)
        if (Array.isArray(resultado)){
            const card = resultado[0]
            lista_cards.appendChild(card)
            const carousel_item = resultado[1]
            carousel_inner.appendChild(carousel_item)
            const btn_carousel = resultado[2]
            carousel_indicators.appendChild(btn_carousel)
            slideIndex++
        } else {
            lista_cards.appendChild(resultado)
        }
    });

    const btn_mais_noticias = document.createElement("button")
    btn_mais_noticias.classList.add("d-block", "w-auto", "mx-auto","my-3")
    btn_mais_noticias.textContent = "Ver todas as notícias"
    container_cards.appendChild(btn_mais_noticias)
}


function createCard(noticia, olimpiadas, slideIndex = 0){
    const card = document.createElement("div")
    card.classList.add("card", "mb-3", "me-2")
    const article = document.createElement("article")
    article.classList.add("noticia", "h-100", "d-flex", "flex-column")
    const img_card = document.createElement("img")
    img_card.classList.add("imagem-card", "abrir-detalhes", "img-fluid")
    const titulo_card = document.createElement("h3")
    titulo_card.classList.add("titulo-card", "abrir-detalhes", "fw-bold", "fs-5")
    const spans_card = document.createElement("h4")
    spans_card.classList.add("mt-3")
    const etiqueta = document.createElement("span")
    etiqueta.classList.add("etiqueta-olimpiada-card", "fw-bold", "fs-6", "me-2", "p-1")
    const olimpiada = olimpiadas.find(o =>
        o.id == noticia.olimpiada_id
    );
    etiqueta.textContent = olimpiada.nome
    const data_card = document.createElement("span")
    data_card.classList.add("data-card", "fw-bold", "fs-6")
    const descricao_card = document.createElement("p")
    descricao_card.classList.add("descricao-card", "fw-semibold", "my-3", "mx-3")
    const btn_detalhes = document.createElement("button")
    btn_detalhes.textContent = "Saiba mais →"
    btn_detalhes.classList.add("abrir-detalhes", "rounded-2", "border-0", "ms-2", "mt-auto", "align-self-start")
    img_card.src = noticia.img_card
    titulo_card.textContent = noticia.titulo
    descricao_card.textContent = noticia.descricao;
    data_card.textContent = noticia.data;
    spans_card.append(etiqueta, data_card)
    article.append(img_card, titulo_card, spans_card, descricao_card, btn_detalhes)
    card.appendChild(article)
    const elementosClique = article.querySelectorAll(".abrir-detalhes");
    for (let elemento of elementosClique) {
        elemento.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = `details.html?id=${noticia.id}`;
        });
    }

    if (noticia.destaque === true) {
        const carousel_item = document.createElement("div")
        carousel_item.classList.add("carousel-item", "c-item")
        const btn_carousel = document.createElement("button")
        btn_carousel.setAttribute("type", "button")
        btn_carousel.setAttribute("data-bs-target", "#carrosel-destaque")
        btn_carousel.setAttribute("data-bs-slide-to", slideIndex)
        btn_carousel.setAttribute("aria-label", `Slide ${slideIndex + 1}`)
        if (slideIndex === 0) {
            carousel_item.classList.add("active")
            btn_carousel.classList.add("active")
            btn_carousel.setAttribute("aria-current", "true")
        }
        const img_carousel = document.createElement("img")
        img_carousel.classList.add("d-block", "w-100", "c-img", "abrir-detalhes")
        img_carousel.src = olimpiada.img_carrossel
        img_carousel.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = `details.html?id=${noticia.id}`;
        });
        const carousel_caption = document.createElement("div")
        carousel_caption.classList.add("carousel-caption", "d-block")
        const title_carousel = document.createElement("h2")
        title_carousel.classList.add("abrir-detalhes")
        title_carousel.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = `details.html?id=${noticia.id}`;
        });
        title_carousel.textContent = noticia.titulo
        const desc_carousel = document.createElement("p")
        desc_carousel.classList.add("d-none", "d-md-block")
        desc_carousel.textContent = noticia.descricao
        carousel_caption.append(title_carousel, desc_carousel)
        carousel_item.append(img_carousel, carousel_caption)
        return [card, carousel_item, btn_carousel]
    }
    return card
}

async function init(){
    const data = await fetchItems()
    renderCards(data.noticias, data.olimpiadas)

    // Recupera o usuário logado do sessionStorage
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    const usuarioCorrente = usuarioCorrenteJSON ? JSON.parse(usuarioCorrenteJSON) : {};
    const estaLogado = usuarioCorrente && usuarioCorrente.id;

    // Ajusta seção de perfil da sidebar
    if (estaLogado){
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

    } else {
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
    }

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
}

init()