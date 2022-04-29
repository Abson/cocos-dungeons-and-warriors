import { _decorator, Animation } from 'cc';
import States, { defaultTriggerParams } from '../Base/States';
import { DIRECTION_ORDER_ENUM, FSM_PARAM_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enum';
import IDLEState from './IDLEState';

const { ccclass, property } = _decorator;

@ccclass('WoodenSkeletonState')
export class WoodenSkeletonState extends States {
    async init() {
        this.addComponent(Animation);
        this.initParams();
        await this.initState();
        this.initAnimationEvent();
        return this;
    }

    initAnimationEvent() {}

    async initState() {
        const promises = [];

        promises.push(this.registState(PARAMS_NAME_ENUM.IDLE, new IDLEState(this)));

        return Promise.all(promises);
    }

    initParams() {
        this.setParams(PARAMS_NAME_ENUM.IDLE, defaultTriggerParams());

        this.setParams(PARAMS_NAME_ENUM.DIRECTION, {
            type: FSM_PARAM_TYPE_ENUM.NUMBER,
            value: DIRECTION_ORDER_ENUM.TOP,
        });
    }

    run(): void {
        let is_trigger = false;
        for (const item of this.getTriggers()) {
            if (!!!PARAMS_NAME_ENUM[item.key]) return;
            this.currentState = this.getRegisteState(PARAMS_NAME_ENUM[item.key]);
            is_trigger = true;
        }
        !is_trigger && (this.currentState = this.currentState);
    }
}
