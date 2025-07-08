// Initialize EmailJS with your credentials
console.log("hello");
import data from './projects.js';
console.log(data);
emailjs.init("boDeA7WwxN0UIT9eo"); // Your User ID
const ADMIN_EMAIL = "sitharthvarsan@gmail.com"; // Your admin email

let generatedOTP = "";

// ======================
// Email/OTP Functions
// ======================

async function sendOTP() {
  const userEmail = document.getElementById("emailInput").value;

  if (!userEmail || !userEmail.includes("@")) {
    alert("Please enter a valid email.");
    return;
  }

  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("OTP generated"); // Removed OTP logging for security

  try {
    await emailjs.send("service_ez8u3c8", "template_2mjok7b", {
      to_email: userEmail,
      otp: generatedOTP
    });

    document.getElementById("otpSection").classList.remove("hidden");
    document.getElementById("messageBox").disabled = true;
    document.getElementById("submitBtn").disabled = true;
    alert("OTP sent to your email!");
  } catch (error) {
    console.error("OTP send failed:", error);
    alert("Failed to send OTP. Please try again.");
  }
}

async function submitForm() {
  const userEmail = document.getElementById("emailInput").value;
  const userMessage = document.getElementById("messageBox").value;

  if (!userEmail || !userMessage) {
    alert("Please fill all fields.");
    return;
  }

  try {
    await emailjs.send("service_ez8u3c8", "template_5lktqvc", {
      user_email: userEmail,
      message: userMessage
    });

    alert("Message sent successfully!");
    resetForm();
  } catch (error) {
    console.error("Message send failed:", error);
    alert("Failed to send message. Please try again.");
  }
}

function verifyOTP() {
  const userOTP = document.getElementById("otpInput").value;
  const feedback = document.getElementById("otpMessage");

  if (userOTP === generatedOTP) {
    feedback.textContent = "OTP verified successfully!";
    feedback.className = "text-green-500";
    document.getElementById("messageBox").disabled = false;
    document.getElementById("submitBtn").disabled = false;
  } else {
    feedback.textContent = "Invalid OTP. Please try again.";
    feedback.className = "text-red-500";
  }
}

function resetForm() {
  document.getElementById("emailInput").value = "";
  document.getElementById("otpInput").value = "";
  document.getElementById("messageBox").value = "";
  document.getElementById("otpSection").classList.add("hidden");
  document.getElementById("otpMessage").textContent = "";
}

// ======================
// Projects Rendering
// ======================

function renderProjects() {
  const projectsContainer = document.getElementById('projects-container');
  if (!projectsContainer) return;

  data.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = "bg-white text-black p-4 rounded-lg shadow-md flex flex-col justify-between w-full sm:w-[300px] h-[360px]";

    const img = document.createElement('img');
    img.src = project.image;
    img.alt = project.title;
    img.className = "w-full max-h-48 object-contain rounded mb-2";
    projectCard.appendChild(img);

    const title = document.createElement('h3');
    title.textContent = project.title;
    title.className = "text-lg font-semibold";
    projectCard.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = project.description;
    desc.className = "text-sm mb-2";
    projectCard.appendChild(desc);

    const githubLink = document.createElement('a');
    githubLink.href = project.github;
    githubLink.target = '_blank';
    githubLink.textContent = 'GitHub →';
    githubLink.className = "text-blue-600 text-sm hover:underline";
    projectCard.appendChild(githubLink);

    const spacer = document.createElement('div');
    spacer.className = "flex-grow";
    projectCard.appendChild(spacer);

    const techStack = document.createElement('div');
    techStack.className = "flex flex-wrap gap-2 items-center mt-2";

    project.tech.forEach(tech => {
      const logo = document.createElement('img');
      const formattedTech = tech.charAt(0).toUpperCase() + tech.slice(1).toLowerCase();
      logo.src = `assests/certificate/image/logo/${formattedTech}.png`;
      logo.alt = tech;
      logo.title = tech;
      logo.className = "h-6 transition-transform duration-300 hover:scale-110";
      techStack.appendChild(logo);
    });

    projectCard.appendChild(techStack);
    projectsContainer.appendChild(projectCard);
  });
}

// ======================
// Skills Section
// ======================

function initSkillsSection() {
  const categories = document.querySelectorAll('.category');
  if (!categories.length) return;

  categories.forEach(category => {
    const header = category.querySelector('.category-header');
    
    header.addEventListener('click', () => {
      category.classList.toggle('active');
    });
    
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        category.classList.toggle('active');
      }
    });
  });
}

// ======================
// Initialize Everything
// ======================

document.addEventListener('DOMContentLoaded', function() {
  renderProjects();
  initSkillsSection();
});

// Expose functions to global scope
window.sendOTP = sendOTP;
window.verifyOTP = verifyOTP;
window.submitForm = submitForm;