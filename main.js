// -------------------------------------------------------------
// 1. API & SERVER İLETİŞİMİ
// -------------------------------------------------------------
async function generateForgeCode(projectData) {
  try {
    const response = await fetch('https://forge-24ad.onrender.com/api/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectData)
    });

    const data = await response.json();
    console.log("Server response:", data);

    if (data.success) {
      console.log("PROS CLI yanıtı başarıyla alındı!");
    }
    return data;
  } catch (error) {
    console.error("Connection error:", error);
    return { success: false, error: error.message };
  }
}

function animateWidthChange(element, updateContentCallback) {
  if (!element) return;

  // 1. Yazının alt satıra kaymasını KESİNLİKLE engelle ve taşmayı gizle
  element.style.whiteSpace = 'nowrap';
  element.style.overflow = 'hidden';

  const startWidth = element.offsetWidth;

  // 2. Önce eski yazıyı hızlıca şeffaflaştır (120ms fade-out)
  element.style.transition = 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease';
  element.style.opacity = '0';

  setTimeout(() => {
    updateContentCallback();
    element.style.width = 'max-content';
    const endWidth = element.offsetWidth;
    element.style.width = `${startWidth}px`;
    void element.offsetWidth;
    element.style.width = `${endWidth}px`;
    element.style.opacity = '1';
    setTimeout(() => {
      element.style.width = '';
      element.style.opacity = '';
    }, 350);
  }, 120);
}

function updateUIState() {
  const projects = ProjectManager.getProjectList();

  // Ana Buton Genişliğini Esneterek Güncelle
  animateWidthChange(mainActionBtn, () => {
    if (projects.length === 0) {
      mainActionBtn.textContent = 'Getting Started';
    } else if (currentSelectedState === '__NEW_PROJECT__') {
      mainActionBtn.textContent = 'Create Project';
    } else {
      mainActionBtn.textContent = `Open ${currentSelectedState}`;
    }
  });

  // Sol Üst Dropdown Buton Genişliğini Esneterek Güncelle
  animateWidthChange(dropdownSelected, () => {
    if (projects.length === 0 || currentSelectedState === '__NEW_PROJECT__') {
      selectedProjectContainer.innerHTML = `<div class="dropdown-selected-content">${PLUS_SVG} <span>New Project</span></div>`;
    } else {
      selectedProjectContainer.innerHTML = `<div class="dropdown-selected-content">${FOLDER_SVG} <span>${currentSelectedState}</span></div>`;
    }
  });
}

// -------------------------------------------------------------
// 2. SVG İKON TANIMLARI
// -------------------------------------------------------------
const FOLDER_SVG = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6C3 4.89543 3.89543 4 5 4H10L12 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" fill="#53391A"/>
    <rect x="5" y="7" width="14" height="10" rx="1" fill="#F4F1E8"/>
    <path d="M2 10C2 9.17157 2.67157 8.5 3.5 8.5H20.5C21.3284 8.5 22 9.17157 22 10L20.8 17.5C20.65 18.375 19.89 19 19 19H5C4.11 19 3.35 18.375 3.2 17.5L2 10Z" fill="#6A4A23"/>
  </svg>`;

const PLUS_SVG = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4V20M4 12H20" stroke="#6A4A23" stroke-width="3.5" stroke-linecap="round"/>
  </svg>`;

// -------------------------------------------------------------
// 3. UI KONTROLÜ VE DROPDOWN YÖNETİMİ
// -------------------------------------------------------------
const dropdown = document.getElementById('customDropdown');
const dropdownSelected = document.getElementById('dropdownSelected');
const selectedProjectContainer = document.getElementById('selectedProjectContainer');
const projectListContainer = document.getElementById('projectListContainer');
const newProjectOption = document.getElementById('newProjectOption');
const mainActionBtn = document.getElementById('mainActionBtn');

// Anlık Seçili Olan Seçenek State'i
let currentSelectedState = '__NEW_PROJECT__';

// Dropdown Listesini Oluşturma
function renderProjectList() {
  const projects = ProjectManager.getProjectList();
  projectListContainer.innerHTML = '';

  projects.forEach(projectName => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.innerHTML = `${FOLDER_SVG} <span>${projectName}</span>`;

    if (projectName === currentSelectedState) {
      item.style.backgroundColor = 'rgba(106, 74, 35, 0.18)';
    }

    item.addEventListener('click', () => {
      currentSelectedState = projectName;
      updateUIState();
      dropdown.classList.remove('open');
    });

    projectListContainer.appendChild(item);
  });
}

// Dropdown Event Listener'ları
dropdownSelected.addEventListener('click', (e) => {
  e.stopPropagation();
  renderProjectList();
  dropdown.classList.toggle('open');
});

document.addEventListener('click', () => {
  dropdown.classList.remove('open');
});

newProjectOption.addEventListener('click', () => {
  currentSelectedState = '__NEW_PROJECT__';
  updateUIState();
  dropdown.classList.remove('open');
});

// -------------------------------------------------------------
// 4. ANIMASYON VE WIZARD (SİHİRBAZ) AKIŞI
// -------------------------------------------------------------
function showStep(hideEl, showEl) {
  hideEl.style.display = "none";
  showEl.style.display = "flex";
  showEl.classList.remove("fade-in");
  
  void showEl.offsetWidth; // Trigger reflow
  showEl.classList.add("fade-in");
}

document.addEventListener("DOMContentLoaded", () => {
  // İlk UI Durumunu Yükle
  updateUIState();

  const landing = document.getElementById("landing-screen");
  const step1 = document.getElementById("wizard-step-1");
  const step2 = document.getElementById("wizard-step-2");
  const loadingStep = document.getElementById("loading-step");

  const btnToStep2 = document.getElementById("btn-to-step-2");
  const btnBackTo1 = document.getElementById("btn-back-to-1");
  const btnGenerate = document.getElementById("btn-generate");
  const cards = document.querySelectorAll(".option-card");

  let selectedTemplate = "lemlib";

  // ANA BUTON AKSİYONU (Getting Started / Create Project / Open Project)
  mainActionBtn.addEventListener("click", () => {
    if (currentSelectedState === '__NEW_PROJECT__') {
      // Yeni proje oluşturulacaksa Wizard Step 1'e geç
      document.getElementById("project-name").value = ""; // Input'u temizle
      showStep(landing, step1);
    } else {
      // Var olan bir proje seçildiyse doğrudan o projeyi yükle
      const projectData = ProjectManager.loadProject(currentSelectedState);
      alert(`📂 "${currentSelectedState}" projesi yükleniyor! Editör açılıyor...`);
      // İleride buraya Editör ekranına geçiş fonksiyonu gelecek
    }
  });

  // Step 1 -> Step 2
  btnToStep2.addEventListener("click", () => {
    const projectName = document.getElementById("project-name").value.trim();
    const hintEl = document.getElementById("hint");

    if (!projectName) {
      if (hintEl) {
        hintEl.innerText = "Please enter a project name before proceeding.";
        hintEl.style.color = "#b30000";
      }
      return;
    }
    showStep(step1, step2);
  });

  // Step 2 -> Step 1 (Geri)
  btnBackTo1.addEventListener("click", () => {
    showStep(step2, step1);
  });

  // Şablon Seçim Kartları
  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      selectedTemplate = card.getAttribute("data-template");
    });
  });

  // GENERATE (PROJEYİ OLUŞTUR VE DERLE)
  btnGenerate.addEventListener("click", async () => {
    const projectName = document.getElementById("project-name").value.trim();
    const statusText = document.getElementById("loading-status");

    showStep(step2, loadingStep);

    // 1. Projeyi Önbelleğe (LocalStorage) Kaydet
    const newProjectObj = {
      projectName: projectName,
      template: selectedTemplate,
      createdAt: new Date().toISOString(),
      config: {},
      generatedCpp: ""
    };
    ProjectManager.saveProject(projectName, newProjectObj);

    // 2. Arayüz Durumunu Yeni Projeye Çek
    currentSelectedState = projectName;
    updateUIState();

    // 3. Yükleme Adımları ve Sunucu Bağlantısı
    setTimeout(() => {
      if (statusText) statusText.innerText = `Fetching ${selectedTemplate.toUpperCase()} template dependencies...`;
    }, 1200);

    setTimeout(() => {
      if (statusText) statusText.innerText = `Generating ${projectName} headers & source files...`;
    }, 2500);

    // Render Sunucusuna İstek At
    const apiResult = await generateForgeCode({
      projectName: projectName,
      template: selectedTemplate
    });

    setTimeout(() => {
      alert(`🎉 Project "${projectName}" successfully generated with ${selectedTemplate.toUpperCase()}!`);
      // Yükleme bittikten sonra ana ekrana dön veya editörü aç
      showStep(loadingStep, landing);
    }, 3800);
  });
});