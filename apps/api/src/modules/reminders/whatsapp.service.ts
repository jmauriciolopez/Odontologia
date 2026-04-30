import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { env } from '../../config/env';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  constructor(private readonly httpService: HttpService) {}

  async sendMessage(phone: string, message: string): Promise<boolean> {
    if (!env.WHATSAPP.ENABLED) {
      this.logger.warn(`WhatsApp is disabled. Skipping message to ${phone}`);
      return false;
    }

    try {
      const cleanPhone = this.formatPhone(phone);
      this.logger.log(`Sending WhatsApp message to ${cleanPhone}...`);

      const url = `${env.WHATSAPP.API_URL}/message/sendText/${env.WHATSAPP.INSTANCE}`;
      const payload = {
        number: cleanPhone,
        text: message,
      };

      await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            apikey: env.WHATSAPP.API_KEY,
            'Content-Type': 'application/json',
          },
        }),
      );

      return true;
    } catch (error: any) {
      this.logger.error(`Error sending WhatsApp message: ${error.message}`);
      return false;
    }
  }

  private formatPhone(phone: string): string {
    // Remove non-numeric characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Argentina specific: add 549 if it starts with 11/15/etc
    if (cleaned.length === 10) {
      cleaned = '549' + cleaned;
    } else if (cleaned.startsWith('0')) {
      cleaned = '549' + cleaned.substring(1);
    }
    
    return cleaned;
  }
}
