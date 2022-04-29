import { AnimationClip } from 'cc';
import { IState, State } from '../Common/state';
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from '../Enum';
import States from '../Base/States';

const URL = 'texture/player/idle';

export default class IDLEState extends States implements IState {
    constructor(private fsm: States) {
        super();
    }

    async init() {
        const loop = AnimationClip.WrapMode.Loop;
        await this.registState(DIRECTION_ENUM.TOP, new State(this.fsm, `${URL}/top`, loop));
        await this.registState(DIRECTION_ENUM.LEFT, new State(this.fsm, `${URL}/left`, loop));
        await this.registState(DIRECTION_ENUM.RIGHT, new State(this.fsm, `${URL}/right`, loop));
        await this.registState(DIRECTION_ENUM.BOTTOM, new State(this.fsm, `${URL}/bottom`, loop));
    }

    run(): void {
        const direction = (this.fsm.getParamsValue(PARAMS_NAME_ENUM.DIRECTION) as number) || DIRECTION_ORDER_ENUM.TOP;
        const key = DIRECTION_ORDER_ENUM[direction];
        this.currentState = this.getRegisteState(key);
    }
}
