import { _decorator, Component, Node, Label, labelAssembler, Color, LabelComponent } from 'cc';
import * as Common from '../Common';
import Levels from '../Levels';
import MapTitles from './MapTiles';
import Tile from './Tile';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MapLoader
 * DateTime = Sun Apr 24 2022 11:58:58 GMT+0800 (中国标准时间)
 * Author = sharlier
 * FileBasename = MapLoader.ts
 * FileBasenameNoExtension = MapLoader
 * URL = db://assets/Script/MapLoader.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('MapLoader')
export class MapLoader extends Component {
    row = 0;
    column = 0;

    start() {
        // [3]
    }

    private probability(percent: number) {
        return (Math.random() * 100) / percent > 1;
    }

    async initLevel(level = 1) {
        MapTitles.clean();
        // 加载地图
        const imgs = await Common.loadResDir('texture/tile/tile');
        const { mapInfo } = Levels[`level${level}`];
        for (let x = 0; x < mapInfo.length; x++) {
            const column = mapInfo[x];
            for (let y = 0; y < column.length; y++) {
                const element = column[y];
                MapTitles.setTitle(null, { x, y });
                if (element.type === null) continue;
                if (element.src == 1) {
                    element.src = this.probability(80) ? Math.floor(Math.random() * 3 + 1) : 1;
                }
                const name = `tile (${element.src})`;
                const frame = imgs.find((val) => val.name === name);
                const node = new Node();
                const tile = node.addComponent(Tile).init(element.src, element.type, frame, { x, y });
                // const label = node.addComponent(Label);
                // label.string = `${x}, ${y}`;
                // label.fontSize = 20;
                // label.overflow = Label.Overflow.RESIZE_HEIGHT;
                node.parent = this.node;
                MapTitles.setTitle(tile, { x, y });
            }
        }

        this.row = mapInfo.length || 0;
        this.column = mapInfo[0].length || 0;
        return this;
    }
}
