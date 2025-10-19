/**
 * Service d'envoi d'emails
 * 
 * Pour activer les emails, vous devez :
 * 1. Installer Resend : npm install resend
 * 2. Obtenir une clé API sur https://resend.com
 * 3. Ajouter RESEND_API_KEY dans .env.local
 * 
 * Alternative : Utiliser SendGrid, Mailgun, ou tout autre service SMTP
 */

interface EmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  // Pour l'instant, on log uniquement (pour le développement)
  // Vous pouvez activer Resend en décommentant le code ci-dessous
  
  console.log('📧 Email à envoyer:', {
    to,
    subject,
    preview: html.substring(0, 100)
  })

  // Vérifier si Resend est configuré
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY non configuré - email non envoyé')
    return { success: false, message: 'Service email non configuré' }
  }

  try {
    // Code pour Resend (à activer après installation)
    /*
    const { Resend } = require('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: 'AI Image Editor <noreply@votredomaine.com>',
      to: [to],
      subject: subject,
      html: html,
    })

    if (error) {
      console.error('Erreur envoi email:', error)
      return { success: false, error }
    }

    console.log('✅ Email envoyé avec succès:', data)
    return { success: true, data }
    */

    // Pour l'instant, simuler l'envoi
    return { 
      success: true, 
      message: 'Email simulé (configurez RESEND_API_KEY pour un envoi réel)' 
    }

  } catch (error) {
    console.error('Erreur envoi email:', error)
    return { success: false, error }
  }
}

// Template pour échec de paiement
export function getPaymentFailedEmailHtml(userName: string, amount: number, currency: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #f59e0b;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            border-radius: 15px;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          h1 {
            color: #dc2626;
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px 0;
          }
          .alert {
            background: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .amount {
            font-size: 20px;
            font-weight: bold;
            color: #dc2626;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡</div>
            <h1>Échec du paiement</h1>
          </div>
          
          <div class="content">
            <p>Bonjour ${userName},</p>
            
            <div class="alert">
              <p><strong>Votre paiement n'a pas pu être traité.</strong></p>
              <p class="amount">Montant : ${amount.toFixed(2)} ${currency.toUpperCase()}</p>
            </div>
            
            <p>Le paiement pour votre génération d'image n'a pas abouti. Cela peut être dû à :</p>
            <ul>
              <li>Fonds insuffisants sur votre carte</li>
              <li>Informations de carte incorrectes</li>
              <li>Restrictions bancaires</li>
              <li>Carte expirée</li>
            </ul>
            
            <p><strong>Que faire maintenant ?</strong></p>
            <p>Vous pouvez réessayer avec une autre carte ou vérifier les informations de votre carte bancaire.</p>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" class="button">
                Réessayer le paiement
              </a>
            </center>
          </div>
          
          <div class="footer">
            <p>AI Image Editor - Propulsé par l'IA</p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

// Template pour annulation d'abonnement
export function getSubscriptionCancelledEmailHtml(userName: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #f59e0b;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            border-radius: 15px;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          h1 {
            color: #1f2937;
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px 0;
          }
          .info-box {
            background: #f3f4f6;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡</div>
            <h1>Abonnement annulé</h1>
          </div>
          
          <div class="content">
            <p>Bonjour ${userName},</p>
            
            <div class="info-box">
              <p><strong>Votre abonnement a été annulé avec succès.</strong></p>
            </div>
            
            <p>Nous confirmons l'annulation de votre abonnement AI Image Editor.</p>
            
            <p><strong>Que se passe-t-il maintenant ?</strong></p>
            <ul>
              <li>Vous ne serez plus facturé</li>
              <li>Vos données restent sauvegardées pendant 30 jours</li>
              <li>Vous pouvez vous réabonner à tout moment</li>
            </ul>
            
            <p>Nous sommes désolés de vous voir partir ! Si vous avez des commentaires ou des suggestions, n'hésitez pas à nous contacter.</p>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" class="button">
                Retour au Dashboard
              </a>
            </center>
          </div>
          
          <div class="footer">
            <p>AI Image Editor - Propulsé par l'IA</p>
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
