
/* =========================================
   FELEX KIPRONO KIRUI - PORTFOLIO
   Main JavaScript
========================================= */

// Select elements
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");

// Current year
document.getElementById("currentYear").textContent =
    new Date().getFullYear();

// =========================================
// MOBILE NAVIGATION
// =========================================

function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

navItems.forEach(link => {
    link.addEventListener("click", closeMenu);
});

// Close menu when clicking outside it
document.addEventListener("click", event => {
    const clickedInsideMenu = navLinks.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
    }
});

// Close menu with Escape key
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

// =========================================
// SCROLL EFFECTS
// =========================================

function handleScroll() {
    const scrollTop = window.scrollY;
    const pageHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress =
        pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0;

    scrollProgress.style.width = `${progress}%`;

    // Back-to-top visibility
    if (scrollTop > 500) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
}

window.addEventListener("scroll", handleScroll, { passive: true });

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// =========================================
// ACTIVE NAVIGATION LINK
// =========================================

const sections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;

                navItems.forEach(link => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${sectionId}`
                    );
                });
            }
        });
    },
    {
        threshold: 0,
        rootMargin: "-35% 0px -55% 0px"
    }
);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// =========================================
// SCROLL REVEAL ANIMATIONS
// =========================================

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// =========================================
// CONTACT FORM VALIDATION
// =========================================

const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    subject: document.getElementById("subject"),
    message: document.getElementById("message")
};

const errors = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    subject: document.getElementById("subjectError"),
    message: document.getElementById("messageError")
};

function showError(fieldName, message) {
    fields[fieldName].classList.add("invalid");
    errors[fieldName].textContent = message;
}

function clearError(fieldName) {
    fields[fieldName].classList.remove("invalid");
    errors[fieldName].textContent = "";
}

function validateForm() {
    let valid = true;

    Object.keys(fields).forEach(clearError);

    formFeedback.textContent = "";

    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const subject = fields.subject.value.trim();
    const message = fields.message.value.trim();

    // Name validation
    if (name.length < 2) {
        showError("name", "Please enter your name (at least 2 characters).");
        valid = false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showError("email", "Please enter a valid email address.");
        valid = false;
    }

    // Subject validation
    if (subject.length < 3) {
        showError("subject", "Please enter a meaningful subject.");
        valid = false;
    }

    // Message validation
    if (message.length < 10) {
        showError("message", "Your message should contain at least 10 characters.");
        valid = false;
    }

    return valid;
}

// Clear field errors as the user types
Object.keys(fields).forEach(fieldName => {
    fields[fieldName].addEventListener("input", () => {
        clearError(fieldName);
        formFeedback.textContent = "";
    });
});

contactForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!validateForm()) {
        formFeedback.style.color = "#ff8585";
        formFeedback.textContent =
            "Please correct the highlighted fields and try again.";
        return;
    }

    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const subject = fields.subject.value.trim();
    const message = fields.message.value.trim();

    // Prepare an email using the visitor's default mail application.
    const recipient = "felex.kiprono.kirui@gmail.com";

    const emailBody = `
Hello Felex,

${message}

Best regards,
${name}
Email: ${email}
`;

    const mailtoLink =
        `mailto:${recipient}?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(emailBody)}`;

    formFeedback.style.color = "#29d6c5";
    formFeedback.textContent =
        "Opening your email application...";

    window.location.href = mailtoLink;
});