
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

## Technologies

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Sequelize](https://sequelize.org/)
- [OAuth 2.0](https://oauth.net/2/)
- [Docker & Docker Compose](https://www.docker.com/)
- [Postman](https://www.postman.com/)
- [OpenAPI 3.0](https://swagger.io/specification/)

### Frameworks and Libraries

* Docker
* NodeJS
* ReactJS
* Express.js
* Sequelize

  
## Report
_Please add at least on section (a file) per Chapter. But you can add more._

### Apresentação do Projeto
## Capítulo 1:
Este projeto tem como objetivo desenvolver uma plataforma web para marcação de consultas médicas. A aplicação permite que os utilizadores possam criar e gerir os seus próprios agendamentos, com autenticação segura via OAuth 2.0.  
O sistema é baseado numa arquitetura RESTful, com uma base de dados relacional (MySQL) e protegido contra acessos não autorizados.  
O projeto foi desenvolvido no âmbito da disciplina de Desenvolvimento Web II, por alunos do Grupo 32.

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

### Product
* Chapter 3: [Product](doc/c3.md)
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
