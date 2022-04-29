import Tile from './Tile';

class MapTitlesStore {
    private info: (Tile | null)[][] = [];

    setTitle(t: Tile, pos: { x: number; y: number }) {
        const { x, y } = pos;
        if (!!!this.info[x]) {
            this.info[x] = [];
        }
        this.info[x][y] = t;
    }

    getTile(pos: { x: number; y: number }): Tile | null {
        const { x, y } = pos;
        return this.info[x][y] || null;
    }

    clean() {
        this.info = [];
    }
}

const MapTitles = new MapTitlesStore();
export default MapTitles;
