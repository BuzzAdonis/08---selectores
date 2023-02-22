import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { switchMap, tap } from "rxjs/operators";

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {


  miFormulario: FormGroup  =this.fb.group({

    region    : ['',[Validators.required]],
    pais      : ['',[Validators.required]],
    frontera  : ['',[Validators.required]]

  });
  //llenar selectores
  regiones : string[] = [];
  paises   : PaisSmall[] = [];
 // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];


  //Ui
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private paisesService:PaisesService){}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //Cuando cambie la region
    // this.miFormulario.get('region')?.valueChanges
    //     .subscribe(region =>{

    //       this.paisesService.getPaisesPorRegion(region)
    //           .subscribe(paises =>{
    //             console.log(paises);
    //             this.paises = paises
    //           })

    //     });
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap((_) =>{
        this.miFormulario.get('pais')?.reset('');
        this.cargando = true;
      }),
      switchMap(region => this.paisesService.getPaisesPorRegion(region))
    )
    .subscribe(paises =>{
      this.paises = paises;
      this.cargando = false;
    });



    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap((_) =>{
        this.fronteras = [];
        this.miFormulario.get('frontera')?.reset('');
        this.cargando = true;
      }),
      switchMap(codigoPais => this.paisesService.getPaisPorCodigo(codigoPais)),
      switchMap(pais => this.paisesService.getPaisPorCodigos(pais !== null ? pais[0]?.borders || []: []))
    )
    .subscribe(paises =>{
      this.cargando = false;
     // this.fronteras = pais !== null ? pais[0]?.borders || []: [];
     
      this.fronteras =  paises;
    });



  }

  guardar(){
    console.log(this.miFormulario.value);
  }
}
