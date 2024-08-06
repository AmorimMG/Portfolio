export const W = 'w';
export const A = 'a';
export const S = 's';
export const D = 'd';
export const SHIFT = 'shift';
export const SPACE = 'space';
export const FirstPerson = 'r';
export const DIRECTIONS = [W, A, S, D];

export class KeyDisplay {
    map = new Map();

    constructor() {
        const w = document.createElement('div');
        const a = document.createElement('div');
        const s = document.createElement('div');
        const d = document.createElement('div');
        const shift = document.createElement('div');
        const space = document.createElement('div');
        const r = document.createElement('div');

        this.map.set(W, w);
        this.map.set(A, a);
        this.map.set(S, s);
        this.map.set(D, d);
        this.map.set(SHIFT, shift);
        this.map.set(SPACE, space);
        this.map.set(FirstPerson, r);

        this.map.forEach((v, k) => {
            v.style.color = 'black';
            v.style.backgroundColor = '#e0e0e0';
            v.style.border = '2px solid #ccc';
            v.style.borderRadius = '5px';
            v.style.fontSize = '20px';
            v.style.fontWeight = '700';
            v.style.textAlign = 'center';
            v.style.lineHeight = '50px';
            v.style.width = '50px';
            v.style.height = '50px';
            v.style.position = 'absolute';
            v.textContent = k;
        });

        this.updatePosition();

        this.map.forEach((v) => {
            document.body.append(v);
        });
    }

    updatePosition() {
        this.map.get(W).style.bottom = `${window.innerHeight - 100}px`;
        this.map.get(A).style.bottom = `${window.innerHeight - 155}px`;
        this.map.get(S).style.bottom = `${window.innerHeight - 155}px`;
        this.map.get(D).style.bottom = `${window.innerHeight - 155}px`;
        this.map.get(SHIFT).style.bottom = `${window.innerHeight - 155}px`;
        this.map.get(SPACE).style.bottom = `${window.innerHeight - 155}px`;
        this.map.get(FirstPerson).style.bottom = `${window.innerHeight - 100}px`;

        this.map.get(W).style.left = `${300}px`;
        this.map.get(A).style.left = `${245}px`;
        this.map.get(S).style.left = `${300}px`;
        this.map.get(D).style.left = `${355}px`;
        this.map.get(SHIFT).style.left = `${185}px`;
        this.map.get(SPACE).style.left = `${415}px`;
        this.map.get(FirstPerson).style.left = `${415}px`;
    }

    down(key) {
        if (this.map.get(key.toLowerCase())) {
            this.map.get(key.toLowerCase()).style.backgroundColor = '#b0b0b0';
            this.map.get(key.toLowerCase()).style.color = 'white';
        }
    }

    up(key) {
        if (this.map.get(key.toLowerCase())) {
            this.map.get(key.toLowerCase()).style.backgroundColor = '#e0e0e0';
            this.map.get(key.toLowerCase()).style.color = 'black';
        }
    }
}
