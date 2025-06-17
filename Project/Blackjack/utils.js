export async function playSoundAsync(sound) {
    return new Promise(resolve => {
        sound.currentTime = 0
        sound.addEventListener("ended", resolve);
        sound.play();
    });
}

export function playSound(sound) {
    sound.currentTime = 0
    sound.play();
}

