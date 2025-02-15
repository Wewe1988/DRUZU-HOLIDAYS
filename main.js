// State variables
let answers = {
  stage1: '',
  stage2: '',
  stage3: '',
  role: '',
  roleText: ''
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
  
  answers.role = role;
  answers.roleText = roleText;
  
  updateProgress(100);
  showSummary();
  transitionToStage('stage3', 'stage4');
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
    role: '',
    roleText: ''
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
  const summaryHTML = `
    <h3>תשובותיך:</h3>
    <p><strong>מה מציינים החגים:</strong> ${answers.stage1}</p>
    <p><strong>מנהגים כיום:</strong> ${answers.stage2}</p>
    <p><strong>מנהגים בעבר:</strong> ${answers.stage3}</p>
    <p><strong>תפקיד נבחר:</strong> ${getRoleName(answers.role)}</p>
    <p><strong>תיאור מנקודת המבט:</strong> ${answers.roleText}</p>
  `;
  
  document.getElementById('summary').innerHTML = summaryHTML;
}

function downloadSummary() {
  const summaryText = `סיכום תשובות - החגים הדרוזיים

מה מציינים החגים:
${answers.stage1}

מנהגים כיום:
${answers.stage2}

מנהגים בעבר:
${answers.stage3}

תפקיד נבחר:
${getRoleName(answers.role)}

תיאור מנקודת המבט:
${answers.roleText}
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