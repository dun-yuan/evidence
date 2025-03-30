function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".cls-corner-leaf");
    elements.forEach(el => {
        el.style.fill = getRandomColor();
    });
});
