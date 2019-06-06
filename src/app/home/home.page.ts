import {Component, OnInit} from '@angular/core';
import {Observable, of, from, fromEvent, Subject, forkJoin} from 'rxjs';
import {map, switchMap, tap, take, first, takeUntil, takeWhile, takeLast, mergeMap, concat} from 'rxjs/operators';


interface Carro {
  marca: string,
  modelo: string,
  ano: number
}
interface Game {
  nome: string,
  ranking: number
}
interface NovoTipo {
  jogo: {},
  carro: object
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit{

  public carroFavorito: Carro;
  public onStop = new Subject<void>()

  constructor() {}

  ngOnInit() {
    const carro: Carro = {
      marca: 'Chrisler',
      modelo: 'C300',
      ano: 2019
    }
    const game: Game = {
      nome: 'THPS',
      ranking: 12
    }




    /* =============================== CRIANDO UM OBSERVABLE =================================================*/

    // Para criar um Observable de algum objeto, basta inferí-lo como abaixo, e usar o operator of antes o objeto desejado.
    const carroObservable: Observable<Carro> = of (carro)

    carroObservable.subscribe(conteudoDoObs => {
      this.carroFavorito = conteudoDoObs;
      console.log(this.carroFavorito);
    })
    // Uma maneira reduzido de se criar um Observable
    const carroObs2 = of (carro)

    carroObs2.subscribe(data => console.log(data))

    //  Para se criar uma Promise basta inferí-la da segunte forma:
    const carroPromise: Promise<Carro> = Promise.resolve(carro)

    carroPromise.then(data => console.log('Promise: ', data))

    // Para transformar uma Promise em um observable basta inferi-la no lugar do objeto
    const promiseObservavel: Observable<Carro> = from (carroPromise)
    promiseObservavel.subscribe(data => console.log('Promise convertida em Observable ',data))


    /*============================================================================================*/
    /*================================ USANDO O OPERADOR MAP ======================================*/

    const gameObs = of (game)
    gameObs.pipe(
        map(data => data.nome.toLowerCase())
    ).subscribe(conteudo => console.log('map: ',conteudo))
    // map serve para manipular os dados do Observable e retorná-los da forma que deseja.

    /*==========================================================================================*/
    /*================================ USANDO O OPERADOR TAP ===================================*/

    const gameObs2 = of (game)
    gameObs2.pipe(
        tap(data => data.nome.toUpperCase())
    ).subscribe(conteudo => console.log('tap: O conteúdo não muda! ',conteudo))
  //   tap mantém os dados exatamente como chegam! Mesmo vc tentando manipulá-los.

    /*==========================================================================================*/
    /*================================ USANDO SWITCHMAP ========================================*/

    const gameMap = of (game)
    const carroMap = of (carro)

    const switchmap = gameMap.pipe(
        switchMap(jogo => {
          return carroMap
              .pipe(
              tap(carro => {
                console.log('game: ', jogo);
                console.log('carro: ', carro)
              }))
        })
    )

     switchmap.subscribe();
    //  SwitchMap cancela a primeira assinatura e assina a segunda, e permite o acesso a ambos os dados.

    /*======================================================================================================*/
    /*======================================= DEBOUNCE TIME ================================================*/

    //  Serve para "esperar" acabar de digitar, para assim poder fazer a busca, evitando que seja feita uma busca para cada letra digitada.
    //  debounce (500)

    /* ======================================================================================================*/
    /* ====================================== DISTINCTUNTILCHANGED ==========================================*/
    // Serve para não repetir a busca do mesmo termo de busca.
    // distinctUntilChanged()

    /*=======================================================================================================*/
    /*=============================== TAKE, TAKEUNTIL, TAKEWHILE, TAKELAST ==================================*/

    const fonte = fromEvent(document, 'click')
    fonte.subscribe(() => console.log('Clicou no documento!'))

    const fonte2 = fromEvent(document, 'click')
    fonte2.pipe(
        take(4)
          ).subscribe(() => console.log('Clicou take!'))

    const fonte3 = fromEvent(document, 'click')
    fonte3.pipe(
        first())
            .subscribe(() => (console.log('clicou first!'))
    )

    let contador = 0
    const fonte4 = fromEvent(document, 'click')
    fonte4.pipe(
        takeWhile(() => contador < 4))
        .subscribe(() => {
          console.log('clicou takeWhile!', contador)
          contador++;
        })

    const fonte5 = of (1,2,3,4);
    fonte5.pipe(
          takeLast(2))
          .subscribe((valor) => {console.log('Pegou os dois ultimos valores" TakeLast', valor)})

    const font6 = fromEvent(document, 'click')
    font6.pipe(
    takeUntil(this.onStop))
        .subscribe(() => {
          console.log('Clicou até parar')
        })

    /*==============================================================================================*/
    /*======================================= MERGEMAP/FLATMAP ====================================*/

    const carObs = of (carro)
    const jogoObs = of (game)

    const gameCar: Observable<NovoTipo> = carObs.pipe(
        mergeMap(carro => {
          return jogoObs.pipe(
              map(jogo => {
                const novoTipo: NovoTipo = {
                  jogo: jogo,
                  carro: carro
                }
                return novoTipo
              })
          )
        })
    )

    gameCar.subscribe(data => console.log('MergMap/FlatMap',data))


   /*=================================================================================================*/
   /*======================================== CONCAT =================================================*/

  //  pegando as constantes do ex atrás.
  //  Está deprecated.

    // const concatObs = concat(carObs, jogoObs)
    // concatObs.subscribe(data = console.log(data))

    /*===================================================================================================================*/
    /*================================================== FORKJOIN =======================================================*/

  //  usando as constantes anteriores

    const forkJoinObs = forkJoin(carObs, jogoObs)
    forkJoinObs.subscribe(data => console.log('forkJoin',data))

  }

  stop(){
    this.onStop.next();
    this.onStop.complete();
  }


}
