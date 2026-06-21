# Olympic Conscience

## Informações Gerais

- Nome: Bernardo Guedes da Silveira
- Matricula: 925696

- Proposta de projeto escolhida: A ideia central do Olympic Conscience é mostrar que as olimpíadas científicas vão além de medalhas: elas proporcionam experiências, interações valiosas e um leque enorme de oportunidades que muitos nem sequer imaginam.

- Breve descrição sobre o projeto: O Olympic Conscience reúne informações importantes sobre olimpíadas científicas em um hub de notícias, além de possibilitar o acesso a conteúdos direcionados para estudo e a interação entre os usuários. A plataforma também promove o compartilhamento de experiências e uma competitividade saudável por meio de um ranking baseado na participação ativa da comunidade.

Além disso, o sistema conta com um CRUD completo de notícias, permitindo o cadastro, visualização, edição e remoção de conteúdos, garantindo a atualização constante das informações disponibilizadas aos usuários. Como funcionalidade dinâmica, foi implementado um calendário interativo utilizando a biblioteca FullCalendar, que exibe eventos relacionados às olimpíadas científicas e é atualizado automaticamente a partir dos dados cadastrados na aplicação.


## Tecnologias utilizadas

- HTML5, CSS3 e JavaScript
- Node.js
- JSON Server (API REST simulada)
- FullCalendar (calendário interativo)
- Bootstrap (estilização e componentes responsivos)
- Font Awesome (ícones)


## Funcionalidades implementadas

- Hub de notícias com **CRUD completo** (criar, visualizar, editar e excluir)
- Pesquisa para filtragem dos itens da home-page por olimpíada e/ou ano
- Calendário interativo (FullCalendar) com eventos gerados automaticamente a partir das olimpíadas cadastradas
- Página de detalhes de cada olimpíada (etapas, premiação, público-alvo, site oficial, etc.)
- Sistema de favoritos por usuário
- Controle de acesso: apenas usuários administradores podem criar, editar ou excluir notícias


## Como rodar o projeto

### Pré-requisitos

- Node.js instalado
- JSON Server instalado

### Instalação

Na pasta raiz do projeto:

```bash
npm install
```

### Inicialização

Após a instalação das dependências, execute (na pasta raiz do projeto):

```bash
npm start
```
Esse comando iniciará o JSON Server e disponibilizará a aplicação localmente.


### Acessando a aplicação

Abra o navegador e acesse:

```text
http://localhost:3000/index.html
```

O JSON Server irá:

- Servir os arquivos estáticos da pasta `public/` (front-end)
- Expor a API RESTful com base no arquivo `db/db.json` (back-end)


### Como realizar o CRUD de notícias (acesso administrador)

O CRUD de notícias só é visível e acessível para usuários administradores. Para testar, faça login com:

- **Usuário:** bguedes
- **Senha:** xyz789
- Ou edite manualmente no db.json o atributo “admin” de algum usuário qualquer para true

Com esse login, os botões "Nova Notícia", de edição (lápis) e de exclusão (lixeira) ficam disponíveis no menu de navegação, no calendário e na página de detalhes de cada notícia.


## Estrutura de pastas

```text
public/        → front-end (HTML, CSS, JS e assets da aplicação)
db/db.json     → "banco de dados" utilizado pelo JSON Server
```


## Resumo da estrutura do db.json

O arquivo `db.json` contém 5 coleções principais utilizadas pela aplicação Olympic Conscience.

- **Notícias:**
Armazena todas as notícias exibidas na plataforma e manipuladas pelo CRUD. Cada notícia possui informações como título, descrição, conteúdo completo, data de publicação, imagem de capa, olimpíada relacionada, tags e indicação de destaque.

As tags são compostas por referências às coleções de categorias, fases da olimpíada e áreas do conhecimento, permitindo a classificação e filtragem dos conteúdos.

Exemplos de notícias cadastradas:

- Inscrições abertas OMIF 2026
- Inscrições abertas OBMEP 2026
- Premiação da OBA celebra talentos
- Resultado oficial OBA 2026 divulgado
- OBFEP anuncia nova etapa experimental

```json
{
    "noticias": [
        {
            "id": "1",
            "titulo": "Inscrições abertas OMIF 2026",
            "olimpiada_id": 1,
            "img_card": "http://localhost:3000/assets/img/cards/omif.jpg",
            "data": "05/06/2026",
            "descricao": "A Olimpíada de Matemática dos Institutos Federais (OMIF) abriu as inscrições para a primeira fase das provas.",
            "conteudo": "A Olimpíada de Matemática dos Institutos Federais (OMIF) abriu oficialmente as inscrições para a edição de 2026. O anúncio foi realizado nesta semana pela organização da competição e já mobiliza estudantes de diferentes Institutos Federais do país. A expectativa é de aumento no número de participantes em relação às últimas edições, ampliando ainda mais o alcance da olimpíada entre os jovens interessados em matemática e raciocínio lógico. Segundo os organizadores, o período de inscrições permanecerá aberto durante as próximas semanas, permitindo que estudantes realizem o cadastro diretamente em suas instituições de ensino. A edição deste ano contará com provas atualizadas e novos desafios voltados à resolução de problemas, interpretação matemática e pensamento analítico. A organização também informou que serão promovidas ações preparatórias, simulados e atividades de incentivo ao longo dos próximos meses para auxiliar os participantes na preparação para as provas.",
            "tags": [
                2,
                2,
                1
            ],
            "destaque": false
        },
    ]
}
```

- **Olimpíadas:**
Armazena as informações completas de cada olimpíada científica cadastrada na plataforma.

Cada olimpíada contém: Nome; Público-alvo; Etapas da competição; Premiação; Descrição institucional; Site oficial; Imagens utilizadas na interface; Cor personalizada utilizada no FullCalendar

Atualmente a aplicação possui as seguintes olimpíadas cadastradas: OMIF, OBMEP, OBA, ONC, ONHB, OBFEP, OMQ

```json
{
    "olimpiadas": [
        {
            "id": "1",
            "nome": "OMIF",
            "quem_pode": "Estudantes regularmente matriculados do 6° ano do ensino fundamental ao 3° ano do ensino médio ou equivalente nos Institutos Federais de Educação, Ciência e Tecnologia de todo o Brasil.",
            "etapas": [
                {
                "fase": "1° Fase",
                "descricao": "Prova objetiva realizada na própria instituição do aluno.",
                "data": "Janeiro de 2026"
                },
                {
                "fase": "2° Fase",
                "descricao": "Prova discursiva em uma das instituições selecionada por todo Brasil.",
                "data": "Agosto de 2026"
                }
            ],
            "premiacao": "Medalhas de ouro, prata, bronze e menção honrosa para os destaques da competição, certificados e oportunidade de viajar pelo Brasil com diversas experiências.",
            "sobre": "A OMIF é uma iniciativa que promove a inclusão, o raciocinio lógico e o desenvolvimento acadêmico dos estudantes dos Institutos Federais, contribuindo para a formação de futuros profissionais nas áreas de ciência e tecnologia.",
            "link": "omif.com.br",
            "img_carrossel": "assets/img/carrossels/carrossel_omif.png",
            "img_banner": "assets/img/banners/banner_omif.png",
            "imgs_conteudo": [
                "assets/img/conteudos/omif/omif1.jpg",
                "assets/img/conteudos/omif/omif2.jpg",
                "assets/img/conteudos/omif/omif3.jpg",
                "assets/img/conteudos/omif/omif4.jpg",
                "assets/img/conteudos/omif/omif5.jpg",
                "assets/img/conteudos/omif/omif6.jpg",
                "assets/img/conteudos/omif/omif7.jpg",
                "assets/img/conteudos/omif/omif8.jpg"
            ],
            "cor": "#198754"
        }
    ]
}
```

- **Categorias das Notícias:**
Guarda as categorias que classificam o tipo de cada notícia, e é utilizada como uma de suas tags, como "Inscrições", "Resultado", "Premiação", entre outras.

```json
{
   "categorias_noticias": [
        {"id": 1, "nome": "Calendário"},
        {"id": 2, "nome": "Inscrições"},
        {"id": 3, "nome": "Edital"},
        {"id": 4, "nome": "Gabarito"},
        {"id": 5, "nome": "Prova corrigida"},
        {"id": 6, "nome": "Resultado"},
        {"id": 7, "nome": "Premiação"},
        {"id": 8, "nome": "Comunicado"},
        {"id": 9, "nome": "Adiamento"},
        {"id": 10, "nome": "Novidade"},
        {"id": 11, "nome": "Destaques"}
    ]
}
```

- **Fases da Olímpiada:**
Guarda as fases do ciclo de uma olimpíada, e é utilizada como uma das tags de cada notícia para identificar a fase no momento da publicação, como "Período de inscrições", "1° fase", "Divulgação de classificados", etc.

```json
{
    "fases": [
        {"id": 1, "nome": "Pré-Inscrições"},
        {"id": 2, "nome": "Período de inscrições"},
        {"id": 3, "nome": "1° fase"},
        {"id": 4, "nome": "2° fase"},
        {"id": 5, "nome": "3° fase"},
        {"id": 6, "nome": "Divulgação de classificados"},
        {"id": 7, "nome": "Divulgação do resultado final"},
        {"id": 8, "nome": "Fase de premiação"}
    ]
}
```

- **Áreas de conhecimento:**
Guarda as áreas do conhecimento associadas às notícias olimpíadas, e é utilizada como um de suas tags como Matemática, Física, Química, História, entre outras.

```json
{
    "areas_conhecimento": [
        {"id": 1, "nome": "Matemática"},
        {"id": 2, "nome": "Programação"},
        {"id": 3, "nome": "Biologia"},
        {"id": 4, "nome": "Filosofia"},
        {"id": 5, "nome": "História"},
        {"id": 6, "nome": "Geografia"},
        {"id": 7, "nome": "Química"},
        {"id": 8, "nome": "Física"},
        {"id": 9, "nome": "Ciências Espaciais"},
        {"id": 10, "nome": "Ciências"}
    ]
}
```

- **Usuários (ainda sem funcionalidade):**
Armazena os dados dos usuários cadastrados na plataforma, incluindo credenciais de acesso, nível, pontuação e lista de notícias favoritas.

Cada usuário contém: Nome completo; Username; E-mail; Senha; Flag de administrador; Lista de IDs de notícias favoritas; Pontuação total; Pontuação da semana; Nível do usuário

Usuários com `admin: true` têm acesso às funcionalidades de criação, edição e exclusão de notícias, além do botão "Nova Notícia" no calendário e no menu de navegação.

```json
{
    "usuarios": [
        {
            "id": "2",
            "username": "bguedes",
            "nome": "Bernardo Guedes da Silveira",
            "email": "bernardo@email.com",
            "senha": "xyz789",
            "admin": true,
            "id_noticias_favoritas": [
                "3",
                "1",
                "8"
            ],
            "pontos": 1820,
            "pontos_semana": 120,
            "nivel": "Intermediário"
        }
    ]
}
```


