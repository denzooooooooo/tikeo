import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

interface TicketData {
  eventTitle: string;
  eventDate: string;
  venue: string;
  ticketType: string;
  orderId: string;
}

interface EventData {
  eventTitle: string;
  eventDate: string;
  venue: string;
  daysUntil: number;
}

interface OrderData {
  orderId: string;
  total: number;
  eventTitle: string;
  ticketCount: number;
}

interface PromoData {
  code: string;
  discount: string;
  validUntil: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private isConfigured = false;
  private readonly fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('SENDGRID_API_KEY');
    this.fromEmail = this.configService.get('EMAIL_FROM', 'noreply@tikeo.com');
    
    if (apiKey) {
      sgMail.setApiKey(apiKey);
      this.isConfigured = true;
      this.logger.log('SendGrid email service initialized');
    } else {
      this.logger.warn('SENDGRID_API_KEY not configured - emails will be logged only');
    }
  }

  private async sendEmail(to: string, subject: string, html: string, text: string) {
    const msg = {
      to,
      from: this.fromEmail,
      subject,
      html,
      text,
    };

    if (this.isConfigured) {
      try {
        await sgMail.send(msg);
        this.logger.log('Email sent successfully to ' + to);
        return { success: true };
      } catch (error) {
        this.logger.error('Failed to send email to ' + to + ': ' + error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: errorMessage };
      }
    } else {
      this.logger.log('=== EMAIL (Not Sent - No API Key) ===');
      this.logger.log('To: ' + to);
      this.logger.log('From: ' + this.fromEmail);
      this.logger.log('Subject: ' + subject);
      return { success: true, dev: true };
    }
  }

  private getEmailHeader(title: string): string {
    return '<div style="background: linear-gradient(135deg, #5B7CFF 0%, #7B61FF 100%); padding: 30px; text-align: center;">' +
      '<h1 style="color: white; margin: 0; font-size: 28px;">Tikeo</h1></div>';
  }

  private getEmailFooter(): string {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    return '<div style="background-color: #f9f9f9; padding: 20px; text-align: center;">' +
      '<p style="color: #999999; font-size: 14px; margin: 0;">© ' + new Date().getFullYear() + ' Tikeo. Tous droits réservés.</p>' +
      '<p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">' +
      '<a href="' + baseUrl + '/contact" style="color: #5B7CFF; text-decoration: none;">Contact</a> • ' +
      '<a href="' + baseUrl + '/privacy" style="color: #5B7CFF; text-decoration: none;">Confidentialité</a> • ' +
      '<a href="' + baseUrl + '/cgu" style="color: #5B7CFF; text-decoration: none;">CGU</a></p></div>';
  }

  private getButton(url: string, text: string): string {
    return '<div style="text-align: center; margin: 30px 0;">' +
      '<a href="' + url + '" style="display: inline-block; background: linear-gradient(135deg, #5B7CFF 0%, #7B61FF 100%); ' +
      'color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">' +
      text + '</a></div>';
  }

  async sendVerificationEmail(email: string, token: string) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    const verifyUrl = baseUrl + '/verify-email?token=' + token;
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Vérifiez votre adresse email') +
      '<td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Vérifiez votre adresse email</h2>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Merci de vous être inscrit sur Tikeo! ' +
      'Cliquez sur le bouton ci-dessous pour vérifier votre adresse email et activer votre compte.</p>' +
      this.getButton(verifyUrl, 'Vérifier mon email') +
      '</td>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Vérifiez votre adresse email - Tikeo', html, 'Verify email: ' + verifyUrl);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = baseUrl + '/reset-password?token=' + token;
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Réinitialisation de mot de passe') +
      '<td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Réinitialisation de mot de passe</h2>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Vous avez demandé la réinitialisation de votre mot de passe. ' +
      'Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe. Ce lien expire dans 1 heure.</p>' +
      this.getButton(resetUrl, 'Réinitialiser mon mot de passe') +
      '</td>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Réinitialisation de votre mot de passe - Tikeo', html, 'Reset password: ' + resetUrl);
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Bienvenue sur Tikeo!') +
      '<td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Bienvenue ' + firstName + '!</h2>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Nous sommes ravis de vous avoir parmi nous!</p>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 10px 0;">Avec Tikeo, vous pouvez:</p>' +
      '<ul style="color:#666;font-size:16px;line-height:1.8;">' +
      '<li>Découvrir les meilleurs événements près de chez vous</li>' +
      '<li>Acheter vos billets en toute simplicité</li>' +
      '<li>Créer et gérer vos propres événements</li>' +
      '<li>Participer à des concours passionnants</li></ul>' +
      this.getButton(baseUrl + '/events', 'Découvrir les événements') +
      '</td>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Bienvenue ' + firstName + '! - Tikeo', html, 'Welcome to Tikeo, ' + firstName + '!');
  }

  async sendTicketEmail(email: string, ticketData: TicketData) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Vos billets pour ' + ticketData.eventTitle) +
      '<td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Vos billets</h2>' +
      '<div style="background:#f5f5f5;border-radius:8px;padding:20px;margin:20px 0;">' +
      '<p style="margin:5px 0;"><strong>Date:</strong> ' + ticketData.eventDate + '</p>' +
      '<p style="margin:5px 0;"><strong>Lieu:</strong> ' + ticketData.venue + '</p>' +
      '<p style="margin:5px 0;"><strong>Type:</strong> ' + ticketData.ticketType + '</p>' +
      '<p style="margin:5px 0;"><strong>Commande:</strong> ' + ticketData.orderId + '</p></div>' +
      '<p style="color:#666;font-size:16px;">Vous pouvez accéder à vos billets dans la section "Mes billets" de votre compte.</p>' +
      '<p style="color:#666;font-size:16px;">Pensez à arriver au moins 30 minutes avant le début!</p>' +
      this.getButton(baseUrl + '/tickets', 'Voir mes billets') +
      '</td>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Vos billets - ' + ticketData.eventTitle + ' - Tikeo', html, 'Your ticket for ' + ticketData.eventTitle);
  }

  async sendEventReminderEmail(email: string, eventData: EventData) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader(eventData.eventTitle + ' commence dans ' + eventData.daysUntil + ' jour(s)!') +
      '<td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Rappel: ' + eventData.eventTitle + '</h2>' +
      '<div style="background:#f5f5f5;border-radius:8px;padding:20px;margin:20px 0;">' +
      '<p style="margin:5px 0;"><strong>Date:</strong> ' + eventData.eventDate + '</p>' +
      '<p style="margin:5px 0;"><strong>Lieu:</strong> ' + eventData.venue + '</p></div>' +
      '<p style="color:#666;font-size:16px;">N\'oubliez pas vos billets!</p>' +
      this.getButton(baseUrl + '/tickets', 'Voir mes billets') +
      '</td>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Rappel: ' + eventData.eventTitle + ' bientôt! - Tikeo', html, 'Reminder: ' + eventData.eventTitle + ' is coming up');
  }

  async sendOrderConfirmationEmail(email: string, orderData: OrderData) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Confirmation de commande') +
      '<td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Merci pour votre achat!</h2>' +
      '<div style="background:#f5f5f5;border-radius:8px;padding:20px;margin:20px 0;">' +
      '<p style="margin:5px 0;"><strong>Commande:</strong> ' + orderData.orderId + '</p>' +
      '<p style="margin:5px 0;"><strong>Événement:</strong> ' + orderData.eventTitle + '</p>' +
      '<p style="margin:5px 0;"><strong>Billets:</strong> ' + orderData.ticketCount + '</p>' +
      '<p style="margin:5px 0;"><strong>Total:</strong> ' + orderData.total + '€</p></div>' +
      '<p style="color:#666;font-size:16px;">Vos billets vous ont été envoyés par email.</p>' +
      this.getButton(baseUrl + '/orders', 'Voir mes commandes') +
      '</td>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Confirmation commande ' + orderData.orderId + ' - Tikeo', html, 'Order confirmed: ' + orderData.orderId);
  }

  async sendPromoCodeEmail(email: string, promoData: PromoData) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Nouveau code promo exclusif!') +
      '<td style="padding:40px 30px;text-align:center;">' +
      '<p style="color:#666;font-size:16px;margin:0 0 20px 0;">Nous avons une offre spéciale pour vous!</p>' +
      '<div style="background:linear-gradient(135deg,#5B7CFF,#7B61FF);border-radius:8px;padding:30px;margin:20px 0;">' +
      '<p style="color:white;margin:0;font-size:14px;">Code promo</p>' +
      '<p style="color:white;margin:10px 0;font-size:32px;font-weight:bold;">' + promoData.code + '</p>' +
      '<p style="color:white;margin:0;font-size:18px;">' + promoData.discount + ' de réduction</p></div>' +
      '<p style="color:#666;font-size:16px;">Valide jusqu\'au ' + promoData.validUntil + '</p>' +
      this.getButton(baseUrl + '/events', 'Découvrir les événements') +
      '</td>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Code promo: ' + promoData.code + ' - Tikeo', html, 'Promo code: ' + promoData.code);
  }
}

