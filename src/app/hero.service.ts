import { Injectable } from '@angular/core';
// import { HEROES } from './mock-heroes';
import { Hero } from './hero';
import { HeroSkill } from './heroskill';
import { catchError, Observable, of, map, tap,debounceTime, distinctUntilChanged } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

   constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

    private heroesUrl = '/api/heroes';  // URL to web api
    private heroSkillsUrl = 'api/heroskills';
    // private heroesUrl = 'http://localhost:44365/api/masters';
  //getHeroes(): Hero[] {
  //  return HEROES;
  //}

  
  /*getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messageService.add('HeroService: 获取到英雄')
    return heroes;
  }*/
  
  getHeroes(): Observable<Hero[]> {
    // debugger
    return this.http.get<Hero[]>(`${this.heroesUrl}`).pipe(
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }
  
  getHeroSkills(): Observable<HeroSkill[]> {
    return this.http.get<HeroSkill[]>(`${this.heroSkillsUrl}`).pipe(
      catchError(this.handleError<HeroSkill[]>('getHeroSkills',[]))
    );
  }

  // getHero(id: number): Observable<Hero> {
  //   const hero = HEROES.find(h => h.id === id)!;
  //   this.messageService.add(`HeroService: fetched hero id=${id}`);
  //   return of(hero);
  // }

  getHero(HeroId: number): Observable<Hero> {
    this.log(`进入英雄细节 HeroId=${HeroId}`)
    const url = `${this.heroesUrl}/${HeroId}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`获取英雄 HeroId=${HeroId}`)),
      catchError(this.handleError<Hero>(`getHero HeroId=${HeroId}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /** PUT: update the hero on the server */
  // updateHero(hero: Hero): Observable<any> {
  //   const url = `${this.heroesUrl}/${hero.id}`; // json-server 要求 PUT 请求包含 id
  //   return this.http.put(url, hero, this.httpOptions).pipe(
  //     tap(_ => this.log(`更新英雄 id=${hero.id}`)), 
  //     catchError(this.handleError<any>('updateHero'))
  //   );
  // }
  updateHero(hero: Hero): Observable<Hero> {
    const url = `${this.heroesUrl}/${hero.id}`;
    return this.http.put<Hero>(url, hero, this.httpOptions).pipe(
      tap(updatedHero => this.log(`更新英雄 id=${updatedHero.id}`)),
      catchError(this.handleError<Hero>('updateHero'))
    );
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {  
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero) => this.log(`添加英雄 id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`删除英雄 id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    const searchTerm = term.trim();
    
    if (!searchTerm) {
      return of([]);
    }

    const encodedTerm = encodeURIComponent(searchTerm);  // 处理特殊字符
    const url = `${this.heroesUrl}?name=${encodedTerm}`;  // 使用更灵活的查询参数

    return this.http.get<Hero[]>(url).pipe(
      tap(results => {
        const logMessage = results.length 
          ? `Found ${results.length} heroes matching "${searchTerm}"`
          : `No heroes found for "${searchTerm}"`;
        this.log(logMessage);
      }),
      distinctUntilChanged(),  // 避免重复请求相同搜索词
      debounceTime(300),       // 防抖处理，减少频繁请求
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
}

  

 
