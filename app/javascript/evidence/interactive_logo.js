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
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes gradient-animation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
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
            initialTooltip.style.background = "linear-gradient(45deg,  rgba(255, 5, 251, 0.9), rgba(249, 124, 12, 0.9), rgba(55,202,226,0.9), rgba(101,155,89,0.9), rgba(178,86,161,0.9), rgba(111, 0, 183, 0.9))";
            initialTooltip.style.backgroundSize = "400% 400%";
            initialTooltip.style.animation = "gradient-animation 15s ease infinite";
            initialTooltip.style.color = "#fff";
            initialTooltip.style.borderRadius = "50%"; // Make it circular
            initialTooltip.style.fontSize = "25px";
            initialTooltip.style.zIndex = "1000";
            initialTooltip.style.pointerEvents = "auto"; // Change from 'none' to 'auto' to enable touch events
            initialTooltip.style.display = "flex"; // Use flexbox for centering
            initialTooltip.style.alignItems = "center"; // Center vertically
            initialTooltip.style.justifyContent = "center"; // Center horizontally
            initialTooltip.style.textAlign = "center";
            initialTooltip.style.lineHeight = "1";
            initialTooltip.style.padding = "20px"; // Add padding inside the circle
            initialTooltip.innerHTML = `<div style='width:100%;'>
                <p style='font-size:50px; display:block;text-align:center;'>🍃</p>
                <p style='display:block; width:100%; margin-bottom:10px'>
                    <span style='font-size:30px; font-weight:bold; color:white;text-shadow: 2px 2px 3px #394459;'>
                        What brings evidence to life?
                    </span>
                </p>
                <p style='display:block; width:100%; text-shadow: 2px 2px 3px #394459;'>
                    ${('ontouchstart' in window) 
                        ? 'Tap the wiggling leaves behind to find out as you color up the logo! <br><br> Touch to start' 
                        : 'Hover over the wiggling leaves to reveal more and light up the logo! <br><br> Click to start'}
                </p>
            </div>`;
            
            // Position the tooltip to snap at the center of the logo
            const updateTooltipPosition = () => {
              const svgRect = svg.getBoundingClientRect();
              // Set width and height to make it cover the logo and scale with it
              const diameter = Math.max(svgRect.width, svgRect.height) * 1.1; // Make it slightly larger than the logo
              initialTooltip.style.width = `${diameter}px`;
              initialTooltip.style.height = `${diameter}px`;
              initialTooltip.style.left = `${svgRect.left + svgRect.width/2}px`;
              initialTooltip.style.top = `${svgRect.top + svgRect.height/2}px`;
              initialTooltip.style.transform = "translate(-50%, -50%)";
            };
            
            // Initial positioning
            updateTooltipPosition();
            
            // Update position on window resize to ensure it scales with the logo
            window.addEventListener('resize', updateTooltipPosition);

            document.body.appendChild(initialTooltip);

            // Remove tooltip on first interaction
            const elements = [
                { id: "code-leaf", color: "#f97c0c", video: "code.mp4" },
                { id: "data-leaf", color: "#37cae2", video: "data.mp4" },
                { id: "runtime-leaf", color: "#659b59", video: "runtime.mp4" },
                { id: "outer-patch", color: "#b256a1", video: "crosspol.mp4" },
                { id: "inner-patch", color: "#6f00b7", video:"evolve.mp4" },
                { id: "letter-e", color: "#394459", text: "Beyond static. Beyond now. Evidence." }
            ];
            
            const cardInner = document.querySelector('.card-inner');
            const cardBack = document.querySelector('.card-back');
            const componentDescription = document.getElementById('component-description');
            
            // Remove the separate video container creation and instead create a video element inside the card
            const videoElement = document.createElement('div');
            videoElement.style.display = 'none';
            videoElement.style.marginTop = '15px'; // Add some space between text and video
            componentDescription.parentNode.appendChild(videoElement);
            
            // Add a spinner element after the component description
            const spinnerElement = document.createElement('div');
            spinnerElement.className = 'spinner';
            spinnerElement.style.display = 'none';
            spinnerElement.innerHTML = `
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 20px auto;
                "></div>
            `;
            
            componentDescription.parentNode.insertBefore(spinnerElement, videoElement);

            let currentActiveElement = null;

            elements.forEach(({ id, color, text, video }) => {
                const element = document.getElementById(id);
                if (element) {
                    const path = element.querySelector("path");
                    path.style.transition = "fill 0.3s ease";
                    if (id !== "letter-e") {
                        element.classList.add("subtle-wiggling");
                        element.style.animationDelay = `${Math.random() * -1}s`;
                    }
                    
                    let isFlipped = false;
                    let hasBeenInteracted = false; // Track if element has been interacted with
                    
                    const handleTouchStart = () => {
                        if (currentActiveElement && currentActiveElement !== element) {
                            const currentPath = currentActiveElement.querySelector("path");
                            currentPath.classList.remove("pulsing");
                            currentActiveElement.classList.remove("subtle-wiggling");
                            isFlipped = false;
                        }

                        if (initialTooltip && initialTooltip.parentNode) {
                            initialTooltip.remove();
                        }
                        element.classList.remove("subtle-wiggling");
                        hasBeenInteracted = true;
                        
                        path.setAttribute("fill", color);
                        path.classList.add("pulsing");
                        cardBack.style.backgroundColor = color;

                        if (video) {
                            componentDescription.style.display = 'none';
                            spinnerElement.style.display = 'block';
                            videoElement.innerHTML = `
                                <video 
                                    playsinline 
                                    autoplay 
                                    loop 
                                    muted 
                                    style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
                                    onloadeddata="this.parentElement.previousElementSibling.style.display='none'"
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
                        
                        // Only flip the card if this is not the letter-e element
                        if (id !== "letter-e") {
                            cardInner.classList.add('card-flip');
                        }
                        currentActiveElement = element;
                    };

                    const handleTouchEnd = () => {
                        path.classList.remove("pulsing");
                        cardInner.classList.remove('card-flip');
                        
                        if (video) {
                            videoElement.style.display = 'none';
                            videoElement.innerHTML = '';
                            componentDescription.style.display = 'block';
                        }
                        currentActiveElement = null;
                        spinnerElement.style.display = 'none';
                    };

                    const handleMouseEnter = () => {
                        if (initialTooltip && initialTooltip.parentNode) {
                            initialTooltip.remove();
                        }
                        
                        element.classList.remove("subtle-wiggling");
                        hasBeenInteracted = true;
                        
                        path.setAttribute("fill", color);
                        path.classList.add("pulsing");
                        cardBack.style.backgroundColor = color;

                        if (video) {
                            componentDescription.style.display = 'none';
                            spinnerElement.style.display = 'block';
                            videoElement.innerHTML = `
                                <video 
                                    playsinline 
                                    autoplay 
                                    loop 
                                    muted 
                                    style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"
                                    onloadeddata="this.parentElement.previousElementSibling.style.display='none'"
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
                        
                        // Only flip the card if this is not the letter-e element
                        if (id !== "letter-e") {
                            cardInner.classList.add('card-flip');
                        }
                    };

                    const handleMouseLeave = () => {
                        path.classList.remove("pulsing");
                        cardInner.classList.remove('card-flip');

                        if (video) {
                            videoElement.style.display = 'none';
                            videoElement.innerHTML = '';
                            componentDescription.style.display = 'block';
                        }
                        spinnerElement.style.display = 'none';
                    };

                    element.addEventListener('touchstart', (e) => {
                        e.preventDefault();
                        
                        // Remove tooltip immediately on any touch
                        if (initialTooltip && initialTooltip.parentNode) {
                            initialTooltip.remove();
                        }
                        
                        if (isFlipped) {
                            handleTouchEnd();
                        } else {
                            handleTouchStart();
                        }
                        isFlipped = !isFlipped;
                    });

                    element.addEventListener("mouseenter", handleMouseEnter);
                    element.addEventListener("mouseleave", handleMouseLeave);
                }
            });
            
            // Add touch/click events for the tooltip itself
            if ('ontouchstart' in window) {
                // Mobile behavior
                initialTooltip.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (initialTooltip.parentNode) {
                        initialTooltip.remove();
                    }
                }, { passive: false });
                
                // Global one-time touch handler for mobile
                document.addEventListener('touchstart', (e) => {
                    if (initialTooltip && initialTooltip.parentNode) {
                        initialTooltip.remove();
                    }
                }, { once: true, passive: false });
            } else {
                // Desktop behavior - just use click (hover behavior is handled elsewhere)
                initialTooltip.addEventListener('click', () => {
                    if (initialTooltip.parentNode) {
                        initialTooltip.remove();
                    }
                });
            }
        })
        .catch(error => console.error("Error loading SVG:", error));
});
