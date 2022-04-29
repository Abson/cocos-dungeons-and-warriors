import { _decorator, Component, Node, Event } from 'cc';
import { CONTROLLER_ENUM, EVENT_ENUM } from './Enum';
import EventManager from './EventManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Controls
 * DateTime = Sun Apr 24 2022 23:33:12 GMT+0800 (中国标准时间)
 * Author = sharlier
 * FileBasename = Controls.ts
 * FileBasenameNoExtension = Controls
 * URL = db://assets/Script/Controls.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('Controls')
export class Controls extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start() {}

    onNextLevel(): void {
        EventManager.emit(EVENT_ENUM.NEXT_LEVEL);
    }

    onCtrl(event: Event, type: CONTROLLER_ENUM): void {
        EventManager.emit(EVENT_ENUM.PLAYER_CTRL, type);
    }
}
