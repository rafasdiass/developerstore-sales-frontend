# 🧾 DeveloperStore - Frontend Angular

Frontend moderno e modular para gerenciamento de vendas da **DeveloperStore**, desenvolvido com **Angular standalone components**, **Reactive Forms**, **Bootstrap Icons**, **SweetAlert2** e integração total com a API RESTful do backend.

> 🔄 Projeto focado em produtividade, escalabilidade e clean code!

## 📚 Sumário

- [🧾 DeveloperStore - Frontend Angular](#-developerstore---frontend-angular)
  - [📚 Sumário](#-sumário)
  - [🛠 Tecnologias Utilizadas](#-tecnologias-utilizadas)
  - [✅ Principais Funcionalidades](#-principais-funcionalidades)
  - [🧱 Arquitetura do Projeto](#-arquitetura-do-projeto)
  - [▶️ Como Executar](#️-como-executar)
    - [Pré-requisitos](#pré-requisitos)
    - [Instalação](#instalação)
    - [Executar em desenvolvimento](#executar-em-desenvolvimento)
  - [📂 Estrutura de Pastas](#-estrutura-de-pastas)
  - [♻️ Padrões e Convenções](#️-padrões-e-convenções)
  - [👨‍💻 Autor](#-autor)

---

## 🛠 Tecnologias Utilizadas

- [Angular CLI 17+](https://angular.io/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [SweetAlert2](https://sweetalert2.github.io/)
- TypeScript + Signals API
- Reactive Forms
- Angular Standalone Components
- Lazy loading por rota
- Estrutura baseada em Services, Domain Models e Componentes

---

## ✅ Principais Funcionalidades

- 📋 Listagem de vendas com ações de visualizar, editar e excluir
- 🆕 Cadastro de nova venda com validação reativa
- ✏️ Edição completa de vendas existentes (via rota `/sales/:id/edit`)
- 📄 Visualização de detalhes da venda (`/sales/:id`)
- ⚠️ Confirmação e feedback com SweetAlert2
- 🎯 Recalculo automático de descontos por quantidade
- 🔢 Totalização de itens com base em regras de negócio
- 🧠 Uso de Signals e `@computed` para estados derivados

---

## 🧱 Arquitetura do Projeto

```text
/src
├── app
│   ├── services/                 # Serviços centralizados por entidade (Sales, Products, Customers etc)
│   ├── models/                   # Models e DTOs usados nos formulários e integração com API
│   ├── sale-form/               # Formulário principal (criação e edição de venda)
│   ├── sales-list/              # Listagem de vendas
│   ├── sale-detail/             # Detalhes da venda
│   ├── layout-sales/            # Componente de layout para rotas de vendas
│   └── app.routes.ts            # Arquivo de rotas standalone
```

---

## ▶️ Como Executar

### Pré-requisitos

* Node.js 18+
* Angular CLI 17+
* Backend rodando em `http://localhost:5211/api`

### Instalação

```bash
npm install
```

### Executar em desenvolvimento

```bash
ng serve
```

Acesse em:

```text
http://localhost:4200
```

---

## 📂 Estrutura de Pastas

* `sale-form`: gerenciamento completo da venda com formulário reativo, desconto automático e modo de edição
* `sales-list`: tabela responsiva com ações e ícones Bootstrap
* `sale-detail`: exibição elegante de detalhes de venda com botão de edição e voltar
* `services`: serviços organizados com `signals`, consumo da API REST e encapsulamento da lógica de estado
* `models`: DTOs bem tipados usados por comandos e entidades do frontend

---

## ♻️ Padrões e Convenções

* 🔁 Comunicação via serviços com Signals (`WritableSignal`, `computed`)
* ✅ Validação reativa (formControlName)
* 💡 Código organizado por responsabilidade (SRP, SOLID)
* 📦 Separação clara entre layout, componentes e lógica
* 🧼 Clean Code com nomes descritivos e ausência de lógica no template

---

## 👨‍💻 Autor

Desenvolvido por **Rafael de Souza Dias**

* GitHub: [rafasdiass](https://github.com/rafasdiass)
* E-mail: [rafasdiasdev@gmail.com](mailto:rafasdiasdev@gmail.com)
* LinkedIn: [linkedin.com/in/rdrafaeldias](https://www.linkedin.com/in/rdrafaeldias/)

---

📌 *Este projeto é parte do sistema DeveloperStore, criado com o objetivo de demonstrar práticas modernas de desenvolvimento frontend.*
