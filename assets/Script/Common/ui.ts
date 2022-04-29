import { animation, AnimationClip, AnimationComponent, Layers, math, Node, Sprite, SpriteFrame, UITransform } from 'cc';

export function createNode(rect?: { pos: math.Vec2; size: math.Size }, img?: SpriteFrame) {
    const node = new Node();
    const sprite = node.addComponent(Sprite);
    img && (sprite.spriteFrame = img);
    const transform = node.addComponent(UITransform);
    transform.contentSize = rect.size;
    transform.setAnchorPoint(0, 1);
    node.layer = 1 << 25;
    rect && node.setPosition(rect.pos.x, rect.pos.y);
    return node;
}

const reg = /\((\d+)\)/;

const getNumberWithString = (str: string) => parseInt(str.match(reg)[1] || '0');

export const sortSpriteFrame = (frames: SpriteFrame[]) => {
    return frames.sort((a, b) => getNumberWithString(a.name) - getNumberWithString(b.name));
};
