import { Component } from '@angular/core';

import { Hero } from '../hero';
import { HeroSkill } from '../heroskill';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

import { FormsModule } from '@angular/forms';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
// import { HEROES } from '../mock-heroes';

import {
  NgIf,
  NgFor,
  UpperCasePipe,
} from '@angular/common';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    UpperCasePipe,
    HeroDetailComponent,
    RouterModule 
  ],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css'
})
export class HeroesComponent {
  selectedHero?: Hero;

  heroes: Hero[] = [];
  constructor(private heroService: HeroService, private messageService: MessageService) { } // 注入服务

  ngOnInit(): void {
    this.getHeroes(); // 安全的初始化逻辑
  }


  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }
    
  
  /** 生成新ID */
  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 1;
  }

  add(heroName: string): void {
    heroName = heroName.trim();
    if (!heroName) { return; }
    // const newSkill: HeroSkill = {
    //   skillId: 0, // 临时ID，后端会生成正式ID
    //   heroId: 0, // 临时值，创建关联后会被更新
    //   skillName: skill,
    //   createdTime: '',
    //   createdUser: ''
    // };
    const newHero: Hero = {
      id: this.genId(this.heroes),
      heroName: heroName,
      // skills: [newSkill]
    };

    this.heroService.addHero(newHero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }

  

}
