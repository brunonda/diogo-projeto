# Especificação do Projeto (Atualizada)

> **Novas Diretrizes do Projeto:**
> 1. **Clientes NÃO realizam login no site**: Acesso autenticado é de uso estritamente restrito ao Designer. Visitantes e clientes interagem através da visualização pública do portfólio de projetos e fotografias, além do envio de propostas/contato pelo formulário de briefing.
> 2. **Designer faz login exclusivamente para postar novas fotos em seus projetos**: Sem máquinas de estado (status), sem fases de obra, sem gestão de cronogramas, contratos ou aprovações. O foco da área autenticada é a gestão do portfólio e galeria de fotografias.

---

## 1. Contexto e Objetivo
Aplicação web moderna e responsiva para um profissional de Arquitetura e Design de Interiores (Diogo) apresentar seu portfólio de alta resolução, receber solicitações de novos clientes pelo site e publicar continuamente novas fotografias dos seus projetos e ambientes concluídos.

## 2. Perfis de Usuário
| Perfil | Autenticação | Permissões |
|---|---|---|
| **Visitante / Cliente** | Não | Navega pelo site, visualiza a galeria pública de projetos e fotografias em alta resolução (lightbox) e envia propostas de orçamento via formulário |
| **Designer (Admin)** | Google (Allowlist) | Acessa a área restrita do estúdio para cadastrar novos projetos e postar/gerenciar fotografias |

## 3. Estrutura da Aplicação

### 3.1 Página Inicial (Pública)
* **Navbar:** Navegação suave pelas seções (Abordagem, Serviços, Projetos, Iniciar Projeto) e botão para a Área do Designer.
* **Hero & Apresentação:** Destaque institucional do estúdio com chamada para ação.
* **Serviços:** Detalhamento do escopo de atuação em design e arquitetura.
* **Portfólio Dinâmico & Galeria:**
  * Exibe os projetos cadastrados com suas fotografias de alta resolução.
  * Filtro por categorias (*Todos, Residencial, Comercial / Home Office, Interiores, etc.*).
  * Modal/Lightbox interativo de galeria: permite visualizar todas as fotos do projeto em tela cheia com legendas, miniaturas e controles de navegação anterior/próximo.
* **Briefing / Solicitação de Orçamento:** Formulário para captação de clientes com proteção honeypot e envio de confirmação.

### 3.2 Área do Designer (Restrita - `/designer`)
* **Login (`/login`):**
  * Autenticação exclusiva com Google Identity / Firebase Auth.
  * Validação de e-mail na allowlist do backend/ambiente (`environment.designerEmail`).
  * Rejeição automática de qualquer tentativa de login não autorizada.
* **Painel de Projetos (`/designer`):**
  * Visão geral de todos os projetos cadastrados e total de fotos publicadas.
  * Busca em tempo real por título, categoria e descrição.
  * Botão `+ Novo Projeto`: criação rápida com título, categoria, descrição e foto de capa.
  * Ações rápidas de exclusão e atalho para gerenciamento de fotos.
* **Gerenciador de Fotos do Projeto (`/designer/projeto/:id`):**
  * Postagem direta de novas fotos por URL com pré-visualização instantânea.
  * Opção de incluir legendas descritivas para cada fotografia.
  * Definição rápida da foto principal (capa do projeto).
  * Remoção individual de fotografias.
  * Edição de dados do projeto (título, categoria, descrição).

## 4. Segurança e Regras do Firebase (`firestore.rules`)
* **Coleção `projects`:**
  * Leitura pública (`allow read: if true;`) para exibição dinâmica no portfólio.
  * Escrita restrita ao Designer autenticado via token Google verificado (`isDesigner()`).
* **Coleção `projectRequests`:**
  * Criação aberta com validação estrita dos campos obrigatórios (nome, email, telefone, descrição).
  * Leitura e gestão restritas ao Designer.
* **Logs de Auditoria:**
  * Registro de ações do Designer (criação de projetos, publicação de fotos, exclusões).
