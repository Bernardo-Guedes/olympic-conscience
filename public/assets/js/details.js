    async function fetchItem(id){
        const [noticia, olimpiadas, tags1, tags2, tags3] = await Promise.all([
            fetch(`http://localhost:3000/noticias/${id}`).then(res => res.json()),
            fetch("http://localhost:3000/olimpiadas").then(res => res.json()),
            fetch("http://localhost:3000/categorias_noticias").then(res => res.json()),
            fetch("http://localhost:3000/fases").then(res => res.json()),
            fetch("http://localhost:3000/areas_conhecimento").then(res => res.json())
        ]);
        const data = { noticia, olimpiadas, tags1, tags2, tags3 }
        return data
    }

    function render(noticia, olimpiadas, tags1, tags2, tags3){
        const olimpiada = olimpiadas.find(o =>
            o.id == noticia.olimpiada_id
        );
        document.getElementById("titulo-noticia").textContent = noticia.titulo;
        document.getElementById("nome-olimpiada").textContent = olimpiada.nome;
        document.getElementById("data-noticia").textContent = noticia.data;
        document.getElementById("descricao-noticia").textContent = noticia.conteudo;
        document.getElementById("img-banner").src = olimpiada.img_banner;
        const tags = document.getElementById("tags")
        const categoria_noticia = tags1.find(t =>
            t.id == noticia.tags[0]
        );
        const fase = tags2.find(t =>
            t.id == noticia.tags[1]
        );
        const area_conhecimento = tags3.find(t =>
            t.id == noticia.tags[2]
        );
        const tag1 = document.createElement("span")
        tag1.classList.add("mt-2", "me-3", "bg-personalize", "p-2", "rounded-2", "text-light", "fw-bold")
        tag1.textContent = categoria_noticia.nome
        const tag2 = document.createElement("span")
        tag2.classList.add("mt-2", "me-3", "bg-personalize", "p-2", "rounded-2", "text-light", "fw-bold")
        tag2.textContent = fase.nome
        const tag3 = document.createElement("span")
        tag3.classList.add("mt-2", "me-3", "bg-personalize", "p-2", "rounded-2", "text-light", "fw-bold")
        tag3.textContent = area_conhecimento.nome
        tags.append(tag1, tag2, tag3)
        
        document.getElementById("quem-pode").textContent = olimpiada.quem_pode;
        document.getElementById("premiacao").textContent = olimpiada.premiacao;
        document.getElementById("sobre").textContent = olimpiada.sobre;
        document.getElementById("link").href = `https://${olimpiada.link}`;
        document.getElementById("link").textContent = olimpiada.link;
        document.getElementById("link").setAttribute("target", "_blank")

        const divEtapas = document.getElementById("etapas");
        for (let etapa of olimpiada.etapas) {
            divEtapas.innerHTML += `
                <div class="bg-light mb-3 mb-sm-0 mx-2 rounded-3 p-2 p-md-3 border border-secondary">
                    <h4 class="ms-2">${etapa.fase}</h4>
                    <p class="fw-semibold ms-2">${etapa.descricao}</p>
                    <p class="d-flex align-items-center gap-1 fw-semibold ms-md-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="25px" height="25px" fill="#650094"><path d="M224 64C241.7 64 256 78.3 256 96L256 128L384 128L384 96C384 78.3 398.3 64 416 64C433.7 64 448 78.3 448 96L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 96C192 78.3 206.3 64 224 64zM160 304L160 336C160 344.8 167.2 352 176 352L208 352C216.8 352 224 344.8 224 336L224 304C224 295.2 216.8 288 208 288L176 288C167.2 288 160 295.2 160 304zM288 304L288 336C288 344.8 295.2 352 304 352L336 352C344.8 352 352 344.8 352 336L352 304C352 295.2 344.8 288 336 288L304 288C295.2 288 288 295.2 288 304zM432 288C423.2 288 416 295.2 416 304L416 336C416 344.8 423.2 352 432 352L464 352C472.8 352 480 344.8 480 336L480 304C480 295.2 472.8 288 464 288L432 288zM160 432L160 464C160 472.8 167.2 480 176 480L208 480C216.8 480 224 472.8 224 464L224 432C224 423.2 216.8 416 208 416L176 416C167.2 416 160 423.2 160 432zM304 416C295.2 416 288 423.2 288 432L288 464C288 472.8 295.2 480 304 480L336 480C344.8 480 352 472.8 352 464L352 432C352 423.2 344.8 416 336 416L304 416zM416 432L416 464C416 472.8 423.2 480 432 480L464 480C472.8 480 480 472.8 480 464L480 432C480 423.2 472.8 416 464 416L432 416C423.2 416 416 423.2 416 432z"/></svg>${etapa.data}</p>
                </div>
            `;
        }
        
        // Lógica para alocar imagens em suas divs
        const btn_left = document.getElementById("btn-img-left")
        const btn_right = document.getElementById("btn-img-right")
        const localImg = document.getElementById("imagens-conteudos")

        for (let i = 0; i < olimpiada.imgs_conteudo.length; i++) {
            const divImg = document.createElement("div");
            divImg.id = `img${i + 1}`;
            localImg.appendChild(divImg);
            const img = document.createElement("img");
            img.classList.add("img-conteudo");
            img.src = olimpiada.imgs_conteudo[i];
            img.classList.add("rounded-2");
            divImg.appendChild(img);
        };

        //Função para atualizar as imagens visíveis
        const mediaQuery992 = window.matchMedia("(min-width: 992px)");
        const mediaQuery768 = window.matchMedia("(min-width: 768px)");
        const mediaQuery576 = window.matchMedia("(min-width: 576px)");

        let inicio_img = 1;

        function getQtdImgs() {
            if (mediaQuery992.matches) {
                return 4;
            }
            if (mediaQuery768.matches) {
                return 3;
            }
            if (mediaQuery576.matches) {
                return 2;
            }
            return 1;
        }

        function atualiza_img() {
            for (let i = 0; i < olimpiada.imgs_conteudo.length; i++) {
                const divImg_visivel = document.getElementById(`img${i + 1}`);
                if(divImg_visivel){
                    divImg_visivel.classList.add("d-none");
                }   
            };
            const qtd = getQtdImgs();
            const maxInicio = olimpiada.imgs_conteudo.length - qtd + 1;
            if (inicio_img > maxInicio) {
                inicio_img = Math.max(1, maxInicio);
            }

            for (let i = inicio_img; i < (inicio_img + qtd); i++) {
                    const div_visivel = document.getElementById(`img${i}`);
                    div_visivel.classList.remove("d-none");
            };
        };
        atualiza_img();
        mediaQuery992.addEventListener("change", () => {atualiza_img();});
        mediaQuery768.addEventListener("change", () => {atualiza_img();});
        mediaQuery576.addEventListener("change", () => {atualiza_img();});

        // Botões de navegação das imagens e setas do teclado
        btn_right.addEventListener("click", () => {
            const qtd = getQtdImgs();
            const maxInicio = olimpiada.imgs_conteudo.length - qtd + 1
            if (inicio_img < maxInicio) {
                inicio_img += 1;
                atualiza_img();
            };
        });
        btn_left.addEventListener("click", () => {
            if (inicio_img > 1) {
                inicio_img -= 1;
                atualiza_img();
            };
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                btn_right.click();
            }
            if (event.key === "ArrowLeft") {
                btn_left.click();
            }
        });
    }

    async function toggleFavorito(idNoticia) {
        const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
        const usuarioCorrente = usuarioCorrenteJSON ? JSON.parse(usuarioCorrenteJSON) : null;

        if (!usuarioCorrente || !usuarioCorrente.id) {
            window.location.href = 'login.html?form=login';
            return;
        }

        try {
            const idsFavoritas = (usuarioCorrente.id_noticias_favoritas || []).map(String);
            const jaFavorito = idsFavoritas.includes(String(idNoticia));

            if (jaFavorito) {
                usuarioCorrente.id_noticias_favoritas = idsFavoritas.filter(id => id !== String(idNoticia));
            } else {
                usuarioCorrente.id_noticias_favoritas = [...idsFavoritas, String(idNoticia)];
            }
            const response = await fetch(`http://localhost:3000/usuarios/${usuarioCorrente.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_noticias_favoritas: usuarioCorrente.id_noticias_favoritas })
            });

            if (!response.ok) throw new Error("Erro ao atualizar favoritos");

            sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
            atualizaBtnFavorito(idNoticia);

        } catch (error) {
            console.error("Erro ao atualizar favoritos:", error);
            alert("Não foi possível atualizar os favoritos.");
        }
    }

    function atualizaBtnFavorito(idNoticia) {
        const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
        const usuarioCorrente = usuarioCorrenteJSON ? JSON.parse(usuarioCorrenteJSON) : null;
        const btn = document.getElementById("btn-add-fav");

        if (!usuarioCorrente) {
            btn.innerHTML = `<i class="fa-regular fa-bookmark me-1"></i>Adicionar aos favoritos`;
            return;
        }

        const isAdminBtn = usuarioCorrente.admin === true;
        const idsFavoritas = (usuarioCorrente.id_noticias_favoritas || []).map(String);
        const jaFavorito = idsFavoritas.includes(String(idNoticia));

        if (jaFavorito) {
            btn.innerHTML = isAdminBtn
                ? `<i class="fa-solid fa-bookmark"></i>`
                : `<i class="fa-solid fa-bookmark me-1"></i>Remover dos favoritos`;
            btn.classList.add("btn-favorito-ativo");
        } else {
            btn.innerHTML = isAdminBtn
                ? `<i class="fa-regular fa-bookmark"></i>`
                : `<i class="fa-regular fa-bookmark me-1"></i>Adicionar aos favoritos`;
            btn.classList.remove("btn-favorito-ativo");
        }
    }

    async function init() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        if (!id) {
            document.body.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <h2>Ops! Nenhuma notícia foi selecionada.</h2>
                    <p>Parece que você acessou esta página sem selecionar uma notícia.</p>
                    <a href="index.html">← Voltar para a página inicial</a>
                </div>
            `;
            return;
        }

        const data = await fetchItem(id);

        if (!data.noticia || data.noticia.id === undefined) {
            document.body.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <h2>Notícia não encontrada.</h2>
                    <p>A notícia que você está procurando não existe ou foi removida.</p>
                    <a href="index.html">← Voltar para a página inicial</a>
                </div>
            `;
            return;
        }

        const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
        const usuarioCorrente = usuarioCorrenteJSON ? JSON.parse(usuarioCorrenteJSON) : null;
        const isAdmin = usuarioCorrente && usuarioCorrente.admin === true;

        const btn_edit = document.getElementById("btn-edit");
        const btn_delete = document.getElementById("btn-delete");

        if (!isAdmin) {
            btn_edit.classList.add("d-none");
            btn_delete.classList.add("d-none");
        } else {
            btn_edit.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
            btn_delete.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

            btn_edit.addEventListener("click", () => {
                window.location.href = `cadastro_noticia.html?edit=true&id=${id}`;
            });

            btn_delete.addEventListener("click", async () => {
                const confirmar = confirm("Tem certeza que deseja excluir esta notícia?");
                if (!confirmar) return;

                try {
                    const usuarios = await fetch("http://localhost:3000/usuarios").then(res => res.json());
                    const usuariosComFavorito = usuarios.filter(usuario =>
                        (usuario.id_noticias_favoritas || []).map(String).includes(String(id))
                    );

                    await Promise.all(usuariosComFavorito.map(usuario => {
                        const novosFavoritos = usuario.id_noticias_favoritas
                            .map(String)
                            .filter(favId => favId !== String(id));
                        return fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id_noticias_favoritas: novosFavoritos })
                        });
                    }));

                    if (usuarioCorrente) {
                        const idsFavoritas = (usuarioCorrente.id_noticias_favoritas || []).map(String);
                        if (idsFavoritas.includes(String(id))) {
                            usuarioCorrente.id_noticias_favoritas = idsFavoritas.filter(favId => favId !== String(id));
                            sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
                        }
                    }
                    
                    const response = await fetch(`http://localhost:3000/noticias/${id}`, {
                        method: "DELETE"
                    });

                    if (!response.ok) throw new Error("Erro ao excluir notícia");

                    alert("Notícia excluída com sucesso!");
                    window.location.href = "index.html";

                } catch (error) {
                    console.error(error);
                    alert("Erro ao excluir notícia.");
                }
            });
        }

        render(data.noticia, data.olimpiadas, data.tags1, data.tags2, data.tags3);
        atualizaBtnFavorito(id);
        document.getElementById("btn-add-fav").addEventListener("click", () => {
            toggleFavorito(id);
        });
    }
    init();