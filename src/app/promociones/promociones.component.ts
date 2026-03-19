import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromocionesService, Promocion } from '../services/promocionesService';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.scss']
})
export class PromocionesComponent implements OnInit {
  promociones: Promocion[] = [];

  constructor(private promoService: PromocionesService) {}

  ngOnInit(): void {
    this.promoService.getPromocionesActivas().subscribe({
      next: (data) => this.promociones = data,
      error: () => this.promociones = [] // si falla el fetch, no muestra nada
    });
  }
   getWhatsappLink(promo: Promocion): string {
    const phone = environment.whatsappNumber;
    const message = encodeURIComponent(
      `¡Hola! 👋 Vi la promoción *${promo.titulo}* en su página y me gustaría obtener más información.`
    );
    return `https://wa.me/${phone}?text=${message}`;
  }
}
