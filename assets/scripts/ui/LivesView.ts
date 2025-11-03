import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('LivesView')
export class LivesView extends Component {
  @property([Node])
  public hearts: Node[] = [];

  public setLives(lives: number): void {
    this.hearts.forEach((heart, index) => {
      heart.active = index < lives;
    });
  }
}
