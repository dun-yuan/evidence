document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".evidence-paper-card");
    
    cards.forEach(card => {
        // Generate one random color for both elements
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        card.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.4)`;

        const cardInner = card.querySelector("#evidence-paper-card-inner");
        cardInner.style.borderTop  = "2px solid";
        cardInner.style.borderTopColor = `rgba(${r}, ${g}, ${b}, 0.4)`;
        cardInner.style.borderTopLeftRadius = "20%";
        cardInner.style.borderBottomRightRadius = "40%";
        cardInner.style.backgroundColor = ` #fcfbfb`;

        // const badgeAccepted = card.querySelector(".badge.accepted");
        
        // badgeAccepted.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.5)`;

        const leaf = card.querySelector(".cls-corner-leaf");
        if (leaf) {
            leaf.style.fill = `rgba(${r}, ${g}, ${b}, 1.0)`;
        }
    });
});
