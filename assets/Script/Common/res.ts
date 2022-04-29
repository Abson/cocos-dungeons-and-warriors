import { resources, SpriteFrame } from 'cc';

export function loadResDir(name: string) {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
        resources.loadDir(name, SpriteFrame, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            // resolve(res);
            resolve(res);
        });
    });
}
