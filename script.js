document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------
       Smooth Scrolling
    -------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetID = this.getAttribute('href');
            const target = document.querySelector(targetID);

            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });



    /* --------------------------------------
       Guestbook Functionality + LocalStorage
    -------------------------------------- */
    const messageForm = document.querySelector('.message-form');
    const notesDisplay = document.querySelector('.notes-display');

    // Load saved messages from localStorage
    function loadMessages() {
        const saved = JSON.parse(localStorage.getItem('guestbookMessages') || "[]");
        saved.forEach(msg => addMessageBubble(msg.name, msg.message, msg.rotation));
    }

    // Save message to localStorage
    function saveMessage(name, message, rotation) {
        const saved = JSON.parse(localStorage.getItem('guestbookMessages') || "[]");
        saved.unshift({ name, message, rotation });
        localStorage.setItem('guestbookMessages', JSON.stringify(saved));
    }

    // Safely escape HTML
    function escapeHTML(str) {
        return str.replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;");
    }

    // Create message bubble
    function addMessageBubble(name, message, rotation) {
        const bubble = document.createElement('div');
        bubble.classList.add('message-bubble');
        bubble.style.setProperty('--rotation', rotation);

        bubble.innerHTML = `
            <p><strong>${escapeHTML(name)} says:</strong></p>
            <p>${escapeHTML(message)}</p>
        `;

        notesDisplay.prepend(bubble);
    }

    // Form Handler
    if (messageForm) {
        messageForm.addEventListener('submit', e => {
            e.preventDefault();

            const name = document.getElementById('your-name').value.trim();
            const message = document.getElementById('your-message').value.trim();

            if (!name || !message) {
                alert("Please enter both your name and a message!");
                return;
            }

            const rotation = (Math.random() * 10 - 5).toFixed(2); // -5 to +5

            addMessageBubble(name, message, rotation);
            saveMessage(name, message, rotation);

            // Clear form
            messageForm.reset();
        });
    }

    // Load messages on page load
    loadMessages();



    /* --------------------------------------
       Section Fade-in Scroll Animation
    -------------------------------------- */
    const sections = document.querySelectorAll('section:not(.hero-section)');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('fade-in-ready');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    sections.forEach(section => {
        section.classList.add('fade-in-prep');
        observer.observe(section);
    });


    /* --------------------------------------
       Inject Keyframes Safely (Guaranteed)
    -------------------------------------- */
    const animStyle = document.createElement("style");
    animStyle.textContent = `
        .fade-in-prep {
            opacity: 0;
            transform: translateY(20px);
        }

        .fade-in-ready {
            animation: fadeInUp 1s ease-out forwards;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(animStyle);

});
