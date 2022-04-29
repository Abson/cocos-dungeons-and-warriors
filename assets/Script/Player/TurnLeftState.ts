import { IState, State } from '../Common/state';
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from '../Enum';
import States from '../Base/States';

const URL = 'texture/player/turnleft';

export default class TurnLeftState extends States implements IState {
    constructor(private fsm: States) {
        super();
    }

    async init() {
        await this.registState(DIRECTION_ENUM.TOP, new State(this.fsm, `${URL}/top`));
        await this.registState(DIRECTION_ENUM.LEFT, new State(this.fsm, `${URL}/left`));
        await this.registState(DIRECTION_ENUM.RIGHT, new State(this.fsm, `${URL}/right`));
        await this.registState(DIRECTION_ENUM.BOTTOM, new State(this.fsm, `${URL}/bottom`));
    }

    run(): void {
        // const val = this.fsm.getParamsValue(PARAMS_NAME_ENUM.TURNLEFT) as boolean;
        const direction = (this.fsm.getParamsValue(PARAMS_NAME_ENUM.DIRECTION) as number) || DIRECTION_ORDER_ENUM.TOP;
        const key = DIRECTION_ORDER_ENUM[direction];
        const state = this.getRegisteState(key);
        this.currentState !== state && (this.currentState = state);
    }
}
