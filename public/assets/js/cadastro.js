// Referência aos elementos HTML
const input_title = document.getElementById("input-title")
const select_olimpiada = document.getElementById("select-olimpiada")
const input_desc = document.getElementById("input-desc")
const input_content = document.getElementById("input-content")
const input_image = document.getElementById("imagem-capa")
const previewImg = document.getElementById("preview-img");
const select_assunto = document.getElementById("select-assunto")
const select_fase = document.getElementById("select-fase")
const select_area = document.getElementById("select-area")
const form = document.querySelector('.needs-validation');
const uploadArea = document.getElementById("upload-area");
const trash = document.getElementById("trash")
const btn_cancel = document.getElementById("cn-btn-cancel")

async function fetchItems() {
    const [noticias, olimpiadas, tags1, tags2, tags3] = await Promise.all([
        fetch(`http://localhost:3000/noticias`).then(res => res.json()),
        fetch("http://localhost:3000/olimpiadas").then(res => res.json()),
        fetch("http://localhost:3000/categorias_noticias").then(res => res.json()),
        fetch("http://localhost:3000/fases").then(res => res.json()),
        fetch("http://localhost:3000/areas_conhecimento").then(res => res.json())
    ]);
    const data = { noticias, olimpiadas, tags1, tags2, tags3 }
    return data
}

async function init() {
    const data = await fetchItems()
    const params = new URLSearchParams(window.location.search);
    const editMode = params.get("edit") === "true";
    const noticiaId = params.get("id");

    //Preenche os selects
    data.olimpiadas.forEach((olimpiada) => {
        const option = document.createElement("option")
        option.value = olimpiada.id
        option.textContent = olimpiada.nome
        select_olimpiada.appendChild(option)
    })
    //Preenche os selects
    data.tags1.forEach((tag) => {
        const option = document.createElement("option");
        option.value = tag.id;
        option.textContent = tag.nome;
        select_assunto.appendChild(option);
    })
    //Preenche os selects
    data.tags2.forEach((tag) => {
        const option = document.createElement("option");
        option.value = tag.id;
        option.textContent = tag.nome;
        select_fase.appendChild(option);
    })
    //Preenche os selects
    data.tags3.forEach((tag) => {
        const option = document.createElement("option");
        option.value = tag.id;
        option.textContent = tag.nome;
        select_area.appendChild(option);
    })

    // Modo de edição de notícia
    if (editMode) {
        const noticia = data.noticias.find(n => n.id === noticiaId);
        document.getElementById("titulo-pagina-cadastro").textContent = "Editar notícia";
        document.getElementById("texto-pagina-cadastro").textContent = "Modifique os campos abaixo para editar a notícia.";
        document.getElementById("cn-btn-confirm").textContent = "Editar notícia"
        if (!noticia) {
            alert("Notícia não encontrada");
            return;
        }
        input_title.value = noticia.titulo;
        select_olimpiada.value = noticia.olimpiada_id;
        input_desc.value = noticia.descricao;
        input_content.value = noticia.conteudo;
        if (noticia.img_card && noticia.img_card.startsWith("data:")) {
            previewImg.src = noticia.img_card;
        } else if (noticia.img_card) {
            const imgTemp = new Image();
            imgTemp.crossOrigin = "anonymous";
            imgTemp.onload = () => {
                const MAX_WIDTH = 400;
                const MAX_HEIGHT = 300;
                const QUALITY = 0.5;

                let width = imgTemp.width;
                let height = imgTemp.height;

                if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                    const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }
                
                const canvas = document.createElement("canvas");
                canvas.width = imgTemp.width;
                canvas.height = imgTemp.height;
                canvas.getContext("2d").drawImage(imgTemp, 0, 0, width, height)
                previewImg.src = canvas.toDataURL("image/jpeg", QUALITY);
            };
            imgTemp.onerror = () => {
                previewImg.src = noticia.img_card;
            };
            imgTemp.src = noticia.img_card;
        }
        select_assunto.value = noticia.tags[0];
        select_fase.value = noticia.tags[1];
        select_area.value = noticia.tags[2];
        if (noticia.img_card && !noticia.img_card.includes("placeholder_image")) {
            input_image.removeAttribute("required");
        } else if (!input_image.hasAttribute("required")) {
            input_image.setAttribute("required");
        }
        btn_cancel.addEventListener("click", () => {
            window.location.href = `details.html?id=${noticiaId}`
        });
    } else{
        btn_cancel.addEventListener("click", () => {
            window.location.href = `index.html`
        });
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }
        form.classList.add('was-validated');

        if (editMode) {
            const noticiaEditada = {
                titulo: input_title.value,
                olimpiada_id: Number(select_olimpiada.value),
                img_card: previewImg.src,
                data: new Date().toLocaleDateString("pt-BR"),
                descricao: input_desc.value,
                conteudo: input_content.value,
                tags: [
                    Number(select_assunto.value),
                    Number(select_fase.value),
                    Number(select_area.value)
                ],
                destaque: false
            };
            try {
                const response = await fetch(`http://localhost:3000/noticias/${noticiaId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(noticiaEditada)
                });
                if (!response.ok) {
                    throw new Error("Erro ao salvar notícia");
                }
                form.reset()
                form.classList.remove("was-validated")
                previewImg.src = "assets/img/placeholder_image.png";
                alert("Notícia editada com sucesso!");
                window.location.href = `details.html?id=${noticiaId}`;

            } catch (error) {
                console.error(error);
            }
        } else {
            const novaNoticia = {
                titulo: input_title.value,
                olimpiada_id: Number(select_olimpiada.value),
                img_card: previewImg.src,
                data: new Date().toLocaleDateString("pt-BR"),
                descricao: input_desc.value,
                conteudo: input_content.value,
                tags: [
                    Number(select_assunto.value),
                    Number(select_fase.value),
                    Number(select_area.value)
                ],
                destaque: false
            };
            try {
                const response = await fetch("http://localhost:3000/noticias", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(novaNoticia)
                });
                if (!response.ok) {
                    throw new Error("Erro ao salvar notícia");
                }
                form.reset()
                form.classList.remove("was-validated")
                previewImg.src = "assets/img/placeholder_image.png";
                alert("Notícia criada com sucesso!");

            } catch (error) {
                console.error(error);
            }
        }
    });

    // Clique na div da imagem aciona o input
    uploadArea.addEventListener("click", () => {
        input_image.click();
    });


    // Imagem selecionada aparece no preview
    let urlImage = null;
    input_image.addEventListener("change", () => {
        const arquivo = input_image.files[0];
        if (!arquivo){
            return;
        } 
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 300;
        const QUALITY = 0.5;
        const img = new Image();
        img.onload = () => {
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            previewImg.src = canvas.toDataURL("image/jpeg", QUALITY);
            URL.revokeObjectURL(urlImage);
        };
        urlImage = URL.createObjectURL(arquivo);
        img.src = urlImage;
    });

    // Lixeira que remove imagem selecionada
    trash.addEventListener("click", () => {
        input_image.value = "";
        if (urlImage) {
            URL.revokeObjectURL(urlImage)
            urlImage = null
        }
        previewImg.src = "assets/img/placeholder_image.png"
    })
}

init()