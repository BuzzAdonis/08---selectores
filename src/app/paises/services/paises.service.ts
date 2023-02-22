import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Countrie, PaisSmall } from '../interfaces/paises.interface';
import { Observable, combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private baseUrl: string = environment.UrlBase
  private _regiones: string[] = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {
    return this.http.get<PaisSmall[]>(`${ this.baseUrl }/region/${ region }?fields=name,cca3`)
  }

  getPaisPorCodigo(codigo: string): Observable<Countrie[] | null> {
    if(!codigo){
      return of(null)
    }
    return this.http.get<Countrie[]>(`${this.baseUrl}/alpha/${codigo}`);

  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    return this.http.get<PaisSmall>(`${this.baseUrl}/alpha/${codigo}?fields=name,cca3`);
  }
  getPaisPorCodigos(borders: string[]):Observable<PaisSmall[]> {
    if( !borders ){
      return of([]);
    }
    const peticiones:Observable<PaisSmall>[] = [];
    borders.forEach(alpha3 => {
      const peticion = this.getPaisPorCodigoSmall(alpha3);
      peticiones.push(peticion);
    });
    return combineLatest( peticiones );
  }
}
