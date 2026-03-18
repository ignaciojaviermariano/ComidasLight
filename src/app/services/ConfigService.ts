import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: Record<string, string> = {};

  private readonly SHEET_ID = '1Ld-ZHWyVrbvX_wCVSAv2gaF4RCZ-yXM1Dj6HzMhNC9I';
  private readonly BASE_URL = 'https://opensheet.elk.sh';

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    const url = `${this.BASE_URL}/${this.SHEET_ID}/cms`;
    const rows: any[] = await firstValueFrom(this.http.get<any[]>(url));
    rows.forEach(row => {
      this.config[row['clave']] = row['valor'] ?? '';
    });
  }

  get(key: string, fallback = ''): string {
    return this.config[key] ?? fallback;
  }
}
