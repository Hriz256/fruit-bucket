import { _decorator, Component, Label } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ScoreView')
export class ScoreView extends Component {
  @property(Label)
  public label: Label | null = null;

  public setScore(score: number): void {
    this.label!.string = score.toString();
  }
}
