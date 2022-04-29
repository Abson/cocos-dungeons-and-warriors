import { animation, AnimationClip, Component, Sprite, SpriteFrame, Animation } from 'cc';
import { loadResDir } from './res';
import { sortSpriteFrame } from './ui';

const ANIMATION_SPPED = 1 / 8;

export interface IState {
    init(): Promise<void>;
    run(): void;
}

export class State implements IState {
    private _clip: AnimationClip;

    constructor(
        private fms: Component,
        private path: string,
        private wrap: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal
    ) {}

    async init() {
        let imgs = await loadResDir(this.path);
        // 排序一下图片，因为网络下载图片的时候，图片下来的顺序不一样
        imgs = sortSpriteFrame(imgs);
        const clip = new AnimationClip();
        const track = new animation.ObjectTrack();
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
        const frames: Array<[number, SpriteFrame]> = imgs.map((img, idx) => [ANIMATION_SPPED * idx, img]);
        track.channel.curve.assignSorted(frames);
        clip.duration = frames.length * ANIMATION_SPPED;
        clip.wrapMode = this.wrap;
        clip.name = this.path;
        clip.addTrack(track);
        this._clip = clip;
    }

    run() {
        const ani = this.fms.getComponent(Animation);
        ani.defaultClip = this._clip;
        ani.play();
    }
}
