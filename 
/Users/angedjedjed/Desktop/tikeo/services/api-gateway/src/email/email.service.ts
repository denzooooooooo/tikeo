import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('SENDGRID_API_KEY');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
      this.isConfigured = true;
      this.logger.log('SendGrid email service initialized');
    } else {
      this.logger.warn('SENDGRID_API_KEY not configured - emails will be logged only');
    }
  }

  private async sendEmail(to: string, subject: string, html: string, text: string) {
    const fromEmail = this.configService.get('EMAIL_FROM', 'noreply@tikeo.com');
    
    const msg = {
      to,
      from: fromEmail,
      subject,
      html,
      text,
    };

    if (this.isConfigured) {
      try {
        await sgMail.send(msg);
        this.logger.log(`Email sent successfully to ${to}`);
        return { success: true };
      } catch (error) {
        this.logger.error(`Failed to send email to ${to}:`, error);
        return { success: false, error: error.message };
      }
    } else {
      // Log email content for development
      this.logger.log(`
        === EMAIL (Not Sent - No API Key) ===
        To: ${to}
        From: ${fromEmail}
        Subject: ${subject}
        Body: ${text}
      `);
      return { success: true, dev: true };
    }
  }

  private getEmailTemplate(title: string, content: string, buttonText?: string, buttonUrl?: string) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    const logoUrl = `${baseUrl}/logo.png`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #5B7CFF 0%, #7B61FF 100%); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Tikeo</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px;">${title}</h2>
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">${content}</p>
                    
                    ${buttonText && buttonUrl ? `
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${buttonUrl}" style="display: inline-block; background: linear-gradient(135deg, #5B7CFF 0%, #7B61FF 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                        ${buttonText}
                      </a>
                    </div>
                    ` : ''}
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center;">
                    <p style="color: #999999; font-size: 14px; margin: 0;">
                      © ${new Date().getFullYear()} Tikeo. Tous droits réservés.
                    </p>
                    <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                      <a href="${baseUrl}/contact" style="color: #5B7CFF; text-decoration: none;">Contact</a> • 
                      <a href="${baseUrl}/privacy" style="color: #5B7CFF; text-decoration: none;">Confidentialité</a> • 
                      <a href="${baseUrl}/cgu" style="color: #5B7CFF; text-decoration: none;">CGU</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  async sendVerificationEmail(email: string, token: string) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    const verifyUrl = `${baseUrl}/verify-email?token=${token}`;
    
    const html = this.getEmailTemplate(
      'Vérifiez votre adresse email',
      'Merci de vous être inscrit sur Tikeo! Cliquez sur le bouton ci-dessous pour vérifier votre adresse email et activer votre compte.',
      'Vérifier mon email',
      verifyUrl
    );

    return this.sendEmail(
      email,
      'Vérifiez votre adresse email - Tikeo',
      html,
      `Merci de vérifier votre email: ${verifyUrl}`
    );
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;
    
    const html = this.getEmailTemplate(
      'Réinitialisation de mot de passe',
      'Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe. Ce lien expire dans 1 heure.',
      'Réinitialiser mon mot de passe',
      resetUrl
    );

    return this.sendEmail(
      email,
      'Réinitialisation de votre mot de passe - Tikeo',
      html,
      `Reset password: ${resetUrl}`
    );
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = this.getEmailTemplate(
      'Bienvenue sur Tikeo! 🎉',
      `Bonjour ${firstName},<br><br>Bienvenue sur Tikeo! Nous sommes ravis de vous avoir parmi nous.<br><br>Avec Tikeo, vous pouvez:<br>• Découvrir les meilleurs événements près de chez vous<br>• Acheter vos billets en toute simplicité<br>• Créer et gérer vos propres événements<br>• Participer à des concours passionnants<br><br>Explorez dès maintenant notre plateforme!`,
      'Découvrir les événements',
      baseUrl
    );

    return this.sendEmail(
      email,
      `Bienvenue ${firstName}! - Tikeo`,
      html,
      `Welcome ${firstName} to Tikeo!`
    );
  }

  async sendTicketEmail(email: string, ticketData: {
    eventTitle: string;
    eventDate: string;
    venue: string;
    ticketType: string;
    orderId: string;
    qrCode?: string;
  }) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = this.getEmailTemplate(
      'Vos billets pour ' + ticketData.eventTitle! 🎫',
      `
      <p>Voici vos billets pour <strong>${ticketData.eventTitle}</strong></p>
      
      <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${ticketData.eventDate}</p>
        <p style="margin: 5px 0;"><strong>📍 Lieu:</strong> ${ticketData.venue}</p>
        <p style="margin: 5px 0;"><strong>🎫 Type:</strong> ${ticketData.ticketType}</p>
        <p style="margin: 5px 0;"><strong>📋 Commande:</strong> ${ticketData.orderId}</p>
      </div>
      
      <p>Vous pouvez accéder à vos billets anytime dans la section "Mes billets" de votre compte.</p>
      <p>Pensez à arriver au moins 30 minutes avant le début de l'événement!</p>
      `,
      'Voir mes billets',
      `${baseUrl}/tickets`
    );

    return this.sendEmail(
      email,
      `Vos billets - ${ticketData.eventTitle} - Tikeo`,
      html,
      `Your ticket for ${ticketData.eventTitle}`
    );
  }

  async sendEventReminderEmail(email: string, eventData: {
    eventTitle: string;
    eventDate: string;
    venue: string;
    daysUntil: number;
  }) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = this.getEmailTemplate(
      `${eventData.eventTitle} commence dans ${eventData.daysUntil} jour${eventData.daysUntil > 1 ? 's' : ''}! ⏰`,
      `
      <p>Bonjour,</p>
      <p>Nous vous rappelons que <strong>${eventData.eventTitle}</strong> commence bientôt!</p>
      
      <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${eventData.eventDate}</p>
        <p style="margin: 5px 0;"><strong>📍 Lieu:</strong> ${eventData.venue}</p>
      </div>
      
      <p>N'oubliez pas vos billets! 🫡</p>
      `,
      'Voir mes billets',
      `${baseUrl}/tickets`
    );

    return this.sendEmail(
      email,
      `Rappel: ${eventData.eventTitle} bientôt! - Tikeo`,
      html,
      `Reminder: ${eventData.eventTitle} is coming up`
    );
  }

  async sendOrderConfirmationEmail(email: string, orderData: {
    orderId: string;
    total: number;
    eventTitle: string;
    ticketCount: number;
  }) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = this.getEmailTemplate(
      'Confirmation de votre commande ✅',
      `
      <p>Merci pour votre achat! Votre commande a été confirmée.</p>
      
      <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>📋 Commande:</strong> ${orderData.orderId}</p>
        <p style="margin: 5px 0;"><strong>🎫 Événement:</strong> ${orderData.eventTitle}</p>
        <p style="margin: 5px 0;"><strong>🎟️ Billets:</strong> ${orderData.ticketCount}</p>
        <p style="margin: 5px 0;"><strong>💰 Total:</strong> ${orderData.total}€</p>
      </div>
      
      <p>Vos billets vous ont été envoyés par email et sont également disponibles dans votre compte.</p>
      `,
      'Voir mes commandes',
      `${baseUrl}/orders`
    );

    return this.sendEmail(
      email,
      `Confirmation commande ${orderData.orderId} - Tikeo`,
      html,
      `Order confirmed: ${orderData.orderId}`
    );
  }

  async sendNewsletterEmail(email: string, subject: string, content: string) {
    const html = this.getEmailTemplate(subject, content);
    return this.sendEmail(email, subject, html, content);
  }

  async sendPromoCodeEmail(email: string, promoData: {
    code: string;
    discount: string;
    validUntil: string;
  }) {
    const html = this.getEmailTemplate(
      'Nouveau code promo exclusif! 🎁',
      `
      <p>Bonjour,</p>
      <p>Nous avons une offre spéciale pour vous!</p>
      
      <div style="background: linear-gradient(135deg, #5B7CFF 0%, #7B61FF 100%); border-radius: 8px; padding: 30px; margin: 20px 0; text-align: center;">
        <p style="color: white; margin: 0; font-size: 14px;">Code promo</p>
        <p style="color: white; margin: 10px 0; font-size: 32px; font-weight: bold;">${promoData.code}</p>
        <p style="color: white; margin: 0; font-size: 18px;">${promoData.discount} de réduction</p>
      </div>
      
      <p>Valide jusqu'au ${promoData.validUntil}</p>
      <p>Utilisez ce code lors de votre prochaine réservation!</p>
      `,
      'Découvrir les événements',
      this.configService.get('FRONTEND_URL', 'http://localhost:3000') + '/events'
    );

    return this.sendEmail(
      email,
      `Code promo: ${promoData.code} - Tikeo`,
      html,
      `Promo code: ${promoData.code}`
    );
  }
}

