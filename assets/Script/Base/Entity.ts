import { Component } from 'cc';
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../Enum';
import States from './States';

export default abstract class Entity extends Component {
    x = 0;
    y = 0;
    protected fsm: States;
    private _state: ENTITY_STATE_ENUM;
    private _direction: DIRECTION_ENUM;

    protected init(params: { x: number; y: number; fsm: States; state: ENTITY_STATE_ENUM; direction: DIRECTION_ENUM }) {
        this.x = params.x;
        this.y = params.y;
        this.fsm = params.fsm;
        this.state = params.state;
        this.direction = params.direction;

        // 将游戏坐标转换位实际坐标
        const x = this.x * 55 - 55 * 1.5;
        const y = -this.y * 55 + 55 * 1.5;
        this.node.setPosition(x, y);
    }

    set state(newState: ENTITY_STATE_ENUM) {
        this._state = newState;
        this.fsm.trigger(this._state, true);
    }

    get state() {
        return this._state;
    }

    set direction(newDirection: DIRECTION_ENUM) {
        this._direction = newDirection;
        this.fsm.trigger(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction]);
    }

    get direction() {
        return this._direction;
    }
}
