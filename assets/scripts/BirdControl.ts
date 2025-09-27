import { _decorator, Component } from "cc";
import { GlobalData } from "./GlobalData";
const { ccclass, property } = _decorator;

@ccclass("BirdControl")
export class BirdControl extends Component {
  //定义小鸟移动的速度
  private speed: number = 300;

  start() {}

  update(deltaTime: number) {
    //1.如果x方向大于0，则向右移动，否则向左移动
    if (GlobalData.direction.x > 0) {
      this.node.setScale(-1, 1, 1);
    } else {
      this.node.setScale(1, 1, 1);
    }
    //2.移动小鸟的位置
    this.node.setPosition(
      this.node.position.x + GlobalData.direction.x * this.speed * deltaTime,
      this.node.position.y + GlobalData.direction.y * this.speed * deltaTime,
      0
    );
  }
}
