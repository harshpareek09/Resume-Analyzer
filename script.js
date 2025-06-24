let resumeText = "";
let skillsData = {};

// STEP 1: Upload Resume
document.getElementById("uploadBtn").addEventListener("click", function () {
  const fileInput = document.getElementById("resumeInput");
  const file = fileInput.files[0];

  if (!file || file.type !== "application/pdf") {
    document.getElementById("fileStatus").textContent = "❌ Please upload a valid PDF file.";
    return;
  }

  resumeText = file.name.toLowerCase(); // Simulated content
  document.getElementById("fileStatus").textContent = "✅ Resume uploaded: " + file.name;
});

// STEP 2: Load Job Roles from JSON
fetch("skills.json")
  .then(res => res.json())
  .then(data => {
    skillsData = data;
    const jobRole = document.getElementById("jobRole");
    jobRole.innerHTML = '<option value="">-- Select Job Role --</option>';
    Object.keys(data).forEach(role => {
      const opt = document.createElement("option");
      opt.value = role;
      opt.textContent = role;
      jobRole.appendChild(opt);
    });
  });

document.getElementById("jobRole").addEventListener("change", function () {
  const role = this.value;
  const exp = document.getElementById("experienceLevel");
  exp.disabled = !role;
  exp.innerHTML = '<option value="">-- Select Level --</option>';
  if (role) {
    ["Beginner", "Intermediate", "Advanced"].forEach(level => {
      const o = document.createElement("option");
      o.value = level;
      o.textContent = level;
      exp.appendChild(o);
    });
  }
  document.getElementById("analyzeBtn").disabled = true;
});

document.getElementById("experienceLevel").addEventListener("change", function () {
  const role = document.getElementById("jobRole").value;
  document.getElementById("analyzeBtn").disabled = !(role && this.value);
});

// STEP 3: Analyze Skills
document.getElementById("analyzeBtn").addEventListener("click", function () {
  const role = document.getElementById("jobRole").value;
  const level = document.getElementById("experienceLevel").value;
  const resumeContent = resumeText.toLowerCase();

  const expectedSkills = skillsData[role][level];
  const matched = [];
  const missing = [];

  expectedSkills.forEach(skill => {
    if (resumeContent.includes(skill.toLowerCase())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  const matchCount = matched.length;
  const totalSkills = expectedSkills.length;
  const percentage = Math.round((matchCount / totalSkills) * 100);

  document.getElementById("selectionStatus").textContent = `Analyzing: ${role} (${level})`;
  document.getElementById("matchSummary").innerHTML =
    `<p>✅ Matched <strong>${matchCount}</strong> of <strong>${totalSkills}</strong> skills — <strong>${percentage}%</strong> match</p>`;

  document.getElementById("matchedSkills").innerHTML =
    `<h3>✅ Skills Found in Resume:</h3><ul>${matched.map(s => `<li>${s}</li>`).join("")}</ul>`;

  document.getElementById("missingSkills").innerHTML =
    `<h3>❌ Missing Skills:</h3><ul>${missing.map(s => `<li>${s}</li>`).join("")}</ul>`;

  const topMissing = missing.slice(0, 3);
  document.getElementById("topSuggestions").innerHTML =
    `<h3>📌 Suggestions:</h3>
     <p>You should work on these important skills to improve your chances:</p>
     <ul>${topMissing.map(s => `<li>${s}</li>`).join("")}</ul>`;
});
