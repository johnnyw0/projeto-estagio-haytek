# Projeto Estágio haytek

## Descrição do projeto

É um sistema de gestão de produtos com operações CRUD. A interface permite abrir formulários para adição e edição de produtos e também visualizá-los usando filtros por modelo, marca e tipo. Os produtos são mostrados em forma de tabela que permite 6 produtos por página.


## Como rodar
### Requisitos

- Docker e Docker compose

### Passos
1. Clone o repositório:
```bash
git clone https://github.com/johnnyw0/projeto-estagio-haytek.git
```
2. Inicie a aplicação
```bash
cd projeto-estagio-haytek
docker compose up --build
```
3. Vá para [localhost](http://localhost)
4. Caso queira acessar a documentação da API, vá para [swagger](http://localhost:api)
## Processo de desenvolvimento

### Definição das tecnologias
- **NestJS** para o backend:
- **React + Vite** para o frontend:
- **MongoDB** para o banco de dados:

### Desenvolvimento do backend

Decidi iniciar pelo backend por ter mais experiência de projetos anteriores e para me familiarizar com um framework que nunca utilizei. O processo inicial foi consultar a [documentação](https://docs.nestjs.com/first-steps) que possui diversos tutoriais para criar e desenvolver um novo projeto. A CLI do NestJS permite rapidamente criar os arquivos necessários no backend. Para esse projeto escolhi fazer uma API RESTful com validação de dados utilizando o class-validator do node e documentada utilizando SwaggerUI.

No backend todos os endpoints envolvem a entidade Produto. Temos um **POST** para criar produtos, um **GET** para buscar um produto por ID, um **GET** para a lógica de filtros e paginação, um **PATCH** para atualizar as informações de um produto e um **DELETE** para tornar um produto inativo no sistema.

Toda a integração e operações para lidar com o banco de dados foi implementada utilizando a biblioteca [Mongoose](https://mongoosejs.com/). Um ponto importante aqui foi o uso de um ID customizado no formato uuidv4 ao invés do ObjectID criado pelo mongo. Esse mapeamento foi feito utilizando virtuals para utilizar 'id' ao invés de '_id' e transform para remover o _id original do documento. 

### Desenvolvimento do frontend

O frontend foi desenvolvido utilizando React com Typescript. A utilização do Vite permitiu que o processo fosse feito de forma rápida por gerar um template completo do frontend. A partir desse template, construí o ProductService para espelhar as funcionalidades CRUD do backend, utilizando Axios para estabelecer comunicação com a API RESTful. Com as funcionalidades integradas, três componentes foram desenvolvidos, o da tela principal, que gerencia a troca entre os componentes; o da listagem de produtos, que mostra os produtos em formato de tabela e permite editar ou deletar cada um; e o formulário de criação/edição, que permite preencher os campos para cada atributo do produto.

### Containerização

Inicialmente, ao fim do desenvolvimento do backend, coloquei a api e o banco de dados para rodarem em containers, e o frontend rodava localmente enquanto ainda não estava completo. Quando o frontend foi finalizado coloquei os três serviços em containers, porém tiveram problemas de conectividade por conta do Vite aceitar apenas conexões locais (de dentro do container). Para não complicar toda a configuração, implementei um proxy reverso utilizando o Nginx, dessa forma acesso o serviço pela porta 80 e o proxy gerencia as requisições para as URLs corretas de cada serviço.










## Referências
- [Dev.to](https://dev.to/munisekharudavalapati/mongoose-with-nestjs-and-mongodb-a-complete-guide-by-munisekhar-udavalapati-57b5), [Fireship](https://youtu.be/-bt_y4Loofg?si=BKy60HCvUzBpAaYQ) MongoDB\Mongoose
- [Fireship](https://youtu.be/0M8AYU_hPas?si=vr2zoRms_nR2ss-Y), [Tech Vision](https://youtu.be/IdsBwplQAMw?si=b5p4fkVcNUVF8P1d), [Net Ninja](https://www.youtube.com/watch?v=pcX97ZrTE6M&list=PL4cUxeGkcC9g8YFseGdkyj9RH9kVs_cMr) NestJS
- [Medium](https://medium.com/nerd-for-tech/react-js-services-854be54a6ba1), [React Org](https://pt-br.legacy.reactjs.org/docs/getting-started.html) React
- [Vite](https://vite.dev/guide/env-and-mode) Vite
- [askthedev](https://askthedev.com/question/how-can-i-set-up-the-most-recent-version-of-node-js-in-a-docker-container/) Node no Docker
- [Freecodecamp](https://www.freecodecamp.org/news/how-to-fetch-api-data-in-react-using-axios/) Axios
- [Nginx Org](https://nginx.org/en/), [Freecodecamp](https://www.freecodecamp.org/portuguese/news/como-configurar-um-proxy-reverso-de-modo-facil-e-seguro-com-docker-nginx-e-letsencrypt/) Nginx e proxy reverso
