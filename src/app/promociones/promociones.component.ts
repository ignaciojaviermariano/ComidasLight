import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromocionesService, Promocion } from '../services/promocionesService';

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
}
