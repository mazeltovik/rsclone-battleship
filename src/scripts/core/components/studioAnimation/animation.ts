import dog from '../../../../assets/png/shadow_dog.png';
import { fade } from '../../logic/functions';

class Animation {
    private static animation() {
        const animation = document.createElement('div');
        animation.id = 'animation';
        const canvas = document.createElement('canvas');
        canvas.id = 'canvas1';
        animation.style.opacity = '1';
        animation.append(canvas);
        document.body.prepend(animation);
        const ctx = canvas.getContext('2d');
        const CANVAS_WIDTH = (canvas.width = 600);
        const CANVAS_HEIGHT = (canvas.height = 600);

        const p = document.createElement('p');
        p.id = 'studioP';
        p.textContent = 'Pirate Byte Studio';
        canvas.after(p);

        const playerImage = new Image();
        playerImage.src = dog;
        const spriteWidth = 575;
        const spriteHeight = 523;
        let frameX = 0;
        let frameY = 3;
        let gameFrame = 0;
        const staggerFrames = 6;

        function animateCanvas() {
            ctx?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            let position = Math.floor(gameFrame / staggerFrames) % 6;
            frameX = spriteWidth * position;
            ctx?.drawImage(
                playerImage,
                frameX,
                frameY * spriteHeight,
                spriteWidth,
                spriteHeight,
                0,
                0,
                spriteWidth,
                spriteHeight
            );
            gameFrame += 1;
            requestAnimationFrame(animateCanvas);
        }

        function fadeIn(elem: HTMLParagraphElement, time: number) {
            let start = new Date().getTime();
            animate();
            function animate() {
                let elapsed = new Date().getTime() - start;
                let fraction = elapsed / time;
                if (fraction < 1) {
                    let opacity = 0 + Math.cos(Math.acos(fraction));
                    elem.style.opacity = String(opacity);
                    setTimeout(animate, Math.min(25, time - elapsed));
                } else {
                    elem.style.opacity = '1';
                }
            }
        }
        setTimeout(() => {
            fade(animation);
            localStorage.setItem('LogoAnimationWas', 'true');
        }, 4500);
        animateCanvas();
        fadeIn(p, 4500);
    }
    static start() {
        if (!localStorage.getItem('LogoAnimationWas')) this.animation();
    }
}

export default Animation;
