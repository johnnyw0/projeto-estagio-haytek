# Projeto Estágio haytek

## Descrição do projeto

O sistema de gestão de produtos é uma aplicação web completa, projetada para gerenciar um catálogo de lentes, implementando as operações essenciais de um CRUD (Create, Read, Update, Delete). No frontend, a aplicação oferece uma interface de usuário intuitiva para a gestão de produtos, destacando uma tabela interativa com listagem paginada e filtros por busca, marca, tipo e status. Formulários permitem a criação e edição de produtos, enquanto botões de ação na tabela facilitam a desativação (soft-delete) dos itens.

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
4. Caso queira acessar a documentação da API, vá para [swagger](http://localhost/docs)

### Testes

Caso queira rodar os testes unitários, após clonar o repositório, execute:
```bash
cd projeto-estagio-haytek/Backend/
npm run test
```
## Processo de desenvolvimento

### Definição das tecnologias
- **NestJS** para o backend:
- **React + Vite** para o frontend:
- **MongoDB** para o banco de dados:

### Desenvolvimento do backend

Decidi iniciar pelo backend por ter mais experiência de projetos anteriores e para me familiarizar com um framework que nunca utilizei. O processo inicial foi consultar a [documentação](https://docs.nestjs.com/first-steps) que possui diversos tutoriais para criar e desenvolver um novo projeto. A CLI do NestJS permite rapidamente criar os arquivos necessários no backend. Para esse projeto escolhi fazer uma API RESTful com validação de dados utilizando o class-validator do node e documentada utilizando SwaggerUI.

No backend todos os endpoints envolvem a entidade Produto. Temos um **POST** para criar produtos, um **GET** para buscar um produto por ID, um **GET** para a lógica de filtros e paginação, um **PATCH** para atualizar as informações de um produto e um **DELETE** para tornar um produto inativo no sistema.

Toda a integração e operações para lidar com o banco de dados foi implementada utilizando a biblioteca [Mongoose](https://mongoosejs.com/). Um ponto importante aqui foi o uso de um ID customizado no formato uuidv4 ao invés do ObjectID criado pelo mongo. Esse mapeamento foi feito utilizando virtuals para utilizar 'id' ao invés de '_id' e transform para remover o _id original do documento. 

Testes unitários foram feitos para product.service, pois é onde toda a lógica de negócio se encontra. Foram criados seis cenários de testes, um para testar se o serviço está definido e os outros testam cada função presente na classe, create, findAll, findOne, update e delete.

### Desenvolvimento do frontend

O frontend foi desenvolvido utilizando React com Typescript. A utilização do Vite permitiu que o processo fosse feito de forma rápida por gerar um template completo do frontend. A partir desse template, construí o ProductService para espelhar as funcionalidades CRUD do backend, utilizando Axios para estabelecer comunicação com a API RESTful. Com as funcionalidades integradas, três componentes foram desenvolvidos, o da tela principal, que gerencia a troca entre os componentes; o da listagem de produtos, que mostra os produtos em formato de tabela e permite editar ou deletar cada um; e o formulário de criação/edição, que permite preencher os campos para cada atributo do produto.

### Containerização

Inicialmente, ao fim do desenvolvimento do backend, coloquei a api e o banco de dados para rodarem em containers, e o frontend rodava localmente enquanto ainda não estava completo. Quando o frontend foi finalizado coloquei os três serviços em containers, porém tiveram problemas de conectividade por conta do Vite aceitar apenas conexões locais (de dentro do container). Para não complicar toda a configuração, implementei um proxy reverso utilizando o Nginx, dessa forma acesso o serviço pela porta 80 e o proxy encaminha as requisições para as URLs corretas de cada serviço.










## Referências
- [Dev.to](https://dev.to/munisekharudavalapati/mongoose-with-nestjs-and-mongodb-a-complete-guide-by-munisekhar-udavalapati-57b5), [Fireship](https://youtu.be/-bt_y4Loofg?si=BKy60HCvUzBpAaYQ) MongoDB\Mongoose
- [Fireship](https://youtu.be/0M8AYU_hPas?si=vr2zoRms_nR2ss-Y), [Tech Vision](https://youtu.be/IdsBwplQAMw?si=b5p4fkVcNUVF8P1d), [Net Ninja](https://www.youtube.com/watch?v=pcX97ZrTE6M&list=PL4cUxeGkcC9g8YFseGdkyj9RH9kVs_cMr) NestJS
- [Medium](https://medium.com/nerd-for-tech/react-js-services-854be54a6ba1), [React Org](https://pt-br.legacy.reactjs.org/docs/getting-started.html) React
- [Vite](https://vite.dev/guide/env-and-mode) Vite
- [askthedev](https://askthedev.com/question/how-can-i-set-up-the-most-recent-version-of-node-js-in-a-docker-container/) Node no Docker
- [Freecodecamp](https://www.freecodecamp.org/news/how-to-fetch-api-data-in-react-using-axios/) Axios
- [Nginx Org](https://nginx.org/en/), [Freecodecamp](https://www.freecodecamp.org/portuguese/news/como-configurar-um-proxy-reverso-de-modo-facil-e-seguro-com-docker-nginx-e-letsencrypt/) Nginx e proxy reverso
