// State variables
let answers = {
  stage1: '',
  stage2: '',
  stage3: '',
  roles: []
};

// Progress management
function updateProgress(percent) {
  document.getElementById('progress-bar').style.width = `${percent}%`;
}

// Stage management
function submitStage1() {
  const answer = document.getElementById('answer1').value.trim();
  
  if (!answer) {
    alert('נא למלא את התשובה');
    return;
  }
  
  answers.stage1 = answer;
  updateProgress(25);
  transitionToStage('stage1', 'stage2');
}

function submitStage2() {
  const currentAnswer = document.getElementById('answer2').value.trim();
  const pastAnswer = document.getElementById('answer3').value.trim();
  
  if (!currentAnswer || !pastAnswer) {
    alert('נא למלא את כל השדות');
    return;
  }
  
  answers.stage2 = currentAnswer;
  answers.stage3 = pastAnswer;
  
  updateProgress(50);
  transitionToStage('stage2', 'stage3');
}

function submitStage3() {
  const role = document.getElementById('role').value;
  const roleText = document.getElementById('roleText').value.trim();
  
  if (!roleText) {
    alert('נא למלא את התיאור של התפקיד');
    return;
  }
  
  // Add new role text to the collection
  answers.roles = answers.roles || [];
  answers.roles.push({
    role: role,
    text: roleText
  });
  
  // Clear input for next role
  document.getElementById('roleText').value = '';
  
  // Show all roles written so far
  showRoleSummary();
  
  // If all roles are completed, enable final submission
  if (answers.roles.length >= 4) {
    document.getElementById('finalSubmit').classList.remove('hidden');
  }
}

function showRoleSummary() {
  const summaryHTML = answers.roles.map(entry => `
    <div class="role-entry">
      <h4>${getRoleName(entry.role)}</h4>
      <p>${entry.text}</p>
    </div>
  `).join('');
  
  document.getElementById('roleSummary').innerHTML = summaryHTML;
}

function submitAllRoles() {
  updateProgress(100);
  showSummary();
  transitionToStage('stage3', 'stage4');
}

function submitRole(roleType) {
  const roleText = document.getElementById(`role-${roleType}`).value.trim();
  
  if (!roleText) {
    alert('נא למלא את התיאור של התפקיד');
    return;
  }
  
  // Add new role text to the collection
  answers.roles = answers.roles || [];
  answers.roles.push({
    role: roleType,
    text: roleText
  });
  
  // Disable the submitted role's input and button
  document.getElementById(`role-${roleType}`).disabled = true;
  document.querySelector(`#role-${roleType} + button`).disabled = true;
  
  // Show all roles written so far
  showRoleSummary();
  
  // If all roles are completed, enable final submission
  if (answers.roles.length >= 4) {
    document.getElementById('finalSubmit').classList.remove('hidden');
  }
}

// Helper functions
function transitionToStage(currentStageId, nextStageId) {
  document.getElementById(currentStageId).classList.add('hidden');
  document.getElementById(nextStageId).classList.remove('hidden');
}

function returnHome() {
  // Reset all answers
  answers = {
    stage1: '',
    stage2: '',
    stage3: '',
    roles: []
  };
  
  // Clear all inputs
  document.getElementById('answer1').value = '';
  document.getElementById('answer2').value = '';
  document.getElementById('answer3').value = '';
  document.getElementById('roleText').value = '';
  document.getElementById('role').selectedIndex = 0;
  
  // Reset progress bar
  updateProgress(0);
  
  // Hide all stages except first
  ['stage2', 'stage3', 'stage4'].forEach(stageId => {
    document.getElementById(stageId).classList.add('hidden');
  });
  
  // Show first stage
  document.getElementById('stage1').classList.remove('hidden');
  
  // Also hide vocabulary content when returning home
  document.getElementById('vocabulary-content').classList.add('hidden');
}

function getRoleName(role) {
  const roleNames = {
    'saba': 'סבא דרוזי',
    'child': 'ילד דרוזי',
    'tourist': 'תייר',
    'religious': 'איש דתי'
  };
  return roleNames[role] || role;
}

function showSummary() {
  const rolesHTML = answers.roles.map(entry => `
    <div class="role-summary">
      <strong>${getRoleName(entry.role)}:</strong>
      <p>${entry.text}</p>
    </div>
  `).join('');

  const summaryHTML = `
    <h3>תשובותיך:</h3>
    <p><strong>מה מציינים החגים:</strong> ${answers.stage1}</p>
    <p><strong>מנהגים כיום:</strong> ${answers.stage2}</p>
    <p><strong>מנהגים בעבר:</strong> ${answers.stage3}</p>
    <h3>תיאורים מנקודות מבט שונות:</h3>
    ${rolesHTML}
  `;
  
  document.getElementById('summary').innerHTML = summaryHTML;
}

function downloadSummary() {
  const rolesText = answers.roles.map(entry => 
    `תפקיד: ${getRoleName(entry.role)}\nתיאור: ${entry.text}\n`
  ).join('\n');

  const summaryText = `סיכום תשובות - החגים הדרוזיים

מה מציינים החגים:
${answers.stage1}

מנהגים כיום:
${answers.stage2}

מנהגים בעבר:
${answers.stage3}

תיאורים מנקודות מבט שונות:
${rolesText}
`;
  
  const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.href = url;
  a.download = 'סיכום_החגים_הדרוזיים.txt';
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

function toggleVocabulary() {
  const content = document.getElementById('vocabulary-content');
  content.classList.toggle('hidden');
}