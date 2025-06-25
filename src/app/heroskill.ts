// 首先定义Skill接口
export interface HeroSkill {
  skillId: number;
  heroId: number;
  skillName: string;
  createdTime?: string;
  createdUser?: string;
}