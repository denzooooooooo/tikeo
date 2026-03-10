import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as QRCode from 'qrcode';
import PDFDocument from 'pdfkit';

interface TicketData {
  eventTitle: string;
  eventDate: string;
  venue: string;
  ticketType: string;
  orderId: string;
  qrCode?: string;
  ticketId?: string;
  eventCoverImage?: string;
  buyerFirstName?: string;
  buyerLastName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  ticketDesign?: {
    template?: string | null;
    backgroundUrl?: string | null;
    primaryColor?: string | null;
    secondaryColor?: string | null;
    textColor?: string | null;
    showQr?: boolean | null;
    showSeat?: boolean | null;
    showTerms?: boolean | null;
    customTitle?: string | null;
    footerNote?: string | null;
  };
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

interface OrganizerPayoutReminderData {
  organizerName: string;
  eventTitle: string;
  payoutSetupUrl: string;
}

interface OrganizerPayoutCompletedData {
  organizerName: string;
  companyName: string;
  amount: number;
  currency: string;
  method: string;
  reference: string;
  payoutDate: string;
  balanceRemaining: number;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;
  private isConfigured = false;
  private readonly fromEmail: string;

  constructor(private configService: ConfigService) {
    //优先使用 RESEND_API_KEY (推荐方式)
    const resendApiKey = this.configService.get('RESEND_API_KEY');
    this.fromEmail = this.configService.get('SMTP_FROM') || 'Tikeoh <onboarding@resend.dev>';

    if (resendApiKey) {
      this.resend = new Resend(resendApiKey);
      this.isConfigured = true;
      this.logger.log('✅ Resend email service initialized with RESEND_API_KEY');
    } else {
      // 回退: 尝试使用 SMTP (为了向后兼容)
      const smtpHost = this.configService.get('SMTP_HOST');
      const smtpPort = Number(this.configService.get('SMTP_PORT') || 587);
      const smtpUser = this.configService.get('SMTP_USER');
      const smtpPass = this.configService.get('SMTP_PASS');
      
      if (smtpHost && smtpPort && smtpUser && smtpPass) {
        this.isConfigured = true;
        this.logger.warn(`⚠️ Using SMTP fallback (${smtpHost}:${smtpPort}) - Consider using RESEND_API_KEY instead`);
      } else {
        this.logger.error('❌ No email service configured. Set RESEND_API_KEY or SMTP_* variables.');
      }
    }
  }

  // 获取配置状态 (供 health 检查使用)
  getConfigStatus() {
    const resendApiKey = this.configService.get('RESEND_API_KEY');
    const smtpHost = this.configService.get('SMTP_HOST');
    
    return {
      isConfigured: this.isConfigured,
      provider: resendApiKey ? 'resend' : (smtpHost ? 'smtp' : 'none'),
      fromEmail: this.fromEmail,
      hasResendKey: !!resendApiKey,
      hasSmtp: !!smtpHost,
    };
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    text: string,
    attachments?: Array<{ filename: string; content: string }>
  ) {
    if (!this.isConfigured) {
      this.logger.error('=== EMAIL NOT SENT (NO EMAIL SERVICE CONFIGURED) ===');
      return { success: false, error: 'EMAIL_SERVICE_NOT_CONFIGURED' };
    }

    const replyTo = this.configService.get('SMTP_REPLY_TO');

    if (this.resend) {
      try {
        const result = await this.resend.emails.send({
          from: this.fromEmail,
          to: [to],
          subject,
          html,
          text,
          ...(attachments && attachments.length > 0 ? { attachments } : {}),
          ...(replyTo ? { replyTo } : {}),
          headers: {
            'X-Entity-Ref-ID': `tikeo-${Date.now()}`,
          },
        });

        if (result.error) {
          this.logger.error(`Failed to send email to ${to}: ${result.error.message}`);
          return { success: false, error: result.error.message };
        }

        this.logger.log(`✅ Email sent successfully to ${to} (id: ${result.data?.id})`);
        return { success: true, messageId: result.data?.id };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Failed to send email to ${to}: ${errorMessage}`);
        return { success: false, error: errorMessage };
      }
    }

    this.logger.error('=== SMTP NOT IMPLEMENTED IN NEW VERSION ===');
    return { success: false, error: 'SMTP_FALLBACK_NOT_IMPLEMENTED' };
  }

  private getEmailHeader(title: string): string {
    return '<div style="background: linear-gradient(135deg, #5B7CFF 0%, #7B61FF 100%); padding: 30px; text-align: center;">' +
      '<h1 style="color: white; margin: 0; font-size: 28px;">Tikeoh</h1></div>';
  }

  private getEmailFooter(): string {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    return '<div style="background-color: #f9f9f9; padding: 20px; text-align: center;">' +
      '<p style="color: #999999; font-size: 14px; margin: 0;">© ' + new Date().getFullYear() + ' Tikeoh. Tous droits réservés.</p>' +
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
      '<tr><td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Vérifiez votre adresse email</h2>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Merci de vous être inscrit sur Tikeoh! ' +
      'Cliquez sur le bouton ci-dessous pour vérifier votre adresse email et activer votre compte.</p>' +
      this.getButton(verifyUrl, 'Vérifier mon email') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Vérifiez votre adresse email - Tikeoh', html, 'Verify email: ' + verifyUrl);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = baseUrl + '/reset-password?token=' + token;
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Réinitialisation de mot de passe') +
      '<tr><td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Réinitialisation de mot de passe</h2>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Vous avez demandé la réinitialisation de votre mot de passe. ' +
      'Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe. Ce lien expire dans 1 heure.</p>' +
      this.getButton(resetUrl, 'Réinitialiser mon mot de passe') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Réinitialisation de votre mot de passe - Tikeoh', html, 'Reset password: ' + resetUrl);
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Bienvenue sur Tikeoh!') +
      '<tr><td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Bienvenue ' + firstName + '!</h2>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Nous sommes ravis de vous avoir parmi nous!</p>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 10px 0;">Avec Tikeoh, vous pouvez:</p>' +
      '<ul style="color:#666;font-size:16px;line-height:1.8;">' +
      '<li>Découvrir les meilleurs événements près de chez vous</li>' +
      '<li>Acheter vos billets en toute simplicité</li>' +
      '<li>Créer et gérer vos propres événements</li>' +
      '<li>Participer à des concours passionnants</li></ul>' +
      this.getButton(baseUrl + '/events', 'Découvrir les événements') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Bienvenue ' + firstName + '! - Tikeoh', html, 'Welcome to Tikeoh, ' + firstName + '!');
  }

  private async generateTicketPdfBuffer(ticketData: TicketData, qrImage: string): Promise<Buffer> {
    const design = ticketData.ticketDesign || {};
    const template = (design.template || 'CLASSIC').toUpperCase();
    const primary = design.primaryColor || '#5B7CFF';
    const secondary = design.secondaryColor || '#7B61FF';
    const textColor = design.textColor || '#FFFFFF';
    const title = design.customTitle || 'Billet officiel';
    const footerNote = design.footerNote || 'Merci de présenter ce billet à l’entrée.';
    const showQr = design.showQr !== false;

    const buyerName = `${ticketData.buyerFirstName || ''} ${ticketData.buyerLastName || ''}`.trim() || 'Non renseigné';
    const buyerEmail = ticketData.buyerEmail || 'Non renseigné';
    const buyerPhone = ticketData.buyerPhone || 'Non renseigné';

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk as Buffer));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Fond global
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f1220');

      // Variantes template (forme/layout)
      if (template === 'MINIMAL') {
        doc.rect(40, 40, doc.page.width - 80, 740).fill('#ffffff');
        doc.rect(40, 40, doc.page.width - 80, 8).fill(primary);
      } else if (template === 'MODERN') {
        doc
          .save()
          .linearGradient(0, 0, doc.page.width, 220)
          .stop(0, primary)
          .stop(1, secondary);
        doc.rect(0, 0, doc.page.width, 220).fill(primary);
        doc.restore();
        doc.roundedRect(30, 170, doc.page.width - 60, 600, 16).fill('#13172b');
      } else {
        // CLASSIC + fallback
        doc
          .save()
          .rect(40, 40, doc.page.width - 80, 110)
          .fill(primary)
          .restore();
        doc.roundedRect(40, 170, doc.page.width - 80, 560, 12).fill('#13172b');
      }

      const lightText = template === 'MINIMAL' ? '#111827' : '#e8eeff';
      const bodyText = template === 'MINIMAL' ? '#374151' : '#d9e1ff';
      const cardBg = template === 'MINIMAL' ? '#f8fafc' : '#13172b';

      // Header
      doc
        .fontSize(24)
        .fillColor(template === 'MINIMAL' ? '#111827' : '#ffffff')
        .text(`🎫 ${title}`, 60, 72, { width: doc.page.width - 120 });

      doc
        .fontSize(11)
        .fillColor(lightText)
        .text('Tikeoh • Billet officiel', 60, 108);

      // Carte principale
      if (template === 'MINIMAL') {
        doc.roundedRect(55, 170, doc.page.width - 110, 560, 10).fill(cardBg);
      }

      doc
        .fontSize(22)
        .fillColor(template === 'MINIMAL' ? '#111827' : textColor)
        .text(ticketData.eventTitle, 60, 200, { width: 320 });

      const detailsY = 260;
      doc.fontSize(12).fillColor(bodyText);
      doc.text(`Date: ${ticketData.eventDate}`, 60, detailsY);
      doc.text(`Lieu: ${ticketData.venue}`, 60, detailsY + 24);
      doc.text(`Type: ${ticketData.ticketType}`, 60, detailsY + 48);
      doc.text(`Commande: ${ticketData.orderId}`, 60, detailsY + 72);
      if (ticketData.ticketId) doc.text(`Billet ID: ${ticketData.ticketId}`, 60, detailsY + 96);

      if (ticketData.eventCoverImage) {
        try {
          doc.roundedRect(390, 410, 150, 100, 8).fill('#ffffff');
          doc.image(ticketData.eventCoverImage, 394, 414, { width: 142, height: 92 });
        } catch {}
      }

      if (showQr && qrImage) {
        doc.roundedRect(390, 240, 150, 150, 8).fill('#ffffff');
        doc.image(qrImage, 400, 250, { width: 130, height: 130 });
      }

      // Infos acheteur (toujours visibles)
      let buyerY = 520;
      doc.fontSize(12).fillColor(lightText).text('Acheteur', 60, buyerY);
      buyerY += 20;
      doc.fontSize(11).fillColor(bodyText);
      doc.text(`Nom: ${buyerName}`, 60, buyerY);
      doc.text(`Email: ${buyerEmail}`, 60, buyerY + 18);
      doc.text(`Téléphone: ${buyerPhone}`, 60, buyerY + 36);

      // Fallback manuel scan
      doc
        .fontSize(11)
        .fillColor(lightText)
        .text('Vérification manuelle (fallback scanner)', 60, 600);

      doc
        .fontSize(10)
        .fillColor(bodyText)
        .text(`Commande: ${ticketData.orderId}`, 60, 618);

      if (ticketData.ticketId) {
        doc
          .fontSize(10)
          .fillColor(bodyText)
          .text(`Billet ID: ${ticketData.ticketId}`, 220, 618);
      }

      if (ticketData.qrCode) {
        doc
          .fontSize(9)
          .fillColor(template === 'MINIMAL' ? '#4b5563' : '#9aa6d1')
          .text(`QR texte: ${ticketData.qrCode}`, 60, 634, { width: 480, lineBreak: false });
      }

      doc
        .fontSize(10)
        .fillColor(template === 'MINIMAL' ? '#4b5563' : '#8d98be')
        .text(footerNote, 60, 654, { width: 480, lineGap: 3 });

      doc
        .fontSize(10)
        .fillColor(primary)
        .text(`Document généré par Tikeoh • ${new Date().toLocaleString('fr-FR')}`, 60, 700);

      doc.end();
    });
  }

  async sendTicketEmail(email: string, ticketData: TicketData) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');

    const qrData = ticketData.qrCode || '';
    const qrImage = qrData ? await QRCode.toDataURL(qrData) : '';
    const design = ticketData.ticketDesign || {};
    const primary = design.primaryColor || '#5B7CFF';
    const secondary = design.secondaryColor || '#7B61FF';
    const customTitle = design.customTitle || 'Billet officiel';
    const footerNote = design.footerNote || 'Merci de présenter ce billet à l\'entrée.';
    const showQr = design.showQr !== false;
    const showTerms = design.showTerms !== false;

    const backgroundImage = design.backgroundUrl
      ? 'background-image:url(\'' + design.backgroundUrl + '\');background-size:cover;background-position:center;'
      : '';
    const textColor = design.textColor || '#FFFFFF';

    const pdfBuffer = await this.generateTicketPdfBuffer(ticketData, qrImage);
    const pdfBase64 = pdfBuffer.toString('base64');

    const buyerName = `${ticketData.buyerFirstName || ''} ${ticketData.buyerLastName || ''}`.trim();
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#0f1220;">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1220;padding:24px 12px;"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#13172b;border:1px solid #202642;border-radius:16px;overflow:hidden;">' +
      '<tr><td style="background: linear-gradient(135deg, ' + primary + ' 0%, ' + secondary + ' 100%); padding: 26px 28px; text-align: left; color: white;">' +
      '<h1 style="margin:0;font-size:26px;line-height:1.2;">🎫 ' + customTitle + '</h1>' +
      '<p style="margin:8px 0 0 0;opacity:.95;font-size:13px;">Billet officiel Tikeoh • Présentez ce QR code à l’entrée</p></td></tr>' +
      '<tr><td style="padding:22px;">' +
      '<div style="border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.08);' + backgroundImage + '">' +
      '<div style="background:rgba(8,10,16,.72);padding:20px;color:' + textColor + ';">' +
      '<h2 style="margin:0 0 12px 0;font-size:22px;color:#fff;">' + ticketData.eventTitle + '</h2>' +
      (ticketData.eventCoverImage
        ? '<div style="margin:0 0 12px 0;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,.15);">' +
          '<img src="' + ticketData.eventCoverImage + '" alt="Image événement" style="width:100%;max-height:170px;object-fit:cover;display:block;" />' +
          '</div>'
        : '') +
      '<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.7;color:#d9e1ff;">' +
      '<tr><td style="padding:3px 0;"><strong>Date</strong></td><td style="padding:3px 0;text-align:right;">' + ticketData.eventDate + '</td></tr>' +
      '<tr><td style="padding:3px 0;"><strong>Lieu</strong></td><td style="padding:3px 0;text-align:right;">' + ticketData.venue + '</td></tr>' +
      '<tr><td style="padding:3px 0;"><strong>Type</strong></td><td style="padding:3px 0;text-align:right;">' + ticketData.ticketType + '</td></tr>' +
      '<tr><td style="padding:3px 0;"><strong>Commande</strong></td><td style="padding:3px 0;text-align:right;">' + ticketData.orderId + '</td></tr>' +
      (ticketData.ticketId ? '<tr><td style="padding:3px 0;"><strong>Billet ID</strong></td><td style="padding:3px 0;text-align:right;">' + ticketData.ticketId + '</td></tr>' : '') +
      '</table>' +
      '</div></div>' +
      '<div style="margin-top:14px;padding:12px;border:1px solid rgba(255,255,255,.12);border-radius:10px;background:rgba(255,255,255,.03);">' +
      '<p style="margin:0 0 8px 0;color:#ffffff;font-size:13px;font-weight:700;">Acheteur</p>' +
      (buyerName ? '<p style="margin:0;color:#d9e1ff;font-size:13px;">Nom: ' + buyerName + '</p>' : '') +
      (ticketData.buyerEmail ? '<p style="margin:4px 0 0 0;color:#d9e1ff;font-size:13px;">Email: ' + ticketData.buyerEmail + '</p>' : '') +
      (ticketData.buyerPhone ? '<p style="margin:4px 0 0 0;color:#d9e1ff;font-size:13px;">Téléphone: ' + ticketData.buyerPhone + '</p>' : '') +
      '</div>' +
      '<div style="margin-top:10px;padding:12px;border:1px dashed rgba(123,97,255,.6);border-radius:10px;background:rgba(123,97,255,.08);">' +
      '<p style="margin:0 0 8px 0;color:#ffffff;font-size:13px;font-weight:700;">Vérification manuelle (si scan impossible)</p>' +
      '<p style="margin:0;color:#d9e1ff;font-size:12px;line-height:1.6;">Commande: ' + ticketData.orderId + '</p>' +
      (ticketData.ticketId ? '<p style="margin:2px 0 0 0;color:#d9e1ff;font-size:12px;line-height:1.6;">Billet ID: ' + ticketData.ticketId + '</p>' : '') +
      (ticketData.qrCode ? '<p style="margin:2px 0 0 0;color:#9fb0e8;font-size:11px;line-height:1.5;word-break:break-all;">QR texte: ' + ticketData.qrCode + '</p>' : '') +
      '</div>' +
      (showQr && qrImage
        ? '<div style="text-align:center;margin:18px 0 10px 0;">' +
          '<div style="display:inline-block;background:#fff;padding:12px;border-radius:12px;border:1px solid #eceff9;">' +
          '<img src="' + qrImage + '" alt="QR Code billet" style="width:180px;height:180px;display:block;" />' +
          '</div></div>'
        : '') +
      (showQr && ticketData.qrCode ? '<p style="color:#96a1c6;font-size:11px;text-align:center;word-break:break-all;margin:8px 0 0 0;">' + ticketData.qrCode + '</p>' : '') +
      '<p style="color:#cfd6f6;font-size:14px;line-height:1.6;margin:18px 0 0 0;">Cher client, voici votre billet pour l’événement. Le PDF est joint à cet email.</p>' +
      '<p style="color:#cfd6f6;font-size:14px;line-height:1.6;margin:8px 0 0 0;">Arrivez 30 minutes avant le début de l’événement pour faciliter le contrôle.</p>' +
      (showTerms ? '<p style="color:#8d98be;font-size:12px;line-height:1.5;margin:12px 0 0 0;">' + footerNote + '</p>' : '') +
      this.getButton(baseUrl + '/tickets', 'Voir mes billets') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(
      email,
      'Vos billets - ' + ticketData.eventTitle + ' - Tikeoh',
      html,
      'Cher client, voici votre billet pour l’événement ' + ticketData.eventTitle,
      [
        {
          filename: `ticket-${ticketData.orderId}-${ticketData.ticketId || 'document'}.pdf`,
          content: pdfBase64,
        },
      ],
    );
  }

  async sendEventReminderEmail(email: string, eventData: EventData) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader(eventData.eventTitle + ' commence dans ' + eventData.daysUntil + ' jour(s)!') +
      '<tr><td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Rappel: ' + eventData.eventTitle + '</h2>' +
      '<div style="background:#f5f5f5;border-radius:8px;padding:20px;margin:20px 0;">' +
      '<p style="margin:5px 0;"><strong>Date:</strong> ' + eventData.eventDate + '</p>' +
      '<p style="margin:5px 0;"><strong>Lieu:</strong> ' + eventData.venue + '</p></div>' +
      '<p style="color:#666;font-size:16px;">N\'oubliez pas vos billets!</p>' +
      this.getButton(baseUrl + '/tickets', 'Voir mes billets') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Rappel: ' + eventData.eventTitle + ' - Tikeoh', html, 'Reminder: ' + eventData.eventTitle);
  }

  async sendOrderConfirmationEmail(email: string, orderData: OrderData) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Confirmation de commande') +
      '<tr><td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Merci pour votre achat!</h2>' +
      '<div style="background:#f5f5f5;border-radius:8px;padding:20px;margin:20px 0;">' +
      '<p style="margin:5px 0;"><strong>Commande:</strong> ' + orderData.orderId + '</p>' +
      '<p style="margin:5px 0;"><strong>Événement:</strong> ' + orderData.eventTitle + '</p>' +
      '<p style="margin:5px 0;"><strong>Billets:</strong> ' + orderData.ticketCount + '</p>' +
      '<p style="margin:5px 0;"><strong>Total:</strong> ' + orderData.total + '€</p></div>' +
      '<p style="color:#666;font-size:16px;">Vos billets vous ont été envoyés par email.</p>' +
      this.getButton(baseUrl + '/orders', 'Voir mes commandes') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Confirmation commande ' + orderData.orderId + ' - Tikeoh', html, 'Order confirmed: ' + orderData.orderId);
  }

  async sendOrganizerPayoutReminderEmail(email: string, data: OrganizerPayoutReminderData) {
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Action requise: configurez vos informations de paiement') +
      '<tr><td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Bonjour ' + data.organizerName + ',</h2>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Vous avez des ventes sur votre événement <strong>' + data.eventTitle + '</strong>, ' +
      'mais vos informations de payout ne sont pas complètes.</p>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Pour recevoir vos paiements sans retard, complétez votre configuration maintenant.</p>' +
      this.getButton(data.payoutSetupUrl, 'Configurer mes informations payout') +
      '<p style="color:#999;font-size:13px;line-height:1.5;margin:18px 0 0 0;">Cet email est transactionnel et lié à vos revenus organisateur.</p>' +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(
      email,
      'Action requise: informations payout manquantes - Tikeoh',
      html,
      'Vos informations payout sont incomplètes. Configurez-les ici: ' + data.payoutSetupUrl,
    );
  }

  async sendPromoCodeEmail(email: string, promoData: PromoData) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Nouveau code promo exclusif!') +
      '<tr><td style="padding:40px 30px;text-align:center;">' +
      '<p style="color:#666;font-size:16px;margin:0 0 20px 0;">Nous avons une offre spéciale pour vous!</p>' +
      '<div style="background:linear-gradient(135deg,#5B7CFF,#7B61FF);border-radius:8px;padding:30px;margin:20px 0;">' +
      '<p style="color:white;margin:0;font-size:14px;">Code promo</p>' +
      '<p style="color:white;margin:10px 0;font-size:32px;font-weight:bold;">' + promoData.code + '</p>' +
      '<p style="color:white;margin:0;font-size:18px;">' + promoData.discount + ' de réduction</p></div>' +
      '<p style="color:#666;font-size:16px;">Valide jusqu\'au ' + promoData.validUntil + '</p>' +
      this.getButton(baseUrl + '/events', 'Découvrir les événements') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, 'Code promo: ' + promoData.code + ' - Tikeoh', html, 'Promo code: ' + promoData.code);
  }

  async sendOrganizerPayoutCompletedEmail(email: string, data: OrganizerPayoutCompletedData) {
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const formattedAmount = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: data.currency,
    }).format(data.amount);

    const formattedBalance = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: data.currency,
    }).format(data.balanceRemaining);

    const methodLabels: Record<string, string> = {
      BANK_TRANSFER: 'Virement bancaire',
      MOBILE_MONEY: 'Mobile Money',
      PAYPAL: 'PayPal',
    };

    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('💰 Paiement reçu!') +
      '<tr><td style="padding:40px 30px;">' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">Bonjour ' + data.organizerName + ',</h2>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Nous avons le plaisir de vous informer qu\'un paiement a été effectué vers votre compte.</p>' +
      '<div style="background:linear-gradient(135deg,#10b981,#059669);border-radius:12px;padding:24px;margin:20px 0;text-align:center;">' +
      '<p style="color:white;margin:0;font-size:14px;">Montant reçu</p>' +
      '<p style="color:white;margin:8px 0;font-size:36px;font-weight:bold;">' + formattedAmount + '</p></div>' +
      '<div style="background:#f5f5f5;border-radius:8px;padding:20px;margin:20px 0;">' +
      '<table width="100%" cellpadding="0" cellspacing="0">' +
      '<tr><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>Organisation:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">' + data.companyName + '</td></tr>' +
      '<tr><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>Méthode:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">' + (methodLabels[data.method] || data.method) + '</td></tr>' +
      '<tr><td style="padding:8px 0;border-bottom:1px solid #eee;"><strong>Référence:</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-family:monospace;">' + data.reference + '</td></tr>' +
      '<tr><td style="padding:8px 0;"><strong>Date:</strong></td><td style="padding:8px 0;text-align:right;">' + data.payoutDate + '</td></tr>' +
      '</table></div>' +
      (data.balanceRemaining > 0 
        ? '<p style="color:#666;font-size:14px;margin:20px 0 0 0;">Solde restant à payer: <strong>' + formattedBalance + '</strong></p>'
        : '<p style="color:#10b981;font-size:14px;margin:20px 0 0 0;">✅ Tous vos paiements ont été effectués!</p>'
      ) +
      this.getButton(baseUrl + '/dashboard/payouts', 'Voir mes paiements') +
      '<p style="color:#999;font-size:12px;line-height:1.5;margin:20px 0 0 0;">Cet email confirme le paiement de vos revenus sur Tikeoh. Pour toute question, contactez notre support.</p>' +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(
      email,
      'Paiement reçu: ' + formattedAmount + ' - Tikeoh',
      html,
      'Votre paiement de ' + formattedAmount + ' a été effectué vers votre compte.',
    );
  }

  buildNewsletterWelcomeTemplate(data: { firstName: string }) {
    const safeName = data.firstName || 'à vous';
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');

    return '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f6f7fb;">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #eceff5;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader('Bienvenue sur la newsletter Tikeoh') +
      '<tr><td style="padding:32px 28px;">' +
      '<h2 style="margin:0 0 14px 0;color:#111827;font-size:24px;">Bonjour ' + safeName + ',</h2>' +
      '<p style="margin:0 0 12px 0;color:#374151;font-size:15px;line-height:1.6;">Votre inscription à la newsletter Tikeoh est confirmée.</p>' +
      '<p style="margin:0 0 20px 0;color:#374151;font-size:15px;line-height:1.6;">Vous recevrez uniquement les infos essentielles : nouveaux événements, meilleures offres et annonces importantes.</p>' +
      this.getButton(baseUrl + '/events', 'Découvrir les événements') +
      '<p style="margin:14px 0 0 0;color:#6b7280;font-size:12px;line-height:1.5;">Si vous n’êtes pas à l’origine de cette inscription, vous pouvez ignorer cet email.</p>' +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';
  }

  async sendCustomTemplateEmail(email: string, subject: string, html: string, text: string) {
    return this.sendEmail(email, subject, html, text);
  }

  // Send custom notification email (admin)
  async sendCustomNotificationEmail(email: string, data: { type: string; title: string; message: string }) {
    const { type, title, message } = data;
    
    const typeLabels: Record<string, string> = {
      TICKET_READY: 'Billets',
      EVENT_REMINDER: 'Rappel',
      PAYMENT_RECEIVED: 'Paiement',
      EVENT_CANCELLED: 'Annulation',
      REVIEW_REQUEST: 'Avis',
      MARKETING: 'Promotion',
      SYSTEM: 'Système',
      NEW_FOLLOWER: 'Nouvel abonné',
      RECOMMENDATION: 'Recommandation',
    };

    const typeLabel = typeLabels[type] || 'Notification';
    const baseUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;font-family:-apple-system,sans-serif;background:#f5f5f5;">' +
      '<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
      '<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;">' +
      this.getEmailHeader(title) +
      '<tr><td style="padding:40px 30px;">' +
      '<span style="display:inline-block;background:#f0f0f0;color:#666;font-size:12px;padding:4px 12px;border-radius:20px;margin-bottom:20px;">' + typeLabel + '</span>' +
      '<h2 style="color:#1a1a1a;margin:0 0 20px 0;font-size:24px;">' + title + '</h2>' +
      '<p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px 0;">' + message + '</p>' +
      this.getButton(baseUrl, 'Voir sur Tikeoh') +
      '</td></tr>' + this.getEmailFooter() +
      '</table></td></tr></table></body></html>';

    return this.sendEmail(email, title + ' - Tikeoh', html, title + ': ' + message);
  }
}

