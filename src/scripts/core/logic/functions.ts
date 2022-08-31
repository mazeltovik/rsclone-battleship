const fade = (target: HTMLElement) => {
    target.style.opacity = String(Number(target.style.opacity) - 0.1);
    if (Number(target.style.opacity) > 0) {
        setTimeout(() => fade(target), 100);
    } else {
        target.remove();
    }
};
const unFadeWithFade = (target: HTMLElement) => {
    target.style.display = 'block';
    let opacity = +target.style.opacity + 0.1;
    target.style.opacity = String(opacity);
    if (Number(target.style.opacity) < 1) {
        setTimeout(() => unFadeWithFade(target), 100);
    } else {
        setTimeout(() => fade(target), 4000);
    }
};

export default unFadeWithFade;
