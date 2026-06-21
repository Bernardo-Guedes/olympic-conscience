const filtro_olimpiadas = document.getElementById("filtro-olimpiadas")
const filtro_assuntos = document.getElementById("filtro-assuntos")
const mediaQuery650 = window.matchMedia("(max-width: 650px)");
async function fetchItems(){
    const [noticias, olimpiadas, assuntos] = await Promise.all([
        fetch("http://localhost:3000/noticias").then(res => res.json()),
        fetch("http://localhost:3000/olimpiadas").then(res => res.json()),
        fetch("http://localhost:3000/categorias_noticias").then(res => res.json())
    ]);
    const data = { noticias, olimpiadas, assuntos }
    return data
}

function converterData(dataStr) {
    const [dia, mes, ano] = dataStr.split('/');
    return `${ano}-${mes}-${dia}`;
}

function formatarData(dataStr) {
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
}

document.addEventListener('DOMContentLoaded', async function() {
    const data = await fetchItems()
    data.olimpiadas.forEach(olimpiada => {
        const check = document.createElement("div")
        check.classList.add("form-check")
        const input_check = document.createElement("input")
        input_check.classList.add("form-check-input")
        input_check.type = "checkbox"
        input_check.id = `olimpiada-${olimpiada.id}`;
        input_check.dataset.id = olimpiada.id;

        const label_check = document.createElement("label")
        label_check.classList.add("form-check-label")
        label_check.setAttribute("for", input_check.id)
        label_check.textContent = olimpiada.nome
        check.appendChild(input_check)
        check.appendChild(label_check)
        filtro_olimpiadas.appendChild(check)
    })

    data.assuntos.forEach(assunto => {
        const check = document.createElement("div")
        check.classList.add("form-check")
        const input_check = document.createElement("input")
        input_check.classList.add("form-check-input")
        input_check.type = "checkbox";
        input_check.id = `assunto-${assunto.id}`;
        input_check.dataset.id = assunto.id;
        const label_check = document.createElement("label")
        label_check.classList.add("form-check-label")
        label_check.setAttribute("for", input_check.id)
        label_check.textContent = assunto.nome
        check.appendChild(input_check)
        check.appendChild(label_check)
        filtro_assuntos.appendChild(check)
    })
    const eventos = data.noticias.map(n => {
        const olimpiada = data.olimpiadas.find(
            o => o.id == n.olimpiada_id
        );
        return {
            title: n.titulo,
            start: converterData(n.data),
            color: olimpiada?.cor,
            allDay: true,
            extendedProps: {
                description: n.descricao,
                olimpiadaNome: olimpiada?.nome,
                olimpiadaId: Number(n.olimpiada_id),
                categoriaId: Number(n.tags[0])
            }
        };
    });
    const calendarElement = document.getElementById('calendar');
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    const usuarioCorrente = usuarioCorrenteJSON ? JSON.parse(usuarioCorrenteJSON) : null;
    const isAdmin = usuarioCorrente && usuarioCorrente.admin === true;
    const calendar = new FullCalendar.Calendar(calendarElement, {
        events: eventos,
        locale: 'pt-br',
        dayHeaderContent: function(arg) {
            const texto = arg.text;
            return texto.charAt(0).toUpperCase() + texto.slice(1);
        },
        titleFormat: (info) => {
            const date = info.date.marker;
            const str = new Date(Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate()
            )).toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC'
            });
            return str.replace(/ de /gi, ' ');
        },
        eventContent: function(arg) {
            if (mediaQuery650.matches) {
                return {
                    html: `<div>${arg.event.extendedProps.olimpiadaNome}</div>`
                };
            }

            return {
                html: `<div>${arg.event.title}</div>`
            };
        },
        buttonText: {
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
        },
        customButtons: {
            novaNoticia: {
                text: '+ Nova Notícia',
                click: function() {
                    window.location.href = 'cadastro_noticia.html?edit=false';
                }
            }
        },
        headerToolbar: {
            left: isAdmin ? 'prev,next today novaNoticia' : 'prev,next today',
            center: 'title',
            right: '',
    },
      eventClick: function(info) {
        const noticiaId = data.noticias.find(n => n.titulo === info.event.title)?.id;
        if (noticiaId) {
            window.location.href = `details.html?id=${noticiaId}`;
        }  
      }   
   });
   
    calendar.render();


    function aplicarFiltros() {
        const olimpiadasSelecionadas = [...document.querySelectorAll('#filtro-olimpiadas input:checked')].map(cb => Number(cb.dataset.id));
        const assuntosSelecionados = [...document.querySelectorAll('#filtro-assuntos input:checked')].map(cb => Number(cb.dataset.id));
        const eventosFiltrados = eventos.filter(evento => {
            const passaOlimpiada =
                olimpiadasSelecionadas.length === 0 ||
                olimpiadasSelecionadas.includes(
                    evento.extendedProps.olimpiadaId
                );
            const passaAssunto =
                assuntosSelecionados.length === 0 ||
                assuntosSelecionados.includes(
                    evento.extendedProps.categoriaId
                );
            return passaOlimpiada && passaAssunto;
        });

        calendar.removeAllEvents();
        calendar.addEventSource(eventosFiltrados);
    }
    document.addEventListener('change', (e) => {
        if (e.target.closest('#filtro-olimpiadas') || e.target.closest('#filtro-assuntos')) {
            aplicarFiltros();
        }
    });

    mediaQuery650.addEventListener("change", () => {
        calendar.render();
    });
});