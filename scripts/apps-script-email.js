/**
 * Google Apps Script - Web App de Envio de E-mails Transacionais (Plano R$ 0)
 * 
 * Como implantar no Google Apps Script (script.google.com):
 * 1. Crie um novo projeto no Google Apps Script conectado à conta Gmail do Designer.
 * 2. Cole este código no arquivo Código.gs.
 * 3. Configure a propriedade de script DESIGNER_EMAIL com o e-mail do designer.
 * 4. Clique em "Implantar" > "Nova Implantação".
 * 5. Tipo: "Aplicativo da Web".
 *    - Executar como: "Eu" (conta do designer).
 *    - Quem tem acesso: "Qualquer pessoa" (ou autenticado).
 * 6. Copie a URL gerada e configure em environment.ts (campo appsScriptUrl).
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Validação básica do destinatário e corpo
    if (!data.to || !data.subject || !data.body) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Parâmetros incompletos (to, subject, body são obrigatórios)'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Limite de segurança e envio via GmailApp
    GmailApp.sendEmail(data.to, data.subject, data.body, {
      name: 'Estúdio de Design & Arquitetura',
      replyTo: Session.getActiveUser().getEmail()
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'E-mail enviado com sucesso para ' + data.to
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

