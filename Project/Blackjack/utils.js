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

export function stopSound(audio) {
    audio.pause();        
    audio.currentTime = 0;
}

export function setupBtnClickSFX(audioPath) {
    const clickSound = new Audio(audioPath);
  
    document.querySelectorAll("button:not(.no-sfx)").forEach(button => {
      button.addEventListener("click", () => {
        playSound(clickSound);
      });
    });
}

export function setupBtnHoverSFX(audioPath) {
    const hoverSound = new Audio(audioPath);
  
    document.querySelectorAll("button:not(.no-sfx)").forEach(button => {
      button.addEventListener("mouseenter", () => {
        playSound(hoverSound);
      });
    });
  }