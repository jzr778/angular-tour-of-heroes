import { HeroSkill } from './heroskill';

// 然后定义包含skills的Hero接口
export interface Hero {
  id: number;
  heroName: string;
  createdTime?: string;
  createdUser?: string;
  skills?: HeroSkill[]; // 添加skills数组
}