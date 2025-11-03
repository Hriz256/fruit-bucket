import { _decorator, Component, Label } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TimerView')
export class TimerView extends Component {
  @property(Label)
  public label: Label | null = null;

  public setTime(timeLeft: number): void {
    const clamped = Math.max(0, Math.floor(timeLeft));
    const minutes = Math.floor(clamped / 60);
    const seconds = clamped % 60;
    this.label!.string = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
