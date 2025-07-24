import data from './projects.js';

// Initialize EmailJS with your credentials
emailjs.init("boDeA7WwxN0UIT9eo");

// ==========================================================
// MAIN INITIALIZATION - Runs when the page is fully loaded
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. ELEMENT SELECTION ---
  const elements = {
    // Contact Form
    emailInput: document.getElementById("emailInput"),
    sendOtpBtn: document.querySelector('#contact button'), // Targets the first button in the contact section
    otpSection: document.getElementById("otpSection"),
    otpInput: document.getElementById("otpInput"),
    verifyOtpBtn: document.querySelector('#otpSection button'),
    otpMessage: document.getElementById("otpMessage"),
    messageBox: document.getElementById("messageBox"),
    submitBtn: document.getElementById("submitBtn"),
    // Projects
    projectsContainer: document.getElementById('projects-container'),
    // Skills
    skillCategories: document.querySelectorAll('.category'),
    // Modals
    pdfModal: document.getElementById('pdf-modal'),
    pdfViewer: document.getElementById('pdf-viewer'),
    pdfCloseBtn: document.querySelector('#pdf-modal .close-button'),
    experienceModal: document.getElementById('experience-modal'),
    experienceCloseBtn: document.querySelector('.close-experience-button'),
    // Clickable Items for Modals
    certificateItems: document.querySelectorAll('.certificate-item'),
    resumeBtn: document.getElementById('resume-btn'),
    experienceBtn: document.getElementById('experience-btn'),
    // AI Chat
    chatWidget: document.querySelector('.ai-chat-mini'),
    chatHeader: document.querySelector('.ai-chat-mini .ai-header'),
    chatInput: document.querySelector('.ai-input-container input'),
    chatSendBtn: document.querySelector('.ai-input-container .ai-send-btn'),
    chatMessagesContainer: document.querySelector('.ai-messages'),
    chatTypingIndicator: document.querySelector('.ai-typing-indicator'),
  };

  // --- 2. FUNCTIONS ---
  let generatedOTP = "";

  // Contact Form & OTP
  function sendOTP() {
    const userEmail = elements.emailInput.value;
    if (!userEmail || !userEmail.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    emailjs.send("service_ez8u3c8", "template_2mjok7b", { to_email: userEmail, otp: generatedOTP })
      .then(() => {
        elements.otpSection.classList.remove("hidden");
        alert("OTP sent to your email!");
      })
      .catch(error => {
        console.error("OTP send failed:", error);
        alert("Failed to send OTP. Please try again.");
      });
  }

  function verifyOTP() {
    const userOTP = elements.otpInput.value;
    if (userOTP === generatedOTP) {
      elements.otpMessage.textContent = "OTP verified successfully!";
      elements.otpMessage.className = "text-green-500";
      elements.messageBox.disabled = false;
      elements.submitBtn.disabled = false;
    } else {
      elements.otpMessage.textContent = "Invalid OTP. Please try again.";
      elements.otpMessage.className = "text-red-500";
    }
  }

  function submitForm() {
    const userEmail = elements.emailInput.value;
    const userMessage = elements.messageBox.value;
    if (!userEmail || !userMessage) {
      alert("Please fill all fields.");
      return;
    }
    emailjs.send("service_ez8u3c8", "template_5lktqvc", { user_email: userEmail, message: userMessage })
      .then(() => {
        alert("Message sent successfully!");
      })
      .catch(error => {
        console.error("Message send failed:", error);
        alert("Failed to send message. Please try again.");
      });
  }

  // Modals (PDF & Experience)
  function openPdfModal(pdfSrc) {
    if (elements.pdfModal && elements.pdfViewer) {
      elements.pdfViewer.src = pdfSrc;
      elements.pdfModal.style.display = 'block';
    }
  }

  function closePdfModal() {
    if (elements.pdfModal && elements.pdfViewer) {
      elements.pdfModal.style.display = 'none';
      elements.pdfViewer.src = '';
    }
  }

  function closeExperienceModal() {
    if (elements.experienceModal) {
      elements.experienceModal.style.display = 'none';
    }
  }

  // AI Chat
  function toggleChat() {
    if (elements.chatWidget) {
      elements.chatWidget.classList.toggle('collapsed');
    }
  }
  
  async function sendMiniAIMessage() {
    const question = elements.chatInput.value.trim();
    if (!question) return;
    
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-message user-message';
    userMsg.textContent = question;
    elements.chatMessagesContainer.appendChild(userMsg);
    elements.chatInput.value = '';
    
    if (elements.chatTypingIndicator) elements.chatTypingIndicator.style.display = 'block';

    try {
      // =========================================================================
      // IMPORTANT FIX: Use your live Render backend URL here
      // =========================================================================
      const backendUrl = "https://sv-portfolio-77uo.onrender.com";
      
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const botMsg = document.createElement('div');
      botMsg.className = 'ai-message bot-message';
      botMsg.textContent = data.answer || "Sorry, I encountered an issue.";
      elements.chatMessagesContainer.appendChild(botMsg);

    } catch (error) {
      console.error("AI fetch error:", error);
      const errorMsg = document.createElement('div');
      errorMsg.className = 'ai-message bot-message error';
      errorMsg.textContent = "Oops! Something went wrong.";
      elements.chatMessagesContainer.appendChild(errorMsg);
    } finally {
      if (elements.chatTypingIndicator) elements.chatTypingIndicator.style.display = 'none';
      elements.chatMessagesContainer.scrollTop = elements.chatMessagesContainer.scrollHeight;
    }
  }

  // Dynamic Content Rendering
  function renderProjects() {
    if (!elements.projectsContainer) return;
    elements.projectsContainer.innerHTML = ''; 
    data.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = `p-4 rounded-lg shadow-md flex flex-col justify-between w-full sm:w-[300px] h-[360px] ${project.themeClass}`;
      projectCard.innerHTML = `
        <div>
          <img src="${project.image}" alt="${project.title}" class="w-full max-h-48 object-contain rounded mb-2">
          <h3 class="text-lg font-semibold">${project.title}</h3>
          <p class="text-sm mb-2">${project.description}</p>
          <a href="${project.github}" target="_blank" class="text-blue-600 text-sm hover:underline">GitHub →</a>
        </div>
        <div class="flex-grow"></div>
        <div class="flex flex-wrap gap-2 items-center mt-2">
          ${project.tech.map(tech => {
            const formattedTech = tech.charAt(0).toUpperCase() + tech.slice(1).toLowerCase();
            return `<img src="assests/certificate/image/logo/${formattedTech}.png" alt="${tech}" title="${tech}" class="h-6 transition-transform duration-300 hover:scale-110">`;
          }).join('')}
        </div>
      `;
      elements.projectsContainer.appendChild(projectCard);
    });
  }

  function initSkillsSection() {
    elements.skillCategories.forEach(category => {
      const header = category.querySelector('.category-header');
      if (header) {
        header.addEventListener('click', () => category.classList.toggle('active'));
      }
    });
  }

  // --- 3. EVENT LISTENERS & INITIALIZATION ---
  
  renderProjects();
  initSkillsSection();

  // Contact form events
  if (elements.sendOtpBtn) elements.sendOtpBtn.addEventListener('click', sendOTP);
  if (elements.verifyOtpBtn) elements.verifyOtpBtn.addEventListener('click', verifyOTP);
  if (elements.submitBtn) elements.submitBtn.addEventListener('click', submitForm);

  // Modal events
  elements.certificateItems.forEach(item => {
      item.addEventListener('click', () => openPdfModal(item.dataset.pdfSrc));
  });
  if (elements.resumeBtn) elements.resumeBtn.addEventListener('click', () => openPdfModal(elements.resumeBtn.dataset.pdfSrc));
  if (elements.experienceBtn) elements.experienceBtn.addEventListener('click', () => {
      if (elements.experienceModal) elements.experienceModal.style.display = 'block';
  });
  if (elements.pdfCloseBtn) elements.pdfCloseBtn.addEventListener('click', closePdfModal);
  if (elements.experienceCloseBtn) elements.experienceCloseBtn.addEventListener('click', closeExperienceModal);

  // Chat events
  if (elements.chatHeader) elements.chatHeader.addEventListener('click', toggleChat);
  if (elements.chatSendBtn) elements.chatSendBtn.addEventListener('click', sendMiniAIMessage);
  if(elements.chatInput) elements.chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMiniAIMessage();
  });

  // Global events
  window.addEventListener('click', (event) => {
      if (event.target === elements.pdfModal) closePdfModal();
      if (event.target === elements.experienceModal) closeExperienceModal();
  });
  window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
          if (elements.pdfModal?.style.display === 'block') closePdfModal();
          if (elements.experienceModal?.style.display === 'block') closeExperienceModal();
      }
  });
});