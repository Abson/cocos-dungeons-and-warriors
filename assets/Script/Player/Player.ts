import { _decorator, Component, Sprite, UITransform, math } from 'cc';
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, PARAMS_NAME_ENUM } from '../Enum';
import MoveableEntity from '../Base/MoveableEntity';
import { PlayerState } from './PlayerState';
import MapTitles from '../Map/MapTiles';
import Tile from '../Map/Tile';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Player
 * DateTime = Mon Apr 25 2022 10:57:27 GMT+0800 (中国标准时间)
 * Author = sharlier
 * FileBasename = Player.ts
 * FileBasenameNoExtension = Player
 * URL = db://assets/Script/Player.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('Player')
export class Player extends MoveableEntity {
    async init() {
        const sprite = this.addComponent(Sprite);
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;

        const transform = this.getComponent(UITransform);
        transform.contentSize = math.size(55 * 4, 55 * 4);
        transform.anchorPoint = new math.Vec2(0, 1);

        const fsm = await this.addComponent(PlayerState).init();

        await super.init({ x: 2, y: 8, fsm, state: ENTITY_STATE_ENUM.IDLE, direction: DIRECTION_ENUM.TOP });
    }

    // set state(newState: ENTITY_STATE_ENUM) {
    //     super.state = newState;
    // }

    // set direction(newDirection: DIRECTION_ENUM) {
    //     super.direction = newDirection;
    // }

    protected async move(ctrl: CONTROLLER_ENUM) {
        const block = this.willBlock(ctrl);
        if (block) {
            ctrl == CONTROLLER_ENUM.TOP && this.fsm.trigger(PARAMS_NAME_ENUM.BLOCKFRONT, true);
            ctrl == CONTROLLER_ENUM.TURNLEFT && this.fsm.trigger(PARAMS_NAME_ENUM.BLOCKTURNLEFT, true);
            ctrl == CONTROLLER_ENUM.TURNRIGHT && this.fsm.trigger(PARAMS_NAME_ENUM.BLOCKRIGHT, true);
            ctrl == CONTROLLER_ENUM.BOTTOM && this.fsm.trigger(PARAMS_NAME_ENUM.BLOCKBACK, true);
            ctrl == CONTROLLER_ENUM.LEFT && this.fsm.trigger(PARAMS_NAME_ENUM.BLOCKLEFT, true);
            ctrl == CONTROLLER_ENUM.RIGHT && this.fsm.trigger(PARAMS_NAME_ENUM.BLOCKRIGHT, true);
            return;
        }
        super.move(ctrl);
    }

    // 判断是否可以走
    private willBlock(ctrl: CONTROLLER_ENUM): boolean {
        const { target_x: x, target_y: y, direction } = this;
        let next_x = 0;
        let next_y = 0;
        // 上下左右走
        if (
            ctrl == CONTROLLER_ENUM.TOP ||
            ctrl == CONTROLLER_ENUM.BOTTOM ||
            ctrl == CONTROLLER_ENUM.LEFT ||
            ctrl == CONTROLLER_ENUM.RIGHT
        ) {
            next_x = x;
            next_y = y;
            if (ctrl == CONTROLLER_ENUM.TOP || ctrl == CONTROLLER_ENUM.BOTTOM) {
                next_y = ctrl == CONTROLLER_ENUM.TOP ? y - 1 : y + 1;
            } else {
                next_x = ctrl == CONTROLLER_ENUM.LEFT ? x - 1 : x + 1;
            }

            let player_next_tile: Tile = null;
            let weapon_next_tile: Tile = null;
            // 获取武器和玩家的下一个瓦片
            if (direction == DIRECTION_ENUM.TOP) {
                player_next_tile = MapTitles.getTile({ x: next_x, y: next_y });
                weapon_next_tile = MapTitles.getTile({ x: next_x, y: next_y - 1 });
            } else if (direction == DIRECTION_ENUM.RIGHT) {
                player_next_tile = MapTitles.getTile({ x: next_x, y: next_y });
                weapon_next_tile = MapTitles.getTile({ x: next_x + 1, y: next_y });
            } else if (direction == DIRECTION_ENUM.BOTTOM) {
                player_next_tile = MapTitles.getTile({ x: next_x, y: next_y });
                weapon_next_tile = MapTitles.getTile({ x: next_x, y: next_y + 1 });
            } else if (direction == DIRECTION_ENUM.LEFT) {
                player_next_tile = MapTitles.getTile({ x: next_x, y: next_y });
                weapon_next_tile = MapTitles.getTile({ x: next_x - 1, y: next_y });
            }

            const moveable = player_next_tile && player_next_tile.moveable;
            const turnable = !!!weapon_next_tile || weapon_next_tile.turnable;
            // 判断瓦片是否可移动, 武器是否可转
            return !moveable || !turnable;
        }

        // 左右转动
        if (ctrl == CONTROLLER_ENUM.TURNRIGHT || ctrl == CONTROLLER_ENUM.TURNLEFT) {
            // 转动主要判断用户前方瓦片，转动角度瓦片，最后的目标瓦片，三块瓦片是否可转动
            next_x = x;
            next_y = y;
            if (ctrl == CONTROLLER_ENUM.TURNRIGHT) {
                if (direction == DIRECTION_ENUM.TOP) {
                    next_x += 1;
                    next_y -= 1;
                } else if (direction == DIRECTION_ENUM.LEFT) {
                    next_x -= 1;
                    next_y -= 1;
                } else if (direction == DIRECTION_ENUM.BOTTOM) {
                    next_x -= 1;
                    next_y += 1;
                } else if (direction == DIRECTION_ENUM.RIGHT) {
                    next_x += 1;
                    next_y += 1;
                }
            } else {
                if (direction == DIRECTION_ENUM.TOP) {
                    next_x -= 1;
                    next_y -= 1;
                } else if (direction == DIRECTION_ENUM.LEFT) {
                    next_x -= 1;
                    next_y += 1;
                } else if (direction == DIRECTION_ENUM.BOTTOM) {
                    next_x += 1;
                    next_y += 1;
                } else if (direction == DIRECTION_ENUM.RIGHT) {
                    next_x += 1;
                    next_y -= 1;
                }
            }
            // next_x、next_y 代表转动中的中间那个瓦片位置
            const font = MapTitles.getTile({ x, y: next_y });
            const middle = MapTitles.getTile({ x: next_x, y: next_y });
            const end = MapTitles.getTile({ x: next_x, y });
            const font_turnable = !!!font || font.turnable;
            const middle_turnable = !!!middle || middle.turnable;
            const end_turnable = !!!end || end.turnable;
            // 三片瓦片，是否让武器可以转的
            return !font_turnable || !middle_turnable || !end_turnable;
        }

        return false;
    }
}
