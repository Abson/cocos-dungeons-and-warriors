import { _decorator, Component, Node, math, TERRAIN_SOUTH_INDEX } from 'cc';
import { EVENT_ENUM } from './Enum';
import EventManager from './EventManager';
import { MapLoader } from './Map/MapLoader';
import { Player } from './Player/Player';
import { WoodenSkeleton } from './WoodenSkeleton/WoodenSkeleton';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    stage: Node;
    map: Node;
    player: Node;
    level = 1;

    protected onLoad(): void {
        EventManager.on(
            EVENT_ENUM.NEXT_LEVEL,
            () => {
                this.level++;
                this.play();
            },
            this
        );
    }

    protected onDestroy(): void {
        EventManager.off(EVENT_ENUM.NEXT_LEVEL, this);
    }

    start() {
        this.play();
    }

    private async play() {
        // 清空上一个舞台
        this.stage && this.stage.destroyAllChildren();
        // 重新生成舞台、地图、玩家
        this.generateStage();
        await this.generateMap();
        this.generatePlayer();
        this.generateWoodenSkeleton();
    }

    private generateStage() {
        // 创建一个舞台
        const node = new Node();
        node.parent = this.node;
        node.layer = 1 << 25;
        this.stage = node;
    }

    private async generateMap() {
        const node = new Node();
        node.layer = 1 << 25;
        node.parent = this.stage;
        const loader = await node.addComponent(MapLoader).initLevel(this.level);
        const x = loader.row * 55 * 0.5 * -1;
        const y = loader.column * 55 * 0.5 + 80;
        node.position = new math.Vec3(x, y);
        this.map = node;
    }

    private async generatePlayer() {
        const node = new Node();
        node.layer = 1 << 25;
        node.parent = this.map;
        await node.addComponent(Player).init();
        this.player = node;
    }

    private async generateWoodenSkeleton() {
        const node = new Node();
        node.layer = 1 << 25;
        node.parent = this.map;
        await node.addComponent(WoodenSkeleton).init();
    }
}
