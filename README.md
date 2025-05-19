
![UMAIA|Logo](/galeria/umaia.png)

# **Desenvolvimento Web II**
## Apresentação do projeto

- Nome do Projeto: Agenda para marcação de consultas.
- Objetivo Principal: Desenvolvimento de uma plataforma para agendamento online de consultas médicas
- Contexto: Trabalho desenvolvido no âmbito da disciplina de "Desenvolvimento Web II".
- Desenvolvido pelo Grupo 32: [@António Oliveira](https://github.com/@A044409), [@Antóno Filipe](https://github.com/AmFilipe) e [@João Gomes](https://github.com/joaoismai).

## Descrição Resumida do Tema

Este projeto consiste no desenvolvimento de uma API REST para uma plataforma de marcação de consultas médicas online. A aplicação permite a gestão de utilizadores, médicos, especialidades e marcações, com suporte a autenticação via OAuth 2.0 (Google Login) e autorização baseada em tokens JWT.

## Organização do repositório

O repositório está organizado da seguinte forma:
- **pasta Docs** - xxx
- **pasta Agenda** - Contém ficheiros xxxx, Base Dados, respectivos dockerfile, docker-compose
- **pasta PostmanCollection**: Arquivo com a Collection do Postman para testar os endpoints da API.


## Testes com Postman

Na pasta `/postmanCollection` encontra-se a **coleção `.json`** com todos os endpoints da API prontos a serem testados via Postman.

## Gallery

_Please provide a galery of the final result, with small images_
A [table](https://www.markdownguide.org/extended-syntax/#tables) may be usefull to organize the images.

## Tecnologias

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)
- [OAuth 2.0](https://oauth.net/2/)
- [Docker & Docker Compose](https://www.docker.com/)
- [Postman](https://www.postman.com/)
- [OpenAPI 3.0](https://swagger.io/specification/)

### Frameworks e Bibliotecas

- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Passport](https://www.passportjs.org/concepts/authentication/strategies/)


### Apresentação do Projeto
## Capítulo 1: [Apresentação o Projeto](docs/c1.md)

### Recursos
## Capítulo 2:
* 📌 Recursos REST implementados

A API disponibiliza os seguintes recursos principais:

1. **Users** (`/users`)  
   Permite criar e consultar utilizadores registados.

2. **Doctors** (`/doctors`)  
   Permite listar médicos disponíveis e as suas especialidades.

3. **Appointments** (`/appointments`)  
   Permite criar, listar, atualizar e apagar marcações de consultas.

4. **Specialties** (`/specialties`)  
   Permite listar as especialidades médicas.
---
## 🔗 Relações entre Recursos

- Um **utilizador** pode ter várias **marcações de consultas** → relação **1:N**
- Um **médico** pertence a uma **especialidade**
- Um **médico** pode ter várias marcações (e cada marcação tem 1 médico)

### Produto
## Capítulo 3:
* 🛠 Arquitetura da Aplicação

A aplicação segue uma arquitetura RESTful organizada em camadas. A estrutura principal é:

- **Node.js + Express** como servidor
- **MySQL** como base de dados relacional
- **Sequelize** como ORM
- **Docker** para orquestração com `docker-compose`
- **OAuth 2.0 + JWT** para autenticação e autorização

---

* ⚙️ Funcionalidades

- Criar, listar, atualizar e apagar marcações de consultas (Appointments)
- Consultar especialidades médicas
- Consultar e gerir médicos
- Gestão de utilizadores autenticados

---

* 🔐 Autenticação

- Login via Google (OAuth 2.0)
- Geração de token JWT
- Proteção dos endpoints com middleware de verificação
- O utilizador autenticado só consegue aceder às suas próprias marcações

### Presentation
* Chapter 4: [Presentation](doc/c4.md)
---
## Link's dos repositórios do Docker Hub

- **mysql** - docker pull inf24dw1g32/xxx
- **nodejs** - docker pull inf24dw1g32/xxx



## Elementos do Grupo
- António Manuel Estrela Magriço de Oliveira – nº 044409 @A044409
- António Manuel Ferreira Lopes dos Santos Filipe - nº 044351 @AmFilipe
- João Pedro Freitas Gomes – nº045235 @joaoismai
