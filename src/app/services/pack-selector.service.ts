import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from './ConfigService';

export interface PlatoSeleccionado {
  nombre: string;
  cantidad: number;
  categoria: string;
}

export interface Pack {
  cantidad: number;
  precio: number;
}

@Injectable({
  providedIn: 'root'
})
export class PackSelectorService {

  // 👇 Se construye desde ConfigService en lugar de hardcodeado
  get packs(): Pack[] {
    const parse = (key: string, fallback: number) =>
      parseInt(this.config.get(key, String(fallback)), 10);

    return [
      { cantidad: parse('pack_1_cantidad', 7),  precio: parse('pack_1_precio', 2100) },
      { cantidad: parse('pack_2_cantidad', 12), precio: parse('pack_2_precio', 3600) },
      { cantidad: parse('pack_3_cantidad', 20), precio: parse('pack_3_precio', 5500) },
    ];
  }

  private packSeleccionado$ = new BehaviorSubject<number | null>(null);
  private platosSeleccionados$ = new BehaviorSubject<PlatoSeleccionado[]>([]);

  packSeleccionado = this.packSeleccionado$.asObservable();
  platosSeleccionados = this.platosSeleccionados$.asObservable();

  constructor(public config: ConfigService) {}

  seleccionarPack(cantidad: number) {
    this.packSeleccionado$.next(cantidad);
    this.platosSeleccionados$.next([]);
  }

  agregarPlato(plato: PlatoSeleccionado) {
    const actuales = this.platosSeleccionados$.value;
    const totalActual = actuales.reduce((sum, p) => sum + p.cantidad, 0);

    if (totalActual + plato.cantidad <= this.packSeleccionado$.value!) {
      const existente = actuales.find(p => p.nombre === plato.nombre);

      if (existente) {
        existente.cantidad += plato.cantidad;
      } else {
        actuales.push(plato);
      }

      this.platosSeleccionados$.next([...actuales]);
    }
  }

  quitarPlato(nombre: string, cantidad: number = 1) {
    let actuales = this.platosSeleccionados$.value;

    const existente = actuales.find(p => p.nombre === nombre);
    if (existente) {
      existente.cantidad -= cantidad;

      if (existente.cantidad <= 0) {
        actuales = actuales.filter(p => p.nombre !== nombre);
      }
    }

    this.platosSeleccionados$.next([...actuales]);
  }

  getTotalActual(): number {
    return this.platosSeleccionados$.value.reduce((sum, p) => sum + p.cantidad, 0);
  }

  getPackActual(): number | null {
    return this.packSeleccionado$.value;
  }

  limpiar() {
    this.packSeleccionado$.next(null);
    this.platosSeleccionados$.next([]);
  }

  generarMensajeWhatsApp(): string {
    const packActual = this.packSeleccionado$.value;
    const platos = this.platosSeleccionados$.value;

    let mensaje = `Hola, me interesa hacer un pedido:\n\n`;
    mensaje += `PACK ${packActual} VIANDAS\n\n`;
    mensaje += `Mi selección:\n`;

    platos.forEach(p => {
      mensaje += `  • ${p.cantidad}x ${p.nombre}\n`;
    });

    mensaje += `¿Cuál es tu disponibilidad?`;

    return mensaje;
  }
}
