interface IItem {
    func: Function;
    ctx: any;
}

class EventManager {
    private static _instance: EventManager;

    private constructor() {}

    static get Instance() {
        return this._instance || (this._instance = new this());
    }

    private event_map: Map<string, IItem[]> = new Map();

    on<T>(key: string, func: (params: T) => void, ctx: any) {
        const item: IItem = { func, ctx };
        if (this.event_map.has(key)) {
            this.event_map.get(key).push(item);
        } else {
            this.event_map.set(key, [item]);
        }
        return item;
    }

    emit(key: string, ...params: any[]) {
        if (!this.event_map.has(key)) return;
        for (const { ctx, func } of this.event_map.get(key)) {
            ctx ? func.apply(ctx, params) : func(...params);
        }
    }

    off(key: string, ctx: any) {
        if (!this.event_map.has(key)) return;
        const items = this.event_map.get(key);
        const idx = items.findIndex((value) => value.ctx == ctx);
        idx > -1 && items.splice(idx, 1);
    }
}

export default EventManager.Instance;
