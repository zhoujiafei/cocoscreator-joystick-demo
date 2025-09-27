import {
  _decorator,
  Component,
  EventTouch,
  input,
  Input,
  math,
  Node,
  UITransform,
  Vec2,
  Vec3,
} from "cc";
import { GlobalData } from "./GlobalData";
const { ccclass, property } = _decorator;

@ccclass("JoystickControl")
export class JoystickControl extends Component {
  //摇杆按钮节点
  @property(Node)
  joystickBtn: Node = null;

  //保存摇杆的初始位置
  private initPos: Vec3 = new Vec3();

  //摇杆按钮可以移动的最大半径
  private maxRadius: number = 86;

  start() {
    //获取摇杆的初始位置
    this.initPos = this.node.getPosition();
    //监听触摸事件
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  }

  //触摸开始
  onTouchStart(event: EventTouch) {
    //1.获取触摸点的位置
    let touchPos = event.getUILocation();
    //2.转换为世界坐标
    const worldPos = new Vec3(touchPos.x, touchPos.y, 0);
    //3.将摇杆按钮移动到触摸点的位置
    this.node.setWorldPosition(worldPos);
  }

  //触摸移动
  onTouchMove(event: EventTouch) {
    //1.获取触摸点的位置
    let touchPos = event.getUILocation();
    //2.转换为世界坐标
    const worldPos = new Vec3(touchPos.x, touchPos.y, 0);
    //3.将世界坐标转换为当前摇杆的本地坐标
    const localPos = this.node
      .getComponent(UITransform)
      .convertToNodeSpaceAR(worldPos);
    //4.获取移动的向量的距离
    const distance = localPos.length();
    //5.将当前的手指位置向量归一化
    localPos.normalize();
    //6.设置位置向量的限定范围内
    localPos.multiplyScalar(math.clamp(distance, 0, this.maxRadius));
    //7.设置方向
    Vec2.normalize(GlobalData.direction, localPos);
    //设置摇杆按钮的位置
    this.joystickBtn.setPosition(localPos);
  }

  //触摸结束
  onTouchEnd(event: EventTouch) {
    //1.将摇杆按钮移动到初始位置
    this.node.setPosition(this.initPos);
    //2.将摇杆按钮的位置设置为初始位置
    this.joystickBtn.setPosition(Vec3.ZERO);
    //3.重置方向向量
    GlobalData.direction.set(Vec2.ZERO);
  }
  update(deltaTime: number) {}
}
