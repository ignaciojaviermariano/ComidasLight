import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Promocion {
  activa: string;
  titulo: string;
  descripcion: string;
  badge: string;
  fecha_fin: string;
}

@Injectable({ providedIn: 'root' })
export class PromocionesService {
  private readonly SHEET_ID = '1wwim-fEx8B-bUpppQ4QtzUWvGMcds7Rd1gpMQcLHL1A'; // tu sheet ID
  private readonly BASE_URL = 'https://opensheet.elk.sh';

  constructor(private http: HttpClient) {}

  getPromocionesActivas(): Observable<Promocion[]> {
    const url = `${this.BASE_URL}/${this.SHEET_ID}/promos`;
    return this.http.get<Promocion[]>(url).pipe(
      map(rows => rows.filter(p => p.activa?.toUpperCase() === 'SI'))
    );
  }
}
