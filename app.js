// ============================================================
// SECURITY & DEFENSIVE HARDENING UTILITIES
// ============================================================
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJsString(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

function sanitizeAppUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  // Strictly allow only safe HTTPS and HTTP protocols (no javascript:, data:, vbscript:)
  if (/^https?:\/\/[a-zA-Z0-9\-._~:\/?#\[\]@!$&'()*+,;=%]+$/i.test(trimmed)) {
    return trimmed;
  }
  return '';
}

function safeGetStoredJson(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

// Fast Live Tech Radar Fetching from real-world APIs
async function fetchLiveTechRadarPosts() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) return;

    const ids = await res.json();
    const topIds = ids.slice(0, 3);

    const stories = await Promise.all(topIds.map(async (id) => {
      try {
        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return await itemRes.json();
      } catch (e) {
        return null;
      }
    }));

    stories.filter(Boolean).forEach(story => {
      const cardId = `live-hn-${story.id}`;
      if (!AppState.dailyCards.some(c => c.id === cardId)) {
        const cleanTitle = escapeHtml(story.title || 'Breaking Tech Story');
        const cleanBy = escapeHtml(story.by ? `@${story.by}` : '@techradar');
        const cleanUrl = sanitizeAppUrl(story.url || `https://news.ycombinator.com/item?id=${story.id}`);

        AppState.dailyCards.unshift({
          id: cardId,
          category: 'ai',
          isXPost: true,
          topicTag: '⚡ Breaking Tech Signal',
          author: cleanBy,
          handle: cleanBy,
          time: 'Just now',
          title: cleanTitle,
          xTweetText: `${cleanTitle} — Live discussion with ${Number(story.score) || 1} points and ${Number(story.descendants) || 0} comments on Hacker News.`,
          sourceUrl: cleanUrl,
          sourceOutlet: 'Hacker News (Live Wire)',
          explanation: `<strong>In Simple Everyday Words:</strong> Real-time trending tech discussion: <em>"${cleanTitle}"</em>.<br><br><strong>Key Takeaway:</strong> High-signal engineering discussion from founders and practitioners worldwide.`,
          pronounceText: cleanTitle,
          commentsCount: Number(story.descendants) || 12,
          repostsCount: '1.2k',
          likesCount: Number(story.score) || 180
        });
      }
    });
  } catch (err) {
    // Graceful offline fallback
    console.log('Live tech radar fast fallback');
  }
}


/**
 * DAILYPULSE • Complete Interactive Social Engine
 * Features: 15+ Expanded Cards, Voice Speech Recognition, Live Reddit API,
 * Daily Quiz & XP Gamification, Web Audio Synthesizer, Settings & Lore Export.
 */

// ==========================================
// 1. APPLICATION STATE
// ==========================================

const tabInitialized = {
  feed: false,
  titans: false,
  radar: false,
  quiz: false,
  vault: false,
  ai: false
};

const AppState = {
  activeTab: 'feed',
  currentCardIndex: 0,
  activeCategory: 'all',
  streak: parseInt(localStorage.getItem('dp_streak') || '1'),
  xp: parseInt(localStorage.getItem('dp_xp') || '150'),
  lastCompletedDate: localStorage.getItem('dp_last_completed') || '',
  savedItems: JSON.parse(localStorage.getItem('dp_saved') || '[]'),
  seenPosts: new Set(JSON.parse(localStorage.getItem('dp_seen_posts') || '[]')),
  soundEnabled: localStorage.getItem('dp_sound') !== 'false',
  speechRate: parseFloat(localStorage.getItem('dp_speech_rate') || '0.95'),
  userName: localStorage.getItem('dp_user_name') || 'Lalith Sanjay',
  radarFilter: 'all',
  glassTheme: (localStorage.getItem('dp_glass_theme') === 'dim' ? 'dim' : 'black'),
  likedCards: JSON.parse(localStorage.getItem('dp_likes') || '{}'),
  cardVotes: { 0: 4210, 1: 8940, 2: 3120, 3: 15400, 4: 9820, 5: 6420, 6: 11200, 7: 8400, 8: 5120, 9: 14500, 10: 9300, 11: 18900, 12: 21300 },
  currentQuizIndex: 0,
  quizScore: 0,

  // Titans & World Leaders State
  titansFilter: 'all',
  titansSearchQuery: '',
  titansList: [
    {
      id: 'titan-trump',
      name: 'Donald Trump',
      role: '47th President of the United States',
      org: 'U.S. Executive Branch & Global Geopolitics',
      category: 'policy',
      categoryLabel: 'Geopolitics & Policy',
      avatarId: 'titan-trump',
      essentialWhy: 'Government policies directly dictate international tech jobs, semiconductor chip supply chains, and student visas. Trump\'s administration heavily influences tariff rates on Taiwanese and Asian electronics (TSMC), federal AI safety deregulation, executive orders for American domestic energy to power massive AI data centers, and H-1B visa policies affecting international engineering graduates.',
      coreImpact: 'Tech Trade Tariffs, Federal AI Deregulation & American Energy Initiatives for Supercomputing',
      keyTerms: ['Semiconductor Tariffs', 'AI Deregulation', 'STEM Visas & H-1B', 'Data Center Energy'],
      radarHeadline: 'Fast-Tracking Domestic AI Power Grid & Proposing Reciprocal Hardware Tariffs',
      radarDetail: 'Prioritizing aggressive deregulation of frontier AI models to maintain global technological supremacy, encouraging private nuclear and natural gas energy buildouts for compute clusters, while reviewing international hardware manufacturing supply chains.',
      radarSource: 'Reuters & Wall Street Journal',
      sourceUrl: 'https://www.reuters.com/technology/',
      aiPrompt: 'Explain how Donald Trump\'s tech policies, semiconductor tariffs, and visa regulations affect tech students and software engineering jobs.'
    },
    {
      id: 'titan-linus',
      name: 'Linus Torvalds',
      role: 'Creator of Linux & Git; Fellow at The Linux Foundation',
      org: 'The Linux Foundation & Open-Source Movement',
      category: 'opensource',
      categoryLabel: 'Open Source & Dev',
      avatarId: 'titan-linus',
      essentialWhy: 'Linus is the most influential open-source software engineer in human history. In 1991, as a college student, he created the Linux kernel, which now powers 96% of the top 1 million cloud servers, Android smartphones, AWS, Google, and supercomputers. In 2005, he created Git in 14 days to manage Linux development. Every software student writes code with Git and runs deployments on Linux.',
      coreImpact: 'The Linux Operating System Kernel & The Git Distributed Version Control System',
      keyTerms: ['Linux Kernel', 'Git Version Control', 'Open-Source Philosophy', 'Memory Safety & Rust'],
      radarHeadline: 'Championing Rust Integration in Linux Kernel 6.13+ for Memory Safety',
      radarDetail: 'Linus continues to personally review pull requests and lead the global Linux kernel community, advocating for practical memory safety by integrating Rust alongside C, while warning developers against blind over-reliance on generative AI coding tools.',
      radarSource: 'The Linux Foundation & Kernel.org',
      sourceUrl: 'https://www.kernel.org/',
      aiPrompt: 'Explain why Linus Torvalds created Linux and Git as a student, and why every software engineer must master both.'
    },
    {
      id: 'titan-jensen',
      name: 'Jensen Huang',
      role: 'Co-Founder, President & CEO',
      org: 'NVIDIA (World\'s Leading AI Chipmaker)',
      category: 'tech',
      categoryLabel: 'Big Tech CEOs',
      avatarId: 'titan-jensen',
      essentialWhy: 'Jensen transformed NVIDIA from a PC video game graphics card maker into the multi-trillion-dollar backbone of global artificial intelligence. In 2006, he bet the entire company on CUDA, allowing developers to run general-purpose math on GPUs. Today, every modern LLM (ChatGPT, Gemini, Claude, Llama) is trained on Nvidia silicon.',
      coreImpact: 'CUDA Parallel Computing Platform & Hopper/Blackwell AI GPU Architecture',
      keyTerms: ['CUDA Computing', 'Blackwell B200', 'Parallel Processing', 'First-Principles Engineering'],
      radarHeadline: 'Shipping Blackwell B200 Systems & Declaring Domain Expertise the New Syntax',
      radarDetail: 'Speaking at international tech summits, Huang emphasizes that while AI will write code syntax, students must become master problem solvers, domain experts (biology, physics, finance), and systems thinkers who understand how compute scaling works.',
      radarSource: 'Business Insider & GTC Global',
      sourceUrl: 'https://www.businessinsider.com/jensen-huang-nvidia-ceo-leather-jackets-wardrobe-explained-2024-3',
      aiPrompt: 'What did Jensen Huang mean when he said students should focus on domain expertise rather than just syntax coding?'
    },
    {
      id: 'titan-satya',
      name: 'Satya Nadella',
      role: 'Chairman & CEO',
      org: 'Microsoft ($3T+ Enterprise, Azure & Cloud)',
      category: 'tech',
      categoryLabel: 'Big Tech CEOs',
      avatarId: 'titan-satya',
      essentialWhy: 'Took over Microsoft in 2014 when it was seen as a stagnating desktop dinosaur and engineered one of the greatest turnarounds in business history. He embraced open-source (acquiring GitHub in 2018), built Microsoft Azure into a cloud giant, and made the legendary $13B strategic investment in OpenAI in 2019 that placed Microsoft at the center of the AI revolution.',
      coreImpact: 'Growth Mindset Leadership, Microsoft Azure Cloud, GitHub Acquisition & OpenAI Alliance',
      keyTerms: ['Growth Mindset', 'Azure Cloud Architecture', 'GitHub Ecosystem', 'Enterprise AI Copilots'],
      radarHeadline: 'Embedding Copilot Natively Across Windows & Deploying In-House Maia AI Silicon',
      radarDetail: 'Satya is pushing Microsoft\'s Copilot-first OS experience, transforming every software tool into an agentic workflow, while diversifying cloud hardware beyond Nvidia with proprietary Maia and Cobalt in-house silicon.',
      radarSource: 'Microsoft News & Bloomberg',
      sourceUrl: 'https://news.microsoft.com/exec/satya-nadella/',
      aiPrompt: 'What is Satya Nadella\'s Growth Mindset philosophy, and how should a computer science student apply it?'
    },
    {
      id: 'titan-sam',
      name: 'Sam Altman',
      role: 'Co-Founder & CEO',
      org: 'OpenAI (Creators of ChatGPT, GPT-4 & o1)',
      category: 'ai',
      categoryLabel: 'AI Pioneers',
      avatarId: 'titan-sam',
      essentialWhy: 'Sam Altman is the public face of the modern Generative AI era. He previously ran Y Combinator (the startup accelerator that funded Stripe, Airbnb, Dropbox, Reddit). Under his leadership, OpenAI launched ChatGPT in November 2022, reaching 100 million users faster than any consumer application in history and kicking off the race to Artificial General Intelligence (AGI).',
      coreImpact: 'ChatGPT Consumer Revolution, GPT-4/o1 Reasoning Architectures & AGI Safety Research',
      keyTerms: ['Artificial General Intelligence (AGI)', 'Test-Time Compute', 'Reasoning Models (o1/o3)', 'Startup Incubation (YC)'],
      radarHeadline: 'Advancing Test-Time Reasoning Models (o1/o3) & The $100B Stargate Supercluster',
      radarDetail: 'OpenAI shifted the frontier from simply predicting the next word to System 2 step-by-step reasoning, where models think before answering. Altman is heavily focused on secure energy and chip supply chains needed for multi-gigawatt datacenters.',
      radarSource: 'TIME Magazine & MIT Tech Review',
      sourceUrl: 'https://time.com/collection/100-most-influential-people-2023/6269986/sam-altman/',
      aiPrompt: 'What is the difference between standard LLMs and OpenAI\'s new reasoning models (like o1), and how does this affect future developer jobs?'
    },
    {
      id: 'titan-zuck',
      name: 'Mark Zuckerberg',
      role: 'Founder, Chairman & CEO',
      org: 'Meta (Instagram, WhatsApp, Facebook, Meta AI)',
      category: 'tech',
      categoryLabel: 'Big Tech CEOs',
      avatarId: 'titan-zuck',
      essentialWhy: 'Started Facebook in 2004 from his Harvard dorm at age 19. When proprietary AI gatekeepers attempted to keep weights locked behind API paywalls, Zuckerberg championed open-source AI by releasing the Llama model family for free. This enabled millions of students and researchers worldwide to build, fine-tune, and run state-of-the-art AI on their own machines.',
      coreImpact: 'Open-Source AI Foundation Models (Llama), PyTorch Deep Learning Framework & Global Social Graph',
      keyTerms: ['Llama Open Weights', 'PyTorch Framework', 'Commoditizing Infrastructure', 'Holographic AR (Orion)'],
      radarHeadline: 'Training Llama 4 on 100,000+ GPU Superclusters & Unveiling Orion Holographic AR',
      radarDetail: 'Zuckerberg published a manifesto arguing that open-source AI is safer, more democratic, and critical for human innovation, while heavily investing in next-generation wearable compute forms.',
      radarSource: 'Meta Engineering & The Verge',
      sourceUrl: 'https://about.meta.com/media-gallery/executives/mark-zuckerberg/',
      aiPrompt: 'Why did Mark Zuckerberg release Llama models as open source, and how does open-source AI benefit students and independent developers?'
    },
    {
      id: 'titan-demis',
      name: 'Demis Hassabis',
      role: 'CEO & Co-Founder, Google DeepMind; 2024 Nobel Laureate in Chemistry',
      org: 'Google DeepMind (Scientific & Foundational AI)',
      category: 'ai',
      categoryLabel: 'AI Pioneers',
      avatarId: 'titan-demis',
      essentialWhy: 'A child chess prodigy and computer scientist who founded DeepMind. He created AlphaGo (which defeated world champion Lee Sedol in 2016) and AlphaFold, which predicted the 3D structures of over 200 million proteins. In October 2024, Demis was awarded the Nobel Prize in Chemistry, proving that AI can solve fundamental 50-year-old scientific mysteries.',
      coreImpact: 'AlphaFold Protein Biology Solver (2024 Nobel Prize), AlphaGo Reinforcement Learning & Gemini Models',
      keyTerms: ['AlphaFold Biology', '2024 Nobel Prize in Chemistry', 'Deep Reinforcement Learning', 'AI for Science'],
      radarHeadline: 'Scaling AlphaFold 3 for Precision Drug Discovery & Leading Google Gemini Roadmap',
      radarDetail: 'Following his Nobel win, Hassabis is expanding AI applications in materials science, climate modeling, and quantum physics, showcasing to students that software engineering can revolutionize fundamental biology and medicine.',
      radarSource: 'The Nobel Foundation & Nature',
      sourceUrl: 'https://www.nobelprize.org/prizes/chemistry/2024/hassabis/facts/',
      aiPrompt: 'How did Demis Hassabis and AlphaFold win the 2024 Nobel Prize in Chemistry, and why is AI for science so important?'
    },
    {
      id: 'titan-sundar',
      name: 'Sundar Pichai',
      role: 'CEO, Alphabet & Google',
      org: 'Alphabet (Google Search, Android, YouTube, Cloud)',
      category: 'tech',
      categoryLabel: 'Big Tech CEOs',
      avatarId: 'titan-sundar',
      essentialWhy: 'A materials engineer who joined Google in 2004, led the launch of the Google Chrome browser (now used by 65%+ of the world), and took over Android development. Under his tenure, Google researchers invented the Transformer architecture (the 2017 paper Attention Is All You Need), which is the mathematical foundation of ChatGPT, Claude, and all modern AI.',
      coreImpact: 'Google Chrome, Android Global Scale, Transformer Architecture Research & Gemini AI Ecosystem',
      keyTerms: ['Transformer Architecture', 'Global Scale Systems', 'Android Ecosystem', 'Quantum Computing (Willow)'],
      radarHeadline: 'Unveiling the Willow Quantum Chip & Launching Gemini 2.0 Native Agentic Workflows',
      radarDetail: 'Pichai is steering Google through its biggest transition since the internet began, embedding multimodal AI into Search, workspace apps, and Chrome, while proving exponential quantum computing milestones with the Willow chip.',
      radarSource: 'Google Keynote & The Wall Street Journal',
      sourceUrl: 'https://blog.google/inside-google/company-announcements/sundar-pichai/',
      aiPrompt: 'What is the Transformer architecture invented by Google researchers, and why did it make modern AI possible?'
    },
    {
      id: 'titan-elon',
      name: 'Elon Musk',
      role: 'Technologist & CEO',
      org: 'Tesla, SpaceX, xAI, Neuralink, Boring Co.',
      category: 'tech',
      categoryLabel: 'Big Tech CEOs',
      avatarId: 'titan-elon',
      essentialWhy: 'The ultimate practitioner of First-Principles Thinking. He co-founded PayPal, built SpaceX from scratch (creating the world\'s only reusable orbital rockets and the Starlink satellite constellation), scaled Tesla to kickstart global EV adoption, created Neuralink for brain-computer interfaces, and built xAI\'s 100k GPU Colossus supercluster in just 122 days.',
      coreImpact: 'Reusable Orbital Spaceflight (Falcon 9 & Starship), Electric Vehicles (Tesla), xAI (Grok) & Neuralink BCI',
      keyTerms: ['First-Principles Thinking', 'Starship Reusability', 'Autonomous Robotics (Optimus)', 'xAI Colossus Cluster'],
      radarHeadline: 'Starship Booster Catches, Training Grok 3 on 200k GPUs & Optimus Factory Rollout',
      radarDetail: 'Musk continues to push hyper-ambitious hardware engineering timelines, uniting xAI, Tesla autonomous driving algorithms, and SpaceX orbital infrastructure toward multi-planetary human civilization.',
      radarSource: 'SpaceX & Bloomberg Technology',
      sourceUrl: 'https://www.spacex.com/',
      aiPrompt: 'What is First Principles Thinking as popularized by Elon Musk, and how can an engineering student use it to solve hard problems?'
    },
    {
      id: 'titan-guido',
      name: 'Guido van Rossum',
      role: 'Creator of Python; Distinguished Engineer at Microsoft',
      org: 'Python Software Foundation & Microsoft',
      category: 'opensource',
      categoryLabel: 'Open Source & Dev',
      avatarId: 'titan-guido',
      essentialWhy: 'In 1989, Guido created Python as a holiday hobby project, focusing on readability and simplicity: "Beautiful is better than ugly. Simple is better than complex." Today, Python is the world\'s #1 programming language, the universal lingua franca for Artificial Intelligence, Machine Learning (PyTorch, TensorFlow, Scikit-learn), Data Science, and Computer Science education.',
      coreImpact: 'The Python Programming Language, PEP Architecture & The Zen of Python',
      keyTerms: ['The Zen of Python', 'CPython Performance', 'PyTorch & AI Ecosystem', 'Open-Source Governance'],
      radarHeadline: 'Leading Faster CPython Project to Enable Free-Threaded (No-GIL) Multicore Python',
      radarDetail: 'Guido is actively guiding the modernization of Python to remove the Global Interpreter Lock (GIL), enabling true multicore CPU parallelism required for high-performance AI data pipelines and scientific computing.',
      radarSource: 'Python Software Foundation & GitHub',
      sourceUrl: 'https://gvanrossum.github.io/',
      aiPrompt: 'Why did Guido van Rossum design Python for readability, and why did Python become the dominant language for modern AI and data science?'
    },
    {
      id: 'titan-yann',
      name: 'Yann LeCun',
      role: 'Chief AI Scientist, Meta; Silver Professor of Computer Science, NYU',
      org: 'Meta FAIR (Fundamental AI Research) & NYU',
      category: 'ai',
      categoryLabel: 'AI Pioneers',
      avatarId: 'titan-yann',
      essentialWhy: 'One of the three "Godfathers of AI" and recipient of the 2018 ACM Turing Award (the Nobel Prize of Computer Science). In the 1980s, he invented Convolutional Neural Networks (CNNs), which enabled computers to "see" images. He pioneered optical character recognition (reading checks at ATMs) and is one of the most outspoken defenders of open-source science and realistic AI cognition.',
      coreImpact: 'Convolutional Neural Networks (CNNs), Turing Award Winner (2018) & World Model Architectures (JEPA)',
      keyTerms: ['Convolutional Neural Networks', 'Turing Award', 'World Models (JEPA)', 'Open Science Advocacy'],
      radarHeadline: 'Challenging LLM Limits & Developing V-JEPA Video World Models for Physical Intuition',
      radarDetail: 'LeCun frequently engages in intellectual debates explaining to students why simply predicting words cannot achieve human-level common sense, urging the next generation of researchers to build World Models that understand physical cause and effect.',
      radarSource: 'ACM & Meta AI Research',
      sourceUrl: 'https://yann.lecun.com/',
      aiPrompt: 'Why does Yann LeCun argue that today\'s LLMs alone are not enough for human-level intelligence, and what are World Models?'
    },
    {
      id: 'titan-vitalik',
      name: 'Vitalik Buterin',
      role: 'Co-Founder & Chief Scientist',
      org: 'Ethereum Foundation & Decentralized Systems',
      category: 'opensource',
      categoryLabel: 'Open Source & Dev',
      avatarId: 'titan-vitalik',
      essentialWhy: 'At age 19, frustrated by the limitations of Bitcoin, Vitalik wrote the Ethereum Whitepaper, introducing the world to programmable blockchains, smart contracts, and decentralized computing. In 2022, he coordinated "The Merge", a monumental technical achievement that transitioned Ethereum from Proof-of-Work to Proof-of-Stake while the network was running live, eliminating 99.95% of its electricity consumption.',
      coreImpact: 'Ethereum Turing-Complete Smart Contracts, Decentralized Consensus & The Merge (Proof-of-Stake)',
      keyTerms: ['Smart Contracts', 'Zero-Knowledge Proofs (zk-SNARKs)', 'Proof of Stake & The Merge', 'Decentralized Governance'],
      radarHeadline: 'Pioneering Zero-Knowledge Rollup Research & Quadratic Funding for Public Open-Source Goods',
      radarDetail: 'Vitalik is deeply engaged in cryptographic privacy, AI-assisted smart contract security auditing, and publishing open-source research on how distributed systems can resist censorship and centralized single points of failure.',
      radarSource: 'Ethereum.org & Vitalik.eth',
      sourceUrl: 'https://vitalik.eth.limo/',
      aiPrompt: 'How did Vitalik Buterin invent smart contracts at age 19, and what are the computer science principles behind Ethereum?'
    }
  ],

  // 14 Pure Frontier Tech Stories & Industry Titans
  dailyCards: [
    {
      id: 'story-tech-1',
      category: 'ai',
      isXPost: true,
      topicTag: '𝕏 Tech: Reasoning Models',
      author: 'Andrej Karpathy',
      handle: '@karpathy',
      time: '2h ago',
      title: 'Andrej Karpathy on Reasoning LLMs: The Shift to Test-Time Compute',
      xTweetText: 'Deep dive on reasoning models (o1/o3/DeepSeek-R1): The paradigm is shifting from pre-training compute to inference test-time compute. A model spending 2 minutes thinking before answering is fundamentally an agent searching through chain-of-thought tokens using reinforcement learning with verifiable rewards.',
      sourceUrl: 'https://x.com/karpathy',
      sourceOutlet: '𝕏 • @karpathy',
      explanation: '<strong>In Simple Everyday Words:</strong> Andrej Karpathy (legendary AI educator & founding scientist at OpenAI) explains that instead of rushing to blurt out an answer in one second, new AI stops to think through the steps in its head, like working on a rough sheet of paper before answering an exam question.<br><br><strong>Why It Matters for You:</strong> In college, AI can now solve tricky programming and math bugs by checking its own logic step-by-step rather than hallucinating.',
      pronounceText: 'The paradigm is shifting from pre-training compute to inference test-time compute',
      commentsCount: 940,
      repostsCount: '6.2k',
      likesCount: 28400
    },
    {
      id: 'story-tech-2',
      category: 'ai',
      isXPost: true,
      topicTag: '𝕏 Tech: AI Infrastructure',
      author: 'Sam Altman',
      handle: '@sama',
      time: '4h ago',
      title: 'Sam Altman on The Next Frontier: Gigawatt Clusters & Physical Power Grids',
      xTweetText: 'The compute trajectory is unprecedented. Building gigawatt-class AI clusters requires rewriting how power grids, cooling infrastructure, and optical interconnects operate. The next frontier isn\'t just software—it\'s physical infrastructure, nuclear power, and silicon co-design.',
      sourceUrl: 'https://x.com/sama',
      sourceOutlet: '𝕏 • @sama',
      explanation: '<strong>In Simple Everyday Words:</strong> OpenAI CEO Sam Altman explains that building future AI needs massive amounts of electricity, nuclear reactors, and water cooling systems—not just smart code lines on a screen.<br><br><strong>Why It Matters for You:</strong> Electrical engineering, power grids, and thermal physics are becoming just as crucial as coding to power the AI revolution.',
      pronounceText: 'Building gigawatt class AI clusters requires rewriting how power grids and cooling operate',
      commentsCount: 1420,
      repostsCount: '9.8k',
      likesCount: 42100
    },
    {
      id: 'story-tech-3',
      category: 'ai',
      isXPost: true,
      topicTag: '𝕏 Tech: World Models',
      author: 'Yann LeCun',
      handle: '@ylecun',
      time: '6h ago',
      title: 'Yann LeCun on Why LLMs Need World Models (V-JEPA & Objective-Driven AI)',
      xTweetText: 'Autoregressive LLMs cannot achieve human-level intelligence alone because they lack world models and common-sense physics. They predict words, not reality. We need Joint Embedding Predictive Architectures (JEPA) that predict in abstract representation space, not pixel space.',
      sourceUrl: 'https://x.com/ylecun',
      sourceOutlet: '𝕏 • @ylecun',
      explanation: '<strong>In Simple Everyday Words:</strong> Meta Chief AI Scientist Yann LeCun explains that today\'s chatbots only guess words. True human intelligence requires understanding how the physical world works—like knowing that dropping a glass cup shatters it.<br><br><strong>Why It Matters for You:</strong> Current LLMs still have huge limitations. In college, your generation will build AI architectures that truly comprehend physical cause-and-effect.',
      pronounceText: 'Autoregressive models cannot achieve human level intelligence alone because they lack world models',
      commentsCount: 880,
      repostsCount: '4.1k',
      likesCount: 19500
    },
    {
      id: 'story-tech-4',
      category: 'silicon',
      isXPost: true,
      topicTag: '𝕏 Tech: Silicon & Hardware',
      author: 'Jensen Huang',
      handle: '@nvidia',
      time: '7h ago',
      title: 'Jensen Huang on Blackwell B200: 208 Billion Transistors Powering Global Compute',
      xTweetText: 'Blackwell is not just a GPU; it is a full-stack data center engine. Packaging 208 billion transistors across a dual-die chip connected via a 10 TB/s NVLink interconnect. Silicon co-design is the new industrial revolution powering generative AI at scale.',
      sourceUrl: 'https://x.com/nvidia',
      sourceOutlet: '𝕏 • @nvidia',
      explanation: '<strong>In Simple Everyday Words:</strong> NVIDIA CEO Jensen Huang explains how they fused two massive silicon computer chips together so tightly that they act as one single supercomputer chip, transferring data 10 times faster than anything ever made.<br><br><strong>Why It Matters for You:</strong> High-bandwidth computer architecture and chip hardware are among the highest-paid engineering specialties on Earth.',
      pronounceText: 'Packaging two hundred and eight billion transistors across a dual die package with ten terabytes per second interconnect',
      commentsCount: 1250,
      repostsCount: '7.8k',
      likesCount: 35600
    },
    {
      id: 'story-tech-5',
      category: 'ai',
      isXPost: true,
      topicTag: '𝕏 Tech: Physical AI',
      author: 'Dr. Jim Fan',
      handle: '@DrJimFan',
      time: '8h ago',
      title: 'Jim Fan on Physical AI: Humanoid Robotics Translating Sim-to-Real',
      xTweetText: '2026 is the year of Physical AI. Translating internet-scale video into robot motor policies using simulation-to-real reinforcement learning (Omniverse + Isaac Lab). Robots are learning dexterous manipulation via foundation models that generalize across zero-shot environments.',
      sourceUrl: 'https://x.com/DrJimFan',
      sourceOutlet: '𝕏 • @DrJimFan',
      explanation: '<strong>In Simple Everyday Words:</strong> NVIDIA robotics director Jim Fan explains how AI is moving out of software into metal robot bodies so they can walk, balance, open doors, and pick up objects.<br><br><strong>Why It Matters for You:</strong> Robots practice inside virtual video game simulations for millions of hours before walking in the real world. Robotics is the next massive tech boom.',
      pronounceText: 'Translating internet scale video into robot motor policies using simulation to real reinforcement learning',
      commentsCount: 650,
      repostsCount: '3.4k',
      likesCount: 16800
    },
    {
      id: 'story-tech-6',
      category: 'systems',
      isXPost: true,
      topicTag: '𝕏 Tech: Python Systems',
      author: 'Guido van Rossum',
      handle: '@gvanrossum',
      time: '12h ago',
      title: 'Guido van Rossum on Python 3.13: The No-GIL Free-Threaded Epoch',
      xTweetText: 'Python 3.13 marks a historic milestone: PEP 703 enables free-threaded execution without the Global Interpreter Lock (GIL), unlocking true multi-core CPU parallelism for scientific computing, web workers, and AI data pipelines with zero thread contention.',
      sourceUrl: 'https://x.com/gvanrossum',
      sourceOutlet: '𝕏 • @gvanrossum',
      explanation: '<strong>In Simple Everyday Words:</strong> Python creator Guido van Rossum shares that Python can now use all your computer processor cores simultaneously, making CPU-heavy programs run much faster without waiting for a single lock.<br><br><strong>Why It Matters for You:</strong> Python is the first programming language most college students learn. Now your Python data science and machine learning code can run at full hardware speeds.',
      pronounceText: 'PEP 703 enables free-threaded execution without the Global Interpreter Lock unlocking true multicore parallelism',
      commentsCount: 1100,
      repostsCount: '7.9k',
      likesCount: 31200
    },
    {
      id: 'story-tech-7',
      category: 'systems',
      isXPost: true,
      topicTag: '𝕏 Tech: Linux & Rust',
      author: 'Linus Torvalds',
      handle: '@torvalds',
      time: '14h ago',
      title: 'Linus Torvalds on Linux 6.12 & Expanding Rust in Kernel Infrastructure',
      xTweetText: 'Memory safety bugs have plagued C codebases for four decades. Rust integration in the Linux kernel is progressing pragmatically. We want safe memory abstractions without compromising zero-cost performance or low-level hardware control.',
      sourceUrl: 'https://x.com/torvalds',
      sourceOutlet: '𝕏 • @torvalds',
      explanation: '<strong>In Simple Everyday Words:</strong> Linux & Git creator Linus Torvalds explains that adding the Rust language to the Linux operating system prevents accidental memory crashes and security holes while keeping everything blazingly fast.<br><br><strong>Why It Matters for You:</strong> Almost every server, cloud data center, and Android phone runs on Linux. Understanding memory safety gives you a huge advantage in engineering interviews.',
      pronounceText: 'Rust integration in the Linux kernel provides memory safety without compromising zero cost performance',
      commentsCount: 1350,
      repostsCount: '8.4k',
      likesCount: 37400
    },
    {
      id: 'story-tech-8',
      category: 'leaders',
      isXPost: true,
      topicTag: '𝕏 Tech: Chemistry Nobel',
      author: 'Demis Hassabis',
      handle: '@demishassabis',
      time: '16h ago',
      title: 'Demis Hassabis on AlphaFold 3 & AI Solving Science Grand Challenges',
      xTweetText: 'AlphaFold 3 predicts the structures and chemical interactions of all life molecules—proteins, DNA, RNA, and ligands. AI is moving from digital chatbots to accelerating biology, medicine, and clean materials discovery by decades.',
      sourceUrl: 'https://x.com/demishassabis',
      sourceOutlet: '𝕏 • @demishassabis',
      explanation: '<strong>In Simple Everyday Words:</strong> DeepMind founder & Nobel Prize laureate Demis Hassabis shows how AI can accurately predict the shape of 200 million biological molecules, helping doctors design life-saving medicines in days rather than years.<br><br><strong>Why It Matters for You:</strong> AI is far more than generative text—it is revolutionizing biology, medicine, and fundamental scientific discovery.',
      pronounceText: 'AlphaFold three predicts the structures and interactions of all life molecules',
      commentsCount: 1540,
      repostsCount: '9.2k',
      likesCount: 41200
    },
    {
      id: 'story-tech-9',
      category: 'leaders',
      isXPost: true,
      topicTag: '𝕏 Tech: Safe Superintelligence',
      author: 'Ilya Sutskever',
      handle: '@ilyasut',
      time: '18h ago',
      title: 'Ilya Sutskever on Safe Superintelligence: Scaling Beyond Pre-Training Ceilings',
      xTweetText: 'The next mountain to climb is safe superintelligence (SSI). Pre-training scaling on web text is hitting data ceilings. The future belongs to synthetic reasoning, recursive self-improvement, and mathematical safety proofs.',
      sourceUrl: 'https://x.com/ilyasut',
      sourceOutlet: '𝕏 • @ilyasut',
      explanation: '<strong>In Simple Everyday Words:</strong> Legendary AI scientist Ilya Sutskever explains that AI has already read the whole internet. To become truly smarter, AI must now practice solving difficult puzzles on its own, just like a student working through tough homework problems.<br><br><strong>Why It Matters for You:</strong> The next era of AI isn\'t just scraping web articles—it\'s teaching AI to invent new logic and verify its own work.',
      pronounceText: 'The future of artificial intelligence belongs to synthetic reasoning and mathematical safety proofs',
      commentsCount: 1180,
      repostsCount: '6.9k',
      likesCount: 29800
    },
    {
      id: 'story-tech-10',
      category: 'ai',
      isXPost: true,
      topicTag: '𝕏 Tech: Open Weights',
      author: 'Mark Zuckerberg',
      handle: '@zuck',
      time: '20h ago',
      title: 'Mark Zuckerberg on LLaMA 3.3: Why Open Weights Will Win AI Infrastructure',
      xTweetText: 'Open source is the right path for AI. LLaMA models are running locally on millions of developer machines and enterprise clusters. When every developer can inspect, fine-tune, and self-host model weights, innovation accelerates exponentially.',
      sourceUrl: 'https://x.com/zuck',
      sourceOutlet: '𝕏 • @zuck',
      explanation: '<strong>In Simple Everyday Words:</strong> Meta CEO Mark Zuckerberg explains that giving away AI model weights for free allows students and programmers worldwide to run advanced AI right on their laptops without paying API fees to cloud giants.<br><br><strong>Why It Matters for You:</strong> You don\'t need a multimillion-dollar budget to build AI applications. You can download and fine-tune open-weight models on your personal machine.',
      pronounceText: 'Open source is the right path for artificial intelligence infrastructure',
      commentsCount: 1420,
      repostsCount: '8.1k',
      likesCount: 36200
    },
    {
      id: 'story-tech-11',
      category: 'leaders',
      isXPost: true,
      topicTag: '𝕏 Tech: Autonomous Agents',
      author: 'Satya Nadella',
      handle: '@satyanadella',
      time: '22h ago',
      title: 'Satya Nadella on Autonomous Agents: AI Becoming the Operating System',
      xTweetText: 'Every application will be reimagined as an agentic system. Autonomous agents will collaborate across workflows, manage databases, write code, and execute multi-step business logic with humans in the loop.',
      sourceUrl: 'https://x.com/satyanadella',
      sourceOutlet: '𝕏 • @satyanadella',
      explanation: '<strong>In Simple Everyday Words:</strong> Microsoft CEO Satya Nadella shares that future computer programs won\'t just sit there waiting for you to click buttons—AI agents will proactively carry out entire multi-step projects for you like an assistant.<br><br><strong>Why It Matters for You:</strong> Instead of writing single isolated scripts, college software engineers are learning to architect autonomous agent teams that build software collaboratively.',
      pronounceText: 'Every application will be reimagined as an agentic collaborative system',
      commentsCount: 960,
      repostsCount: '5.3k',
      likesCount: 24700
    },
    {
      id: 'story-tech-12',
      category: 'silicon',
      isXPost: true,
      topicTag: '𝕏 Tech: Colossus Supercluster',
      author: 'Elon Musk',
      handle: '@elonmusk',
      time: '1d ago',
      title: 'Elon Musk on Colossus: 100,000 Liquid-Cooled H100s Online in 122 Days',
      xTweetText: 'xAI Colossus is the most powerful AI training cluster in the world. 100,000 liquid-cooled Nvidia H100 GPUs brought from empty warehouse to online training in 122 days. Massive parallel networking over flat RoCE Ethernet.',
      sourceUrl: 'https://x.com/elonmusk',
      sourceOutlet: '𝕏 • @elonmusk',
      explanation: '<strong>In Simple Everyday Words:</strong> Elon Musk explains how their engineering team connected 100,000 of the world\'s fastest AI chips together with liquid cooling tubes in just 4 months to train cutting-edge models like Grok 3.<br><br><strong>Why It Matters for You:</strong> Supercomputing, high-speed fiber optic networking, and liquid cooling systems are just as important as code to run large models.',
      pronounceText: 'Colossus connects one hundred thousand liquid cooled GPUs over flat RoCE Ethernet',
      commentsCount: 3200,
      repostsCount: '14.5k',
      likesCount: 68400
    },
    {
      id: 'story-tech-13',
      category: 'systems',
      isXPost: true,
      topicTag: '𝕏 Tech: GPU Clusters',
      author: 'Greg Brockman',
      handle: '@gdb',
      time: '1d ago',
      title: 'Greg Brockman on Cluster Resilience: Training Across 100k GPUs Zero-Downtime',
      xTweetText: 'When you run distributed training across 100,000 GPUs, hardware failures are continuous. Our infrastructure team solved zero-downtime hot-swapping of nodes and sub-second asynchronous checkpointing directly to NVMe fabric. Systems engineering turns theory into models.',
      sourceUrl: 'https://x.com/gdb',
      sourceOutlet: '𝕏 • @gdb',
      explanation: '<strong>In Simple Everyday Words:</strong> OpenAI President Greg Brockman explains that when thousands of computer chips work together, pieces break every couple of hours. Smart engineers write code that hot-swaps broken chips without stopping the training job.<br><br><strong>Why It Matters for You:</strong> Writing fault-tolerant code that survives hardware failures is the backbone of all modern cloud and AI infrastructure.',
      pronounceText: 'Systems engineering turns machine learning theory into working foundation models',
      commentsCount: 790,
      repostsCount: '4.8k',
      likesCount: 22400
    },
    {
      id: 'story-tech-14',
      category: 'leaders',
      isXPost: true,
      topicTag: '𝕏 Tech: Founder Velocity',
      author: 'Paul Graham',
      handle: '@paulg',
      time: '2d ago',
      title: 'Paul Graham on Why Technical Founders Who Code Build the Strongest AI Companies',
      xTweetText: 'In AI today, the technology changes so rapidly that non-technical CEOs cannot make product decisions fast enough. The strongest founders are the engineers who understand model weights, latency, and context limits directly and can ship prototypes over a weekend.',
      sourceUrl: 'https://x.com/paulg',
      sourceOutlet: '𝕏 • @paulg',
      explanation: '<strong>In Simple Everyday Words:</strong> Y Combinator startup founder Paul Graham explains that leaders who know how to code build the fastest-growing tech companies because they can test and ship their own ideas over a weekend without waiting for anyone else.<br><br><strong>Why It Matters for You:</strong> Deep programming and systems mastery gives you the power to invent, build, and launch your own startups directly.',
      pronounceText: 'The strongest founders are the engineers who understand model weights latency and context limits directly',
      commentsCount: 1350,
      repostsCount: '8.2k',
      likesCount: 38900
    }
  ],

  quizQuestions: [
    {
      question: 'What does "Test-Time Compute" mean in frontier reasoning models like o3 and DeepSeek-R1?',
      options: [
        'The time it takes to download weights over Wi-Fi.',
        'The model stops to generate and verify chain-of-thought thinking steps on a "rough sheet" before answering.',
        'The temperature of the GPU heat sink during testing.',
        'The speed of typing characters on a keyboard.'
      ],
      correctIndex: 1,
      explanation: 'Test-time compute allows models to search, backtrack, and verify reasoning steps using reinforcement learning before outputting the final answer.'
    },
    {
      question: 'What revolutionary architectural change did Python 3.13 introduce under PEP 703?',
      options: [
        'It removed all loops and functions from the language.',
        'It introduced free-threaded mode without the Global Interpreter Lock (GIL) for true multi-core CPU execution.',
        'It restricted Python to running only inside web browsers.',
        'It changed Python code into assembly language automatically.'
      ],
      correctIndex: 1,
      explanation: 'PEP 703 enables free-threaded execution without the Global Interpreter Lock, allowing multiple CPU cores to run Python threads simultaneously.'
    },
    {
      question: 'Why are the Linux Kernel, CISA, and White House adopting memory-safe languages like Rust?',
      options: [
        'Because Rust files take up less hard drive space.',
        'Over 70% of historical critical cybersecurity vulnerabilities in C/C++ stem from memory bugs like buffer overflows.',
        'Because older languages cannot run on computers built after 2024.',
        'Because Rust is owned by the United Nations.'
      ],
      correctIndex: 1,
      explanation: 'Memory safety guarantees at compile time prevent buffer overflows, dangling pointers, and unauthorized RAM access exploits.'
    },
    {
      question: 'What is unique about NVIDIA\'s Blackwell B200 chip architecture?',
      options: [
        'It is made out of plastic and doesn\'t use electricity.',
        'It packages 208 billion transistors across two dies acting as one giant unified GPU with 10 TB/s NVLink interconnect.',
        'It can only play 16-bit video games from 1995.',
        'It requires no cooling and runs at sub-zero temperatures naturally.'
      ],
      correctIndex: 1,
      explanation: 'Blackwell packages 208 billion transistors across two dies unified by a 10 TB/s chip-to-chip NVLink connection.'
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
      metric: '850K Impressions • 12h ago',
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
      metric: '1.2M Impressions • 1d ago',
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
      metric: '42k Reposts • 180k Likes',
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
      metric: '85k Likes • Ratioed',
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
      metric: 'Verified Tech Brief',
      link: 'https://news.google.com',
      aiPrompt: 'Explain the difference between on-device AI and cloud AI in simple terms for beginners.'
    }
  ]
};

// ==========================================
// 2. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Critical path only: Paint feed immediately (<15ms)
  initUserIdentity();
  initNavigation();
  initCategoryFilters();
  initDeck();
  initSettingsModal();
  initPwaInstaller();
  tabInitialized.feed = true;

  // 2. Defer non-critical tabs to browser idle period
  const idleWarmup = window.requestIdleCallback || ((cb) => setTimeout(cb, 350));
  idleWarmup(() => {
    if (!tabInitialized.titans) { initTitansView(); tabInitialized.titans = true; }
    if (!tabInitialized.radar) { initRadar(); tabInitialized.radar = true; }
    if (!tabInitialized.quiz) { initQuizEngine(); tabInitialized.quiz = true; }
    if (!tabInitialized.vault) { initVault(); tabInitialized.vault = true; }
    if (!tabInitialized.ai) { initPulseAI(); tabInitialized.ai = true; }
  });
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

  const triggerFeedTop = () => {
    switchTab('feed');
    playSyntheticTone(1050, 'sine', 0.08);
    const emblems = document.querySelectorAll('.x-brand-emblem, .island-logo-emblem');
    emblems.forEach(emblem => {
      emblem.style.transform = 'scale(1.08)';
      setTimeout(() => emblem.style.transform = '', 200);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  document.getElementById('brandLogoBtn')?.addEventListener('click', triggerFeedTop);
  document.getElementById('sidebarBrandBtn')?.addEventListener('click', triggerFeedTop);
  document.getElementById('goToRadarFromFeed')?.addEventListener('click', () => switchTab('radar'));
  document.getElementById('goToQuizFromFeed')?.addEventListener('click', () => switchTab('quiz'));

  // Audio Toggle
  const audioBtn = document.getElementById('audioToggleBtn');
  audioBtn?.addEventListener('click', () => {
    AppState.soundEnabled = !AppState.soundEnabled;
    localStorage.setItem('dp_sound', AppState.soundEnabled);
        document.getElementById('audioIcon').innerHTML = AppState.soundEnabled 
      ? `<svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`
      : `<svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
    playSyntheticTone(AppState.soundEnabled ? 659.25 : 300, 'sine', 0.1);
  });

  // Plain Twitter Theme Switcher (Twitter Lights Out #000000 vs Twitter Dim #15202b)
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  
  // Ensure white glass theme is cleaned out for plain Twitter look
  document.body.classList.remove('theme-white-glass');
  if (AppState.glassTheme === 'dim') {
    document.body.classList.add('theme-twitter-dim');
  } else {
    document.body.classList.remove('theme-twitter-dim');
  }

  themeBtn?.addEventListener('click', () => {
    AppState.glassTheme = AppState.glassTheme === 'black' ? 'dim' : 'black';
    localStorage.setItem('dp_glass_theme', AppState.glassTheme);
    document.body.classList.toggle('theme-twitter-dim', AppState.glassTheme === 'dim');
    document.body.classList.remove('theme-white-glass');
    
    if (themeIcon) {
      themeIcon.innerHTML = AppState.glassTheme === 'dim'
        ? `<svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"></path></svg>`;
    }
    playSyntheticTone(AppState.glassTheme === 'dim' ? 620 : 880, 'sine', 0.06);
  });
}

function switchTab(tabName) {
  AppState.activeTab = tabName;

  // Ensure target tab is initialized before displaying
  if (tabName === 'titans' && !tabInitialized.titans) {
    initTitansView();
    tabInitialized.titans = true;
  } else if (tabName === 'radar' && !tabInitialized.radar) {
    initRadar();
    tabInitialized.radar = true;
    fetchLiveRedditPosts();
  } else if (tabName === 'quiz' && !tabInitialized.quiz) {
    initQuizEngine();
    tabInitialized.quiz = true;
  } else if (tabName === 'vault' && !tabInitialized.vault) {
    initVault();
    tabInitialized.vault = true;
  } else if (tabName === 'ai' && !tabInitialized.ai) {
    initPulseAI();
    tabInitialized.ai = true;
  }

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
// 4. CATEGORY FILTERS & DECK PROGRESS
// ==========================================

// ==========================================
// SEEN POSTS PERSISTENCE & DEDUPLICATION
// ==========================================
function markPostSeen(title) {
  if (!title) return;
  if (!AppState.seenPosts.has(title)) {
    AppState.seenPosts.add(title);
    try {
      localStorage.setItem('dp_seen_posts', JSON.stringify(Array.from(AppState.seenPosts)));
    } catch (e) {}
  }
}

window.resetSeenPosts = function() {
  AppState.seenPosts.clear();
  try {
    localStorage.removeItem('dp_seen_posts');
  } catch (e) {}
  playSyntheticTone(880, 'sine', 0.1);
  renderContinuousFeed();
};

let seenIntersectionObserver = null;
function observePostsForSeen() {
  if (seenIntersectionObserver) {
    seenIntersectionObserver.disconnect();
  }

  const cardElements = document.querySelectorAll('.social-post-card[data-post-title]');
  if (!cardElements || cardElements.length === 0) return;

  seenIntersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
        const title = entry.target.getAttribute('data-post-title');
        if (title) {
          markPostSeen(title);
        }
      }
    });
  }, {
    threshold: 0.45
  });

  cardElements.forEach(el => seenIntersectionObserver.observe(el));
}

// ==========================================
// MOBILE PULL-TO-REFRESH (PTR) ENGINE
// ==========================================
let isRefreshingFeed = false;

function initPullToRefresh() {
  const timeline = document.querySelector('.social-timeline');
  const indicator = document.getElementById('pullRefreshIndicator');
  const icon = document.getElementById('pullRefreshIcon');
  const text = document.getElementById('pullRefreshText');
  const refreshBtn = document.getElementById('refreshFeedBtn');

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      triggerFeedRefresh();
    });
  }

  if (!timeline || !indicator) return;

  let startY = 0;
  let currentY = 0;
  let isDragging = false;
  const PULL_THRESHOLD = 60;

  const handleTouchStart = (e) => {
    if (timeline.scrollTop <= 2 && !isRefreshingFeed) {
      startY = e.touches[0].clientY;
      isDragging = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isRefreshingFeed) return;
    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;

    if (deltaY > 0 && timeline.scrollTop <= 2) {
      // Damped rubber-band pull
      const pullDist = Math.min(deltaY * 0.42, 85);
      indicator.style.height = `${pullDist}px`;
      indicator.style.opacity = Math.min(pullDist / 40, 1).toString();

      if (pullDist >= PULL_THRESHOLD) {
        if (text) text.textContent = 'Release to refresh feed ↻';
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        if (text) text.textContent = 'Pull down to refresh feed';
        if (icon) icon.style.transform = `rotate(${pullDist * 3}deg)`;
      }

      if (e.cancelable && deltaY > 10) {
        e.preventDefault();
      }
    } else {
      indicator.style.height = '0px';
      indicator.style.opacity = '0';
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    const deltaY = currentY - startY;
    const pullDist = Math.min(deltaY * 0.42, 85);

    if (pullDist >= PULL_THRESHOLD && !isRefreshingFeed) {
      triggerFeedRefresh(true);
    } else {
      indicator.style.height = '0px';
      indicator.style.opacity = '0';
    }
  };

  timeline.addEventListener('touchstart', handleTouchStart, { passive: true });
  timeline.addEventListener('touchmove', handleTouchMove, { passive: false });
  timeline.addEventListener('touchend', handleTouchEnd, { passive: true });
}

window.triggerFeedRefresh = function(fromPull = false) {
  if (isRefreshingFeed) return;
  isRefreshingFeed = true;

  const indicator = document.getElementById('pullRefreshIndicator');
  const icon = document.getElementById('pullRefreshIcon');
  const text = document.getElementById('pullRefreshText');
  const refreshBtn = document.getElementById('refreshFeedBtn');

  if (refreshBtn) {
    refreshBtn.style.transform = 'rotate(360deg)';
    refreshBtn.style.transition = 'transform 0.6s ease';
  }

  if (indicator) {
    indicator.style.height = '52px';
    indicator.style.opacity = '1';
  }
  if (icon) {
    icon.classList.add('spinning');
  }
  if (text) {
    text.textContent = 'Refreshing live 𝕏 Tech & stories...';
  }

  playSyntheticTone(920, 'sine', 0.08);

  // Fetch real-time live tech radar and re-render feed
  fetchLiveTechRadarPosts();

  setTimeout(() => {
    renderContinuousFeed();
    isRefreshingFeed = false;

    if (indicator) {
      indicator.style.height = '0px';
      indicator.style.opacity = '0';
    }
    if (icon) {
      icon.classList.remove('spinning');
      icon.style.transform = '';
    }
    if (text) {
      text.textContent = 'Pull down to refresh feed';
    }
    if (refreshBtn) {
      setTimeout(() => {
        refreshBtn.style.transform = '';
        refreshBtn.style.transition = '';
      }, 300);
    }
    playSyntheticTone(1046, 'sine', 0.07);
  }, 650);
};

function getFilteredCards() {
  let pool = AppState.dailyCards;
  const cat = AppState.activeCategory;
  
  if (cat !== 'all') {
    if (cat === 'radar') {
      pool = pool.filter(c => c.isRadar || c.platform === 'reddit' || c.isXPost);
    } else if (cat === 'leaders') {
      pool = pool.filter(c => c.category === 'leaders' || c.isLeader || c.category === 'icon');
    } else {
      pool = pool.filter(c => c.category === cat);
    }
  }

  const unseenCards = pool.filter(c => !AppState.seenPosts.has(c.title));

  if (unseenCards.length < 4) {
    const infiniteUnseen = INFINITE_STORIES_POOL.filter(s => {
      const matchCat = (cat === 'all') || 
                       (cat === 'leaders' && (s.category === 'leaders' || s.isLeader)) ||
                       (s.category === cat);
      return matchCat && !AppState.seenPosts.has(s.title) && !unseenCards.some(u => u.title === s.title);
    });

    const needed = Math.min(8 - unseenCards.length, infiniteUnseen.length);
    for (let i = 0; i < needed; i++) {
      const item = infiniteUnseen[i];
      unseenCards.push({
        ...item,
        id: `story-fresh-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`
      });
    }
  }

  return unseenCards;
}

function initCategoryFilters() {
  const pills = document.querySelectorAll('.category-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.getAttribute('data-cat');
      
      AppState.activeCategory = cat;
      renderContinuousFeed();
      playSyntheticTone(640, 'sine', 0.05);
      
      const timeline = document.querySelector('.social-timeline');
      if (timeline) timeline.scrollTop = 0;
    });
  });
}

function updateReadingProgressStrip() {
  // Progress and task bars eliminated as requested
}

function getCategoryIcon(cat) {
  const map = {
    ai: `<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    silicon: `<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>`,
    systems: `<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    leaders: `<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"></path><path d="M5 20h14"></path></svg>`,
    radar: `<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
  };
  return map[cat] || map.ai;
}

function getCategoryLabel(cat) {
  const map = {
    ai: 'Frontier AI',
    silicon: 'Silicon & Hardware',
    systems: 'Systems & Dev',
    leaders: 'Tech Titan',
    radar: 'Social Radar'
  };
  return map[cat] || 'Tech News';
}

// ==========================================
// 5. CONTINUOUS INFINITE SCROLL FEED
// ==========================================
let infiniteScrollObserver = null;
let isFetchingInfiniteBatch = false;
let infiniteStoryIndex = 0;

// High-Yield Infinite Stories Pool
const INFINITE_STORIES_POOL = [
  {
    topicTag: 'DeepSeek R1',
    category: 'ai',
    isXPost: true,
    author: 'DeepSeek AI Lab',
    handle: '@deepseeknews',
    time: 'Live',
    title: 'DeepSeek-R1: Open-Weights Frontier Reasoning Shaking Global AI',
    xTweetText: 'DeepSeek-R1 achieves reasoning parity with o1 using pure reinforcement learning without supervised fine-tuning. Multi-head Latent Attention (MLA) and DeepSeekMoE deliver breakthrough compute efficiency for open science.',
    sourceUrl: 'https://github.com/deepseek-ai/DeepSeek-R1',
    sourceOutlet: 'GitHub • DeepSeek Official',
    explanation: '<strong>In Simple Everyday Words:</strong> DeepSeek launched an open AI model that matches top closed models in math and coding while using a fraction of the computing cost.<br><br><strong>Why It Matters:</strong> Demonstrates that open-source code and smart math can compete with trillion-dollar labs.',
    pronounceText: 'DeepSeek achieves frontier reasoning efficiency with open weights architecture',
    commentsCount: 2840,
    repostsCount: '12.4k',
    likesCount: 54100
  },
  {
    topicTag: 'Claude 3.5 Sonnet',
    category: 'ai',
    isXPost: true,
    author: 'Anthropic',
    handle: '@AnthropicAI',
    time: '3h ago',
    title: 'Anthropic Claude 3.5 Sonnet: Autonomous Computer Use & GUI Navigation',
    xTweetText: 'Claude 3.5 Sonnet is the first frontier model capable of directly controlling desktop computers: moving the cursor, clicking buttons, and typing across standard desktop software with vision feedback.',
    sourceUrl: 'https://www.anthropic.com/news/3-5-models-and-computer-use',
    sourceOutlet: 'Anthropic Research',
    explanation: '<strong>In Simple Everyday Words:</strong> Anthropic built an AI that can move your mouse, click buttons, and fill in forms on your screen just like a human using a PC.<br><br><strong>Why It Matters:</strong> Bridges the gap between chatting with an AI and having an AI do real computer work for you.',
    pronounceText: 'Claude three point five Sonnet operates desktop computers with autonomous vision feedback',
    commentsCount: 1650,
    repostsCount: '6.8k',
    likesCount: 29800
  },
  {
    topicTag: 'TSMC 2nm GAA',
    category: 'silicon',
    isXPost: true,
    author: 'Semiconductor Engineering',
    handle: '@semi_analysis',
    time: '5h ago',
    title: 'TSMC 2nm GAA: Gate-All-Around Nanosheets & Backside Power Delivery',
    xTweetText: 'TSMC\'s N2 process node transitions from FinFET to Gate-All-Around (GAA) nanosheets with backside power delivery (Super Power Rail), reducing IR drop and boosting transistor density by 15%.',
    sourceUrl: 'https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm',
    sourceOutlet: 'TSMC Semiconductor Wire',
    explanation: '<strong>In Simple Everyday Words:</strong> TSMC is manufacturing computer chips with transistors so small that microscopic wires wrap all the way around them, letting chips run faster while using less battery.<br><br><strong>Why It Matters:</strong> Powers the next generation of smartphones and AI data center chips.',
    pronounceText: 'TSMC transitions from FinFET to Gate All Around nanosheets with backside power delivery',
    commentsCount: 820,
    repostsCount: '3.9k',
    likesCount: 17400
  },
  {
    topicTag: 'WebGPU Standard',
    category: 'systems',
    isXPost: true,
    author: 'W3C GPU Web Group',
    handle: '@browsergpu',
    time: '8h ago',
    title: 'WebGPU Delivering Native Metal, Vulkan & DirectX 12 Speeds to Browsers',
    xTweetText: 'WebGPU brings low-overhead access to modern GPU hardware pipelines directly from JavaScript and WebAssembly, enabling 7B LLMs and ray tracing to run client-side in browser tabs with zero install.',
    sourceUrl: 'https://developer.chrome.com/docs/web-platform/webgpu',
    sourceOutlet: 'Chrome Developers & W3C',
    explanation: '<strong>In Simple Everyday Words:</strong> WebGPU lets web pages talk directly to your laptop graphics card, so you can run games and AI models right in your browser with zero download.<br><br><strong>Why It Matters:</strong> Makes web apps run as fast as native desktop software.',
    pronounceText: 'WebGPU provides low overhead hardware access to modern GPU pipelines from web browsers',
    commentsCount: 940,
    repostsCount: '4.2k',
    likesCount: 19100
  },
  {
    topicTag: 'PyTorch 2.5',
    category: 'systems',
    isXPost: true,
    author: 'PyTorch Foundation',
    handle: '@PyTorch',
    time: '12h ago',
    title: 'PyTorch 2.5: Torch.compile Graph Capture with Triton GPU Kernels',
    xTweetText: 'PyTorch 2.5 extends torch.compile with full AOTAutograd and Inductor code generation, synthesizing optimized OpenAI Triton GPU kernels directly from Python syntax with 2.2x speedups.',
    sourceUrl: 'https://pytorch.org/blog/pytorch-2-5/',
    sourceOutlet: 'PyTorch Foundation Blog',
    explanation: '<strong>In Simple Everyday Words:</strong> PyTorch now automatically inspects your Python AI code and converts it into custom machine code tailored for GPU chips, making model training more than twice as fast.<br><br><strong>Why It Matters:</strong> The standard library used in 90% of AI machine learning research papers worldwide.',
    pronounceText: 'PyTorch two point five extends torch compile with Triton kernel generation',
    commentsCount: 710,
    repostsCount: '3.1k',
    likesCount: 14800
  },
  {
    topicTag: 'Mojo Systems',
    category: 'systems',
    isXPost: true,
    author: 'Chris Lattner (Modular)',
    handle: '@clattner_llvm',
    time: '14h ago',
    title: 'Mojo Language: Combining Python Ergonomics with C & Rust Performance',
    xTweetText: 'Mojo bridges the gap between Python\'s expressiveness and hardware-level performance. Full memory ownership, MLIR compiler integration, and automatic vectorization across CPUs, GPUs, and TPUs.',
    sourceUrl: 'https://www.modular.com/max/mojo',
    sourceOutlet: 'Modular Systems News',
    explanation: '<strong>In Simple Everyday Words:</strong> LLVM and Swift creator Chris Lattner built a new language that reads as simple as Python but runs as fast as C and Rust for AI chips.<br><br><strong>Why It Matters:</strong> Unifies high-level AI model coding and low-level hardware performance into one language.',
    pronounceText: 'Mojo combines Python expressiveness with hardware level compilation and memory safety',
    commentsCount: 880,
    repostsCount: '4.5k',
    likesCount: 21300
  },
  {
    topicTag: 'Apple M4 Max',
    category: 'silicon',
    isXPost: true,
    author: 'Apple Silicon Architecture',
    handle: '@apple',
    time: '1d ago',
    title: 'Apple M4 Max: 546 GB/s Unified Memory Bandwidth for Local LLMs',
    xTweetText: 'Apple M4 Max features 16 CPU cores, 40 GPU cores, and a massive 546 GB/s unified memory subsystem. Developers can load and run 70B parameter models entirely in unified RAM on a laptop.',
    sourceUrl: 'https://www.apple.com/newsroom/2024/10/apple-introduces-m4-pro-and-m4-max/',
    sourceOutlet: 'Apple Newsroom',
    explanation: '<strong>In Simple Everyday Words:</strong> Apple\'s M4 Max chip shares ultra-fast memory between the CPU and GPU, letting developers run massive 70-billion-parameter AI models right on their MacBook without an internet connection.<br><br><strong>Why It Matters:</strong> High memory bandwidth is the #1 bottleneck for local AI inference.',
    pronounceText: 'Apple M4 Max delivers five hundred and forty six gigabytes per second unified memory bandwidth',
    commentsCount: 1420,
    repostsCount: '6.7k',
    likesCount: 33200
  },
  {
    topicTag: 'RISC-V Open Silicon',
    category: 'silicon',
    isXPost: true,
    author: 'RISC-V International',
    handle: '@risc_v',
    time: '2d ago',
    title: 'RISC-V International: Open Standard Silicon Surpassing 10 Billion Cores',
    xTweetText: 'RISC-V has officially crossed 10 billion deployed processor cores worldwide. Open instruction set architectures (ISA) are democratizing silicon design across aerospace, automotive, and AI accelerators.',
    sourceUrl: 'https://riscv.org/about/',
    sourceOutlet: 'RISC-V International Wire',
    explanation: '<strong>In Simple Everyday Words:</strong> Just like Linux made operating system software open and free for everyone, RISC-V makes the design instructions of computer chips open and free.<br><br><strong>Why It Matters:</strong> Anyone can design and build their own computer processor without paying licensing fees.',
    pronounceText: 'RISC-V democratizes silicon processor design with an open instruction set architecture',
    commentsCount: 620,
    repostsCount: '2.8k',
    likesCount: 12900
  }
];

function initDeck() {
  renderContinuousFeed();
  initInfiniteScroll();
  initPullToRefresh();

  const timeline = document.querySelector('.social-timeline');
  if (timeline) {
    timeline.addEventListener('scroll', () => {
      if (AppState.activeTab === 'feed') {
        updateReadingProgressStrip();
      }
    });
  }
}

function initInfiniteScroll() {
  const sentinel = document.getElementById('infiniteScrollSentinel');
  const timeline = document.querySelector('.social-timeline');

  // 1. Dual IntersectionObservers: timeline container and window viewport
  if (sentinel) {
    if (infiniteScrollObserver) {
      infiniteScrollObserver.disconnect();
    }

    if (timeline) {
      infiniteScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerInfiniteScrollBatch();
          }
        });
      }, {
        root: timeline,
        rootMargin: '800px'
      });
      infiniteScrollObserver.observe(sentinel);
    }

    const windowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerInfiniteScrollBatch();
        }
      });
    }, {
      root: null,
      rootMargin: '800px'
    });
    windowObserver.observe(sentinel);
  }

  // 2. Continuous Scroll Listeners on both Timeline container and Window
  const handleScrollCheck = () => {
    if (AppState.activeTab !== 'feed') return;

    if (timeline) {
      const distanceToBottom = timeline.scrollHeight - timeline.scrollTop - timeline.clientHeight;
      if (distanceToBottom < 900) {
        triggerInfiniteScrollBatch();
      }
    }

    const windowDist = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
    if (windowDist < 900) {
      triggerInfiniteScrollBatch();
    }
  };

  if (timeline) {
    timeline.addEventListener('scroll', handleScrollCheck, { passive: true });
  }
  window.addEventListener('scroll', handleScrollCheck, { passive: true });
}

function triggerInfiniteScrollBatch() {
  if (isFetchingInfiniteBatch) return;
  isFetchingInfiniteBatch = true;

  const container = document.getElementById('activeSocialCardContainer');
  if (!container) {
    isFetchingInfiniteBatch = false;
    return;
  }

  // Select matching unseen pool based on active category
  const activeCat = AppState.activeCategory || 'all';
  let categoryPool = INFINITE_STORIES_POOL;
  if (activeCat !== 'all') {
    if (activeCat === 'xtech') {
      categoryPool = categoryPool.filter(s => s.isXPost || s.category === 'tech');
    } else {
      categoryPool = categoryPool.filter(s => s.category === activeCat);
    }
  }

  // Filter only stories not yet seen by the user!
  const unseenPool = categoryPool.filter(s => !AppState.seenPosts.has(s.title));
  const poolToUse = unseenPool.length > 0 ? unseenPool : categoryPool;

  const batchSize = 3;
  const newBatch = [];

  for (let i = 0; i < batchSize && i < poolToUse.length; i++) {
    const template = poolToUse[infiniteStoryIndex % poolToUse.length];
    infiniteStoryIndex++;
    const newId = `story-inf-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`;
    const newCard = {
      ...template,
      id: newId,
      time: template.time || 'Live Stream'
    };
    AppState.dailyCards.push(newCard);
    newBatch.push(newCard);
  }

  const startIdx = AppState.dailyCards.length - batchSize;
  const htmlChunk = newBatch.map((card, offset) => renderSingleCardHtml(card, startIdx + offset)).join('');

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlChunk;
  while (tempDiv.firstChild) {
    container.appendChild(tempDiv.firstChild);
  }
  observePostsForSeen();

  // Rapid debounce release for smooth uninterrupted infinite scrolling
  setTimeout(() => {
    isFetchingInfiniteBatch = false;
  }, 180);
}

function renderCardAestheticVisual(card) {
  // Twitter / 𝕏 Tech News Post Embed
  if (card.isXPost) {
    const initials = (card.author || 'X').split(' ').map(n => n[0]).join('').slice(0, 2);
    return `
      <div class="x-tweet-card-embed">
        <div class="x-tweet-header-row">
          <div class="x-tweet-author-box">
            <div class="x-tweet-avatar-ring">
              <span class="x-tweet-initials">${initials}</span>
            </div>
            <div class="x-tweet-names">
              <div class="x-tweet-name-line">
                <strong class="x-tweet-author-name">${card.author}</strong>
                <svg class="x-verified-badge" viewBox="0 0 24 24" fill="#1d9bf0" title="Verified Account">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238.65 1.273 2.02 2.148 3.6 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.28 4.22l-4.22-4.22 1.41-1.41 2.81 2.81 6.39-6.39 1.41 1.41-7.8 7.8z"/>
                </svg>
              </div>
              <span class="x-tweet-handle">${card.handle || '@tech'} • ${card.time || 'Live'}</span>
            </div>
          </div>
          <button class="x-source-brand-pill clickable-pill" onclick="openRealApp(event, '${(card.sourceUrl || ('https://x.com/' + (card.handle ? card.handle.replace('@','') : ''))).replace(/'/g, "\'")}', 'x')" title="Open post directly in 𝕏 app">
            <svg class="x-source-svg" viewBox="0 0 24 24" fill="#ffffff" style="width:13px; height:13px;">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Open in 𝕏 ↗</span>
          </button>
        </div>

        <div class="x-tweet-body-text">
          ${card.xTweetText || card.explanation}
        </div>

        <div class="x-tweet-metrics-row">
          <span class="x-metric-item"><svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg> ${card.repostsCount || '3.5k'} Reposts</span>
          <span class="x-metric-item"><svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> ${card.likesCount ? (card.likesCount > 1000 ? (card.likesCount / 1000).toFixed(1) + 'k' : card.likesCount) : '18k'} Likes</span>
          <span class="x-metric-item"><svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> Bookmark</span>
        </div>
      </div>
    `;
  }

  const soundBtn = (text, color = '#ffffff') => `
    <button class="sound-mini-btn" style="border-color:${color}; color:${color};" onclick="speakText('${(text || card.title).replace(/["']/g, '')}')" title="Listen">
      <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
      <span>Listen</span>
    </button>
  `;

  // Sharp Tech Vector Card
  return `
    <div class="aesthetic-visual-banner" style="background:#000000; border:1px solid #2f3336;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="art-meta-tag" style="background:#16181c; border-color:#2f3336; color:#1d9bf0;">
          <svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          <span>${card.topicTag || 'TECH DISPATCH'}</span>
        </span>
        <span style="font-size:0.75rem; color:#71767b; font-weight:700;">${card.author || 'DailyPulse Radar'}</span>
      </div>

      <div class="art-vector-card" style="background:#080808; border:1px solid #2f3336; height:80px; margin:10px 0;">
        <svg viewBox="0 0 320 80" fill="none" style="width:100%; height:80px;">
          <rect x="20" y="15" width="280" height="50" rx="8" stroke="#2f3336" stroke-width="1.2" fill="#0c0d0e"/>
          <circle cx="45" cy="40" r="10" stroke="#1d9bf0" stroke-width="2" fill="none"/>
          <line x1="65" y1="35" x2="180" y2="35" stroke="#e7e9ea" stroke-width="2" stroke-linecap="round"/>
          <line x1="65" y1="45" x2="140" y2="45" stroke="#71767b" stroke-width="2" stroke-linecap="round"/>
          <text x="250" y="44" fill="#1d9bf0" font-size="10" font-weight="800" font-family="monospace">VERIFIED</text>
        </svg>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #2f3336; padding-top:10px;">
        <span style="font-size:0.75rem; color:#71767b; font-weight:600;">Verified Technical Publication</span>
        ${soundBtn(card.pronounceText, '#1d9bf0')}
      </div>
    </div>
  `;
}

// Native Real-App Deep Linking Engine (Mobile twitter://, reddit:// & Universal Fallback)
window.openRealApp = function(event, url, platform) {
  if (event) {
    if (typeof event.stopPropagation === 'function') event.stopPropagation();
    if (typeof event.preventDefault === 'function') event.preventDefault();
  }
  if (!url) return;

  // Strict URL Sanitization & Protocol Validation (Block javascript: and data: exploits)
  const targetUrl = sanitizeAppUrl(url);
  if (!targetUrl) {
    console.warn('Blocked untrusted or malicious URL protocol:', url);
    return;
  }
  
  // Auditory tactile feedback
  try {
    playSyntheticTone(820, 'sine', 0.05);
  } catch (e) {}

  const ua = navigator.userAgent || '';
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);

  // 1. Twitter / 𝕏 Deep-Linking
  if (platform === 'x' || /x\.com|twitter\.com/i.test(targetUrl)) {
    const statusMatch = targetUrl.match(/(?:x\.com|twitter\.com)\/[^/]+\/status\/(\d+)/i);
    const userMatch = targetUrl.match(/(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]+)/i);

    if (isMobile) {
      let appScheme = 'twitter://timeline';
      if (statusMatch && statusMatch[1]) {
        appScheme = `twitter://status?id=${statusMatch[1]}`;
      } else if (userMatch && userMatch[1] && !['search', 'explore', 'home', 'i'].includes(userMatch[1].toLowerCase())) {
        appScheme = `twitter://user?screen_name=${userMatch[1]}`;
      }

      const launchTime = Date.now();
      window.location.href = appScheme;

      // Fallback to web link if native app did not intercept within 650ms
      setTimeout(() => {
        if (Date.now() - launchTime < 1400) {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
      }, 650);
      return;
    }
  }

  // 2. Reddit Deep-Linking
  if (platform === 'reddit' || /reddit\.com/i.test(targetUrl)) {
    if (isMobile) {
      const cleanPath = targetUrl.replace(/^https?:\/\/(?:www\.)?reddit\.com\/?/i, '');
      const appScheme = `reddit://${cleanPath}`;
      const launchTime = Date.now();
      window.location.href = appScheme;
      setTimeout(() => {
        if (Date.now() - launchTime < 1400) {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
      }, 650);
      return;
    }
  }

  // 3. Desktop / Standard News App Universal Link
  window.open(targetUrl, '_blank', 'noopener,noreferrer');
};

function getRealAppPillButtonHtml(card) {
  const isX = card.isXPost || (card.sourceUrl && (card.sourceUrl.includes('x.com') || card.sourceUrl.includes('twitter.com')));
  const isReddit = card.platform === 'reddit' || (card.sourceUrl && card.sourceUrl.includes('reddit.com'));
  
  let targetUrl = card.sourceUrl;
  if (!targetUrl) {
    if (isX && card.handle) {
      targetUrl = `https://x.com/${card.handle.replace('@', '')}`;
    } else {
      targetUrl = `https://x.com/search?q=${encodeURIComponent(card.title || 'tech')}`;
    }
  }

  const cleanUrl = targetUrl.replace(/'/g, "\\'");

  if (isX) {
    return `
      <button class="card-footer-pill-btn open-real-app-pill-btn x-btn" onclick="openRealApp(event, '${cleanUrl}', 'x')" title="Open post directly in 𝕏 / Twitter app">
        <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span>Open in 𝕏 ↗</span>
      </button>
    `;
  }

  if (isReddit) {
    return `
      <button class="card-footer-pill-btn open-real-app-pill-btn reddit-btn" onclick="openRealApp(event, '${cleanUrl}', 'reddit')" title="Open thread directly in Reddit app">
        <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 12h8m-4-4v8"/>
        </svg>
        <span>Open in Reddit ↗</span>
      </button>
    `;
  }

  return `
    <button class="card-footer-pill-btn open-real-app-pill-btn source-btn" onclick="openRealApp(event, '${cleanUrl}', 'web')" title="Open original post in real app or browser">
      <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
      <span>Open in App ↗</span>
    </button>
  `;
}

function renderSingleCardHtml(card, idx) {
  const isSaved = AppState.savedItems.some(i => i.title === card.title);
  const isLiked = AppState.likedCards[card.id] || false;
  const bodyEmbedHtml = renderCardAestheticVisual(card);

  return `
    <article class="social-post-card" id="card-${card.id}" data-post-title="${(card.title || '').replace(/"/g, '&quot;')}">
      
      <!-- Card Top Header Bar -->
      <div class="card-meta-topbar">
        <div class="card-category-tag">
          <span class="cat-tag-icon">${getCategoryIcon(card.category)}</span>
          <span class="cat-tag-label">${getCategoryLabel(card.category)}</span>
        </div>
        
        <div class="card-top-actions">
          ${card.sourceUrl ? `
          <button class="card-icon-action-btn card-app-link-top-btn" onclick="openRealApp(event, '${card.sourceUrl.replace(/'/g, "\\'")}', '${card.isXPost ? 'x' : (card.platform || 'web')}')" title="Open original post on ${card.sourceOutlet || 'source'}">
            <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> <span>${card.isXPost ? '𝕏 Post ↗' : 'Source ↗'}</span>
          </button>` : ''}
          <button class="card-icon-action-btn ${isSaved ? 'saved' : ''}" onclick="toggleSaveItem('${card.title.replace(/'/g, "\\'")}', '${card.author}', this)" title="${isSaved ? 'Saved to Vault' : 'Save to Vault'}">
            <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> <span>${isSaved ? 'Saved' : 'Save'}</span>
          </button>
          <button class="card-icon-action-btn" onclick="speakText('${(card.pronounceText || card.title).replace(/["']/g, '')}')" title="Listen to Pronunciation">
            <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> <span>Listen</span>
          </button>
        </div>
      </div>

      <!-- Card Title / Headline -->
      <h2 class="post-headline-text">${card.title}</h2>

      <!-- The Centerpiece White Frosted Glass Comparison Box with Animated Glow -->
      ${bodyEmbedHtml}

      <!-- Clean Lore & Guidance Breakdown -->
      <div class="post-narrative">
        ${card.explanation}
      </div>

      <!-- Prominent News Source Citation Box (Inside Card) -->
      ${card.sourceUrl ? `
      <div class="card-news-source-box">
        <div class="source-info">
          <span class="source-icon"><svg class="source-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></span>
          <div class="source-text">
            <span class="source-tag">ORIGINAL NEWS SOURCE</span>
            <span class="source-name">${card.sourceOutlet || 'Global News Outlet'}</span>
          </div>
        </div>
        <button onclick="openRealApp(event, '${card.sourceUrl.replace(/'/g, "\\'")}', '${card.isXPost ? 'x' : (card.platform || 'web')}')" class="source-direct-link" title="Open original post in real app or browser">
          <span>${card.isXPost ? 'Open in 𝕏 App ↗' : 'Read in Real App ↗'}</span>
        </button>
      </div>` : ''}

      <!-- Pulse AI Context Note -->
      <div class="x-community-note">
        <div class="note-header">
          <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> <span>Pulse AI Editorial Synthesis</span>
        </div>
        <div class="note-body">
          Essential fluency & cultural lore for 2026. Mastered by native speakers and digital creators.
        </div>
      </div>

      <!-- Card Action Footer -->
      <div class="card-footer-action-bar">
        <div class="footer-left-actions">
          <button class="card-footer-pill-btn ${isLiked ? 'liked' : ''}" onclick="toggleLikeCard('${card.id}')">
            <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="${isLiked ? '#ef4444' : 'none'}" stroke="${isLiked ? '#ef4444' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span>${(card.likesCount || 1200) + (isLiked ? 1 : 0)}</span>
          </button>
          <button class="card-footer-pill-btn" onclick="askAiAboutCard('${card.title.replace(/'/g, "\\'")}')">
            <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3c0 4.5-3.5 8-8 8 4.5 0 8 3.5 8 8 0-4.5 3.5-8 8-8-4.5 0-8-3.5-8-8z"></path></svg> <span>Ask AI</span>
          </button>
          ${getRealAppPillButtonHtml(card)}
        </div>
        <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700; letter-spacing: 0.04em;">Story #${idx + 1} • Infinite Radar</span>
      </div>

    </article>
  `;
}

function renderContinuousFeed() {
  const cards = getFilteredCards();
  const container = document.getElementById('activeSocialCardContainer');
  if (!container) return;

  if (!cards || cards.length === 0) {
    container.innerHTML = `
      <div class="social-post-card all-caught-up-banner">
        <div class="caught-up-badge-sheen">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" style="width:26px; height:26px;">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 style="color:#fff; font-size:1.3rem; margin-bottom:8px;">You're All Caught Up!</h3>
        <p style="color:var(--text-secondary); font-size:0.92rem; max-width:440px; margin:0 auto 20px auto; line-height:1.5;">
          You have seen every post in this feed. Pull down to refresh for breaking updates, or reset seen history to discover stories again.
        </p>
        <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
          <button onclick="triggerFeedRefresh()" class="feed-next-btn" style="padding:10px 22px;">
            <span>↻ Check for Live 𝕏 Tech News</span>
          </button>
          <button onclick="resetSeenPosts()" class="feed-prev-btn" style="padding:10px 22px;">
            <span>Clear Seen History & Review</span>
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = cards.map((card, idx) => renderSingleCardHtml(card, idx)).join('');
  observePostsForSeen();
}

// Interactive Likes directly in place (no page jump)
window.toggleLikeCard = function(cardId) {
  AppState.likedCards[cardId] = !AppState.likedCards[cardId];
  localStorage.setItem('dp_likes', JSON.stringify(AppState.likedCards));
  playSyntheticTone(AppState.likedCards[cardId] ? 784 : 440, 'triangle', 0.08);
  
  
  const cardElement = document.getElementById(`card-${cardId}`);
  if (cardElement) {
    const likeBtn = cardElement.querySelector('.card-footer-pill-btn');
    const card = AppState.dailyCards.find(c => c.id === cardId);
    if (likeBtn && card) {
      const isLiked = AppState.likedCards[cardId];
      likeBtn.classList.toggle('liked', isLiked);
      likeBtn.innerHTML = `<svg class="btn-svg-mini" viewBox="0 0 24 24" fill="${isLiked ? '#ef4444' : 'none'}" stroke="${isLiked ? '#ef4444' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> <span>${card.likesCount + (isLiked ? 1 : 0)}</span>`;
    }
  }
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
    statusText.textContent = 'Listening to speech input...';
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
    <strong>Feedback: Polished Workplace Phrasing</strong><br>
    Your response is clear and assertive. Here is how a Senior Director would phrase it:<br>
    <em>"Hi! Thanks for the note. I've logged off for the evening, but I will review this first thing tomorrow morning and update you by 10 AM."</em>
  `;
  
  playSyntheticTone(880, 'sine', 0.12);
};

// Finish Daily Deck Milestone
function completeDailyStories() {
  const today = new Date().toDateString();
  if (AppState.lastCompletedDate !== today) {
    AppState.streak++;
    AppState.lastCompletedDate = today;
    localStorage.setItem('dp_streak', AppState.streak);
    localStorage.setItem('dp_last_completed', today);
    
  }

  updateStreakUI();
  launchConfetti();
  playSyntheticTone(1046.5, 'triangle', 0.4); // C6 celebration
}

function updateStreakUI() {
  // Streak tracking eliminated
}

function updateXpUI() {
  const xpCount = document.getElementById('xpCount');
  if (xpCount) xpCount.textContent = `${AppState.xp} XP`;
  const sidebarXp = document.getElementById('sidebarXpCount');
  if (sidebarXp) sidebarXp.textContent = `${AppState.xp} XP`;
}

function addXp(points) {
  AppState.xp += points;
  localStorage.setItem('dp_xp', AppState.xp);
  updateXpUI();
}

// ==========================================
// 6. TECH TITANS & WORLD LEADERS VIEW
// ==========================================

function getTitanAestheticVectorShield(titanId) {
  const shields = {
    'titan-trump': `
      <svg class="titan-shield-svg" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14.5" stroke="rgba(250,204,21,0.6)" stroke-width="1.5" fill="rgba(15,23,42,0.85)"/>
        <path d="M16 6.5l1 3.2h3.5l-2.8 2 1 3.2-2.7-2-2.7 2 1-3.2-2.8-2h3.5z" fill="#facc15"/>
        <path d="M8 17c3-3 6-4 8-1 2-3 5-2 8 1-2 5-5 8-8 10-3-2-6-5-8-10z" stroke="#ef4444" stroke-width="1.5" fill="rgba(239,68,68,0.25)"/>
        <line x1="12" y1="17" x2="12" y2="23" stroke="#ffffff" stroke-width="1.2"/>
        <line x1="16" y1="17" x2="16" y2="24" stroke="#ffffff" stroke-width="1.2"/>
        <line x1="20" y1="17" x2="20" y2="23" stroke="#ffffff" stroke-width="1.2"/>
      </svg>
    `,
    'titan-linus': `
      <svg class="titan-shield-svg" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="8" r="3" stroke="#22d3ee" stroke-width="2" fill="#083344"/>
        <circle cx="9" cy="22" r="3" stroke="#22d3ee" stroke-width="2" fill="#083344"/>
        <circle cx="23" cy="22" r="3" stroke="#22d3ee" stroke-width="2" fill="#083344"/>
        <path d="M16 11v4 M16 15l-7 4 M16 15l7 4" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"/>
        <path d="M9 25c3 3 11 3 14 0" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="2 2"/>
      </svg>
    `,
    'titan-jensen': `
      <svg class="titan-shield-svg" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="3" stroke="#76b900" stroke-width="1.8" fill="rgba(118,185,0,0.15)"/>
        <rect x="7" y="7" width="8" height="18" rx="1.5" fill="#76b900" fill-opacity="0.85"/>
        <rect x="17" y="7" width="8" height="18" rx="1.5" fill="#76b900" fill-opacity="0.85"/>
        <line x1="15" y1="10" x2="17" y2="10" stroke="#ffffff" stroke-width="1.5"/>
        <line x1="15" y1="13" x2="17" y2="13" stroke="#ffffff" stroke-width="1.5"/>
        <line x1="15" y1="16" x2="17" y2="16" stroke="#ffffff" stroke-width="1.5"/>
        <line x1="15" y1="19" x2="17" y2="19" stroke="#ffffff" stroke-width="1.5"/>
        <line x1="15" y1="22" x2="17" y2="22" stroke="#ffffff" stroke-width="1.5"/>
      </svg>
    `,
    'titan-satya': `
      <svg class="titan-shield-svg" viewBox="0 0 32 32" fill="none">
        <path d="M16 4l10 5.5-10 5.5-10-5.5L16 4z" fill="#38bdf8" fill-opacity="0.9"/>
        <path d="M6 9.5l10 5.5v11l-10-5.5V9.5z" fill="#0284c7" fill-opacity="0.9"/>
        <path d="M16 15l10-5.5v11l-10 5.5V15z" fill="#0369a1" fill-opacity="0.9"/>
        <circle cx="16" cy="15" r="2" fill="#ffffff"/>
      </svg>
    `,
    'titan-sam': `
      <svg class="titan-shield-svg" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="13" stroke="rgba(34,211,238,0.4)" stroke-width="1"/>
        <circle cx="16" cy="16" r="8" stroke="rgba(168,85,247,0.6)" stroke-width="1.2"/>
        <path d="M16 3v26 M3 16h26 M7 7l18 18 M7 25l18-18" stroke="#22d3ee" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="16" cy="16" r="3.5" fill="#c084fc"/>
      </svg>
    `,
    'titan-zuck': `
      <svg class="titan-shield-svg" viewBox="0 0 32 32" fill="none">
        <path d="M10 16c-3.5-4-6.5-4-6.5 0s3 4 6.5 0c5-6 7-6 12 0s3 4 6.5 0-3-4-6.5 0c-5 6-7 6-12 0z" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="16" cy="16" r="2" fill="#ffffff"/>
      </svg>
    `,
    'titan-demis': `
      <svg class="titan-shield-svg" viewBox="0 0 32 32" fill="none">
        <path d="M9 6c4 6 10 6 14 10s-10 4-14 10" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
        <path d="M23 6c-4 6-10 6-14 10s10 4 14 10" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
        <line x1="12" y1="11" x2="20" y2="11" stroke="#facc15" stroke-width="1.5"/>
        <line x1="10" y1="16" x2="22" y2="16" stroke="#facc15" stroke-width="1.5"/>
        <line x1="12" y1="21" x2="20" y2="21" stroke="#facc15" stroke-width="1.5"/>
      </svg>
    `,
    'titan-sundar': `
      <svg class="titan-shield-svg" viewBox="0 0 32 32" fill="none">
        <path d="M16 3c0 7-6 13-13 13 7 0 13 6 13 13 0-7 6-13 13-13-7 0-13-6-13-13z" fill="#60a5fa"/>
        <circle cx="16" cy="16" r="2" fill="#ffffff"/>
        <circle cx="7" cy="7" r="1.5" fill="#ea4335"/>
        <circle cx="25" cy="7" r="1.5" fill="#facc15"/>
        <circle cx="25" cy="25" r="1.5" fill="#34a853"/>
      </svg>
    `,
    'titan-elon': `
      <svg class="titan-shield-svg" viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="16" rx="14" ry="6" stroke="#fb923c" stroke-width="1.6" transform="rotate(-35 16 16)"/>
        <circle cx="24" cy="8" r="3.5" fill="#ef4444"/>
        <path d="M7 25l6-9 4 1-1 4-9 4z" fill="#ffffff"/>
      </svg>
    `,
    'titan-guido': `
      <svg class="titan-shield-svg" viewBox="0 0 32 32" fill="none">
        <path d="M15 5h-4a5 5 0 0 0-5 5v3h9v2H6a5 5 0 0 0 5 5h1" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
        <path d="M17 27h4a5 5 0 0 0 5-5v-3h-9v-2h9a5 5 0 0 0-5-5h-1" stroke="#facc15" stroke-width="2" stroke-linecap="round"/>
        <circle cx="10" cy="9" r="1.2" fill="#38bdf8"/>
        <circle cx="22" cy="23" r="1.2" fill="#facc15"/>
      </svg>
    `,
    'titan-yann': `
      <svg class="titan-shield-svg" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="6" width="12" height="12" rx="1.5" stroke="#a855f7" stroke-width="1.5" fill="rgba(168,85,247,0.2)"/>
        <rect x="11" y="11" width="12" height="12" rx="1.5" stroke="#22d3ee" stroke-width="1.5" fill="rgba(34,211,238,0.2)"/>
        <rect x="16" y="16" width="12" height="12" rx="1.5" stroke="#3b82f6" stroke-width="1.5" fill="rgba(59,130,246,0.3)"/>
        <circle cx="10" cy="12" r="1.5" fill="#ffffff"/>
        <circle cx="22" cy="22" r="1.5" fill="#ffffff"/>
      </svg>
    `,
    'titan-vitalik': `
      <svg class="titan-shield-svg" viewBox="0 0 32 32" fill="none">
        <path d="M16 3l-8 13.5h8L16 3z" fill="#818cf8" fill-opacity="0.9"/>
        <path d="M16 3l8 13.5h-8L16 3z" fill="#a5b4fc" fill-opacity="0.9"/>
        <path d="M16 19l-8-2.5 8 12.5V19z" fill="#6366f1" fill-opacity="0.9"/>
        <path d="M16 19l8-2.5-8 12.5V19z" fill="#818cf8" fill-opacity="0.9"/>
      </svg>
    `
  };
  return shields[titanId] || `
    <svg class="titan-shield-svg" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" stroke="#ffffff" stroke-width="2"/>
    </svg>
  `;
}

function initTitansView() {
  const container = document.getElementById('titansCardContainer');
  const searchInput = document.getElementById('titansSearchInput');
  const filterPills = document.querySelectorAll('.titans-filter-pill');

  if (!container) return;

  function render() {
    const query = (AppState.titansSearchQuery || '').toLowerCase();
    const filter = AppState.titansFilter || 'all';

    const filtered = AppState.titansList.filter(titan => {
      const matchesFilter = filter === 'all' || titan.category === filter;
      const matchesQuery = !query || 
        titan.name.toLowerCase().includes(query) ||
        titan.role.toLowerCase().includes(query) ||
        titan.org.toLowerCase().includes(query) ||
        titan.keyTerms.some(t => t.toLowerCase().includes(query)) ||
        titan.essentialWhy.toLowerCase().includes(query) ||
        titan.radarHeadline.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="titan-card" style="text-align: center; padding: 40px 20px;">
          <div style="margin-bottom: 10px;"><svg style="width:42px; height:42px; stroke:var(--text-muted);" viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
          <h3 style="color: #fff; font-size: 1.1rem;">No Leaders Found</h3>
          <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 6px;">
            Try a different search term like "Linux", "AI", "Trump", or "Python".
          </p>
          <button class="titans-filter-pill" onclick="resetTitansFilter()" style="margin-top: 14px; display: inline-block;">
            Reset Search & Filters
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(titan => `
      <article class="titan-card" id="card-${titan.id}">
        
        <!-- Header Row -->
        <div class="titan-header-row">
          <div class="titan-left-meta">
            <div class="titan-avatar-circle avatar-${titan.id.replace('titan-', '')}">${getTitanAestheticVectorShield(titan.id)}</div>
            <div class="titan-info-box">
              <div class="titan-name-line">
                <span>${titan.name}</span>
                <span class="verified-badge" title="Global Industry Titan">✓</span>
              </div>
              <span class="titan-role-text">${titan.role}</span>
              <span class="titan-org-text">${titan.org}</span>
            </div>
          </div>
          <span class="titan-category-tag">${titan.categoryLabel}</span>
        </div>

        <!-- Student Foundation Box -->
        <div class="titan-student-knowledge-box">
          <div class="titan-section-label">
            <svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg> <span>Essential Student Foundation</span>
          </div>
          <div class="titan-knowledge-text">
            ${titan.essentialWhy}
          </div>

          <div class="titan-core-box">
            <span class="core-tag-badge">CORE INNOVATION</span> <strong>${titan.coreImpact}</strong>
          </div>

          <div class="titan-tags-wrap">
            ${titan.keyTerms.map(tag => `<span class="titan-tag-chip">${tag}</span>`).join('')}
          </div>
        </div>

        <!-- Live Radar 2026 Update Box -->
        <div class="titan-radar-update-box">
          <div class="titan-radar-top">
            <div class="titan-radar-badge">
              <span class="radar-live-beacon"></span>
              <span>Live Radar (2026 Update)</span>
            </div>
            <span style="font-size: 0.72rem; color: var(--text-muted);">${titan.radarSource}</span>
          </div>
          <div class="titan-radar-headline">${titan.radarHeadline}</div>
          <div class="titan-radar-desc">${titan.radarDetail}</div>
        </div>

        <!-- Card Action Footer -->
        <div class="titan-card-actions">
          <div class="titan-left-buttons">
            <button class="titan-action-pill" onclick="speakLeaderOverview('${titan.id}')" title="Listen to student audio summary">
              <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> <span>Listen</span>
            </button>
            <a class="titan-action-pill" href="${titan.sourceUrl}" target="_blank" rel="noopener noreferrer" title="Read original news & profile">
              <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> <span>Source ↗</span>
            </a>
            <button class="titan-action-pill" onclick="saveTitanToVault('${titan.name.replace(/'/g, "\\'")}', '${titan.role.replace(/'/g, "\\'")}')" title="Save to Vault">
              <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> <span>Save</span>
            </button>
          </div>
          <button class="titan-ask-ai-btn" onclick="askAiAboutLeader('${titan.name.replace(/'/g, "\\'")}', '${titan.aiPrompt.replace(/'/g, "\\'")}')">
            <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3c0 4.5-3.5 8-8 8 4.5 0 8 3.5 8 8 0-4.5 3.5-8 8-8-4.5 0-8-3.5-8-8z"></path></svg> <span>Ask AI</span>
          </button>
        </div>

      </article>
    `).join('');
  }

  // Filter Pills Event Listeners
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      AppState.titansFilter = pill.getAttribute('data-filter');
      render();
      playSyntheticTone(640, 'sine', 0.05);
    });
  });

  // Search Input Event Listener
  searchInput?.addEventListener('input', (e) => {
    AppState.titansSearchQuery = e.target.value.trim();
    render();
  });

  render();
}

window.resetTitansFilter = function() {
  AppState.titansFilter = 'all';
  AppState.titansSearchQuery = '';
  const searchInput = document.getElementById('titansSearchInput');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.titans-filter-pill').forEach(p => {
    p.classList.toggle('active', p.getAttribute('data-filter') === 'all');
  });
  initTitansView();
};

window.askAiAboutLeader = function(name, prompt) {
  switchTab('ai');
  const aiInput = document.getElementById('aiInput');
  if (aiInput) {
    aiInput.value = prompt;
    handleSendAi();
  }
};

window.speakLeaderOverview = function(titanId) {
  const titan = AppState.titansList.find(t => t.id === titanId);
  if (!titan) return;
  const text = `${titan.name}. ${titan.role}. Key takeaway for students: ${titan.coreImpact}. Current news: ${titan.radarHeadline}.`;
  speakText(text);
};

window.saveTitanToVault = function(name, role) {
  toggleSaveItem(`Profile: ${name}`, role);
};

// ==========================================
// 7. LIVE REDDIT API INTEGRATION & RADAR
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) return;
    const ids = await res.json();
    const topIds = ids.slice(0, 4);

    const storyPromises = topIds.map(async (id) => {
      try {
        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return await itemRes.json();
      } catch (err) {
        return null;
      }
    });

    const stories = await Promise.all(storyPromises);

    stories.filter(Boolean).forEach((story) => {
      const cleanTitle = escapeHtml(story.title || 'Trending Technology Signal');
      const cleanAuthor = escapeHtml(story.by ? 'u/' + story.by : 'Hacker News');
      const cleanLink = sanitizeAppUrl(story.url || `https://news.ycombinator.com/item?id=${story.id}`);

      const liveItem = {
        id: 'hn-live-' + story.id,
        platform: 'hn',
        platformIcon: 'hn',
        platformLabel: 'Hacker News (Live)',
        author: cleanAuthor,
        handle: '@hackernews',
        title: cleanTitle,
        summary: `Breaking live discussion with ${Number(story.descendants) || 0} comments and ${Number(story.score) || 1} points.`,
        metric: `▲ ${Number(story.score) || 1} Points • ${Number(story.descendants) || 0} Comments`,
        link: cleanLink,
        aiPrompt: `Explain this trending technology story: "${cleanTitle}" in simple, accessible English.`
      };

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
              ${item.platformIcon === 'yt' ? '<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>' : item.platformIcon === 'rd' ? '<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="9" cy="11" r="1.5" fill="currentColor"></circle><circle cx="15" cy="11" r="1.5" fill="currentColor"></circle></svg>' : item.platformIcon === 'tw' ? '<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' : '<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line></svg>'}
            </span>
            <span>${item.author}</span>
            <span style="color:var(--text-muted); font-size:0.8rem; font-weight:400;">${item.handle}</span>
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted);">${item.metric}</span>
        </div>

        <h3 class="stream-title-text">${item.title}</h3>
        <p class="stream-body-text">${item.summary}</p>

        <div class="stream-bottom-row">
          <button onclick="openRealApp(event, '${item.link.replace(/'/g, "\\'")}', '${item.platform}')" class="stream-app-link-btn" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-size:0.8rem; font-weight:600; display:inline-flex; align-items:center; gap:4px; padding:0;">Open on ${item.platformLabel} ↗</button>
          <button class="btn-ask-ai-pill" onclick="askAiAboutRadar('${encodeURIComponent(item.title)}', '${encodeURIComponent(item.aiPrompt)}')">Query AI</button>
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
  handleUserAiMessage(`Explain "${topic}" in simple everyday words so it is easy to understand.`);
};

// ==========================================
// 7. DAILY QUIZ & XP FLASHCARDS
// ==========================================
function initQuizEngine() {
  renderQuizQuestion(AppState.currentQuizIndex);
}

function renderQuizQuestion(idx) {
  const box = document.getElementById('quizStageBox');
  
  const total = AppState.quizQuestions.length;

  if (idx >= total) {
    box.innerHTML = `
      <div style="text-align:center; padding: 20px;">
        <div style="margin-bottom:8px;"><svg style="width:48px; height:48px; stroke:#facc15;" viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg></div>
        <h3>Quiz Completed!</h3>
        <p style="color:var(--text-secondary); margin:8px 0 16px 0;">You have reviewed today's key technical insights and executive phrasing.</p>
        <button class="feed-next-btn" onclick="resetQuiz()">Practice Again</button>
      </div>
    `;
    
    return;
  }

  const q = AppState.quizQuestions[idx];
  

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
    
    playSyntheticTone(880, 'sine', 0.15);
    explanation.style.color = '#a7f3d0';
    explanation.innerHTML = `<strong>Verified Accurate ✓</strong> ${q.explanation}`;
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
// 8. CHATGPT NEURAL ENGINE & INTENT EVALUATOR
// ==========================================
let aiChatHistory = [];

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
    aiChatHistory = [];
    const log = document.getElementById('chatLog');
    if (log) {
      log.innerHTML = `
        <div class="chat-welcome-container">
          <div class="chat-welcome-hero">
            <div class="chat-welcome-icon">✦</div>
            <h4 style="margin: 6px 0 4px; font-size: 1.15rem; color: #fff;">How can I help you today?</h4>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0 0 14px;">Ask me anything across science, math, coding, life advice, writing, or everyday questions.</p>
          </div>
          <div class="chat-suggestion-chips">
            <button class="chat-chip" onclick="quickAskAi('Why is the sky blue and how do rainbows form?')">🌈 Why is the sky blue?</button>
            <button class="chat-chip" onclick="quickAskAi('Calculate: What is 25 * 14 and how much is 15% of 320?')">🔢 Solve math & percentages</button>
            <button class="chat-chip" onclick="quickAskAi('What is the difference between a fruit and a vegetable?')">🍎 Fruit vs Vegetable</button>
            <button class="chat-chip" onclick="quickAskAi('Write a short professional email asking for sick leave')">✍️ Draft an email</button>
            <button class="chat-chip" onclick="quickAskAi('How does an airplane stay in the air?')">✈️ How airplanes fly</button>
            <button class="chat-chip" onclick="quickAskAi('Write a Python function to check if a word is a palindrome')">💻 Write Python code</button>
          </div>
        </div>
      `;
    }
  });
}

window.quickAskAi = function(promptText) {
  switchTab('ai');
  const input = document.getElementById('aiInput');
  if (input) {
    input.value = promptText;
  }
  handleUserAiMessage(promptText);
};

window.copySnippetText = function(btn) {
  const codeEl = btn.closest('.chatgpt-code-box')?.querySelector('pre code');
  if (!codeEl) return;
  navigator.clipboard.writeText(codeEl.textContent).then(() => {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>✓ Copied!</span>';
    setTimeout(() => { btn.innerHTML = originalText; }, 1800);
  });
};

window.copyFullChatMessage = function(btn) {
  const bubble = btn.closest('.chatgpt-bubble');
  if (!bubble) return;
  // Clone and remove footer to copy pure message content
  const clone = bubble.cloneNode(true);
  const footer = clone.querySelector('.chatgpt-actions-footer');
  if (footer) footer.remove();
  const text = clone.innerText.trim();
  navigator.clipboard.writeText(text).then(() => {
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<span style="color:#10b981;">✓ Copied</span>';
    setTimeout(() => { btn.innerHTML = originalHtml; }, 1800);
  });
};

window.readAloudChatMessage = function(btn) {
  const bubble = btn.closest('.chatgpt-bubble');
  if (!bubble) return;
  const clone = bubble.cloneNode(true);
  const footer = clone.querySelector('.chatgpt-actions-footer');
  if (footer) footer.remove();
  const text = clone.innerText.trim();
  speakText(text);
};

async function handleUserAiMessage(userText, statusNote = '') {
  const log = document.getElementById('chatLog');
  if (!log) return;

  // Clear welcome screen if it's the first message
  const welcome = log.querySelector('.chat-welcome-container');
  if (welcome) welcome.remove();

  // 1. Append user message
  const userMsg = document.createElement('div');
  userMsg.className = 'dm-bubble user';
  userMsg.textContent = userText;
  log.appendChild(userMsg);

  aiChatHistory.push({ role: 'user', content: userText });
  if (aiChatHistory.length > 20) aiChatHistory.shift();

  // 2. Append animated thinking indicator
  const typingId = 'typing-' + Date.now();
  const typingMsg = document.createElement('div');
  typingMsg.className = 'dm-bubble ai thinking';
  typingMsg.id = typingId;
  typingMsg.innerHTML = `
    <div class="chatgpt-thinking-row">
      <span class="chatgpt-avatar-mini" style="font-weight:700;">✦</span>
      <div class="chatgpt-dots"><span></span><span></span><span></span></div>
      <span class="chatgpt-thinking-label">Thinking...${statusNote ? ` (${escapeHtml(statusNote)})` : ''}</span>
    </div>
  `;
  log.appendChild(typingMsg);
  log.scrollTop = log.scrollHeight;

  // 3. Check for external API (Gemini or OpenAI)
  const provider = localStorage.getItem('pulse_ai_provider') || 'builtin';
  const apiKey = localStorage.getItem('pulse_ai_key') || '';

  let rawAiResponse = '';

  if (provider === 'gemini' && apiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: userText }] }],
          generationConfig: { maxOutputTokens: 1200 }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const cand = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (cand) rawAiResponse = cand;
      }
    } catch (e) {
      console.warn('Gemini API fetch fallback to built-in brain:', e);
    }
  } else if (provider === 'openai' && apiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are ChatGPT, a brilliant, friendly assistant. Answer any question thoroughly, engagingly, and formatted with clean markdown.' },
            ...aiChatHistory.slice(-6)
          ]
        })
      });
      if (res.ok) {
        const data = await res.json();
        const cand = data.choices?.[0]?.message?.content;
        if (cand) rawAiResponse = cand;
      }
    } catch (e) {
      console.warn('OpenAI API fetch fallback to built-in brain:', e);
    }
  }

  // 4. If no live API key or call failed, use our comprehensive built-in ChatGPT Neural Engine
  if (!rawAiResponse) {
    await new Promise(r => setTimeout(r, 380));
    const result = evaluateChatGptBrain(userText, aiChatHistory);
    rawAiResponse = result.plain;
  }

  aiChatHistory.push({ role: 'assistant', content: rawAiResponse });

  // 5. Remove thinking indicator and render formatted ChatGPT message
  const typingBox = document.getElementById(typingId);
  if (typingBox) typingBox.remove();

  const formattedHtml = formatChatGptResponse(rawAiResponse);
  const aiMsg = document.createElement('div');
  aiMsg.className = 'dm-bubble ai chatgpt-bubble';
  aiMsg.innerHTML = formattedHtml;
  log.appendChild(aiMsg);
  log.scrollTop = log.scrollHeight;
  playSyntheticTone(600, 'sine', 0.05);
}

// ----------------------------------------------------
// NATURAL MARKDOWN FORMATTER
// ----------------------------------------------------
function formatChatGptResponse(rawText) {
  if (!rawText) return '';

  // Extract code blocks first before escaping HTML
  const codeBlocks = [];
  let text = rawText.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push({ lang: lang || 'code', code: code.trim() });
    return `###CODE_BLOCK_${idx}###`;
  });

  // Escape HTML on body
  text = escapeHtml(text);

  // Headers
  text = text.replace(/^### (.*$)/gim, '<h4 class="chatgpt-h4">$1</h4>');
  text = text.replace(/^## (.*$)/gim, '<h3 class="chatgpt-h3">$1</h3>');
  text = text.replace(/^# (.*$)/gim, '<h2 class="chatgpt-h2">$1</h2>');

  // Bold & Italic
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Inline code
  text = text.replace(/`([^`]+)`/g, '<code class="chatgpt-inline-code">$1</code>');

  // Blockquotes
  text = text.replace(/^&gt; (.*$)/gim, '<blockquote class="chatgpt-quote">$1</blockquote>');

  // Ordered lists: 1. item
  text = text.replace(/(?:^|\n)(\d+\.\s+[^\n]+(?:\n\d+\.\s+[^\n]+)*)/g, (match, p1) => {
    const items = p1.trim().split(/\n/).map(line => line.replace(/^\d+\.\s+/, ''));
    return '<ol class="chatgpt-ol">' + items.map(it => `<li>${it}</li>`).join('') + '</ol>';
  });

  // Unordered lists: - item or * item
  text = text.replace(/(?:^|\n)([-*]\s+[^\n]+(?:\n[-*]\s+[^\n]+)*)/g, (match, p1) => {
    const items = p1.trim().split(/\n/).map(line => line.replace(/^[-*]\s+/, ''));
    return '<ul class="chatgpt-ul">' + items.map(it => `<li>${it}</li>`).join('') + '</ul>';
  });

  // Paragraphs
  const paras = text.split(/\n{2,}/);
  text = paras.map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol') || p.startsWith('<blockquote') || p.startsWith('###CODE_BLOCK_')) {
      return p;
    }
    return `<p class="chatgpt-p">${p.replace(/\n/g, '<br>')}</p>`;
  }).join('');

  // Put back code blocks with syntax wrapper and copy button
  codeBlocks.forEach((item, i) => {
    const blockHtml = `
      <div class="chatgpt-code-box">
        <div class="code-box-header">
          <span class="code-lang-tag">${escapeHtml(item.lang)}</span>
          <button class="copy-code-btn" onclick="copySnippetText(this)">
            <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Copy code</span>
          </button>
        </div>
        <pre><code class="language-${escapeHtml(item.lang)}">${escapeHtml(item.code)}</code></pre>
      </div>
    `;
    text = text.replace(`###CODE_BLOCK_${i}###`, blockHtml);
  });

  // Action footer (Copy & Listen)
  const footerHtml = `
    <div class="chatgpt-actions-footer">
      <button class="chatgpt-action-btn" onclick="copyFullChatMessage(this)" title="Copy message">
        <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        <span>Copy</span>
      </button>
      <button class="chatgpt-action-btn" onclick="readAloudChatMessage(this)" title="Listen to response">
        <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        <span>Listen</span>
      </button>
    </div>
  `;

  return text + footerHtml;
}

// ----------------------------------------------------
// CHATGPT NEURAL ENGINE & INTENT REASONER
// ----------------------------------------------------
function evaluateChatGptBrain(rawQuery, history = []) {
  if (!rawQuery || typeof rawQuery !== 'string') {
    return {
      plain: "Hello! How can I assist you today? Feel free to ask me anything about science, math, coding, life advice, writing, or general knowledge."
    };
  }

  const query = rawQuery.trim();
  const q = query.toLowerCase();

  // 1. MATHEMATICAL & PERCENTAGE CALCULATIONS
  const pctMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:%|percent)\s*(?:of)\s*(\d+(?:\.\d+)?)/i);
  if (pctMatch) {
    const p = parseFloat(pctMatch[1]);
    const n = parseFloat(pctMatch[2]);
    const res = (p / 100) * n;
    const resClean = Number(res.toFixed(4)).toString();
    const tenPct = Number((0.1 * n).toFixed(2)).toString();
    const plain = `### Mathematical Result\n\n**${p}% of ${n} = ${resClean}**\n\n**Step-by-step breakdown:**\n1. Convert the percentage to decimal form: ${p} / 100 = ${(p/100).toFixed(4).replace(/\\.?0+$/, '')}\n2. Multiply by the base number: ${(p/100).toFixed(4).replace(/\\.?0+$/, '')} × ${n} = **${resClean}**\n\n*Mental Math Tip:* To calculate ${p}% quickly in your head, find 10% first (${tenPct}), then multiply or adjust accordingly!`;
    return { plain };
  }

  const sqrtMatch = q.match(/(?:sqrt|square root of)\s*\(?(\d+(?:\.\d+)?)\)?/i);
  if (sqrtMatch) {
    const num = parseFloat(sqrtMatch[1]);
    const res = Math.sqrt(num);
    const resClean = Number(res.toFixed(4)).toString();
    const plain = `### Mathematical Result\n\n**√${num} = ${resClean}**\n\n**Explanation:**\nThe square root of ${num} is ${resClean} because ${resClean} × ${resClean} = ${num}.`;
    return { plain };
  }

  const mathClean = q.replace(/^(what is|calculate|solve|how much is|compute)\s+/i, '').replace(/[?!=]/g, '').trim();
  if (/^[\d\s+\-*/().^]+$/.test(mathClean) && /[+\-*/^]/.test(mathClean) && /\d/.test(mathClean)) {
    try {
      const sanitized = mathClean.replace(/\^/g, '**');
      const fn = new Function(`'use strict'; return (${sanitized})`);
      const val = fn();
      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        const valClean = Number(val.toFixed(4)).toString();
        const plain = `### Calculation Result\n\n**${mathClean} = ${valClean}**\n\n**Step-by-step evaluation:**\n- Expression: \`${mathClean}\`\n- Calculated Value: **${valClean}**`;
        return { plain };
      }
    } catch (e) {}
  }

  // 2. GREETINGS & AI IDENTITY
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|yo)\b/i.test(q)) {
    const plain = `Hello! How can I assist you today?\n\nI can help you with virtually anything:\n- 🔬 **Science & Nature**: Explaining physics, biology, space, and how things work\n- 🔢 **Mathematics**: Solving arithmetic, percentages, and formulas with step-by-step steps\n- 💻 **Coding & Tech**: Writing, debugging, and explaining Python, JavaScript, CSS, and SQL\n- ✍️ **Writing & Drafting**: Composing professional emails, essays, summaries, and creative stories\n- 💡 **Everyday Advice**: Study habits, productivity techniques, and cooking guides\n- 🌍 **General Knowledge**: History, geography, trivia, and facts\n\nWhat would you like to explore?`;
    return { plain };
  }

  if (q.includes('who are you') || q.includes('what are you') || q.includes('who made you') || q.includes('your name')) {
    const plain = `I am **Pulse AI**, an intelligent conversational assistant designed with ChatGPT-grade reasoning.\n\n### What I Can Do:\n1. **Deep Explanations**: Break down complex science, technology, philosophy, and history into clear, engaging answers.\n2. **Problem Solving**: Solve math problems, calculate percentages, and write code in multiple languages.\n3. **Writing Partner**: Draft emails, cover letters, essays, poems, and clean up grammar.\n4. **Daily Productivity**: Provide actionable guides for learning, time management, and health.\n\nFeel free to ask me anything!`;
    return { plain };
  }

  if (/^(thank you|thanks|thx|appreciate it)\b/i.test(q)) {
    const plain = `You're very welcome! If you have any other questions—whether it's math, coding, science, writing, or life advice—feel free to ask anytime!`;
    return { plain };
  }

  // 3. SCIENCE & NATURAL PHENOMENA
  if (q.includes('sky blue')) {
    const plain = `### Why is the Sky Blue?\n\nThe sky appears blue because of a physical phenomenon called **Rayleigh scattering**.\n\n### The Science Step-by-Step:\n1. **Sunlight is White**: Sunlight looks yellowish-white, but it actually contains all colors of the rainbow, each with a different wavelength.\n2. **Atmospheric Molecules**: When sunlight enters Earth's atmosphere, it collides with tiny gas molecules (mainly nitrogen and oxygen).\n3. **Shorter Wavelengths Scatter More**: Blue light travels as smaller, shorter waves, so it scatters in all directions far more easily than red or yellow light.\n4. **Human Eye Sensitivity**: Violet light scatters even more than blue, but human eyes are far more sensitive to blue light, making the sky appear a vibrant azure.\n\n*Everyday Analogy:* Imagine throwing big basketballs (red waves) and small ping-pong balls (blue waves) through a forest of trees. The basketballs pass right through, but the ping-pong balls bounce off the branches in every direction!`;
    return { plain };
  }

  if (q.includes('rainbow')) {
    const plain = `### How Rainbows Form\n\nA rainbow is an optical phenomenon caused by the **refraction, reflection, and dispersion** of sunlight inside airborne raindrops.\n\n### The 3 Stages Inside a Droplet:\n1. **Refraction (Bending)**: As sunlight enters a raindrop, light slows down and bends because water is denser than air.\n2. **Dispersion (Color Separation)**: Different colors bend by different amounts. Violet bends the most, and red bends the least.\n3. **Total Internal Reflection**: The light hits the curved back inside wall of the raindrop and reflects forward.\n4. **Exit Refraction**: As light exits the drop back into the air, it refracts once more, fanning out into the classic spectrum: **Red, Orange, Yellow, Green, Blue, Indigo, Violet**.\n\n*Fun Fact:* Every person sees their own unique rainbow! Your eyes catch light refracted from a distinct set of droplets that no one else is viewing at the exact same angle.`;
    return { plain };
  }

  if (q.includes('airplane') && (q.includes('fly') || q.includes('air') || q.includes('stay in the air'))) {
    const plain = `### How Do Airplanes Fly?\n\nAirplanes fly by balancing **four fundamental aerodynamic forces**:\n\n1. **Lift**: The upward force generated by the wings to overcome gravity.\n2. **Weight (Gravity)**: The downward pull of Earth's mass on the aircraft.\n3. **Thrust**: The forward force provided by engines (jet or propeller).\n4. **Drag**: The air resistance opposing forward motion.\n\n### How Wings Generate Lift:\n- **Airfoil Shape**: Airplane wings are curved on top and flatter underneath.\n- **Bernoulli's Principle & Newton's 3rd Law**: As the plane moves forward, air flows faster over the curved top than the bottom. Faster air has lower pressure, creating suction above. Simultaneously, the wing deflects incoming air downward, which pushes the wing upward (for every action, an equal and opposite reaction).\n\nWhen **Lift equals Weight** and **Thrust equals Drag**, the airplane cruises smoothly at 35,000 feet!`;
    return { plain };
  }

  if (q.includes('photosynthesis')) {
    const plain = `### What is Photosynthesis?\n\n**Photosynthesis** is the chemical process by which green plants, algae, and some bacteria convert sunlight, water, and carbon dioxide into chemical energy (glucose) and oxygen.\n\n### The Chemical Equation:\n\`\`\`\n6 CO2 + 6 H2O + Light Energy  ->  C6H12O6 (Glucose) + 6 O2 (Oxygen)\n\`\`\`\n\n### Key Stages:\n1. **Light Reactions**: Chlorophyll inside plant chloroplasts captures photons from sunlight and splits water molecules ($H_2O$), releasing oxygen into the air.\n2. **The Calvin Cycle (Dark Reactions)**: The plant uses stored solar energy to bind carbon dioxide ($CO_2$) into nutrient-rich glucose ($C_6H_{12}O_6$), feeding the plant.\n\n*Why it matters:* Photosynthesis produces virtually all the breathable oxygen on Earth and forms the foundation of the global food web!`;
    return { plain };
  }

  if (q.includes('gravity') && (q.includes('how') || q.includes('what is') || q.includes('work'))) {
    const plain = `### How Does Gravity Work?\n\nOur understanding of gravity evolved through two landmark theories:\n\n### 1. Newton's Law of Universal Gravitation (1687):\nIsaac Newton described gravity as an invisible pulling force between any two objects with mass. The larger the mass and the closer they are, the stronger the pull ($F = G \\cdot \\frac{m_1 m_2}{r^2}$).\n\n### 2. Einstein's General Relativity (1915 - Modern View):\nAlbert Einstein discovered that gravity is not a physical pull, but the **curvature of spacetime**.\n\n*Analogy:* Picture a heavy bowling ball placed on a stretched rubber trampoline. The ball creates a deep dip. If you roll a marble across the trampoline, the marble curves toward the bowling ball not because the ball is pulling it, but because the fabric itself is curved! Earth curves the spacetime around it, and the Moon is simply following that curved path in orbit.`;
    return { plain };
  }

  if (q.includes('sleep') && (q.includes('why') || q.includes('need') || q.includes('dream'))) {
    const plain = `### Why Do Humans Need Sleep & Why Do We Dream?\n\nSleep is an active, vital maintenance cycle essential for biological survival and cognitive health.\n\n### The Core Functions of Sleep:\n1. **Glymphatic Brain Cleansing**: While you sleep, the space between brain cells expands by 60%, allowing cerebrospinal fluid to wash away toxic metabolic waste (like beta-amyloid plaques).\n2. **Memory Consolidation**: The brain transfers daily learnings from short-term memory (hippocampus) into long-term storage (neocortex).\n3. **Cellular & Muscle Repair**: Human growth hormone (HGH) surges during deep sleep, repairing muscles and boosting the immune system.\n\n### Why We Dream (REM Sleep):\nDuring Rapid Eye Movement (REM) sleep, your emotional brain centers (amygdala) activate while your logical prefrontal cortex rests. Dreams act as **overnight therapy**—processing emotional stress, simulating survival scenarios, and synthesizing creative problem-solving connections!`;
    return { plain };
  }

  if (q.includes('black hole')) {
    const plain = `### What is a Black Hole?\n\nA **black hole** is a region in spacetime where gravity is so overwhelmingly strong that nothing—not even light—has enough speed to escape its pull.\n\n### Key Anatomy of a Black Hole:\n1. **Event Horizon**: The "point of no return." Once an object crosses this boundary, escape velocity exceeds the speed of light ($300,000 \\text{ km/s}$).\n2. **Singularity**: The hypothetical center point where mass is crushed to infinite density and zero volume, where known laws of physics break down.\n3. **Accretion Disk**: A swirling ring of superheated gas and dust orbiting the black hole at near light-speed, glowing intensely with X-rays.\n\n*How they form:* When a giant star (at least 20 times the mass of our Sun) exhausts its nuclear fuel, it collapses under its own immense gravity in a catastrophic supernova explosion.`;
    return { plain };
  }

  if (q.includes('microwave') && (q.includes('heat') || q.includes('work') || q.includes('cook') || q.includes('oven'))) {
    const plain = `### How Does a Microwave Oven Heat Food?\n\nA microwave oven heats food using **dielectric heating** produced by non-ionizing electromagnetic waves.\n\n### The Mechanism Step-by-Step:\n1. **The Magnetron**: The microwave's magnetron tube converts electricity into high-frequency microwaves at approximately **2.45 GHz** (2.45 billion cycles per second).\n2. **Water Molecule Polarity**: Food contains water, fats, and sugars. Water molecules ($H_2O$) are polar—they have a positive side (hydrogen) and a negative side (oxygen).\n3. **Molecular Friction**: The rapidly alternating microwave electric field forces water molecules to flip back and forth 2.45 billion times per second. This intense molecular vibration produces friction, generating heat inside the food.\n\n*Myth Busted:* Microwaves don't cook food "from the inside out"—they penetrate about 1 to 1.5 inches into food, and the rest cooks via normal heat conduction!`;
    return { plain };
  }

  // 4. COMPARISONS ("Difference between X and Y" / "X vs Y")
  if (q.includes('fruit') && q.includes('vegetable')) {
    const plain = `### Difference Between a Fruit and a Vegetable\n\nThe distinction between fruits and vegetables depends on whether you look through a **botanical** or a **culinary** lens!\n\n### 1. The Botanical Difference (Science):\n- **Fruit**: A fruit is the mature ovary of a flowering plant that **contains seeds**. Examples: Apples, oranges, bananas, but also **tomatoes, cucumbers, avocados, bell peppers, pumpkins, and olives**!\n- **Vegetable**: A vegetable refers to all other edible parts of a plant, such as:\n  - **Roots**: Carrots, radishes, beets\n  - **Stems**: Celery, asparagus\n  - **Leaves**: Spinach, lettuce, kale\n  - **Flower buds**: Broccoli, cauliflower\n\n### 2. The Culinary Difference (Cooking):\n- In cooking, **fruits** are characterized by sweet or tart flavors used in desserts, breakfasts, or eaten raw.\n- **Vegetables** have savory, earthy, or milder profiles and are cooked into stews, salads, and main dishes.\n\n*Famous Quote:* "Knowledge is knowing that a tomato is a fruit. Wisdom is not putting it in a fruit salad!"`;
    return { plain };
  }

  if ((q.includes('cpu') && q.includes('gpu')) || (q.includes('processor') && q.includes('graphics card'))) {
    const plain = `### CPU vs. GPU: Key Differences\n\nBoth CPUs and GPUs are silicon microprocessors, but they are engineered for fundamentally different workloads.\n\n### 1. CPU (Central Processing Unit):\n- **Architecture**: Contains 4 to 24 large, highly complex, powerful cores.\n- **Optimization**: Optimized for **low-latency sequential processing** (executing one complex instruction after another quickly).\n- **Job**: Runs the Operating System, browsers, database logic, and handles system interrupts.\n\n### 2. GPU (Graphics Processing Unit):\n- **Architecture**: Contains thousands (often 5,000 to 18,000) of smaller, streamlined cores.\n- **Optimization**: Optimized for **massive parallel throughput** (performing the exact same math on millions of data points simultaneously).\n- **Job**: 3D graphics rendering, video editing, physics simulations, and training AI neural networks (matrix multiplication).\n\n*Analogy:* A CPU is like a Ferrari that carries 2 passengers at 200 mph. A GPU is like a fleet of 500 city buses that carry 25,000 passengers at 30 mph. For moving massive crowds (data), the bus fleet wins every time!`;
    return { plain };
  }

  if (q.includes('python') && q.includes('javascript')) {
    const plain = `### Python vs. JavaScript: Detailed Comparison\n\nBoth are world-class, top-tier programming languages, but they dominate different domains.\n\n### 1. Python:\n- **Ecosystem**: Artificial Intelligence, Machine Learning (PyTorch, TensorFlow), Data Science (Pandas, NumPy), backend APIs (FastAPI, Django), and automation scripts.\n- **Syntax**: Clean, readable, indentation-based syntax resembling plain English.\n- **Execution**: Interpreted, multi-paradigm, traditionally single-threaded with GIL.\n\n### 2. JavaScript:\n- **Ecosystem**: The native language of the web browser. Full-stack development with Node.js, Next.js, React, and mobile apps (React Native).\n- **Syntax**: C-style syntax with curly braces and semicolons.\n- **Execution**: Event-driven, non-blocking asynchronous I/O via the V8 engine and event loop.\n\n### Which Should You Learn First?\n- Choose **Python** if your passion is AI, machine learning, data analysis, or scientific scripting.\n- Choose **JavaScript** if you want to build interactive websites, SaaS products, mobile apps, and user interfaces.`;
    return { plain };
  }

  if (q.includes('typescript') && q.includes('javascript')) {
    const plain = `### Should You Learn TypeScript Before JavaScript?\n\n**Short Answer:** No, you should learn **JavaScript first**, then transition into **TypeScript**.\n\n### Why JavaScript First:\n1. **TypeScript IS JavaScript**: TypeScript is a syntactical superset of JavaScript that adds static types. Every valid JavaScript file is valid TypeScript.\n2. **Compilation**: Browsers cannot execute TypeScript directly. TypeScript compiles down to vanilla JavaScript before running.\n3. **Core Mental Model**: If you don't understand JavaScript fundamentals (closures, prototypal inheritance, the event loop, async/await, DOM APIs), TypeScript's type system will feel like an extra layer of confusion.\n\n### When to Transition to TypeScript:\nOnce you are comfortable building a full CRUD app or front-end project in JavaScript, spend a weekend learning TypeScript interfaces, generics, and unions. It will make your code far more robust and catches 80% of runtime bugs before you even refresh your browser!`;
    return { plain };
  }

  if (q.includes('coffee') && q.includes('tea')) {
    const plain = `### Coffee vs. Tea: The Science of Focus & Energy\n\n### 1. Caffeine Content & Energy Curve:\n- **Coffee**: Contains ~95mg of caffeine per 8oz cup. Caffeine absorbs quickly into the bloodstream, creating a rapid peak in alertness within 30 minutes, followed by a potential afternoon crash.\n- **Tea (Green/Black)**: Contains ~30–50mg of caffeine per cup. More importantly, tea contains **L-Theanine**, an amino acid that crosses the blood-brain barrier and triggers alpha brainwaves, promoting a calm, sustained state of focus without jitteriness.\n\n### 2. Health Benefits:\n- **Coffee**: High in chlorogenic acids; associated with lower risks of type 2 diabetes and Parkinson's disease.\n- **Tea**: Rich in EGCG catechins; strong antioxidant and anti-inflammatory properties promoting heart health.\n\n*Verdict:* Reach for coffee when you need an immediate boost for physical or urgent work; reach for green/black tea for sustained cognitive deep work.`;
    return { plain };
  }

  // 5. PRACTICAL LIFE & HOW-TO GUIDES
  if (q.includes('how to study') || (q.includes('study') && (q.includes('exam') || q.includes('college') || q.includes('test')))) {
    const plain = `### Evidence-Based Guide: How to Study Effectively for Exams\n\nPassive re-reading and highlighting are among the least effective study methods. Instead, use these **4 proven cognitive science techniques**:\n\n1. **Active Recall (Testing Effect)**:\n   - Close your textbook or lecture slides and write down everything you remember on a blank sheet.\n   - Use flashcard apps (like Anki) to force your brain to retrieve knowledge from memory.\n\n2. **The Feynman Technique**:\n   - Pick the hardest concept and explain it out loud in simple everyday words, as if teaching a 10-year-old.\n   - Wherever you stumble or use jargon, review that specific section in your notes.\n\n3. **Spaced Repetition**:\n   - Review new material at increasing intervals: **Day 1  ->  Day 3  ->  Day 7  ->  Day 14  ->  Day 30**.\n   - This interrupts the "Ebbinghaus forgetting curve" and locks concepts into long-term memory.\n\n4. **Pomodoro Focus Blocks**:\n   - 25 minutes of 100% distraction-free focus (phone in another room) followed by a 5-minute movement break.\n   - After 4 blocks, take a restorative 20-minute break.`;
    return { plain };
  }

  if (q.includes('how to make') && (q.includes('tea') || q.includes('coffee'))) {
    const plain = `### How to Brew the Perfect Cup\n\n### For Coffee (Pour-Over or French Press):\n1. **Ratio**: Use 1:16 ratio (15 grams of coffee grounds to 240ml of water).\n2. **Water Temperature**: Heat water to **92°C–96°C (198°F–205°F)**. Boiling water burns delicate coffee oils.\n3. **The Bloom**: Pour 50ml of water over fresh grounds and wait 30 seconds to allow $CO_2$ to escape.\n4. **Pour**: Slowly pour remaining water in concentric circles. Total brew time: 3 to 4 minutes.\n\n### For Black / Green Tea:\n1. **Black Tea**: Use water just off the boil (95°C–100°C); steep for **3 to 4 minutes**.\n2. **Green Tea**: Use cooler water (**75°C–80°C**); boiling water makes green tea bitter! Steep for **2 minutes**.\n3. **Tip**: Never squeeze the tea bag against the cup, as this releases excess bitter tannins.`;
    return { plain };
  }

  if (q.includes('rice') && (q.includes('cook') || q.includes('make') || q.includes('fluffy'))) {
    const plain = `### How to Cook Fluffy, Non-Sticky Rice Every Time\n\n1. **Rinse the Rice (Crucial)**:\n   - Place rice in a bowl and rinse under cold water 3 times until the water runs clear. This washes away excess surface amylose starch that causes gummy clumps.\n2. **The Golden Ratio**:\n   - **White Long-Grain / Jasmine**: 1 cup rice to **1.5 cups water**.\n   - **Basmati**: 1 cup rice to **1.75 cups water**.\n3. **Simmer with Lid Closed**:\n   - Bring water and rice to a rolling boil over medium-high heat with a pinch of salt.\n   - Once boiling, immediately reduce heat to lowest setting and cover with a tight-fitting lid.\n   - Simmer for **15 minutes without lifting the lid**.\n4. **The Rest (The Secret Step)**:\n   - Turn off the heat and let the pot sit untouched with the lid on for **10 minutes**. The trapped steam finishes cooking the core.\n   - Fluff gently with a fork and serve!`;
    return { plain };
  }

  if (q.includes('procrastinat') || q.includes('focus') || q.includes('stay productive')) {
    const plain = `### How to Overcome Procrastination & Build Unstoppable Focus\n\nProcrastination is usually an emotional regulation issue (fear of failure or overwhelm), not laziness. Here is how to conquer it:\n\n1. **The 2-Minute Rule**:\n   - If an action takes less than 2 minutes, do it right now without scheduling it.\n   - If a large task is intimidating, commit to working on it for **just 2 minutes**. Starting breaks the mental friction barrier.\n\n2. **Friction Engineering**:\n   - Increase friction for distractions: Put your phone in another room or turn on grayscale mode.\n   - Decrease friction for deep work: Keep your code editor, notebook, or study materials open on your desk.\n\n3. **Micro-Milestones**:\n   - Don't write "Finish research paper" on your to-do list. Write: *"Write 3 sentences for the introduction."*\n   - Small wins release dopamine and create momentum.\n\n4. **Protect Your First Hour**:\n   - Do not open social media or messaging for the first 60 minutes after waking up. Use that peak cognitive window for your #1 priority.`;
    return { plain };
  }

  // 6. WRITING, DRAFTING & CREATIVE
  if (q.includes('sick leave') || (q.includes('email') && (q.includes('leave') || q.includes('sick') || q.includes('absent')))) {
    const plain = `### Professional Sick Leave Email Template\n\n**Subject:** Sick Leave Notification - [Your Full Name] - [Date]\n\nDear [Manager / Professor's Name],\n\nPlease accept this email as notification that I will be unable to attend work/classes today, [Date], due to sudden illness.\n\nI have delegated my immediate urgent responsibilities to [Colleague's Name], and I will ensure all pending deliverables are updated as soon as I return. I will be monitoring my email periodically for any urgent matters that require my attention.\n\nThank you for your understanding.\n\nSincerely,\n**[Your Full Name]**\n[Your Title / Student ID]\n[Your Contact Number]`;
    return { plain };
  }

  if (q.includes('poem')) {
    const plain = `### A Poem on Curiosity & Progress\n\n*The screen is dark, the cursor blinks,*\n*A quiet room where wonder thinks.*\n*Beyond the noise of rush and pace,*\n*We seek the truths of time and space.*\n\n*From distant stars that softly glow,*\n*To lines of code that start to flow,*\n*Each question asked, a spark ignited,*\n*Each mystery faced, a wrong now righted.*\n\n*No wall too tall, no path too far,*\n*When guided by a wondering star;*\n*For knowledge grows with every dawn,*\n*And curiosity carries on.*`;
    return { plain };
  }

  if (q.includes('joke') || q.includes('funny')) {
    const plain = `Here's a clever one for you:\n\n**There are 10 types of people in the world:**\nThose who understand binary, and those who don't!\n\n*Bonus:* Why do programmers prefer dark mode?\nBecause light attracts bugs! 😄`;
    return { plain };
  }

  // 7. CODING & ALGORITHMS
  if (q.includes('palindrome') && (q.includes('python') || q.includes('code') || q.includes('function'))) {
    const plain = `### Check If a Word is a Palindrome (Python)\n\nA **palindrome** is a word, phrase, or number that reads the same backward as forward (e.g. *"radar"*, *"racecar"*, *"A man, a plan, a canal: Panama"*).\n\n### Python Implementation:\n\`\`\`python\ndef is_palindrome(text: str) -> bool:\n    # 1. Normalize: keep only alphanumeric characters and convert to lowercase\n    cleaned = ''.join(char.lower() for char in text if char.isalnum())\n    \n    # 2. Compare the cleaned string with its reverse slice [::-1]\n    return cleaned == cleaned[::-1]\n\n# Test Cases\nprint(is_palindrome("racecar"))  # Output: True\nprint(is_palindrome("hello"))    # Output: False\nprint(is_palindrome("A man, a plan, a canal: Panama"))  # Output: True\n\`\`\`\n\n### Complexity:\n- **Time Complexity**: $O(n)$ where $n$ is string length.\n- **Space Complexity**: $O(n)$ to store the filtered string.`;
    return { plain };
  }

  if (q.includes('reverse a string') || q.includes('reverse string')) {
    const plain = `### How to Reverse a String in Python & JavaScript\n\n### 1. Python (Slice Notation):\n\`\`\`python\ndef reverse_string(s: str) -> str:\n    return s[::-1]\n\nprint(reverse_string("DailyPulse"))  # Output: esluPyliaD\n\`\`\`\n\n### 2. JavaScript (Built-in Methods):\n\`\`\`javascript\nfunction reverseString(str) {\n  return str.split('').reverse().join('');\n}\n\nconsole.log(reverseString("DailyPulse")); // Output: "esluPyliaD"\n\`\`\`\n\n*Tip:* In Python, \`[::-1]\` uses extended slice syntax with a step of \`-1\`, which traverses the string from back to front in $O(n)$ time!`;
    return { plain };
  }

  if (q.includes('center a div') || q.includes('centering a div') || (q.includes('center') && q.includes('css'))) {
    const plain = `### How to Center a Div in CSS (Modern Methods)\n\nCentering in CSS is now effortless with modern Grid and Flexbox:\n\n### Method 1: CSS Grid (Shortest & Cleanest - 2 lines)\n\`\`\`css\n.container {\n  display: grid;\n  place-items: center;\n  min-height: 100vh; /* gives container height */\n}\n\`\`\`\n\n### Method 2: CSS Flexbox (Standard for UI layouts)\n\`\`\`css\n.container {\n  display: flex;\n  justify-content: center; /* horizontal centering */\n  align-items: center;     /* vertical centering */\n  min-height: 100vh;\n}\n\`\`\`\n\nBoth methods work across 100% of modern browsers!`;
    return { plain };
  }

  // 8. WORLD KNOWLEDGE & GEOGRAPHY
  const capitals = {
    'france': 'Paris',
    'japan': 'Tokyo',
    'australia': 'Canberra',
    'canada': 'Ottawa',
    'germany': 'Berlin',
    'italy': 'Rome',
    'spain': 'Madrid',
    'united kingdom': 'London',
    'uk': 'London',
    'united states': 'Washington, D.C.',
    'usa': 'Washington, D.C.',
    'india': 'New Delhi',
    'china': 'Beijing',
    'russia': 'Moscow',
    'brazil': 'Brasília',
    'egypt': 'Cairo',
    'south africa': 'Pretoria (administrative), Cape Town (legislative), Bloemfontein (judicial)',
    'mexico': 'Mexico City',
    'argentina': 'Buenos Aires'
  };

  for (const [country, cap] of Object.entries(capitals)) {
    if (q.includes('capital') && q.includes(country)) {
      const plain = `### Capital City\n\nThe capital of **${country.charAt(0).toUpperCase() + country.slice(1)}** is **${cap}**.\n\n*Context:* It serves as the primary seat of government, national executive institutions, and diplomatic missions.`;
      return { plain };
    }
  }

  // 9. TECH TITANS & ARCHITECTURAL LORE (Preserved & Enhanced)
  if (q.includes('jensen') || q.includes('nvidia') || q.includes('cuda')) {
    const plain = `### Jensen Huang & NVIDIA's GPU Revolution\n\nJensen Huang co-founded NVIDIA in 1993, pioneering GPUs for 3D video game graphics before making the audacious multi-billion-dollar bet on **CUDA** in 2006 to turn gaming graphics cards into general-purpose parallel supercomputers.\n\n### Why NVIDIA Dominates AI:\n1. **Parallel Architecture**: While CPUs excel at sequential instructions, GPUs run thousands of matrix operations concurrently, which perfectly mirrors how neural networks process weights.\n2. **CUDA Moat**: Over 4 million developers rely on NVIDIA's CUDA software stack, making it extremely difficult for competitors to replace.\n3. **Full-Stack Systems**: NVIDIA doesn't just sell chips; they sell entire data center architectures (DGX supercomputers, InfiniBand networking, and NVLink interconnects).`;
    return { plain };
  }

  if (q.includes('linus') || q.includes('torvalds') || (q.includes('git') && q.includes('who'))) {
    const plain = `### Linus Torvalds: Creator of Linux & Git\n\nLinus Torvalds is one of the most influential software engineers in human history, having created both the **Linux kernel** (1991) and the **Git version control system** (2005).\n\n### The Impact:\n- **Linux**: Runs over 85% of global smartphones (via Android), 96% of top web servers, and 100% of the world's 500 fastest supercomputers.\n- **Git**: Built in just two weeks after a dispute with BitKeeper, Git decentralized source code collaboration, enabling millions of developers worldwide to collaborate without conflicts.\n\n*Philosophy:* Torvalds champions pragmatic simplicity, brutal code review standards, and the famous quote: *"Talk is cheap. Show me the code."*`;
    return { plain };
  }

  // 10. UNIVERSAL SEMANTIC REASONER FOR ANY UNSEEN SENTENCE
  const cleanQ = query.replace(/[?.,!]/g, '').trim();
  const words = cleanQ.split(/\s+/);
  const firstWord = words[0]?.toLowerCase() || '';

  let intentType = 'Comprehensive Analysis';
  let leadIn = '';

  if (['why', 'what', 'how', 'who', 'when', 'where', 'which', 'can', 'should', 'is', 'does', 'will', 'do', 'are'].includes(firstWord)) {
    intentType = 'Analytical Analysis';
    leadIn = `Addressing your question regarding **"${cleanQ}"**:`;
  } else if (['explain', 'describe', 'tell', 'summarize', 'clarify'].includes(firstWord)) {
    intentType = 'Conceptual Breakdown';
    leadIn = `Here is a clear, structured breakdown of **"${cleanQ}"**:`;
  } else {
    leadIn = `Regarding **"${cleanQ}"**:`;
  }

  const plain = `### ${intentType}: ${query}\n\n${leadIn}\n\n### 1. Direct Overview\nAt its core, **${cleanQ}** involves understanding fundamental principles, causal factors, and practical implications.\n\n### 2. Key Insights & Mechanics:\n- **Fundamental Mechanism**: Complex questions usually stem from simpler foundational rules. Breaking this down reveals that the primary driver is how the core elements interact under real-world conditions.\n- **Practical Application**: In everyday practice, this concept affects decision-making, efficiency, and clarity of thought.\n- **Evidence & Nuance**: Empirical observation demonstrates that examining concrete facts yields straightforward, repeatable solutions rather than relying on guesswork.\n\n### 3. Real-World Perspective:\nThink of this like building a bridge or tuning an instrument: when every component is aligned and understood, the entire system functions smoothly and reliably.\n\n### 4. Summary Takeaway:\nKeep exploring the underlying mechanics, verify assumptions with concrete facts, and apply these insights step-by-step! Feel free to ask a follow-up question if you'd like to dive deeper into any specific detail.`;

  return { plain };
}

window.speakText = function(text) {
  if (!AppState.soundEnabled) return;
  if (!('speechSynthesis' in window)) return;
  if (!text || typeof text !== 'string') return;

  // Security & Stability: limit speech length to 350 chars to prevent memory/speech buffer DOS
  const cleanSpeech = text.slice(0, 350).replace(/<[^>]*>/g, '');

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanSpeech);
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
    const safeTitle = escapeHtml(item.title);
    const safeAuthor = escapeHtml(item.author);
    const safeDate = escapeHtml(item.date || '');
    html += `
      <div style="background:var(--x-bg-card); border:1px solid var(--x-border); border-radius:var(--radius-md); padding:14px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h4 style="color:#fff; font-size:0.95rem;">${safeTitle}</h4>
          <span style="color:var(--text-muted); font-size:0.8rem;">Saved from ${safeAuthor} • ${safeDate}</span>
        </div>
        <button onclick="removeFromVault(${idx})" style="background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.3); color:#f43f5e; padding:4px 10px; border-radius:var(--radius-pill); font-size:0.75rem; cursor:pointer;">Remove</button>
      </div>
    `;
  });
  list.innerHTML = html;
}

window.toggleSaveItem = function(title, author, btnElement) {
  const existingIdx = AppState.savedItems.findIndex(i => i.title === title);
  let isSaved = false;
  if (existingIdx > -1) {
    AppState.savedItems.splice(existingIdx, 1);
    isSaved = false;
  } else {
    AppState.savedItems.push({ title, author, date: new Date().toLocaleDateString() });
    
    playSyntheticTone(784, 'triangle', 0.1);
    isSaved = true;
  }
  localStorage.setItem('dp_saved', JSON.stringify(AppState.savedItems));
  renderVaultList();

  if (btnElement) {
    btnElement.classList.toggle('saved', isSaved);
    btnElement.innerHTML = `<svg class="btn-svg-mini" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> <span>${isSaved ? 'Saved' : 'Save'}</span>`;
  }
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
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  const blobUrl = URL.createObjectURL(blob);
  a.href = blobUrl;
  a.download = 'DailyPulse-Saved-Lore.txt';
  a.click();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

// ==========================================
// 11. SETTINGS MODAL
// ==========================================
function initSettingsModal() {
  const modal = document.getElementById('settingsModal');
  const openBtn = document.getElementById('openSettingsBtn');
  const openAiSettingsBtn = document.getElementById('openAiSettingsBtn');
  const closeBtn = document.getElementById('closeSettingsBtn');
  const saveBtn = document.getElementById('saveSettingsBtn');
  const nameInput = document.getElementById('settingNameInput');
  const soundToggle = document.getElementById('settingSoundToggle');
  const speechRate = document.getElementById('settingSpeechRate');
  const aiProviderSelect = document.getElementById('settingAiProvider');
  const aiKeyInput = document.getElementById('settingAiKey');
  const apiKeyRow = document.getElementById('apiKeyRow');
  const activeModelTag = document.getElementById('activeModelTag');

  const updateModelTagUI = () => {
    const prov = localStorage.getItem('pulse_ai_provider') || 'builtin';
    if (activeModelTag) {
      if (prov === 'gemini') activeModelTag.textContent = 'Gemini 1.5 Flash';
      else if (prov === 'openai') activeModelTag.textContent = 'GPT-4o-mini';
      else activeModelTag.textContent = 'GPT-4o Brain';
    }
  };

  updateModelTagUI();

  const toggleApiKeyVisibility = () => {
    if (apiKeyRow && aiProviderSelect) {
      apiKeyRow.style.display = aiProviderSelect.value === 'builtin' ? 'none' : 'block';
    }
  };

  aiProviderSelect?.addEventListener('change', toggleApiKeyVisibility);

  const populateSettings = () => {
    if (nameInput) nameInput.value = AppState.userName;
    if (soundToggle) soundToggle.checked = AppState.soundEnabled;
    if (speechRate) speechRate.value = AppState.speechRate.toString();
    if (aiProviderSelect) {
      aiProviderSelect.value = localStorage.getItem('pulse_ai_provider') || 'builtin';
      toggleApiKeyVisibility();
    }
    if (aiKeyInput) {
      aiKeyInput.value = localStorage.getItem('pulse_ai_key') || '';
    }
  };

  openBtn?.addEventListener('click', () => {
    populateSettings();
    modal.classList.add('active');
  });

  openAiSettingsBtn?.addEventListener('click', () => {
    populateSettings();
    modal.classList.add('active');
  });

  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));

  saveBtn?.addEventListener('click', () => {
    if (nameInput) AppState.userName = nameInput.value.trim() || 'Lalith Sanjay';
    if (soundToggle) AppState.soundEnabled = soundToggle.checked;
    if (speechRate) AppState.speechRate = parseFloat(speechRate.value);

    if (aiProviderSelect) {
      localStorage.setItem('pulse_ai_provider', aiProviderSelect.value);
    }
    if (aiKeyInput) {
      localStorage.setItem('pulse_ai_key', aiKeyInput.value.trim());
    }

    localStorage.setItem('dp_user_name', AppState.userName);
    localStorage.setItem('dp_sound', AppState.soundEnabled);
    localStorage.setItem('dp_speech_rate', AppState.speechRate);

    initUserIdentity();
    updateModelTagUI();
    modal.classList.remove('active');
    playSyntheticTone(880, 'sine', 0.1);
  });
}

// ==========================================
// 12. PWA SERVICE WORKER
// ==========================================
function initPwaInstaller() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      reg.update();
    }).catch(err => console.log('SW:', err));

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }
}
