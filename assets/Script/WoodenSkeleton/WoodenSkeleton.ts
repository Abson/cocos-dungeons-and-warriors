import { math, Sprite, UITransform, _decorator } from 'cc';
import Entity from '../Base/Entity';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM } from '../Enum';
import { WoodenSkeletonState } from './WoodenSkeletonState';

const { ccclass, property } = _decorator;

@ccclass('WoodenSkeleton')
export class WoodenSkeleton extends Entity {
    async init() {
        const sprite = this.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        const transform = this.getComponent(UITransform);
        transform.contentSize = math.size(4 * 55, 4 * 55);
        transform.anchorPoint = math.v2(0, 1);

        const fsm = await this.addComponent(WoodenSkeletonState).init();

        super.init({ x: 7, y: 8, fsm, direction: DIRECTION_ENUM.TOP, state: ENTITY_STATE_ENUM.IDLE });

        return this;
    }
}
