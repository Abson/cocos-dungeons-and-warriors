import { _decorator, Component, Node, ResolutionPolicy, AnimationClip, Animation, SpriteFrame, animation } from 'cc';
import { State } from '../Common/state';
import {
    DIRECTION_ENUM,
    DIRECTION_ORDER_ENUM,
    ENTITY_STATE_ENUM,
    FSM_PARAM_TYPE_ENUM,
    PARAMS_NAME_ENUM,
} from '../Enum';
import States, { defaultTriggerParams } from '../Base/States';
import IDLEState from './IDLEState';
import TurnLeftState from './TurnLeftState';
import TurnRightState from './TurnRightState';
import { Player } from './Player';
import BlockFontState from './BlockState';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PlayerState
 * DateTime = Mon Apr 25 2022 22:07:29 GMT+0800 (中国标准时间)
 * Author = sharlier
 * FileBasename = PlayerState.ts
 * FileBasenameNoExtension = PlayerState
 * URL = db://assets/Script/PlayerState.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('PlayerState')
export class PlayerState extends States {
    async init() {
        this.addComponent(Animation);
        this.initParams();
        await this.initState();
        this.initAnimationEvent();
        return this;
    }

    initAnimationEvent() {
        this.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
            // 检查 clip 的 path 参数，是否要回档
            const { name } = this.getComponent(Animation).defaultClip;
            const whites = [`block`, `turn`];
            if (!whites.some((v) => name.includes(v))) {
                return;
            }
            this.node.getComponent(Player).state = ENTITY_STATE_ENUM.IDLE;
        });
    }

    async initState() {
        // new State(this, 'texture/player/idle/top', AnimationClip.WrapMode.Loop)
        const promises = [];
        promises.push(this.registState(PARAMS_NAME_ENUM.IDLE, new IDLEState(this)));

        promises.push(this.registState(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftState(this)));

        promises.push(this.registState(PARAMS_NAME_ENUM.TURNRIGHT, new TurnRightState(this)));

        promises.push(this.registState(PARAMS_NAME_ENUM.BLOCKFRONT, new BlockFontState(this, 'front')));

        promises.push(this.registState(PARAMS_NAME_ENUM.BLOCKBACK, new BlockFontState(this, 'back')));

        promises.push(this.registState(PARAMS_NAME_ENUM.BLOCKTURNLEFT, new BlockFontState(this, 'turnleft')));

        promises.push(this.registState(PARAMS_NAME_ENUM.BLOCKTURNRIGHT, new BlockFontState(this, 'turnright')));

        promises.push(this.registState(PARAMS_NAME_ENUM.BLOCKLEFT, new BlockFontState(this, 'left')));

        promises.push(this.registState(PARAMS_NAME_ENUM.BLOCKRIGHT, new BlockFontState(this, 'right')));

        return Promise.all(promises);
    }

    initParams() {
        this.setParams(PARAMS_NAME_ENUM.IDLE, defaultTriggerParams());

        this.setParams(PARAMS_NAME_ENUM.TURNLEFT, defaultTriggerParams());

        this.setParams(PARAMS_NAME_ENUM.TURNRIGHT, defaultTriggerParams());

        this.setParams(PARAMS_NAME_ENUM.BLOCKFRONT, defaultTriggerParams());

        this.setParams(PARAMS_NAME_ENUM.BLOCKBACK, defaultTriggerParams());

        this.setParams(PARAMS_NAME_ENUM.BLOCKTURNLEFT, defaultTriggerParams());

        this.setParams(PARAMS_NAME_ENUM.BLOCKTURNRIGHT, defaultTriggerParams());

        this.setParams(PARAMS_NAME_ENUM.BLOCKLEFT, defaultTriggerParams());

        this.setParams(PARAMS_NAME_ENUM.BLOCKRIGHT, defaultTriggerParams());

        this.setParams(PARAMS_NAME_ENUM.DIRECTION, {
            type: FSM_PARAM_TYPE_ENUM.NUMBER,
            value: DIRECTION_ORDER_ENUM.TOP,
        });
    }

    run() {
        // switch (this.currentState) {
        // case this.getRegisteState(PARAMS_NAME_ENUM.TURNLEFT):
        // case this.getRegisteState(PARAMS_NAME_ENUM.TURNRIGHT):
        // case this.getRegisteState(PARAMS_NAME_ENUM.IDLE):
        // case this.getRegisteState(PARAMS_NAME_ENUM.BLOCKFRONT):
        // case this.getRegisteState(PARAMS_NAME_ENUM.BLOCKTURNLEFT):
        //     const turnleft = this.getParamsValue(PARAMS_NAME_ENUM.TURNLEFT);
        //     const idel = this.getParamsValue(PARAMS_NAME_ENUM.IDLE);
        //     const turnright = this.getParamsValue(PARAMS_NAME_ENUM.TURNRIGHT);
        //     const block_font = this.getParamsValue(PARAMS_NAME_ENUM.BLOCKFRONT);
        //     const block_back = this.getParamsValue(PARAMS_NAME_ENUM.BLOCKBACK);
        //     const block_turnleft = this.getParamsValue(PARAMS_NAME_ENUM.BLOCKTURNLEFT);
        //     const block_turnleft = this.getParamsValue(PARAMS_NAME_ENUM.BLOCKTURNLEFT);
        //     const block_turnleft = this.getParamsValue(PARAMS_NAME_ENUM.BLOCKTURNLEFT);
        //     if (turnleft) {
        //         this.currentState = this.getRegisteState(PARAMS_NAME_ENUM.TURNLEFT);
        //     } else if (block_font) {
        //         this.currentState = this.getRegisteState(PARAMS_NAME_ENUM.BLOCKFRONT);
        //     } else if (idel) {
        //         this.currentState = this.getRegisteState(PARAMS_NAME_ENUM.IDLE);
        //     } else if (turnright) {
        //         this.currentState = this.getRegisteState(PARAMS_NAME_ENUM.TURNRIGHT);
        //     } else if (block_turnleft) {
        //         this.currentState = this.getRegisteState(PARAMS_NAME_ENUM.BLOCKTURNLEFT);
        //     } else {
        //         this.currentState = this.currentState;
        //     }
        //     break;
        // default:
        //     this.currentState = this.getRegisteState(PARAMS_NAME_ENUM.IDLE);
        // }
        let is_trigger = false;
        for (const item of this.getTriggers()) {
            if (!!!PARAMS_NAME_ENUM[item.key]) return;
            this.currentState = this.getRegisteState(PARAMS_NAME_ENUM[item.key]);
            is_trigger = true;
        }
        !is_trigger && (this.currentState = this.currentState);
    }
}
