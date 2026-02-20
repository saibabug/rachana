// ═══════════════════════════════════════════════════════
// TELUGU DICTIONARY DATA
// ═══════════════════════════════════════════════════════
let teluguDictionary = {};
let dictionaryLoaded = false;

// Load dictionary from external JSON file
async function loadDictionary() {
  try {
    const response = await fetch('telugu-dictionary.json');
    if (!response.ok) {
      throw new Error('Dictionary file not found');
    }
    teluguDictionary = await response.json();
    dictionaryLoaded = true;
    console.log('Dictionary loaded successfully:', Object.keys(teluguDictionary).length, 'words');
  } catch (error) {
    console.error('Error loading dictionary:', error);
    showNotification('నిఘంటువు లోడ్ చేయడంలో సమస్య');
    // Fallback to a few basic words if file not found
    teluguDictionary = {
      "పుస్తకం": {
        meaning: "చదవడానికి లేదా చూడటానికి కాగితపు పేజీలతో కూడిన రచన",
        pos: "నామవాచకం",
        example: "నేను ప్రతిరోజు ఒక పుస్తకం చదువుతాను.",
        synonyms: "గ్రంథం, పోథి, పుస్తి"
      },
      "రచన": {
        meaning: "వ్రాయబడిన సాహిత్య కృతి లేదా రచయిత చేసిన పని",
        pos: "నామవాచకం",
        example: "ఆమె తన మొదటి రచనను ప్రచురించింది.",
        synonyms: "కృతి, సృష్టి, రచయిత పని"
      },
      "కథ": {
        meaning: "కల్పిత లేదా వాస్తవ సంఘటనల వృత్తాంతం",
        pos: "నామవాచకం",
        example: "పిల్లలకు కథలు చెప్పడం చాలా ఇష్టం.",
        synonyms: "కథనం, కథనిక, చరిత"
      }
    };
    dictionaryLoaded = true;
  }
}

// ═══════════════════════════════════════════════════════
// DICTIONARY FUNCTIONS
// ═══════════════════════════════════════════════════════
async function searchDictionary() {
  const searchTerm = document.getElementById('dict-search-input').value.trim();
  if (!searchTerm) {
    showNotification('పదాన్ని నమోదు చేయండి');
    return;
  }

  const resultsDiv = document.getElementById('dict-results');
  
  // Load dictionary if not loaded yet
  if (!dictionaryLoaded) {
    resultsDiv.innerHTML = '<div class="dict-loading">నిఘంటువు లోడ్ అవుతోంది...</div>';
    await loadDictionary();
  }
  
  // Search in dictionary
  const result = teluguDictionary[searchTerm];
  
  if (result) {
    resultsDiv.innerHTML = `
      <div class="dict-entry">
        <div class="dict-word">${searchTerm}</div>
        ${result.pos ? `<div class="dict-pos">${result.pos}</div>` : ''}
        <div class="dict-meaning">${result.meaning}</div>
        ${result.example ? `<div class="dict-example">ఉదాహరణ: ${result.example}</div>` : ''}
        ${result.synonyms ? `<div class="dict-synonyms">పర్యాయపదాలు: ${result.synonyms}</div>` : ''}
      </div>
    `;
  } else {
    // Search for partial matches
    const partialMatches = Object.keys(teluguDictionary).filter(word => 
      word.includes(searchTerm) || searchTerm.includes(word)
    );
    
    if (partialMatches.length > 0) {
      resultsDiv.innerHTML = `
        <div style="margin-bottom:16px;color:var(--text-muted);font-size:12px;">
          "${searchTerm}" కొరకు సరైన అర్థం దొరకలేదు. సంబంధిత పదాలు:
        </div>
      ` + partialMatches.slice(0, 3).map(word => {
        const data = teluguDictionary[word];
        return `
          <div class="dict-entry">
            <div class="dict-word">${word}</div>
            ${data.pos ? `<div class="dict-pos">${data.pos}</div>` : ''}
            <div class="dict-meaning">${data.meaning}</div>
            ${data.example ? `<div class="dict-example">ఉదాహరణ: ${data.example}</div>` : ''}
          </div>
        `;
      }).join('');
    } else {
      resultsDiv.innerHTML = `
        <div class="dict-error">
          <p>"${searchTerm}" కొరకు నిఘంటువులో అర్థం దొరకలేదు.</p>
          <p style="margin-top: 12px; font-size: 11px;">క్రింది పదాలు ప్రయత్నించండి:</p>
          <div class="dict-quick-words" style="margin-top:12px;">
            ${Object.keys(teluguDictionary).slice(0, 8).map(word => 
              `<div class="dict-quick-word" onclick="quickSearch('${word}')">${word}</div>`
            ).join('')}
          </div>
        </div>
      `;
    }
  }
}

function quickSearch(word) {
  document.getElementById('dict-search-input').value = word;
  searchDictionary();
}

// ═══════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════
let chapters = [{ id: Date.now(), title: 'అధ్యాయం 1', content: '' }];
let currentChapterIdx = 0;
let currentFont = "'Noto Serif Telugu', serif";
let currentLang = 'te';
let bookData = {
  title: '',
  author: '',
  genre: 'నవల (Novel)',
  publisher: '',
  description: ''
};
let coverData = { 
  style: 'classic',
  backgroundImage: null
};
let currentLayout = 'classic';

// ═══════════════════════════════════════════════════════
// COVER DESIGN
// ═══════════════════════════════════════════════════════
const coverStyles = [
  { id: 'classic', name: 'క్లాసిక్', bg: '#8b4513', accent: '#c9933a', pattern: 'solid' },
  { id: 'modern', name: 'మోడర్న్', bg: '#2c3e50', accent: '#3498db', pattern: 'gradient' },
  { id: 'elegant', name: 'ఎలిగెంట్', bg: '#1a1a2e', accent: '#c9b0ff', pattern: 'solid' },
  { id: 'vibrant', name: 'వైబ్రెంట్', bg: '#e74c3c', accent: '#f39c12', pattern: 'gradient' },
  { id: 'nature', name: 'ప్రకృతి', bg: '#27ae60', accent: '#f1c40f', pattern: 'solid' },
  { id: 'ocean', name: 'సముద్రం', bg: '#16a085', accent: '#ecf0f1', pattern: 'gradient' },
  { id: 'sunset', name: 'సూర్యాస్తమయం', bg: '#d35400', accent: '#e8e8f0', pattern: 'gradient' },
  { id: 'royal', name: 'రాజసి', bg: '#8e44ad', accent: '#f8d568', pattern: 'solid' }
];

let coverImages = [];

function initCoverPreviews() {
  const container = document.getElementById('cover-templates');
  container.innerHTML = coverStyles.map((s, i) => `
    <div class="cover-template ${i === 0 ? 'active' : ''}" 
         style="background:${s.pattern === 'gradient' ? `linear-gradient(135deg, ${s.bg}, ${s.accent})` : s.bg}" 
         onclick="selectCoverStyle('${s.id}')"
         title="${s.name}">
    </div>
  `).join('');
}

function selectCoverStyle(styleId) {
  coverData.style = styleId;
  document.querySelectorAll('.cover-template').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  generateCover();
}

async function loadCoverImages() {
  const container = document.getElementById('cover-images');
  container.innerHTML = '<div class="cover-image-loading">చిత్రాలు లోడ్ అవుతున్నాయి...</div>';
  
  try {
    // Using Unsplash API for free images
    // Note: In production, you'd want to use your own Unsplash API key
    const keywords = ['book', 'library', 'nature', 'abstract', 'art', 'vintage', 'texture', 'pattern'];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    
    const response = await fetch(`https://source.unsplash.com/collection/1163637/400x600`);
    
    // Generate multiple image variations
    const imageUrls = [
      'https://source.unsplash.com/collection/1163637/400x600?sig=1',
      'https://source.unsplash.com/collection/1163637/400x600?sig=2',
      'https://source.unsplash.com/collection/1163637/400x600?sig=3',
      'https://source.unsplash.com/collection/1163637/400x600?sig=4',
      'https://source.unsplash.com/collection/1163637/400x600?sig=5',
      'https://source.unsplash.com/collection/1163637/400x600?sig=6',
      'https://source.unsplash.com/400x600/?book,library',
      'https://source.unsplash.com/400x600/?nature,landscape',
      'https://source.unsplash.com/400x600/?abstract,art',
      'https://source.unsplash.com/400x600/?vintage,texture',
      'https://source.unsplash.com/400x600/?pattern,design',
      'https://source.unsplash.com/400x600/?minimal,simple'
    ];
    
    container.innerHTML = imageUrls.map((url, idx) => `
      <div class="cover-image-item" onclick="selectCoverImage('${url}')">
        <img src="${url}" alt="Cover option ${idx + 1}" loading="lazy">
      </div>
    `).join('');
    
    showNotification('చిత్రాలు లోడ్ అయ్యాయి!');
  } catch (error) {
    container.innerHTML = '<div class="cover-image-loading">చిత్రాలు లోడ్ చేయడంలో లోపం.<br>మళ్ళీ ప్రయత్నించండి.</div>';
  }
}

function selectCoverImage(imageUrl) {
  coverData.backgroundImage = imageUrl;
  document.querySelectorAll('.cover-image-item').forEach(item => item.classList.remove('active'));
  event.currentTarget.classList.add('active');
  generateCover();
}

function generateCover() {
  const canvas = document.getElementById('cover-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 600;
  
  const style = coverStyles.find(s => s.id === coverData.style) || coverStyles[0];
  
  // Background
  if (coverData.backgroundImage) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      // Draw image
      ctx.drawImage(img, 0, 0, 400, 600);
      
      // Add overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, 400, 600);
      
      // Draw text on top
      drawCoverText(ctx, style);
    };
    img.src = coverData.backgroundImage;
  } else {
    // Solid or gradient background
    if (style.pattern === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, 400, 600);
      gradient.addColorStop(0, style.bg);
      gradient.addColorStop(1, style.accent);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = style.bg;
    }
    ctx.fillRect(0, 0, 400, 600);
    
    drawCoverText(ctx, style);
  }
}

function drawCoverText(ctx, style) {
  // Decorative borders
  ctx.strokeStyle = coverData.backgroundImage ? '#ffffff' : style.accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, 340, 540);
  ctx.strokeRect(40, 40, 320, 520);
  
  // Title
  ctx.fillStyle = coverData.backgroundImage ? '#ffffff' : style.accent;
  ctx.font = 'bold 32px "Noto Serif Telugu", serif';
  ctx.textAlign = 'center';
  const title = bookData.title || 'తెలుగు పుస్తకం';
  wrapText(ctx, title, 200, 250, 320, 40);
  
  // Author
  ctx.font = '20px "Noto Serif Telugu", serif';
  ctx.fillText(bookData.author || 'రచయిత', 200, 400);
  
  // Ornament
  ctx.font = '16px "Noto Sans Telugu", sans-serif';
  ctx.fillText('◆', 200, 450);
  
  // Genre/Publisher at bottom
  ctx.font = '14px "Noto Sans Telugu", sans-serif';
  ctx.fillText(bookData.genre || 'నవల', 200, 520);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lines = [];
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => {
    ctx.fillText(l, x, startY + i * lineHeight);
  });
}

function downloadCover() {
  const canvas = document.getElementById('cover-canvas');
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bookData.title || 'cover'}.png`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('కవర్ డౌన్లోడ్ చేయబడింది!');
  });
}

// ═══════════════════════════════════════════════════════
// CHAPTERS
// ═══════════════════════════════════════════════════════
function renderChapters() {
  const list = document.getElementById('chapter-list');
  list.innerHTML = chapters.map((ch, i) => `
    <div class="chapter-item ${i === currentChapterIdx ? 'active' : ''}" onclick="switchChapter(${i})">
      <div class="chapter-title">${ch.title}</div>
      <div class="chapter-meta">
        <span>పదాలు: ${countWords(i === currentChapterIdx ? document.getElementById('text-editor').innerText : (ch.content||'').replace(/<[^>]+>/g,''))}</span>
      </div>
      ${chapters.length > 1 ? `<button class="chapter-delete" onclick="event.stopPropagation(); deleteChapter(${i})">✕</button>` : ''}
    </div>
  `).join('');
}

function addChapter() {
  saveCurrentChapter();
  const newCh = { id: Date.now(), title: `అధ్యాయం ${chapters.length+1}`, content: '' };
  chapters.push(newCh);
  currentChapterIdx = chapters.length - 1;
  loadChapter();
  renderChapters();
  updateStats();
  showNotification('కొత్త అధ్యాయం జోడించబడింది!');
}

function switchChapter(idx) {
  if (idx === currentChapterIdx) return;
  saveCurrentChapter();
  currentChapterIdx = idx;
  loadChapter();
  renderChapters();
  updateStats();
}

function deleteChapter(idx) {
  if (chapters.length === 1) {
    showNotification('కనీసం ఒక అధ్యాయం ఉండాలి!');
    return;
  }
  if (confirm(`"${chapters[idx].title}" తొలగించాలా?`)) {
    chapters.splice(idx, 1);
    if (currentChapterIdx >= chapters.length) currentChapterIdx = chapters.length - 1;
    loadChapter();
    renderChapters();
    updateStats();
    showNotification('అధ్యాయం తొలగించబడింది');
  }
}

function saveCurrentChapter() {
  chapters[currentChapterIdx].content = document.getElementById('text-editor').innerHTML;
}

function loadChapter() {
  document.getElementById('text-editor').innerHTML = chapters[currentChapterIdx].content || '';
  updateEditorStats();
}

// ═══════════════════════════════════════════════════════
// EDITOR COMMANDS
// ═══════════════════════════════════════════════════════
function execCmd(cmd, val) {
  document.execCommand(cmd, false, val);
  document.getElementById('text-editor').focus();
}

function changeFont(font) {
  currentFont = font;
  document.getElementById('text-editor').style.fontFamily = font;
}

function changeFontSize(size) {
  document.getElementById('text-editor').style.fontSize = size + 'px';
}

function insertText(text) {
  const editor = document.getElementById('text-editor');
  editor.focus();
  document.execCommand('insertText', false, text);
}

function checkSelection() {
  // Could implement word suggestions here
}

// ═══════════════════════════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════════════════════════
function applyTemplate(type) {
  const templates = {
    novel: { title: 'అధ్యాయం 1: ప్రారంభం', content: '<p>ఈ కథ ప్రారంభం అవుతుంది...</p>' },
    story: { title: 'కథ', content: '<p>ఒకప్పుడు...</p>' },
    poetry: { title: 'కవిత 1', content: '<p style="text-align:center;"><i>ఇక్కడ మీ కవిత రాయండి...</i></p>' },
    essay: { title: 'వ్యాసం', content: '<h2>పరిచయం</h2><p></p>' },
    blog: { title: 'బ్లాగ్ పోస్ట్', content: '<h2>శీర్షిక</h2><p></p>' },
    script: { title: 'దృశ్యం 1', content: '<p><b>పాత్ర 1:</b> </p>' }
  };
  const t = templates[type];
  if (t) {
    chapters[currentChapterIdx].title = t.title;
    chapters[currentChapterIdx].content = t.content;
    loadChapter();
    renderChapters();
    showNotification(`${t.title} టెంప్లేట్ వర్తింపబడింది!`);
  }
}

// ═══════════════════════════════════════════════════════
// STATS & COUNTING
// ═══════════════════════════════════════════════════════
function countWords(text) {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function updateEditorStats() {
  const text = document.getElementById('text-editor').innerText;
  const words = countWords(text);
  const chars = text.replace(/\s/g, '').length;
  const readTime = Math.ceil(words / 200);
  document.getElementById('status-words').textContent = `పదాలు: ${words}`;
  document.getElementById('status-chars').textContent = `అక్షరాలు: ${chars}`;
  document.getElementById('status-read-time').textContent = `చదవడం: ${readTime} నిమి.`;
  document.getElementById('status-chapter').textContent = `అధ్యాయం ${currentChapterIdx+1} / ${chapters.length}`;
}

function updateTotalStats() {
  let totalWords = 0;
  chapters.forEach((ch, i) => {
    const txt = i === currentChapterIdx ? document.getElementById('text-editor').innerText : (ch.content||'').replace(/<[^>]+>/g,'');
    totalWords += countWords(txt);
  });
  document.getElementById('total-stats').textContent = `మొత్తం: ${totalWords} పదాలు`;
}

// ═══════════════════════════════════════════════════════
// SAVE & LOAD
// ═══════════════════════════════════════════════════════
function saveAll() {
  saveCurrentChapter();
  const data = { chapters, bookData, coverData, currentChapterIdx };
  localStorage.setItem('telugu-book', JSON.stringify(data));
  showNotification('పుస్తకం సేవ్ చేయబడింది! 💾');
}

function loadAll() {
  const saved = localStorage.getItem('telugu-book');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      chapters = data.chapters || chapters;
      bookData = data.bookData || bookData;
      coverData = data.coverData || coverData;
      currentChapterIdx = data.currentChapterIdx || 0;
      loadChapter();
      renderChapters();
      loadBookDetails();
      updateStats();
    } catch(e) { console.error(e); }
  }
}

function saveBookDetails() {
  bookData.title = document.getElementById('book-title').value;
  bookData.author = document.getElementById('book-author').value;
  bookData.genre = document.getElementById('book-genre').value;
  bookData.publisher = document.getElementById('book-publisher').value;
  bookData.description = document.getElementById('book-description').value;
  closeModal('book-modal');
  showNotification('పుస్తక వివరాలు సేవ్ చేయబడ్డాయి!');
  saveAll();
}

function loadBookDetails() {
  document.getElementById('book-title').value = bookData.title || '';
  document.getElementById('book-author').value = bookData.author || '';
  document.getElementById('book-genre').value = bookData.genre || 'నవల (Novel)';
  document.getElementById('book-publisher').value = bookData.publisher || '';
  document.getElementById('book-description').value = bookData.description || '';
}

// ═══════════════════════════════════════════════════════
// PREVIEW
// ═══════════════════════════════════════════════════════
function renderPreview(layout) {
  currentLayout = layout;
  document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  
  const layouts = {
    classic: { pageColor: '#faf6ee', color: '#2a1e0f', font: 'Georgia, serif' },
    modern: { pageColor: '#ffffff', color: '#333333', font: 'Arial, sans-serif' },
    minimal: { pageColor: '#f5f5f5', color: '#1a1a1a', font: 'Helvetica, sans-serif' },
    elegant: { pageColor: '#1a1a2e', color: '#e8e8f0', font: 'Garamond, serif' }
  };
  
  const l = layouts[layout];
  saveCurrentChapter();
  
  let allContent = '';
  chapters.forEach((ch, i) => {
    const content = ch.content || '';
    allContent += `<h2 style="color:${l.color === '#e8e8f0' ? '#c9b0ff':'#8b4513'};margin-top:32px;font-size:22px;">${ch.title}</h2>${content}`;
  });
  
  document.getElementById('preview-content').innerHTML = `
    <div style="background:${l.pageColor};padding:48px;font-family:'Noto Serif Telugu',serif;color:${l.color};min-height:400px;">
      ${bookData.title ? `<h1 style="text-align:center;font-size:28px;color:${l.color === '#e8e8f0' ? '#c9b0ff':'#c9933a'};margin-bottom:8px;">${bookData.title}</h1>` : ''}
      ${bookData.author ? `<p style="text-align:center;font-size:14px;color:${l.color};margin-bottom:40px;">${bookData.author} రచించిన</p>` : ''}
      <hr style="border-color:rgba(201,147,58,0.4);margin-bottom:40px;">
      ${allContent}
    </div>
  `;
}

// ═══════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════
function exportAs(type) {
  const title = bookData.title || 'తెలుగు పుస్తకం';
  const author = bookData.author || 'రచయిత';
  
  if (type === 'txt') {
    let content = `${title}\n${'='.repeat(title.length)}\nరచయిత: ${author}\n\n`;
    chapters.forEach((ch, i) => {
      const txt = i === currentChapterIdx ? (document.getElementById('text-editor').innerText) : (ch.content ? ch.content.replace(/<[^>]+>/g,'') : '');
      content += `అధ్యాయం ${i+1}: ${ch.title}\n${'─'.repeat(40)}\n${txt}\n\n`;
    });
    downloadFile(content, `${title}.txt`, 'text/plain;charset=utf-8');
    showNotification('TXT ఫైల్ సేవ్ అయింది!');
  }
  else if (type === 'html') {
    const css = `body{font-family:'Noto Serif Telugu',serif;max-width:800px;margin:0 auto;padding:40px;background:#faf6ee;color:#2a1e0f;} h1{text-align:center;color:#c9933a;} h2{color:#8b4513;} p{line-height:2;}`;
    let content = `<!DOCTYPE html><html lang="te"><head><meta charset="UTF-8"><title>${title}</title><link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Telugu:wght@400;700&display=swap" rel="stylesheet"><style>${css}</style></head><body>`;
    content += `<h1>${title}</h1><p style="text-align:center;">${author} రచించిన</p><hr>`;
    chapters.forEach((ch, i) => {
      const txt = i === currentChapterIdx ? document.getElementById('text-editor').innerHTML : (ch.content || '');
      content += `<h2>అధ్యాయం ${i+1}: ${ch.title}</h2>${txt}<hr>`;
    });
    content += `</body></html>`;
    downloadFile(content, `${title}.html`, 'text/html;charset=utf-8');
    showNotification('HTML ఫైల్ సేవ్ అయింది!');
  }
  else if (type === 'pdf' || type === 'print') {
    const css2 = `
      @page{size:A4;margin:25mm 30mm;}
      body{font-family:'Noto Serif Telugu',serif;font-size:14pt;line-height:2;color:#2a1e0f;}
      h1{text-align:center;font-size:22pt;color:#8b4513;page-break-after:avoid;}
      h2{font-size:16pt;color:#8b4513;page-break-before:always;page-break-after:avoid;}
      .cover{height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}
      .cover h1{font-size:32pt;color:#c9933a;margin-bottom:20px;}
      @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Telugu:wght@400;700&display=swap');
    `;
    let body = `<div class="cover"><h1>${title}</h1><p style="font-size:16pt;">${author}</p><p style="font-size:12pt;">${bookData.publisher||''}</p></div>`;
    chapters.forEach((ch, i) => {
      const txt = i === currentChapterIdx ? document.getElementById('text-editor').innerHTML : (ch.content || '');
      body += `<h2>అధ్యాయం ${i+1}: ${ch.title}</h2>${txt}`;
    });
    const win = window.open('');
    win.document.write(`<!DOCTYPE html><html lang="te"><head><meta charset="UTF-8"><title>${title}</title><style>${css2}</style></head><body>${body}</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 600);
  }
}

function downloadFile(content, filename, mime) {
  const blob = new Blob(['\uFEFF'+content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════
// STATS MODAL
// ═══════════════════════════════════════════════════════
function showStats() {
  let totalWords = 0, totalChars = 0;
  chapters.forEach((ch, i) => {
    const txt = i === currentChapterIdx ? document.getElementById('text-editor').innerText : (ch.content||'').replace(/<[^>]+>/g,'');
    totalWords += countWords(txt);
    totalChars += txt.replace(/\s/g,'').length;
  });
  const stats = [
    { label: 'మొత్తం అధ్యాయాలు', value: chapters.length },
    { label: 'మొత్తం పదాలు', value: totalWords },
    { label: 'మొత్తం అక్షరాలు', value: totalChars },
    { label: 'చదవడానికి సమయం', value: Math.ceil(totalWords/200) + ' నిమి.' },
    { label: 'సగటు అధ్యాయం పదాలు', value: chapters.length ? Math.round(totalWords/chapters.length) : 0 },
    { label: 'పుస్తక పేరు', value: bookData.title || '—' },
    { label: 'రచయిత', value: bookData.author || '—' },
    { label: 'ప్రకారం', value: bookData.genre || '—' },
  ];
  document.getElementById('stats-content').innerHTML = stats.map(s => `
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:6px;padding:12px;text-align:center;">
      <div style="font-size:22px;color:var(--gold-light);font-weight:bold;font-family:'Noto Serif Telugu',serif;">${s.value}</div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${s.label}</div>
    </div>
  `).join('');
  openModal('stats-modal');
}

// ═══════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════
function openModal(id) {
  document.getElementById(id).classList.add('show');
  if (id === 'cover-modal') { setTimeout(()=>{ initCoverPreviews(); generateCover(); },100); }
  if (id === 'preview-modal') renderPreview(currentLayout);
  if (id === 'stats-modal') showStats();
}
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('show'); });
});

function switchSTab(panel, el) {
  document.querySelectorAll('.sidebar-panel').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
  document.querySelectorAll('.s-tab').forEach(t => t.classList.remove('active'));
  const p = document.getElementById('panel-' + panel);
  if (p) { p.classList.add('active'); p.style.display = 'flex'; }
  el.classList.add('active');
}

function switchRTab(panel, el) {
  document.querySelectorAll('#sidebar-right .right-panel').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
  document.querySelectorAll('.r-tab').forEach(t => t.classList.remove('active'));
  const p = document.getElementById('panel-' + panel);
  if (p) { p.classList.add('active'); p.style.display = 'flex'; }
  el.classList.add('active');
}

function toggleSidebar(side) {
  const sb = document.getElementById('sidebar-' + side);
  const toggle = document.getElementById(side === 'left' ? 'left-toggle' : 'right-toggle');
  sb.classList.toggle('collapsed');
  toggle.classList.toggle('collapsed');
  toggle.textContent = sb.classList.contains('collapsed')
    ? (side === 'left' ? '▶' : '◀')
    : (side === 'left' ? '◀' : '▶');
}

function setLang(lang, el) {
  currentLang = lang;
  document.querySelectorAll('.lang-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  const editor = document.getElementById('text-editor');
  if (lang === 'en') {
    editor.style.fontFamily = 'Georgia, serif';
    editor.dataset.placeholder = 'Start writing in English here...';
  } else {
    editor.style.fontFamily = currentFont;
    editor.dataset.placeholder = 'ఇక్కడ మీ రచన ప్రారంభించండి...';
  }
  showNotification(lang === 'te' ? 'తెలుగు మోడ్' : lang === 'en' ? 'English Mode' : 'Mixed Mode / మిశ్రమ మోడ్');
}

function showNotification(msg) {
  const n = document.getElementById('notification');
  n.textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 2500);
}

function updateStats() {
  updateEditorStats();
  updateTotalStats();
}

// Initialize
const editor = document.getElementById('text-editor');
const style = document.createElement('style');
style.textContent = `#text-editor:empty:before{content:attr(data-placeholder);color:#b0a090;pointer-events:none;}`;
document.head.appendChild(style);
editor.dataset.placeholder = 'ఇక్కడ మీ రచన ప్రారంభించండి... (Start writing here...)';

document.querySelectorAll('.sidebar-panel:not(.active)').forEach(p => p.style.display = 'none');
document.querySelectorAll('.right-panel:not(.active)').forEach(p => p.style.display = 'none');
document.getElementById('panel-chapters').style.display = 'flex';
document.getElementById('panel-dictionary').style.display = 'flex';

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey)) {
    if (e.key === 's') { e.preventDefault(); saveAll(); }
    if (e.key === 'p') { e.preventDefault(); exportAs('print'); }
  }
});

// Load on startup
window.addEventListener('load', () => {
  loadAll();
  renderChapters();
  updateStats();
  // Preload dictionary in background
  loadDictionary();
  // Initialize transliteration
  initializeTransliteration();
});

// ═══════════════════════════════════════════════════════
// AKSHARAMUKHA TRANSLITERATION
// ═══════════════════════════════════════════════════════
let aksharamukhaReady = false;

// Initialize Aksharamukha
function initializeTransliteration() {
  try {
    // Check if Aksharamukha library is loaded
    if (typeof Aksharamukha !== 'undefined') {
      aksharamukhaReady = true;
      console.log('Aksharamukha library loaded successfully');
      
      // Add event listener to input field
      const translitInput = document.getElementById('translitInput');
      if (translitInput) {
        translitInput.addEventListener('input', handleTransliteration);
        console.log('Transliteration input listener added');
      }
    } else {
      console.warn('Aksharamukha library not loaded yet, retrying...');
      setTimeout(initializeTransliteration, 500);
    }
  } catch (error) {
    console.error('Error initializing Aksharamukha:', error);
    showNotification('ట్రాన్స్‌లిటరేషన్ లోడ్ చేయడంలో సమస్య');
  }
}

// Handle transliteration as user types
function handleTransliteration(event) {
  const inputText = event.target.value;
  const outputDiv = document.getElementById('translitOutput');
  
  if (!inputText.trim()) {
    outputDiv.textContent = '';
    return;
  }
  
  if (aksharamukhaReady && typeof Aksharamukha !== 'undefined') {
    try {
      // Convert ITRANS to Telugu using Aksharamukha API
      const teluguText = Aksharamukha.convert(inputText, 'ITRANS', 'Telugu');
      outputDiv.textContent = teluguText;
    } catch (error) {
      console.error('Transliteration error:', error);
      outputDiv.textContent = 'మార్పిడి విఫలమైంది';
    }
  } else {
    outputDiv.textContent = 'లైబ్రరీ లోడ్ అవుతోంది...';
  }
}

// Insert transliterated text into editor
function insertTranslitText() {
  const outputDiv = document.getElementById('translitOutput');
  const teluguText = outputDiv.textContent;
  
  if (!teluguText || teluguText === 'లైబ్రరీ లోడ్ అవుతోంది...' || teluguText === 'మార్పిడి విఫలమైంది') {
    showNotification('ముందుగా టెక్స్ట్ టైప్ చేయండి');
    return;
  }
  
  // Insert into editor
  const editor = document.getElementById('text-editor');
  if (editor) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const textNode = document.createTextNode(teluguText + ' ');
    range.insertNode(textNode);
    
    // Move cursor after inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Update stats and save
    updateStats();
    autoSave();
    
    // Clear input
    document.getElementById('translitInput').value = '';
    outputDiv.textContent = '';
    
    showNotification('టెక్స్ట్ చేర్చబడింది');
  }
}


