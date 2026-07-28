function showStep(hideEl, showEl) {
    hideEl.style.display = "none";
    showEl.style.display = "flex";
    showEl.classList.remove("fade-in");
    
    void showEl.offsetWidth;
    showEl.classList.add("fade-in");
}

document.addEventListener("DOMContentLoaded", () => {
    const landing = document.getElementById("landing-screen");
    const step1 = document.getElementById("wizard-step-1");
    const step2 = document.getElementById("wizard-step-2");
    const loadingStep = document.getElementById("loading-step");

    const btnStart = document.getElementById("start-button");
    const btnToStep2 = document.getElementById("btn-to-step-2");
    const btnBackTo1 = document.getElementById("btn-back-to-1");
    const btnGenerate = document.getElementById("btn-generate");
    const cards = document.querySelectorAll(".option-card");

    let selectedTemplate = "lemlib";

    btnStart.addEventListener("click", () => {
        showStep(landing, step1);
    });

    btnToStep2.addEventListener("click", () => {
        const projectName = document.getElementById("project-name").value.trim();
        if (!projectName) {
            document.getElementById("hint").innerText = "Please enter a project name before proceeding.";
            document.getElementById("hint").style.color = "#b30000";
            return;
        }
        step1.style.display = "none";
        step2.style.display = "flex";
    });

    btnBackTo1.addEventListener("click", () => {
        step2.style.display = "none";
        step1.style.display = "flex";
    });

    cards.forEach(card => {
        card.addEventListener("click", () => {
            cards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            selectedTemplate = card.getAttribute("data-template");
        });
    });

    btnGenerate.addEventListener("click", () => {
        const projectName = document.getElementById("project-name").value.trim();
        const statusText = document.getElementById("loading-status");

        step2.style.display = "none";
        loadingStep.style.display = "flex";

        setTimeout(() => {
            statusText.innerText = `Fetching ${selectedTemplate.toUpperCase()} template dependencies...`;
        }, 1200);

        setTimeout(() => {
            statusText.innerText = `Generating ${projectName} headers & source files...`;
        }, 2500);

        setTimeout(() => {
            alert(`Project ${projectName} successfully generated with ${selectedTemplate.toUpperCase()}!`);
        }, 3800);
    });
}); 