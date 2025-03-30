document.addEventListener("DOMContentLoaded", function () {
    // First, let's create the pulse animation style
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .pulsing {
            animation: pulse 1s ease-in-out infinite;
            transform-origin: center;
            transform-box: fill-box;
        }
        @keyframes wiggle {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-3deg); }
            75% { transform: rotate(3deg); }
            100% { transform: rotate(0deg); }
        }
        @keyframes subtle-wiggle {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-1deg); }
            75% { transform: rotate(1deg); }
            100% { transform: rotate(0deg); }
        }
        .wiggling {
            animation: wiggle 0.5s ease-in-out infinite;
        }
        .subtle-wiggling {
            animation: subtle-wiggle 1s ease-in-out infinite;
        }
    `;
    document.head.appendChild(styleSheet);

    fetch("evidence_logo_black.svg")
        .then(response => response.text())
        .then(svgText => {
            const container = document.getElementById("svg-container");
            container.innerHTML = svgText;
            
            // Add initial wiggle animation to the SVG, except for specific elements
            const svg = container.querySelector("svg");

            // Make tooltip responsive
            const initialTooltip = document.createElement("div");
            initialTooltip.style.position = "absolute";
            initialTooltip.style.padding = "8px";
            initialTooltip.style.background = "rgba(28.24%,50.2%,60%,80%)";
            initialTooltip.style.color = "#fff";
            initialTooltip.style.borderRadius = "5px";
            initialTooltip.style.fontSize = "14px";
            initialTooltip.style.zIndex = "1000";
            initialTooltip.style.pointerEvents = "none";
            initialTooltip.style.maxWidth = "80vw"; // Make tooltip width responsive
            initialTooltip.style.textAlign = "center"; // Center text for better mobile display
            initialTooltip.textContent = "Tap or hover over leaves to color up the building blocks of a living preprint!";
            
            // Position the tooltip over the center of the SVG
            const svgRect = svg.getBoundingClientRect();
            initialTooltip.style.left = `${svgRect.left + svgRect.width/2}px`;
            initialTooltip.style.top = `${svgRect.top - 15}px`;
            initialTooltip.style.transform = "translate(-50%, -50%)";
            
            document.body.appendChild(initialTooltip);

            // Remove tooltip on first interaction
            const elements = [
                { id: "code-leaf", color: "#f97c0c", video: "code.mp4" },
                { id: "data-leaf", color: "#37cae2", text: "Data is the lifeblood of scientific discovery. It represents our observations, measurements, and the raw material of knowledge." },
                { id: "runtime-leaf", color: "#659b59",  video: "runtime.mp4" },
                { id: "outer-patch", color: "#b256a1", text: "The scientific process is iterative and collaborative, building upon previous knowledge." },
                { id: "inner-patch", color: "#6f00b7", text: "At our core is the commitment to open science and transparent research." },
                { id: "letter-e", color: "#394459", text: "Evidence-based research drives progress and innovation in every field." }
            ];
            
            const cardInner = document.querySelector('.card-inner');
            const componentDescription = document.getElementById('component-description');
            
            // Remove the separate video container creation and instead create a video element inside the card
            const videoElement = document.createElement('div');
            videoElement.style.display = 'none';
            videoElement.style.marginTop = '15px'; // Add some space between text and video
            componentDescription.parentNode.appendChild(videoElement);
            
            elements.forEach(({ id, color, text, video }) => {
                const element = document.getElementById(id);
                if (element) {
                    const path = element.querySelector("path");
                    path.style.transition = "fill 0.3s ease";
                    if (id !== "letter-e") {
                        element.classList.add("subtle-wiggling");
                        element.style.animationDelay = `${Math.random() * -1}s`;
                    }
                    
                    // Function to handle both touch and mouse events
                    const handleInteractionStart = () => {
                        if (initialTooltip && initialTooltip.parentNode) {
                            initialTooltip.remove();
                        }
                        element.classList.remove("subtle-wiggling");
                        
                        path.setAttribute("fill", color);
                        path.classList.add("pulsing");
                        
                        if (video) {
                            componentDescription.style.display = 'none';
                            videoElement.innerHTML = `
                                <video 
                                    playsinline 
                                    autoplay 
                                    loop 
                                    muted 
                                    style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
                                >
                                    <source src="${video}" type="video/mp4">
                                </video>
                            `;
                            videoElement.style.display = 'block';
                        } else {
                            componentDescription.style.display = 'block';
                            componentDescription.textContent = text;
                            componentDescription.style.color = color;
                        }
                        
                        cardInner.classList.add('card-flip');
                    };

                    const handleInteractionEnd = () => {
                        path.classList.remove("pulsing");
                        cardInner.classList.remove('card-flip');
                        
                        if (video) {
                            videoElement.style.display = 'none';
                            videoElement.innerHTML = '';
                            componentDescription.style.display = 'block';
                        }
                    };

                    // Add touch events
                    element.addEventListener('touchstart', (e) => {
                        e.preventDefault(); // Prevent mouse events from firing
                        handleInteractionStart();
                    });

                    element.addEventListener('touchend', (e) => {
                        e.preventDefault();
                        handleInteractionEnd();
                    });

                    // Keep mouse events for desktop
                    element.addEventListener("mouseenter", handleInteractionStart);
                    element.addEventListener("mouseleave", handleInteractionEnd);
                }
            });
        })
        .catch(error => console.error("Error loading SVG:", error));
});
