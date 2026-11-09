

Atue como profissional de Angular e especialista em segurança WEB com Angular.
Este projeto é para um profissional Designer de Interiores/Arquiteto mostrar seu portfolio, receber propostas e acompanhar projetos.

# Problema:
Atualmente, o Designer precisar se comunicar com cliente apenas por telefone e whatsapp para informar o status da obra, enviar fotos e registros. Isso o impede de ter um controle continuo e eficaz de vários projetos ao mesmo tempo, além de não formalizar algumas informações necessárias de forma centralizada. E o cliente fica refém da comunicação do Designer para receber atualização.

# Objetivo: 
Ter uma página web (também adaptada ao mobile) para centralizar o acompanhamento de uma obra pelo cliente e pelo designer, com fotos, descrições, orçamentos, documentos, status.


# Estrutura:
A estrutura da aplicação consiste em:

## Cabeçalho:
* Deve ter um botão de login e outros (ja está implementada)

## Pagina Inicial
* Comum a todos os usuários não logados

## Gestão do Designer (área logada do gestor)
* página principal, que será o painel de gestão com os projetos
* pagina de analise de pedido de projeto + orçamento
* página de projeto


### Fluxo 1:
Cliente solicita orçamento pelo site no formulário, que já temos.
Não é necessário estar logado.

### Fluxo 2:
Se o designer aceitar, responde com convite de cadastro no site. 

### Fluxo 3:
O login será apenas via Google Account. Crie um agente para entender esse funcionamento e te mostrar como implementar, garantindo segurança e integridade com todo projeto, sem deixar brecha para ataques externos ou injeção de qualquer dado perigoso.

### Fluxo 4:
O intuito é visibilidade dos estágios e comodos da obra.

#### Pagina Principal:
Contém uma lista dos projetos (painel de gestão) em que trabalha e os pendentes de resposta.
Esses projetos são clicaveis para ir para outra página.

* Os projetos desse painel devem conter Nome do Cliente, Status, Fase da Obra, Prazo Estimado, % Concluída. 
* Ao receber a proposta do cliente, o projeto tem status Orçamento. Ao clicar, abre a página de Aceite.
* Ao aceitar o projeto do cliente, o status se altera para Pendente de Cadastro. Ao clicar, abre a página de Projeto
* Ao confirmar o cadastro do cliente, o status é alterado para Iniciar. Ao clicar, abre a página de Projeto

#### Pagina de Aceite
O Designer recebe a proposta e analisa. Ele pode:
Aceitar -> Envia convite por email para o cliente solicitando cadastro no site
Recusar -> Enviar email de recusa.

#### Pagina de Projeto:
É acessada a partir do painel do gestor.
Terá as aba
* Acordo: visualizar o acordo realizado, formalizado
* Detalhes: detalhes do projeto, com contato, previsão de inicio e fim, valor, orçameento etc.
* Ambientes: os comodos firmados no acordo. A definir essa area.
* Documentos: documentos como planta baixa etc. a definir


## Página de acompanhamento da obra do Cliente (área logada do Cliente)
* a definir