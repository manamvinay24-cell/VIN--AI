let currentModalResume = "";

window.onload = function () {
  if (localStorage.getItem("vinaiLoggedIn") === "true") {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("appPage").classList.remove("hidden");
  }

  updateUI();
  renderSavedResumes();
  renderApplications();
};

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    showToast("Please enter username and password");
    return;
  }

  localStorage.setItem("vinaiLoggedIn", "true");
  localStorage.setItem("vinaiUsername", username);

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("appPage").classList.remove("hidden");
  showPage("dashboard");
  updateUI();
}

function demoLogin() {
  localStorage.setItem("vinaiLoggedIn", "true");
  localStorage.setItem("vinaiUsername", "Demo User");

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("appPage").classList.remove("hidden");
  showPage("dashboard");
  updateUI();
}

function logout() {
  localStorage.setItem("vinaiLoggedIn", "false");
  document.getElementById("appPage").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  if (pageId === "saved") renderSavedResumes();
  if (pageId === "tracker") renderApplications();

  updateUI();
}

function updateUI() {
  const resumes = getSavedResumes();
  const apps = getApplications();

  document.getElementById("savedCount").innerText = resumes.length;
  document.getElementById("applicationCount").innerText = apps.length;
}

function generateResume() {
  const name = value("rName") || "Your Name";
  const email = value("rEmail") || "your.email@example.com";
  const phone = value("rPhone") || "+91 XXXXXXXXXX";
  const location = value("rLocation") || "India";
  const education = value("rEducation") || "B.Tech student with interest in web development and AI tools.";
  const objective = value("rObjective") || "To obtain an internship opportunity where I can apply my skills, learn from real-world projects, and contribute with dedication.";
  const skills = value("rSkills") || "HTML, CSS, JavaScript, Python, Communication, Problem Solving";
  const projects = value("rProjects") || "Portfolio Website, Resume Builder App, Student Career Helper App";
  const certifications = value("rCertifications") || "Web Development Basics, Python Basics";
  const languages = value("rLanguages") || "Telugu, English";

  const resume = `
${name}
Email: ${email} | Phone: ${phone} | Location: ${location}

PROFESSIONAL SUMMARY
A motivated student and beginner web developer with interest in building useful digital products, responsive websites, and career-focused applications.

CAREER OBJECTIVE
${objective}

EDUCATION
${education}

SKILLS
${skills}

PROJECTS
${projects}

CERTIFICATIONS
${certifications}

LANGUAGES
${languages}
`;

  document.getElementById("resumeOutput").innerText = resume;
  showToast("Resume generated successfully");
}

function saveResume() {
  const resume = document.getElementById("resumeOutput").innerText.trim();

  if (!resume || resume === "Your resume preview will appear here.") {
    showToast("Generate a resume first");
    return;
  }

  const resumes = getSavedResumes();

  resumes.push({
    id: Date.now(),
    title: value("rName") || "Untitled Resume",
    content: resume,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("vinaiSavedResumes", JSON.stringify(resumes));
  renderSavedResumes();
  updateUI();
  showToast("Resume saved successfully");
}

function getSavedResumes() {
  return JSON.parse(localStorage.getItem("vinaiSavedResumes") || "[]");
}

function renderSavedResumes() {
  const list = document.getElementById("savedResumesList");
  const resumes = getSavedResumes();

  if (!list) return;

  if (resumes.length === 0) {
    list.innerHTML = `<div class="output">No saved resumes yet. Generate and save a resume first.</div>`;
    return;
  }

  list.innerHTML = resumes.map(resume => `
    <div class="saved-card">
      <h3>${resume.title}</h3>
      <p class="muted">${resume.date}</p>
      <div class="btn-row">
        <button onclick="viewResume(${resume.id})">View</button>
        <button onclick="copySavedResume(${resume.id})">Copy</button>
        <button onclick="downloadSavedResume(${resume.id})">Download</button>
        <button class="danger" onclick="deleteResume(${resume.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

function viewResume(id) {
  const resume = getSavedResumes().find(r => r.id === id);
  if (!resume) return;

  currentModalResume = resume.content;
  document.getElementById("modalResumeContent").innerText = resume.content;
  document.getElementById("resumeModal").classList.remove("hidden");
}

function closeResumeModal() {
  document.getElementById("resumeModal").classList.add("hidden");
}

function copyModalResume() {
  navigator.clipboard.writeText(currentModalResume);
  showToast("Resume copied");
}

function downloadModalResume() {
  downloadPlainText(currentModalResume, "vinai-saved-resume.txt");
}

function copySavedResume(id) {
  const resume = getSavedResumes().find(r => r.id === id);
  if (!resume) return;

  navigator.clipboard.writeText(resume.content);
  showToast("Resume copied");
}

function downloadSavedResume(id) {
  const resume = getSavedResumes().find(r => r.id === id);
  if (!resume) return;

  downloadPlainText(resume.content, "vinai-resume.txt");
}

function deleteResume(id) {
  let resumes = getSavedResumes();
  resumes = resumes.filter(r => r.id !== id);
  localStorage.setItem("vinaiSavedResumes", JSON.stringify(resumes));
  renderSavedResumes();
  updateUI();
  showToast("Resume deleted");
}

function clearResumeForm() {
  [
    "rName",
    "rEmail",
    "rPhone",
    "rLocation",
    "rEducation",
    "rObjective",
    "rSkills",
    "rProjects",
    "rCertifications",
    "rLanguages"
  ].forEach(id => {
    document.getElementById(id).value = "";
  });

  document.getElementById("resumeOutput").innerText = "Your resume preview will appear here.";
  showToast("Form cleared");
}

function generateCover() {
  const name = value("cName") || "Student";
  const company = value("cCompany") || "Company";
  const role = value("cRole") || "Internship";
  const skills = value("cSkills") || "HTML, CSS, JavaScript and communication";
  const interest = value("cInterest") || "I am interested in learning from real projects and improving my skills.";
  const availability = value("cAvailability") || "I am available to join immediately.";

  const cover = `
Dear Hiring Manager,

I am ${name}, and I am writing to apply for the ${role} opportunity at ${company}.

I have basic skills in ${skills}. ${interest}

As a student and fresher, I am eager to learn, work hard, and contribute to the team with dedication. ${availability}

Thank you for considering my application.

Sincerely,
${name}
`;

  document.getElementById("coverOutput").innerText = cover;
  showToast("Cover letter generated");
}

function generateHired() {
  const role = value("hRole") || "internship";
  const skills = value("hSkills") || "web development and communication";
  const strengths = value("hStrengths") || "quick learning, hard work, and consistency";
  const projects = value("hProjects") || "basic projects and practice work";
  const learning = value("hLearning") || "I am ready to learn new things and improve every day.";

  const answer = `
I should be hired for the ${role} role because I am a hardworking and quick-learning student.

I have basic skills in ${skills}. My strengths are ${strengths}. I have worked on ${projects}, which helped me improve my practical understanding.

${learning} I may be a fresher, but I am serious about learning, completing tasks on time, and giving my best effort to the team.
`;

  document.getElementById("hiredOutput").innerText = answer;
  showToast("Answer generated");
}

function addApplication() {
  const company = value("tCompany");
  const role = value("tRole");
  const platform = value("tPlatform");
  const date = value("tDate");
  const status = value("tStatus");
  const notes = value("tNotes");

  if (!company || !role || !date) {
    showToast("Fill company, role, and date");
    return;
  }

  const apps = getApplications();

  apps.push({
    id: Date.now(),
    company,
    role,
    platform,
    date,
    status,
    notes
  });

  localStorage.setItem("vinaiApplications", JSON.stringify(apps));
  renderApplications();
  updateUI();
  showToast("Application added");
}

function getApplications() {
  return JSON.parse(localStorage.getItem("vinaiApplications") || "[]");
}

function renderApplications() {
  const list = document.getElementById("trackerList");
  if (!list) return;

  const apps = getApplications();

  if (apps.length === 0) {
    list.innerHTML = `<div class="output">No internship applications added yet.</div>`;
    return;
  }

  list.innerHTML = apps.map(app => `
    <div class="saved-card">
      <h3>${app.company}</h3>
      <p>${app.role} • ${app.platform || "Platform not added"}</p>
      <p>Applied Date: ${app.date}</p>
      <span class="status">${app.status}</span>
      <p class="muted">${app.notes || ""}</p>

      <div class="btn-row">
        <select onchange="updateApplicationStatus(${app.id}, this.value)">
          <option ${app.status === "Applied" ? "selected" : ""}>Applied</option>
          <option ${app.status === "Shortlisted" ? "selected" : ""}>Shortlisted</option>
          <option ${app.status === "Interview" ? "selected" : ""}>Interview</option>
          <option ${app.status === "Rejected" ? "selected" : ""}>Rejected</option>
          <option ${app.status === "Selected" ? "selected" : ""}>Selected</option>
        </select>
        <button class="danger" onclick="deleteApplication(${app.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

function updateApplicationStatus(id, status) {
  const apps = getApplications();
  const app = apps.find(a => a.id === id);
  if (app) app.status = status;

  localStorage.setItem("vinaiApplications", JSON.stringify(apps));
  renderApplications();
  showToast("Status updated");
}

function deleteApplication(id) {
  let apps = getApplications();
  apps = apps.filter(a => a.id !== id);
  localStorage.setItem("vinaiApplications", JSON.stringify(apps));
  renderApplications();
  updateUI();
  showToast("Application deleted");
}

function clearApplications() {
  localStorage.removeItem("vinaiApplications");
  renderApplications();
  updateUI();
  showToast("All applications cleared");
}

/* REAL AI CHAT */
function quickAsk(question) {
  document.getElementById("chatInput").value = question;
  sendChat();
}

function handleChatEnter(event) {
  if (event.key === "Enter") {
    sendChat();
  }
}

async function sendChat() {
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const question = input.value.trim();

  if (!question) {
    showToast("Please type a question");
    return;
  }

  addMessage(question, "user");
  input.value = "";
  sendBtn.disabled = true;
  sendBtn.innerText = "Thinking...";

  const thinkingId = addMessage("Thinking...", "ai");

  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: question })
    });

    const data = await response.json();

    removeMessage(thinkingId);

    if (!response.ok) {
      addMessage(data.error || "AI response failed. Please try again.", "ai");
      return;
    }

    addMessage(data.reply || "I could not generate a reply.", "ai");
  } catch (error) {
    removeMessage(thinkingId);
    addMessage("AI server is not connected yet. Deploy this app on Netlify with the GEMINI_API_KEY environment variable.", "ai");
  } finally {
    sendBtn.disabled = false;
    sendBtn.innerText = "Send";
  }
}

function addMessage(text, type) {
  const messages = document.getElementById("messages");

  const div = document.createElement("div");
  const id = "msg-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

  div.id = id;
  div.className = `msg ${type === "user" ? "user-msg" : "ai-msg"}`;
  div.innerText = text;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  return id;
}

function removeMessage(id) {
  const element = document.getElementById(id);
  if (element) element.remove();
}

function showRoadmap() {
  const role = value("roleSelect");
  let text = "";

  if (role === "frontend") {
    text = `
Frontend Developer Roadmap

Required Skills:
HTML, CSS, JavaScript, Responsive Design, GitHub

30-Day Plan:
Days 1-7: HTML basics and forms
Days 8-14: CSS layouts and responsive design
Days 15-21: JavaScript basics
Days 22-30: Build a portfolio and 2 small projects

Project Ideas:
Portfolio website, landing page, to-do app, resume builder
`;
  } else if (role === "web") {
    text = `
Web Developer Roadmap

Required Skills:
HTML, CSS, JavaScript, basic backend, database basics

30-Day Plan:
Learn frontend basics, forms, validation, simple backend concepts, and deployment.

Project Ideas:
Expense tracker, business website, student dashboard
`;
  } else if (role === "bd") {
    text = `
Business Development Intern Roadmap

Required Skills:
Communication, lead generation, email writing, Excel, LinkedIn search

Practice:
Write daily outreach messages, build lead sheets, and learn client communication.
`;
  } else if (role === "data") {
    text = `
Data Entry Intern Roadmap

Required Skills:
Typing, Excel, Google Sheets, accuracy, internet research

Practice:
Create sample sheets, clean data, and improve typing speed.
`;
  } else if (role === "uiux") {
    text = `
UI/UX Beginner Roadmap

Required Skills:
Figma, wireframes, colors, typography, user flow

Projects:
Food app design, portfolio app design, login and dashboard UI.
`;
  } else {
    text = `
AI Tools Beginner Roadmap

Required Skills:
Prompt writing, ChatGPT, Canva AI, AI image tools, automation basics

Projects:
AI resume helper, caption generator, prompt library.
`;
  }

  document.getElementById("roadmapOutput").innerText = text;
}

function copyText(elementId) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(text);
  showToast("Copied");
}

function downloadText(elementId, fileName) {
  const text = document.getElementById(elementId).innerText;
  downloadPlainText(text, fileName);
}

function downloadPlainText(text, fileName) {
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(link.href);
  showToast("Downloaded");
}

function printResume() {
  const text = document.getElementById("resumeOutput").innerText;

  if (!text || text === "Your resume preview will appear here.") {
    showToast("Generate a resume first");
    return;
  }

  const win = window.open("", "_blank");
  win.document.write(`
    <html>
      <head>
        <title>VINAI Resume</title>
        <style>
          body { font-family: Arial; padding: 40px; line-height: 1.7; }
          pre { white-space: pre-wrap; font-family: Arial; }
        </style>
      </head>
      <body>
        <pre>${text}</pre>
      </body>
    </html>
  `);
  win.document.close();
  win.print();
}

function value(id) {
  return document.getElementById(id).value.trim();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2200);
}