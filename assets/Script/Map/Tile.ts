import { Component, Label, math, Sprite, SpriteFrame, UITransform, _decorator } from 'cc';
import { TILE_TYPE_ENUM } from '../Enum';
import { ITile } from '../Levels';

const { ccclass, property } = _decorator;

@ccclass()
export default class Tile extends Component implements ITile {
    public src: number;
    public type: TILE_TYPE_ENUM;
    public turnable: boolean;
    public moveable: boolean;

    init(src: number, type: TILE_TYPE_ENUM, frame: SpriteFrame, pos: { x: number; y: number }) {
        this.src = src;
        this.type = type;

        switch (this.type) {
            case TILE_TYPE_ENUM.WALL_COLUMN:
            case TILE_TYPE_ENUM.WALL_ROW:
            case TILE_TYPE_ENUM.WALL_RIGHT_TOP:
            case TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM:
            case TILE_TYPE_ENUM.WALL_LEFT_TOP:
            case TILE_TYPE_ENUM.WALL_LEFT_BOTTOM:
                this.moveable = false;
                this.turnable = false;
                break;
            case TILE_TYPE_ENUM.CLIFF_CENTER:
            case TILE_TYPE_ENUM.CLIFF_LEFT:
            case TILE_TYPE_ENUM.CLIFF_RIGHT:
                this.moveable = false;
                this.turnable = true;
                break;
            case TILE_TYPE_ENUM.FLOOR:
                this.turnable = true;
                this.moveable = true;
                break;
        }

        const sprite = this.node.addComponent(Sprite);
        sprite.spriteFrame = frame;
        const transform = this.node.addComponent(UITransform);
        transform.contentSize = math.size(55, 55);
        transform.setAnchorPoint(0, 1);
        this.node.layer = 1 << 25;
        const v2 = new math.Vec2(pos.x * 55, -pos.y * 55);
        this.node.setPosition(v2.x, v2.y);

        return this;
    }
}
