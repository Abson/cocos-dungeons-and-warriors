import { Component } from 'cc';
import { IState } from '../Common/state';
// import State from './Common/state';
import { FSM_PARAM_TYPE_ENUM } from '../Enum';

export interface IParamsValue {
    type: FSM_PARAM_TYPE_ENUM;
    value: number | boolean;
}

export function defaultTriggerParams(): IParamsValue {
    return { type: FSM_PARAM_TYPE_ENUM.TRIGGER, value: false };
}

export default abstract class States extends Component {
    private params: Map<string, IParamsValue> = new Map();
    private _state: IState;
    private machine: Map<string, IState> = new Map();

    get currentState() {
        return this._state;
    }

    set currentState(newState: IState) {
        // if (newState == this._state) return;
        this._state = newState;
        this._state.run();
    }

    setParams(key: string, param: IParamsValue) {
        this.params.set(key, param);
    }

    getParams(key: string) {
        return this.params.get(key);
    }

    getParamsValue(key: string) {
        return this.params.get(key).value;
    }

    *getTriggers() {
        // return [...this.params.values()].filter((val) => val.type == FSM_PARAM_TYPE_ENUM.TRIGGER);
        for (const [key, value] of this.params) {
            if (value.type != FSM_PARAM_TYPE_ENUM.TRIGGER || value.value == false) continue;
            yield { key, value };
        }
    }

    async trigger(key: string, val: boolean | number) {
        // 查看是否有注册相应的事件
        if (!this.params.has(key)) {
            return;
        }
        this.params.get(key).value = val;
        this.run();
        // 触发完后，要重置触发器
        this.resetTrigger();
    }

    private resetTrigger() {
        for (const [_, param] of this.params) {
            if (param.type == FSM_PARAM_TYPE_ENUM.TRIGGER) {
                param.value = false;
            }
        }
    }

    async registState(key: string, state: IState) {
        this.machine.set(key, state);
        await state.init();
        return true;
    }

    getRegisteState(key: string) {
        if (this.machine.has(key)) {
            return this.machine.get(key);
        }
        return null;
    }

    abstract run(): void;
}
