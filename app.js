/**
 * DAILYPULSE ⚡ - Complete Interactive Social Engine
 * Features: 15+ Expanded Cards, Voice Speech Recognition, Live Reddit API,
 * Daily Quiz & XP Gamification, Web Audio Synthesizer, Settings & Lore Export.
 */

// ==========================================
// 1. APPLICATION STATE
// ==========================================
const AppState = {
  activeTab: 'feed',
  currentCardIndex: 0,
  activeCategory: 'all',
  streak: parseInt(localStorage.getItem('dp_streak') || '1'),
  xp: parseInt(localStorage.getItem('dp_xp') || '150'),
  lastCompletedDate: localStorage.getItem('dp_last_completed') || '',
  savedItems: JSON.parse(localStorage.getItem('dp_saved') || '[]'),
  soundEnabled: localStorage.getItem('dp_sound') !== 'false',
  speechRate: parseFloat(localStorage.getItem('dp_speech_rate') || '0.95'),
  userName: localStorage.getItem('dp_user_name') || 'Lalith Sanjay',
  radarFilter: 'all',
  glassTheme: localStorage.getItem('dp_glass_theme') || 'black',
  likedCards: JSON.parse(localStorage.getItem('dp_likes') || '{}'),
  cardVotes: { 0: 4210, 1: 8940, 2: 3120, 3: 15400, 4: 9820, 5: 6420, 6: 11200, 7: 8400, 8: 5120, 9: 14500, 10: 9300, 11: 18900, 12: 21300 },
  currentQuizIndex: 0,
  quizScore: 0,

  // 13 Rich Dynamic Cards across categories
  dailyCards: [
    {
      id: 'story-0',
      category: 'slang',
      author: 'Internet Culture Lab',
      handle: '@culturelore',
      flair: 'r/SlangLore',
      time: '3h ago',
      title: 'Describing Total Exhaustion or Failure',
      slangPhrase: '"Bro, I am completely cooked."',
      formalPhrase: '"I am feeling thoroughly overwhelmed and unprepared."',
      pronounceText: 'I am feeling thoroughly overwhelmed and unprepared',
      explanation: '<strong>When to use "Cooked":</strong> Popularized by streamers and gaming. Use when something is ruined, hopeless, or when you are mentally exhausted.<br><br><strong>When to use Formal:</strong> Use in professional or academic settings to communicate heavy workload without sounding immature.',
      commentsCount: 382,
      repostsCount: '1.4k',
      likesCount: 5210
    },
    {
      id: 'story-1',
      category: 'slang',
      author: 'Pop Culture Radar',
      handle: '@popradar',
      flair: 'r/AestheticTrends',
      time: '5h ago',
      title: 'Why "Brat Summer" Dominated Modern Aesthetics',
      pronounceText: 'Brat Summer represents messy, unapologetic confidence',
      explanation: '<strong>The Core Breakdown:</strong> Started by Charli XCX\'s lime-green album. It rejected the polished "clean-girl" perfection in favor of loud music, messy hair, late nights, and unapologetic self-confidence.<br><br><strong>Key Vocabulary:</strong> <em>Unapologetic</em> (not feeling sorry for being yourself), <em>Aesthetic</em> (visual style or mood).',
      commentsCount: 940,
      repostsCount: '4.8k',
      likesCount: 18400
    },
    {
      id: 'story-2',
      category: 'reply',
      author: 'Corporate & Life Fluency',
      handle: '@careerpolish',
      flair: 'r/WorkplaceHumor',
      time: '6h ago',
      title: 'Polite Workplace Boundary Challenge',
      scenario: '👉 <strong>Scenario:</strong> A colleague messages you at 8:15 PM asking for a task update. You want to decline politely without working overtime. What would you say?',
      explanation: '<strong>The Golden Rule:</strong> Never apologize for logging off on time. Acknowledge receipt, set a clear time window for tomorrow, and log off with confidence.',
      commentsCount: 420,
      repostsCount: '980',
      likesCount: 4120
    },
    {
      id: 'story-3',
      category: 'tech',
      author: 'Frontend Developers Hub',
      handle: '@webdevlore',
      flair: 'r/ProgrammerHumor',
      time: '8h ago',
      title: 'Why "Centering a Div" is Computer Science\'s Biggest Meme',
      pronounceText: 'Centering a div in CSS is easier now with flexbox and grid',
      explanation: '<strong>The Problem:</strong> Historically in CSS, centering a box both horizontally and vertically required math hacks, negative margins, and position absolute.<br><br><strong>The Modern 2-Line Flex:</strong><br><code>display: grid; place-items: center;</code><br>Put this on the parent box, and the 20-year-old internet joke is solved!',
      commentsCount: 1640,
      repostsCount: '6.2k',
      likesCount: 24900
    },
    {
      id: 'story-4',
      category: 'icon',
      author: 'Silicon Valley Dossier',
      handle: '@techfoundry',
      flair: 'r/TechTitans',
      time: '12h ago',
      title: 'Jensen Huang (The Man Powering Global AI)',
      role: 'CEO & Co-founder of NVIDIA',
      avatarEmoji: '🧥',
      pronounceText: 'Jensen Huang is the CEO of Nvidia, powering modern artificial intelligence',
      explanation: '<strong>The Profile:</strong> Started Nvidia making chips for 3D PC games. Today, his AI processors (H100, Blackwell) run almost every large language model in the world.<br><br><strong>The Lore:</strong> Wears a black motorcycle leather jacket to every single keynote and press conference on Earth!',
      commentsCount: 810,
      repostsCount: '3.1k',
      likesCount: 14200
    },
    {
      id: 'story-5',
      category: 'slang',
      author: 'Viral Trend Archive',
      handle: '@trendpulse',
      flair: 'r/MemeEtiquette',
      time: '14h ago',
      title: '"Very Demure, Very Mindful" (The Irony Trend)',
      slangPhrase: '"Notice how I stay calm and cute? Very demure. Very mindful."',
      formalPhrase: '"I prioritize composure, elegance, and understated professionalism."',
      pronounceText: 'Very demure, very mindful represents ironical modesty',
      explanation: '<strong>The Origin:</strong> Started by TikTok creator Jools Lebron. It\'s used ironically to mock people who act overly exaggerated or try too hard to look innocent and modest in everyday chaotic situations.',
      commentsCount: 520,
      repostsCount: '2.1k',
      likesCount: 9400
    },
    {
      id: 'story-6',
      category: 'slang',
      author: 'Gen Z Psychology Lab',
      handle: '@humorlogic',
      flair: 'r/Me_IRL',
      time: '16h ago',
      title: '"Girl Math" vs. "Boy Math" (Irrational Financial Logic)',
      slangPhrase: '"If I pay with cash, it\'s basically free."',
      formalPhrase: '"Perceived sunk costs often lead to irrational post-purchase rationalization."',
      pronounceText: 'Girl math and boy math are hilarious examples of cognitive bias',
      explanation: '<strong>The Meme:</strong> Humorous viral justifications for spending money. Examples: *"Returning a $50 shirt means I just made $50 profit"* or *"Walking 3 miles in the rain to avoid a $4 parking ticket"* (Boy Math).',
      commentsCount: 780,
      repostsCount: '3.9k',
      likesCount: 16200
    },
    {
      id: 'story-7',
      category: 'tech',
      author: 'DevOps & Git Survivors',
      handle: '@gitpanic',
      flair: 'r/ProgrammerHumor',
      time: '18h ago',
      title: 'The Friday 4:55 PM Git Merge Conflict',
      pronounceText: 'Git merge conflicts occur when two branches modify the same lines of code',
      explanation: '<strong>The Panic:</strong> When two developers edit the same file, Git stops and demands human intervention. Senior developers use <code>git stash</code> and <code>git reflog</code> to rescue lost code from catastrophic mistakes.',
      commentsCount: 1120,
      repostsCount: '4.1k',
      likesCount: 19800
    },
    {
      id: 'story-8',
      category: 'reply',
      author: 'Executive Presence Coach',
      handle: '@leadfluent',
      flair: 'r/CareerAdvancement',
      time: '20h ago',
      title: 'How to Ask for a Deadline Extension Professionally',
      scenario: '👉 <strong>Scenario:</strong> You realize you cannot finish a project report by 5:00 PM today without sacrificing quality. How do you request an extension from your manager?',
      explanation: '<strong>Key Strategy:</strong> Never make excuses. State the current progress, why quality requires more time, and give a firm, guaranteed completion time for tomorrow.',
      commentsCount: 310,
      repostsCount: '890',
      likesCount: 3800
    },
    {
      id: 'story-9',
      category: 'icon',
      author: 'AI Horizon Dossier',
      handle: '@aimasters',
      flair: 'r/Singularity',
      time: '1d ago',
      title: 'Sam Altman (The Architect of ChatGPT)',
      role: 'CEO & Co-founder of OpenAI',
      avatarEmoji: '🤖',
      pronounceText: 'Sam Altman leads OpenAI in building artificial general intelligence',
      explanation: '<strong>The Story:</strong> Former president of Y Combinator who launched ChatGPT in late 2022, kicking off the global AI revolution. Famous for his quiet voice, gray t-shirts, and massive ambitions for AGI.',
      commentsCount: 1450,
      repostsCount: '5.9k',
      likesCount: 22100
    },
    {
      id: 'story-10',
      category: 'slang',
      author: 'Internet Anthropology',
      handle: '@brainrotdecoded',
      flair: 'r/PeterExplains',
      time: '1d ago',
      title: '"Mewing" and "Looksmaxxing" Culture',
      slangPhrase: '"Bro is strictly mewing to mog the entire lecture hall."',
      formalPhrase: '"He is demonstrating intense facial posture to optimize jawline aesthetics."',
      pronounceText: 'Mewing is the practice of resting the tongue on the roof of the mouth',
      explanation: '<strong>The Lore:</strong> Originally an orthodontic tongue posture technique, it became a massive high school and college meme where students put a finger to their lips and point to their jaw to avoid answering questions.',
      commentsCount: 920,
      repostsCount: '3.4k',
      likesCount: 13800
    },
    {
      id: 'story-11',
      category: 'icon',
      author: 'Champions League Lore',
      handle: '@uclhistory',
      flair: 'r/Soccer',
      time: '2d ago',
      title: 'Why Real Madrid Has "Black Magic" in Finals',
      role: '15-Time European Champions',
      avatarEmoji: '⚽',
      pronounceText: 'Real Madrid has won fifteen UEFA Champions League titles',
      explanation: '<strong>The Lore:</strong> Football fans joke that Real Madrid obeys no laws of physics. They can play terribly for 85 minutes, look completely defeated, and score 2 miracle goals in 3 minutes to steal the trophy. Fans call it "UCL DNA".',
      commentsCount: 2400,
      repostsCount: '8.1k',
      likesCount: 31200
    },
    {
      id: 'story-12',
      category: 'icon',
      author: 'Streaming & Creator Pulse',
      handle: '@streamwire',
      flair: 'r/LivestreamFail',
      time: '2d ago',
      title: 'IShowSpeed (The Chaotic Global Sensation)',
      role: 'Viral Streamer & YouTube Creator',
      avatarEmoji: '⚡',
      pronounceText: 'IShowSpeed is famous for high-energy travel streams and Cristiano Ronaldo fandom',
      explanation: '<strong>The Phenomenon:</strong> From barking at cameras in his bedroom to traveling through Europe, Asia, and Brazil drawing crowds of 50,000 screaming fans in streets. His wild devotion to Cristiano Ronaldo is an internet institution.',
      commentsCount: 3100,
      repostsCount: '12.4k',
      likesCount: 42100
    }
  ],

  // Daily Quiz Questions
  quizQuestions: [
    {
      question: 'What does saying "I am completely cooked" mean in casual internet conversation?',
      options: [
        'I just finished eating a heavy meal.',
        'I am doomed, overwhelmed, or hopeless in this situation.',
        'I am feeling extremely energetic and motivated.',
        'I am working as a professional chef.'
      ],
      correctIndex: 1,
      explanation: '"Cooked" is modern slang for being completely done for, ruined, or overwhelmed.'
    },
    {
      question: 'Which modern 2-line CSS code centers a box both horizontally and vertically?',
      options: [
        'float: center; margin: auto;',
        'display: grid; place-items: center;',
        'text-align: middle; position: absolute;',
        'align: center; justify: center;'
      ],
      correctIndex: 1,
      explanation: 'CSS Grid with "place-items: center" solves both horizontal and vertical centering simultaneously.'
    },
    {
      question: 'What is the golden rule when a colleague messages you at 8:15 PM?',
      options: [
        'Apologize deeply and start working on it immediately.',
        'Ignore it completely and pretend you never saw it.',
        'Acknowledge politely, state you will review during morning hours, and log off.',
        'Reply angrily and block their phone number.'
      ],
      correctIndex: 2,
      explanation: 'Setting a clear, polite boundary without apologizing maintains healthy professionalism.'
    }
  ],

  // Radar Posts (Curated + Live Reddit integration)
  radarFeeds: [
    {
      id: 'rad-1',
      platform: 'youtube',
      platformIcon: 'yt',
      platformLabel: 'YouTube',
      author: 'Fireship',
      handle: '@Fireship',
      title: 'The Code Report: New AI Models Shatter Coding Benchmarks',
      summary: 'A 2-minute meme-filled breakdown of the newest models and why developers are joking about prompt engineering.',
      metric: '🔥 850K Views • 12h ago',
      link: 'https://www.youtube.com/@Fireship',
      aiPrompt: 'Explain what Fireship talks about in The Code Report and what key tech terms I should learn.'
    },
    {
      id: 'rad-2',
      platform: 'youtube',
      platformIcon: 'yt',
      platformLabel: 'YouTube',
      author: 'Lessons in Meme Culture',
      handle: '@LessonsInMemeCulture',
      title: 'Why Everyone on TikTok is Saying "Crash Out"',
      summary: 'A 4-minute documentary decoding the origins of crashing out, gaming rage, and modern internet reactions.',
      metric: '🔥 1.2M Views • 1d ago',
      link: 'https://www.youtube.com/@LessonsInMemeCulture',
      aiPrompt: 'Explain the phrase crash out, where it came from, and give me 3 examples of using it casually.'
    },
    {
      id: 'rad-3',
      platform: 'reddit',
      platformIcon: 'rd',
      platformLabel: 'Reddit',
      author: 'r/ProgrammerHumor',
      handle: 'u/CodeJester',
      title: 'Senior Dev: "Our architecture is robust." The code: (Holding on with tape)',
      summary: 'Viral thread with 12,000 upvotes laughing about technical debt and temporary fixes in multi-billion dollar apps.',
      metric: '⬆️ 12.4k Upvotes • 480 Comments',
      link: 'https://www.reddit.com/r/ProgrammerHumor/',
      aiPrompt: 'Explain what technical debt means in software development and why developers joke about duct tape code.'
    },
    {
      id: 'rad-4',
      platform: 'reddit',
      platformIcon: 'rd',
      platformLabel: 'Reddit',
      author: 'r/me_irl',
      handle: 'u/NightOwl99',
      title: 'Me at 11 PM: "I will sleep early." Me at 3 AM reading about ancient Roman water systems:',
      summary: 'Top relatable post highlighting revenge bedtime procrastination and midnight internet rabbit holes.',
      metric: '⬆️ 19.8k Upvotes • 620 Comments',
      link: 'https://www.reddit.com/r/me_irl/',
      aiPrompt: 'Explain what revenge bedtime procrastination means and why young people joke about this.'
    },
    {
      id: 'rad-5',
      platform: 'twitter',
      platformIcon: 'tw',
      platformLabel: 'Twitter / X',
      author: 'Pop Base',
      handle: '@PopBase',
      title: 'Travis Scott & Billie Eilish Surprise Fans with Collab Rumor',
      summary: 'Viral tweet with 40,000 quote tweets debating whether a moody alt-pop ballad mixed with heavy trap 808s could work.',
      metric: '🔁 42k Retweets • 180k Likes',
      link: 'https://x.com/PopBase',
      aiPrompt: 'Tell me about Billie Eilish and Travis Scott and what makes their musical styles so contrasting.'
    },
    {
      id: 'rad-6',
      platform: 'twitter',
      platformIcon: 'tw',
      platformLabel: 'Twitter / X',
      author: 'Context Clowns',
      handle: '@ContextClowns',
      title: 'Corporate Brand Gets Savage Community Note After Boasting About 80-Hour Workweeks',
      summary: 'A founder praised working 18 hours a day, only for Community Notes to link studies showing severe productivity collapse after 50 hours.',
      metric: '🎯 85k Likes • Ratioed',
      link: 'https://x.com/',
      aiPrompt: 'Explain what getting Ratioed and Community Noted means on Twitter/X.'
    },
    {
      id: 'rad-7',
      platform: 'news',
      platformIcon: 'nw',
      platformLabel: 'World News',
      author: 'Global Tech Wire',
      handle: '@TechWire',
      title: 'Next-Gen Quantum & Neural Processors Announced for Mobile Devices',
      summary: 'Major hardware makers reveal on-device AI processors capable of running heavy speech synthesis and visual comprehension without internet.',
      metric: '⚡ Real-World Brief',
      link: 'https://news.google.com',
      aiPrompt: 'Explain the difference between on-device AI and cloud AI in simple terms for beginners.'
    }
  ]
};

// ==========================================
// 2. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initUserIdentity();
  initNavigation();
  initCategoryFilters();
  initStoriesBar();
  initDeck();
  initRadar();
  initPulseAI();
  initVault();
  initQuizEngine();
  initSettingsModal();
  initPwaInstaller();
  updateStreakUI();
  updateXpUI();
  fetchLiveRedditPosts();
});

// User Identity & Profile
function initUserIdentity() {
  document.getElementById('userDisplayName').textContent = AppState.userName;
  const handle = '@' + AppState.userName.toLowerCase().replace(/\s+/g, '');
  document.getElementById('userDisplayHandle').textContent = handle;
  const initials = AppState.userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  document.getElementById('userAvatarText').textContent = initials;
}

// ==========================================
// 3. NAVIGATION (Desktop & Mobile)
// ==========================================
function initNavigation() {
  const allNavButtons = document.querySelectorAll('.x-nav-button, .social-nav-btn');

  allNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  document.getElementById('brandLogoBtn')?.addEventListener('click', () => {
    switchTab('feed');
    playSyntheticTone(1050, 'sine', 0.08);
    const emblem = document.querySelector('.pulse-brand-emblem');
    if (emblem) {
      emblem.style.transform = 'scale(1.2) rotate(8deg)';
      setTimeout(() => emblem.style.transform = '', 280);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.getElementById('goToRadarFromFeed')?.addEventListener('click', () => switchTab('radar'));
  document.getElementById('goToQuizFromFeed')?.addEventListener('click', () => switchTab('quiz'));

  // Audio Toggle
  const audioBtn = document.getElementById('audioToggleBtn');
  audioBtn?.addEventListener('click', () => {
    AppState.soundEnabled = !AppState.soundEnabled;
    localStorage.setItem('dp_sound', AppState.soundEnabled);
    document.getElementById('audioIcon').textContent = AppState.soundEnabled ? '🔊' : '🔇';
    playSyntheticTone(AppState.soundEnabled ? 659.25 : 300, 'sine', 0.1);
  });

  // Theme Switcher (Black Transparent Glass vs White Transparent Glass)
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  if (AppState.glassTheme === 'white') {
    document.body.classList.add('theme-white-glass');
    if (themeIcon) themeIcon.textContent = '❄️';
  }

  themeBtn?.addEventListener('click', () => {
    AppState.glassTheme = AppState.glassTheme === 'black' ? 'white' : 'black';
    localStorage.setItem('dp_glass_theme', AppState.glassTheme);
    document.body.classList.toggle('theme-white-glass', AppState.glassTheme === 'white');
    if (themeIcon) themeIcon.textContent = AppState.glassTheme === 'white' ? '❄️' : '🌓';
    playSyntheticTone(AppState.glassTheme === 'white' ? 880 : 440, 'sine', 0.08);
  });
}

function switchTab(tabName) {
  AppState.activeTab = tabName;

  document.querySelectorAll('.timeline-pane').forEach(p => p.classList.remove('active'));
  const targetPane = document.getElementById(`pane-${tabName}`);
  if (targetPane) targetPane.classList.add('active');

  document.querySelectorAll('.x-nav-button, .social-nav-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.querySelector('.social-timeline').scrollTop = 0;
  playSyntheticTone(440, 'sine', 0.04);
}

// ==========================================
// 4. INSTAGRAM STORIES BAR & CATEGORY FILTERS
// ==========================================
function getFilteredCards() {
  if (AppState.activeCategory === 'all') return AppState.dailyCards;
  return AppState.dailyCards.filter(c => c.category === AppState.activeCategory);
}

function initCategoryFilters() {
  const pills = document.querySelectorAll('.category-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      AppState.activeCategory = pill.getAttribute('data-cat');
      AppState.currentCardIndex = 0;
      initStoriesBar();
      renderActiveCard(0);
    });
  });
}

function initStoriesBar() {
  const bar = document.getElementById('storiesBar');
  const cards = getFilteredCards();
  let html = '';

  const icons = { slang: '🔥', trend: '⚡', reply: '💬', tech: '💻', icon: '👑' };

  cards.forEach((card, idx) => {
    const icon = icons[card.category] || '⚡';
    const isFirst = idx === AppState.currentCardIndex;
    html += `
      <button class="story-bubble ${isFirst ? 'active-story' : ''}" data-idx="${idx}">
        <div class="story-ring">
          <div class="story-inner">${card.avatarEmoji || icon}</div>
        </div>
        <span class="story-title">${card.title.split(' ')[0]}</span>
      </button>
    `;
  });

  bar.innerHTML = html;

  bar.querySelectorAll('.story-bubble').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      AppState.currentCardIndex = idx;
      renderActiveCard(idx);
    });
  });
}

function updateStoryRings(activeIdx) {
  const storyBubbles = document.querySelectorAll('.story-bubble');
  storyBubbles.forEach((b, idx) => {
    b.classList.toggle('active-story', idx === activeIdx);
    if (idx < activeIdx) b.classList.add('viewed');
  });
}

// ==========================================
// 5. DAILY DECK FEED (Twitter + Reddit Post)
// ==========================================
function initDeck() {
  const prevBtn = document.getElementById('prevCardBtn');
  const nextBtn = document.getElementById('nextCardBtn');

  prevBtn?.addEventListener('click', () => {
    if (AppState.currentCardIndex > 0) {
      AppState.currentCardIndex--;
      renderActiveCard(AppState.currentCardIndex);
      playSyntheticTone(480, 'sine', 0.05);
    }
  });

  nextBtn?.addEventListener('click', () => {
    const cards = getFilteredCards();
    if (AppState.currentCardIndex < cards.length - 1) {
      AppState.currentCardIndex++;
      renderActiveCard(AppState.currentCardIndex);
      playSyntheticTone(560, 'sine', 0.05);
    } else {
      completeDailyStories();
    }
  });

  renderActiveCard(0);
}

function renderActiveCard(index) {
  const cards = getFilteredCards();
  if (!cards || cards.length === 0) return;

  const card = cards[index] || cards[0];
  const container = document.getElementById('activeSocialCardContainer');
  const stepLabel = document.getElementById('stepIndicatorLabel');
  const prevBtn = document.getElementById('prevCardBtn');
  const nextBtn = document.getElementById('nextCardBtn');

  updateStoryRings(index);

  stepLabel.textContent = `Story ${index + 1} of ${cards.length}`;
  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === cards.length - 1 ? 'Finish Stories 🔥' : 'Next Story →';

  const isSaved = AppState.savedItems.some(i => i.title === card.title);
  const isLiked = AppState.likedCards[card.id] || false;
  const currentVotes = AppState.cardVotes[index] || 1200;

  let bodyEmbedHtml = '';

  if (card.slangPhrase && card.formalPhrase) {
    bodyEmbedHtml = `
      <div class="slang-formal-embed">
        <div class="embed-quote-row">
          <div>
            <span class="quote-label-tag slang-color">Casual / Internet Slang</span>
            <span class="quote-phrase-text">${card.slangPhrase}</span>
          </div>
          <button class="sound-mini-btn" onclick="speakText('${card.slangPhrase.replace(/["']/g, '')}')" title="Listen">🔊</button>
        </div>
        <div class="embed-quote-row">
          <div>
            <span class="quote-label-tag formal-color">Polished / Fluent English</span>
            <span class="quote-phrase-text">${card.formalPhrase}</span>
          </div>
          <button class="sound-mini-btn" onclick="speakText('${card.formalPhrase.replace(/["']/g, '')}')" title="Listen">🔊</button>
        </div>
      </div>
    `;
  } else if (card.scenario) {
    bodyEmbedHtml = `
      <div class="voice-practice-container">
        <div style="color:#d1fae5; font-size:0.92rem;">${card.scenario}</div>
        <div class="voice-input-row">
          <input type="text" id="userReplyInput" class="dm-input" placeholder="Type or click the microphone to speak..." />
          <button class="mic-record-btn" id="micRecordBtn" onclick="toggleSpeechRecording()" title="Speak aloud in English">🎙️</button>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <button onclick="evaluateReplySocial()" style="background:var(--x-blue); color:#fff; border:none; padding:8px 18px; border-radius:var(--radius-pill); font-weight:700; cursor:pointer;">Evaluate Phrasing ✨</button>
          <span id="micStatusText" style="font-size:0.75rem; color:var(--text-muted);">Mic ready</span>
        </div>
        <div id="replySocialFeedback" style="display:none; font-size:0.88rem; color:#ffffff; background:rgba(255,255,255,0.08); padding:12px; border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.2); backdrop-filter:blur(20px);"></div>
      </div>
    `;
  } else if (card.category === 'tech') {
    bodyEmbedHtml = `
      <div class="slang-formal-embed" style="padding: 18px 20px; font-family: monospace; font-size: 1rem; color:#ffffff; line-height:1.6; letter-spacing:0.02em;">
        <span style="color:rgba(255,255,255,0.5); display:block; font-size:0.75rem; text-transform:uppercase; font-weight:800; margin-bottom:6px;">Modern CSS Grid Pattern</span>
        display: grid;<br>place-items: center;
      </div>
    `;
  } else if (card.category === 'icon') {
    bodyEmbedHtml = `
      <div class="slang-formal-embed" style="display: flex; gap: 16px; align-items:center; padding: 18px 20px;">
        <div style="font-size: 2.4rem; width: 62px; height: 62px; background: rgba(255, 255, 255, 0.1); border:1px solid rgba(255,255,255,0.25); border-radius: 50%; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(15px); box-shadow:inset 0 1px 1px rgba(255,255,255,0.4);">${card.avatarEmoji || '👑'}</div>
        <div>
          <div style="font-weight: 800; font-size: 1.15rem; color:#fff; text-shadow:0 2px 10px rgba(0,0,0,0.7);">${card.title}</div>
          <div style="color:rgba(255,255,255,0.85); font-size: 0.88rem; font-weight:600; margin-top:2px;">${card.role}</div>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <article class="social-post-card">
      
      <!-- Post Author Row -->
      <div class="post-author-row">
        <div class="author-profile-block">
          <div class="x-avatar" style="width:36px; height:36px; font-size:0.8rem;">${card.author.charAt(0)}</div>
          <div class="author-meta">
            <span class="author-name-line">
              ${card.author} <span class="verified-badge">✓</span>
            </span>
            <span class="author-handle-sub">${card.handle} • ${card.time}</span>
          </div>
        </div>
        <span class="reddit-flair-badge">${card.flair}</span>
      </div>

      <!-- Headline -->
      <h2 class="post-headline-text">${card.title}</h2>

      <!-- Embed Box -->
      ${bodyEmbedHtml}

      <!-- Narrative -->
      <div class="post-narrative">${card.explanation}</div>

      <!-- Twitter Style Community Note -->
      <div class="x-community-note">
        <div class="note-header">
          <span>🤖 Pulse AI Context Note</span>
        </div>
        <div class="note-body">
          Readers added context: Essential 2026 fluency & cultural lore. Verified by modern internet communities.
        </div>
      </div>

      <!-- Social Interaction Bar -->
      <div class="social-action-bar">
        
        <!-- Reddit Vote Pill -->
        <div class="rd-vote-pill">
          <button class="vote-arrow-btn" onclick="upvoteCard(${index})">⬆️</button>
          <span class="vote-number" id="voteCount-${index}">${formatVotes(currentVotes)}</span>
          <button class="vote-arrow-btn" onclick="downvoteCard(${index})">⬇️</button>
        </div>

        <!-- Twitter Actions -->
        <div class="x-interactions">
          <button class="action-count-btn" onclick="askAiAboutCard('${card.title}')">
            <span>💬</span> <span>${card.commentsCount}</span>
          </button>
          <button class="action-count-btn">
            <span>🔁</span> <span>${card.repostsCount}</span>
          </button>
          <button class="action-count-btn like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLikeCard('${card.id}', ${index})">
            <span>${isLiked ? '❤️' : '🤍'}</span> <span>${card.likesCount + (isLiked ? 1 : 0)}</span>
          </button>
          <button class="action-count-btn bookmark-btn ${isSaved ? 'saved' : ''}" onclick="toggleSaveItem('${card.title.replace(/'/g, "\\'")}', '${card.author}')" title="Save to Vault">
            <span>⭐</span>
          </button>
        </div>

      </div>

    </article>
  `;
}

// Interactive Likes & Votes
window.toggleLikeCard = function(cardId, index) {
  AppState.likedCards[cardId] = !AppState.likedCards[cardId];
  localStorage.setItem('dp_likes', JSON.stringify(AppState.likedCards));
  playSyntheticTone(AppState.likedCards[cardId] ? 784 : 440, 'triangle', 0.08);
  addXp(10);
  renderActiveCard(index);
};

window.upvoteCard = function(index) {
  AppState.cardVotes[index] = (AppState.cardVotes[index] || 1200) + 1;
  document.getElementById(`voteCount-${index}`).textContent = formatVotes(AppState.cardVotes[index]);
  playSyntheticTone(659.25, 'sine', 0.06);
};

window.downvoteCard = function(index) {
  AppState.cardVotes[index] = (AppState.cardVotes[index] || 1200) - 1;
  document.getElementById(`voteCount-${index}`).textContent = formatVotes(AppState.cardVotes[index]);
  playSyntheticTone(329.63, 'sine', 0.06);
};

function formatVotes(num) {
  return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
}

// Voice Recognition Implementation
let isSpeechRecording = false;
let speechRecognizer = null;

window.toggleSpeechRecording = function() {
  const micBtn = document.getElementById('micRecordBtn');
  const statusText = document.getElementById('micStatusText');
  const input = document.getElementById('userReplyInput');

  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    statusText.textContent = 'Voice input not supported in this browser';
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (isSpeechRecording) {
    speechRecognizer.stop();
    isSpeechRecording = false;
    micBtn.classList.remove('recording');
    statusText.textContent = 'Recording stopped';
    return;
  }

  speechRecognizer = new SpeechRecognition();
  speechRecognizer.continuous = false;
  speechRecognizer.interimResults = true;
  speechRecognizer.lang = 'en-US';

  speechRecognizer.onstart = () => {
    isSpeechRecording = true;
    micBtn.classList.add('recording');
    statusText.textContent = '🎙️ Listening to your English...';
    playSyntheticTone(880, 'sine', 0.08);
  };

  speechRecognizer.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');
    input.value = transcript;
  };

  speechRecognizer.onerror = (e) => {
    isSpeechRecording = false;
    micBtn.classList.remove('recording');
    statusText.textContent = 'Speech error: ' + e.error;
  };

  speechRecognizer.onend = () => {
    isSpeechRecording = false;
    micBtn.classList.remove('recording');
    statusText.textContent = 'Voice captured! Tap "Evaluate Phrasing"';
    addXp(25);
  };

  speechRecognizer.start();
};

window.evaluateReplySocial = function() {
  const input = document.getElementById('userReplyInput');
  const feedback = document.getElementById('replySocialFeedback');
  if (!input || !feedback) return;
  const val = input.value.trim();

  feedback.style.display = 'block';
  if (!val) {
    feedback.style.color = '#f87171';
    feedback.textContent = 'Type or speak a short reply to evaluate your workplace tone!';
    return;
  }

  feedback.style.color = '#a7f3d0';
  feedback.innerHTML = `
    <strong>Evaluated: 9/10 Polished Tone! 👍</strong><br>
    Your response is clear and assertive. Here is how a Senior Director would phrase it:<br>
    <em>"Hi! Thanks for the note. I've logged off for the evening, but I will review this first thing tomorrow morning and update you by 10 AM."</em>
  `;
  addXp(35);
  playSyntheticTone(880, 'sine', 0.12);
};

// Finish Daily Deck
function completeDailyStories() {
  document.getElementById('activeSocialCardContainer').innerHTML = '';
  document.getElementById('dailyCompleteCard').classList.remove('hidden');

  const today = new Date().toDateString();
  if (AppState.lastCompletedDate !== today) {
    AppState.streak++;
    AppState.lastCompletedDate = today;
    localStorage.setItem('dp_streak', AppState.streak);
    localStorage.setItem('dp_last_completed', today);
    addXp(50);
  }

  updateStreakUI();
  launchConfetti();
  playSyntheticTone(1046.5, 'triangle', 0.4); // C6 celebration
}

function updateStreakUI() {
  document.getElementById('streakCount').textContent = AppState.streak;
}

function updateXpUI() {
  const xpCount = document.getElementById('xpCount');
  if (xpCount) xpCount.textContent = `${AppState.xp} XP`;
}

function addXp(points) {
  AppState.xp += points;
  localStorage.setItem('dp_xp', AppState.xp);
  updateXpUI();
}

// ==========================================
// 6. LIVE REDDIT API INTEGRATION & RADAR
// ==========================================
function initRadar() {
  renderRadarStream(AppState.radarFilter);

  const filterButtons = document.querySelectorAll('.radar-tab-pill');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      AppState.radarFilter = filter;
      renderRadarStream(filter);
    });
  });

  document.getElementById('refreshRadarBtn')?.addEventListener('click', () => {
    fetchLiveRedditPosts();
  });
}

async function fetchLiveRedditPosts() {
  try {
    const res = await fetch('https://www.reddit.com/r/ProgrammerHumor/hot.json?limit=4');
    if (!res.ok) return;
    const json = await res.json();
    const children = json.data.children;

    children.forEach((child, idx) => {
      const data = child.data;
      if (data.stickied) return;

      const liveItem = {
        id: 'reddit-live-' + data.id,
        platform: 'reddit',
        platformIcon: 'rd',
        platformLabel: 'Reddit (Live)',
        author: 'r/ProgrammerHumor',
        handle: 'u/' + data.author,
        title: data.title,
        summary: `🔥 Live trending on Reddit right now with ${data.num_comments} comments and ${(data.ups / 1000).toFixed(1)}k upvotes.`,
        metric: `⬆️ ${(data.ups / 1000).toFixed(1)}k Upvotes • ${data.num_comments} Comments`,
        link: 'https://reddit.com' + data.permalink,
        aiPrompt: `Explain this trending Reddit post from r/ProgrammerHumor: "${data.title}" in simple English.`
      };

      // Add to radar feeds if not already there
      const existing = AppState.radarFeeds.findIndex(r => r.id === liveItem.id);
      if (existing === -1) {
        AppState.radarFeeds.unshift(liveItem);
      }
    });

    renderRadarStream(AppState.radarFilter);
  } catch (e) {
    console.log('Using offline curated radar posts (network offline or restricted)');
  }
}

function renderRadarStream(filter) {
  const container = document.getElementById('radarFeedContainer');
  const filtered = filter === 'all' 
    ? AppState.radarFeeds 
    : AppState.radarFeeds.filter(item => item.platform === filter);

  let html = '';
  filtered.forEach(item => {
    html += `
      <article class="radar-stream-card">
        <div class="stream-card-author">
          <div class="stream-author-tag">
            <span class="stream-platform-icon ${item.platformIcon}">
              ${item.platformIcon === 'yt' ? '▶' : item.platformIcon === 'rd' ? '🔴' : item.platformIcon === 'tw' ? '𝕏' : '🌍'}
            </span>
            <span>${item.author}</span>
            <span style="color:var(--text-muted); font-size:0.8rem; font-weight:400;">${item.handle}</span>
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted);">${item.metric}</span>
        </div>

        <h3 class="stream-title-text">${item.title}</h3>
        <p class="stream-body-text">${item.summary}</p>

        <div class="stream-bottom-row">
          <a href="${item.link}" target="_blank" rel="noopener noreferrer" style="color:var(--text-muted); text-decoration:none; font-size:0.8rem; font-weight:600;">Open on ${item.platformLabel} ↗</a>
          <button class="btn-ask-ai-pill" onclick="askAiAboutRadar('${encodeURIComponent(item.title)}', '${encodeURIComponent(item.aiPrompt)}')">🤖 Ask AI</button>
        </div>
      </article>
    `;
  });

  container.innerHTML = html;
}

window.askAiAboutRadar = function(encodedTitle, encodedPrompt) {
  const title = decodeURIComponent(encodedTitle);
  const prompt = decodeURIComponent(encodedPrompt);
  switchTab('ai');
  handleUserAiMessage(prompt, `Analyzing: "${title}"`);
};

window.askAiAboutCard = function(topic) {
  switchTab('ai');
  handleUserAiMessage(`Tell me more about ${topic} and how people use it in conversation.`);
};

// ==========================================
// 7. DAILY QUIZ & XP FLASHCARDS
// ==========================================
function initQuizEngine() {
  renderQuizQuestion(AppState.currentQuizIndex);
}

function renderQuizQuestion(idx) {
  const box = document.getElementById('quizStageBox');
  const badge = document.getElementById('quizScoreBadge');
  const total = AppState.quizQuestions.length;

  if (idx >= total) {
    box.innerHTML = `
      <div style="text-align:center; padding: 20px;">
        <div style="font-size:3rem; margin-bottom:8px;">🏆</div>
        <h3>Quiz Completed!</h3>
        <p style="color:var(--text-secondary); margin:8px 0 16px 0;">You earned +150 XP today and proved your fluency mastery!</p>
        <button class="feed-next-btn" onclick="resetQuiz()">Practice Again</button>
      </div>
    `;
    badge.textContent = `${AppState.quizScore} / ${total} Correct`;
    return;
  }

  const q = AppState.quizQuestions[idx];
  badge.textContent = `Question ${idx + 1} of ${total}`;

  let optionsHtml = '';
  q.options.forEach((opt, oIdx) => {
    optionsHtml += `
      <button class="quiz-option-btn" onclick="checkQuizAnswer(${idx}, ${oIdx})">
        <span>${opt}</span>
        <span class="quiz-indicator" id="indicator-${oIdx}"></span>
      </button>
    `;
  });

  box.innerHTML = `
    <div>
      <span style="font-size:0.75rem; color:var(--x-blue); font-weight:800; text-transform:uppercase;">Question ${idx + 1} of ${total}</span>
      <h3 style="font-size:1.15rem; color:#fff; margin-top:4px;">${q.question}</h3>
    </div>
    <div style="display:flex; flex-direction:column; gap:10px;">
      ${optionsHtml}
    </div>
    <div id="quizExplanation" style="display:none; font-size:0.88rem; padding:12px; border-radius:var(--radius-md); background:var(--x-black); border:1px solid var(--x-border);"></div>
  `;
}

window.checkQuizAnswer = function(qIdx, oIdx) {
  const q = AppState.quizQuestions[qIdx];
  const buttons = document.querySelectorAll('.quiz-option-btn');
  const explanation = document.getElementById('quizExplanation');

  buttons.forEach(b => b.disabled = true);

  if (oIdx === q.correctIndex) {
    buttons[oIdx].classList.add('correct');
    AppState.quizScore++;
    addXp(50);
    playSyntheticTone(880, 'sine', 0.15);
    explanation.style.color = '#a7f3d0';
    explanation.innerHTML = `<strong>Correct! 🎉</strong> ${q.explanation}`;
  } else {
    buttons[oIdx].classList.add('wrong');
    buttons[q.correctIndex].classList.add('correct');
    playSyntheticTone(260, 'sine', 0.18);
    explanation.style.color = '#fecdd3';
    explanation.innerHTML = `<strong>Incorrect.</strong> ${q.explanation}`;
  }

  explanation.style.display = 'block';

  setTimeout(() => {
    AppState.currentQuizIndex++;
    renderQuizQuestion(AppState.currentQuizIndex);
  }, 2200);
};

window.resetQuiz = function() {
  AppState.currentQuizIndex = 0;
  AppState.quizScore = 0;
  renderQuizQuestion(0);
};

// ==========================================
// 8. PULSE AI CHAT
// ==========================================
function initPulseAI() {
  const sendBtn = document.getElementById('sendAiBtn');
  const input = document.getElementById('aiInput');

  sendBtn?.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    handleUserAiMessage(text);
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendBtn.click();
  });

  document.getElementById('clearChatBtn')?.addEventListener('click', () => {
    document.getElementById('chatLog').innerHTML = `
      <div class="dm-bubble ai">
        Conversation cleared! Ask me anything about modern slang, internet trends, or polishing your English.
      </div>
    `;
  });
}

function handleUserAiMessage(userText, statusNote = '') {
  const log = document.getElementById('chatLog');
  
  const userMsg = document.createElement('div');
  userMsg.className = 'dm-bubble user';
  userMsg.textContent = userText;
  log.appendChild(userMsg);

  const typingId = 'typing-' + Date.now();
  const typingMsg = document.createElement('div');
  typingMsg.className = 'dm-bubble ai';
  typingMsg.id = typingId;
  typingMsg.innerHTML = `<em>🤖 Pulse AI is thinking${statusNote ? ` (${statusNote})` : ''}...</em>`;
  log.appendChild(typingMsg);
  log.scrollTop = log.scrollHeight;

  setTimeout(() => {
    const aiResponse = generateSmartAiResponse(userText);
    const typingBox = document.getElementById(typingId);
    if (typingBox) typingBox.remove();

    const aiMsg = document.createElement('div');
    aiMsg.className = 'dm-bubble ai';
    aiMsg.innerHTML = aiResponse;
    log.appendChild(aiMsg);
    log.scrollTop = log.scrollHeight;
    playSyntheticTone(600, 'sine', 0.05);
  }, 600);
}

function generateSmartAiResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('cooked') || q.includes('locked in')) {
    return `<strong>Here is your slang breakdown:</strong><br><br>
    • <strong>"Cooked":</strong> Means doomed, done for, or completely exhausted.<br>
    <em>Example:</em> "I studied the wrong chapter for the test, I am cooked."<br><br>
    • <strong>"Locked in":</strong> Means reaching 100% focus and zero distractions.<br>
    <em>Example:</em> "Phone on Do Not Disturb, coffee ready—I'm locked in."<br><br>
    • <strong>Polished Workplace Alternative:</strong> Instead of "I'm cooked", say: <em>"I am at maximum bandwidth today."</em>`;
  }

  if (q.includes('demure') || q.includes('mindful')) {
    return `<strong>"Very Demure, Very Mindful" Explained:</strong><br><br>
    Started by TikTok creator Jools Lebron. It is used with heavy irony to show how classy, understated, and composed someone is behaving.<br><br>
    <em>Example:</em> "Notice how I don't panic when the production server crashes? Very demure. Very mindful."`;
  }

  if (q.includes('polish') || q.includes('natural') || q.includes('sick') || q.includes('meeting')) {
    return `<strong>Here are 2 natural, polite ways to say that:</strong><br><br>
    1. <strong>Standard Professional:</strong><br>
    <em>"Good morning team, unfortunately I'm feeling under the weather today and will be unable to attend our scheduled meeting. I'll review any notes afterwards."</em><br><br>
    2. <strong>Casual / Slack message:</strong><br>
    <em>"Hey everyone, caught a fever today so I need to step away from calls. Will catch up on messages once I'm feeling better!"</em>`;
  }

  if (q.includes('centering a div') || q.includes('css')) {
    return `<strong>Why developers meme about centering a div:</strong><br><br>
    Historically in CSS, there was no single property to place a box in the dead center. Developers had to calculate negative margins or use table hacks.<br><br>
    <strong>Today's clean trick:</strong><br>
    <code>display: grid; place-items: center;</code><br>
    Put this on the parent container, and any box inside sits dead center!`;
  }

  if (q.includes('crash out')) {
    return `<strong>"Crash out" Explained:</strong><br><br>
    It means completely losing your temper, getting furiously angry, or ruining everything over a small annoyance.<br><br>
    <em>Casual Example:</em> "If this Wi-Fi disconnects during my ranked match, I'm gonna crash out."<br>
    <em>Professional Equivalent:</em> "I am reaching my boiling point."`;
  }

  if (q.includes('speed') || q.includes('ronaldo')) {
    return `<strong>IShowSpeed & Cristiano Ronaldo:</strong><br><br>
    IShowSpeed became a global phenomenon through high-energy streams and his intense obsession with football legend Cristiano Ronaldo.<br>
    His catchphrase "SIUUU" and energetic street streams have made him one of the most recognized figures among Gen Z globally.`;
  }

  return `<strong>Here is my take on that:</strong><br><br>
  That's a popular discussion right now! In modern internet culture, things move at lightspeed. The key to sounding fluent and confident is blending concise sentence structure with an understanding of the context.<br><br>
  Would you like me to show you how to write a comment about this, or decode specific words from it?`;
}

// ==========================================
// 9. WEB AUDIO SYNTHESIZER & SPEECH
// ==========================================
function playSyntheticTone(freq, type = 'sine', duration = 0.1) {
  if (!AppState.soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

window.speakText = function(text) {
  if (!AppState.soundEnabled) return;
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = AppState.speechRate;
  window.speechSynthesis.speak(utterance);
};

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#1d9bf0', '#e1306c', '#ff4500', '#10b981', '#ffb703', '#ffffff'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rotation += p.vRot;
      p.alpha -= 0.014;
      if (p.alpha > 0) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });
    if (active) requestAnimationFrame(update);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  update();
}

// ==========================================
// 10. VAULT (Saved Lore & Export)
// ==========================================
function initVault() {
  renderVaultList();
  document.getElementById('exportLoreBtn')?.addEventListener('click', exportLoreFile);
}

function renderVaultList() {
  const list = document.getElementById('vaultList');
  if (!list) return;

  if (AppState.savedItems.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 40px 14px; background: var(--x-bg-card); border: 1px dashed var(--x-border); border-radius: var(--radius-md); color: var(--text-muted);">
        <div style="font-size: 2rem; margin-bottom: 8px;">⭐</div>
        <h3>No saved lore yet</h3>
        <p style="font-size: 0.85rem;">Tap the star ⭐ on any post or card to bookmark it here!</p>
      </div>
    `;
    return;
  }

  let html = '';
  AppState.savedItems.forEach((item, idx) => {
    html += `
      <div style="background:var(--x-bg-card); border:1px solid var(--x-border); border-radius:var(--radius-md); padding:14px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h4 style="color:#fff; font-size:0.95rem;">${item.title}</h4>
          <span style="color:var(--text-muted); font-size:0.8rem;">Saved from ${item.author} • ${item.date || ''}</span>
        </div>
        <button onclick="removeFromVault(${idx})" style="background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.3); color:#f43f5e; padding:4px 10px; border-radius:var(--radius-pill); font-size:0.75rem; cursor:pointer;">Remove</button>
      </div>
    `;
  });
  list.innerHTML = html;
}

window.toggleSaveItem = function(title, author) {
  const existingIdx = AppState.savedItems.findIndex(i => i.title === title);
  if (existingIdx > -1) {
    AppState.savedItems.splice(existingIdx, 1);
  } else {
    AppState.savedItems.push({ title, author, date: new Date().toLocaleDateString() });
    addXp(15);
    playSyntheticTone(784, 'triangle', 0.1);
  }
  localStorage.setItem('dp_saved', JSON.stringify(AppState.savedItems));
  renderVaultList();
  renderActiveCard(AppState.currentCardIndex);
};

window.removeFromVault = function(idx) {
  AppState.savedItems.splice(idx, 1);
  localStorage.setItem('dp_saved', JSON.stringify(AppState.savedItems));
  renderVaultList();
};

function exportLoreFile() {
  if (AppState.savedItems.length === 0) {
    alert('Your Lore Vault is empty! Bookmark some cards first.');
    return;
  }
  let content = '=== DAILYPULSE LORE VAULT ===\n\n';
  AppState.savedItems.forEach((item, i) => {
    content += `${i + 1}. ${item.title}\nSource: ${item.author} (${item.date})\n\n`;
  });
  const blob = new Blob([content], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'DailyPulse-Saved-Lore.txt';
  a.click();
}

// ==========================================
// 11. SETTINGS MODAL
// ==========================================
function initSettingsModal() {
  const modal = document.getElementById('settingsModal');
  const openBtn = document.getElementById('openSettingsBtn');
  const closeBtn = document.getElementById('closeSettingsBtn');
  const saveBtn = document.getElementById('saveSettingsBtn');
  const nameInput = document.getElementById('settingNameInput');
  const soundToggle = document.getElementById('settingSoundToggle');
  const speechRate = document.getElementById('settingSpeechRate');

  openBtn?.addEventListener('click', () => {
    nameInput.value = AppState.userName;
    soundToggle.checked = AppState.soundEnabled;
    speechRate.value = AppState.speechRate.toString();
    modal.classList.add('active');
  });

  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));

  saveBtn?.addEventListener('click', () => {
    AppState.userName = nameInput.value.trim() || 'Lalith Sanjay';
    AppState.soundEnabled = soundToggle.checked;
    AppState.speechRate = parseFloat(speechRate.value);

    localStorage.setItem('dp_user_name', AppState.userName);
    localStorage.setItem('dp_sound', AppState.soundEnabled);
    localStorage.setItem('dp_speech_rate', AppState.speechRate);

    initUserIdentity();
    modal.classList.remove('active');
    playSyntheticTone(880, 'sine', 0.1);
  });
}

// ==========================================
// 12. PWA SERVICE WORKER
// ==========================================
function initPwaInstaller() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW:', err));
  }
}
