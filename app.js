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
      avatar: '🇺🇸',
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
      avatar: '🐧',
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
      avatar: '🧥',
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
      avatar: '🪟',
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
      avatar: '🧠',
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
      avatar: '👓',
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
      avatar: '🧬',
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
      avatar: '🔍',
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
      avatar: '🚀',
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
      avatar: '🐍',
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
      avatar: '👨‍🏫',
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
      avatar: '💎',
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

  // 13 Rich Dynamic Cards across categories
  dailyCards: [
    {
      id: 'story-0',
      category: 'slang',
      topicTag: 'Cooked',
      author: 'Internet Culture Lab',
      handle: '@culturelore',
      flair: 'r/SlangLore',
      time: '3h ago',
      title: 'Describing Total Exhaustion or Failure',
      slangPhrase: '"Bro, I am completely cooked."',
      formalPhrase: '"I am feeling thoroughly overwhelmed and unprepared."',
      pronounceText: 'I am feeling thoroughly overwhelmed and unprepared',
      sourceUrl: 'https://knowyourmeme.com/memes/let-him-cook',
      sourceOutlet: 'Know Your Meme',
      explanation: '<strong>When to use "Cooked":</strong> Popularized by streamers and gaming. Use when something is ruined, hopeless, or when you are mentally exhausted.<br><br><strong>When to use Formal:</strong> Use in professional or academic settings to communicate heavy workload without sounding immature.',
      commentsCount: 382,
      repostsCount: '1.4k',
      likesCount: 5210
    },
    {
      id: 'story-1',
      category: 'slang',
      topicTag: 'Brat Summer',
      author: 'Pop Culture Radar',
      handle: '@popradar',
      flair: 'r/AestheticTrends',
      time: '5h ago',
      title: 'Why "Brat Summer" Dominated Modern Aesthetics',
      pronounceText: 'Brat Summer represents messy, unapologetic confidence',
      sourceUrl: 'https://www.theguardian.com/music/article/2024/jul/23/brat-summer-charli-xcx-kamala-harris',
      sourceOutlet: 'The Guardian',
      explanation: '<strong>The Core Breakdown:</strong> Started by Charli XCX\'s lime-green album. It rejected the polished "clean-girl" perfection in favor of loud music, messy hair, late nights, and unapologetic self-confidence.<br><br><strong>Key Vocabulary:</strong> <em>Unapologetic</em> (not feeling sorry for being yourself), <em>Aesthetic</em> (visual style or mood).',
      commentsCount: 940,
      repostsCount: '4.8k',
      likesCount: 18400
    },
    {
      id: 'story-2',
      category: 'reply',
      topicTag: 'Boundaries',
      author: 'Corporate & Life Fluency',
      handle: '@careerpolish',
      flair: 'r/WorkplaceHumor',
      time: '6h ago',
      title: 'Polite Workplace Boundary Challenge',
      scenario: '👉 <strong>Scenario:</strong> A colleague messages you at 8:15 PM asking for a task update. You want to decline politely without working overtime. What would you say?',
      sourceUrl: 'https://hbr.org/2021/04/how-to-set-boundaries-when-the-lines-are-blurred',
      sourceOutlet: 'Harvard Business Review',
      explanation: '<strong>The Golden Rule:</strong> Never apologize for logging off on time. Acknowledge receipt, set a clear time window for tomorrow, and log off with confidence.',
      commentsCount: 420,
      repostsCount: '980',
      likesCount: 4120
    },
    {
      id: 'story-3',
      category: 'tech',
      topicTag: 'Center Div',
      author: 'Frontend Developers Hub',
      handle: '@webdevlore',
      flair: 'r/ProgrammerHumor',
      time: '8h ago',
      title: 'Why "Centering a Div" is Computer Science\'s Biggest Meme',
      pronounceText: 'Centering a div in CSS is easier now with flexbox and grid',
      sourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Centering_things',
      sourceOutlet: 'MDN Web Docs',
      explanation: '<strong>The Problem:</strong> Historically in CSS, centering a box both horizontally and vertically required math hacks, negative margins, and position absolute.<br><br><strong>The Modern 2-Line Flex:</strong><br><code>display: grid; place-items: center;</code><br>Put this on the parent box, and the 20-year-old internet joke is solved!',
      commentsCount: 1640,
      repostsCount: '6.2k',
      likesCount: 24900
    },
    {
      id: 'story-4',
      category: 'icon',
      topicTag: 'Jensen Huang',
      author: 'Silicon Valley Dossier',
      handle: '@techfoundry',
      flair: 'r/TechTitans',
      time: '12h ago',
      title: 'Jensen Huang (The Man Powering Global AI)',
      role: 'CEO & Co-founder of NVIDIA',
      avatarEmoji: '🧥',
      pronounceText: 'Jensen Huang is the CEO of Nvidia, powering modern artificial intelligence',
      sourceUrl: 'https://www.businessinsider.com/jensen-huang-nvidia-ceo-leather-jackets-wardrobe-explained-2024-3',
      sourceOutlet: 'Business Insider',
      explanation: '<strong>The Profile:</strong> Started Nvidia making chips for 3D PC games. Today, his AI processors (H100, Blackwell) run almost every large language model in the world.<br><br><strong>The Lore:</strong> Wears a black motorcycle leather jacket to every single keynote and press conference on Earth!',
      commentsCount: 810,
      repostsCount: '3.1k',
      likesCount: 14200
    },
    {
      id: 'story-5',
      category: 'slang',
      topicTag: 'Demure',
      author: 'Viral Trend Archive',
      handle: '@trendpulse',
      flair: 'r/MemeEtiquette',
      time: '14h ago',
      title: '"Very Demure, Very Mindful" (The Irony Trend)',
      slangPhrase: '"Notice how I stay calm and cute? Very demure. Very mindful."',
      formalPhrase: '"I prioritize composure, elegance, and understated professionalism."',
      pronounceText: 'Very demure, very mindful represents ironical modesty',
      sourceUrl: 'https://time.com/7011889/very-demure-very-mindful-tiktok-trend-jools-lebron/',
      sourceOutlet: 'TIME Magazine',
      explanation: '<strong>The Origin:</strong> Started by TikTok creator Jools Lebron. It\'s used ironically to mock people who act overly exaggerated or try too hard to look innocent and modest in everyday chaotic situations.',
      commentsCount: 520,
      repostsCount: '2.1k',
      likesCount: 9400
    },
    {
      id: 'story-6',
      category: 'slang',
      topicTag: 'Girl Math',
      author: 'Gen Z Psychology Lab',
      handle: '@humorlogic',
      flair: 'r/Me_IRL',
      time: '16h ago',
      title: '"Girl Math" vs. "Boy Math" (Irrational Financial Logic)',
      slangPhrase: '"If I pay with cash, it\'s basically free."',
      formalPhrase: '"Perceived sunk costs often lead to irrational post-purchase rationalization."',
      pronounceText: 'Girl math and boy math are hilarious examples of cognitive bias',
      sourceUrl: 'https://www.businessinsider.com/what-is-girl-math-explained-tiktok-spending-trend-2023-9',
      sourceOutlet: 'Business Insider',
      explanation: '<strong>The Meme:</strong> Humorous viral justifications for spending money. Examples: *"Returning a $50 shirt means I just made $50 profit"* or *"Walking 3 miles in the rain to avoid a $4 parking ticket"* (Boy Math).',
      commentsCount: 780,
      repostsCount: '3.9k',
      likesCount: 16200
    },
    {
      id: 'story-7',
      category: 'tech',
      topicTag: 'Git Merge',
      author: 'DevOps & Git Survivors',
      handle: '@gitpanic',
      flair: 'r/ProgrammerHumor',
      time: '18h ago',
      title: 'The Friday 4:55 PM Git Merge Conflict',
      pronounceText: 'Git merge conflicts occur when two branches modify the same lines of code',
      sourceUrl: 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts',
      sourceOutlet: 'Git Official SCM',
      explanation: '<strong>The Panic:</strong> When two developers edit the same file, Git stops and demands human intervention. Senior developers use <code>git stash</code> and <code>git reflog</code> to rescue lost code from catastrophic mistakes.',
      commentsCount: 1120,
      repostsCount: '4.1k',
      likesCount: 19800
    },
    {
      id: 'story-8',
      category: 'reply',
      topicTag: 'Deadlines',
      author: 'Executive Presence Coach',
      handle: '@leadfluent',
      flair: 'r/CareerAdvancement',
      time: '20h ago',
      title: 'How to Ask for a Deadline Extension Professionally',
      scenario: '👉 <strong>Scenario:</strong> You realize you cannot finish a project report by 5:00 PM today without sacrificing quality. How do you request an extension from your manager?',
      sourceUrl: 'https://www.forbes.com/sites/carolinecastrillon/2023/04/30/how-to-professionally-ask-for-a-deadline-extension/',
      sourceOutlet: 'Forbes',
      explanation: '<strong>Key Strategy:</strong> Never make excuses. State the current progress, why quality requires more time, and give a firm, guaranteed completion time for tomorrow.',
      commentsCount: 310,
      repostsCount: '890',
      likesCount: 3800
    },
    {
      id: 'story-9',
      category: 'icon',
      topicTag: 'Sam Altman',
      author: 'AI Horizon Dossier',
      handle: '@aimasters',
      flair: 'r/Singularity',
      time: '1d ago',
      title: 'Sam Altman (The Architect of ChatGPT)',
      role: 'CEO & Co-founder of OpenAI',
      avatarEmoji: '🤖',
      pronounceText: 'Sam Altman leads OpenAI in building artificial general intelligence',
      sourceUrl: 'https://time.com/collection/100-most-influential-people-2023/6269986/sam-altman/',
      sourceOutlet: 'TIME 100',
      explanation: '<strong>The Story:</strong> Former president of Y Combinator who launched ChatGPT in late 2022, kicking off the global AI revolution. Famous for his quiet voice, gray t-shirts, and massive ambitions for AGI.',
      commentsCount: 1450,
      repostsCount: '5.9k',
      likesCount: 22100
    },
    {
      id: 'story-10',
      category: 'slang',
      topicTag: 'Mewing',
      author: 'Internet Anthropology',
      handle: '@brainrotdecoded',
      flair: 'r/PeterExplains',
      time: '1d ago',
      title: '"Mewing" and "Looksmaxxing" Culture',
      slangPhrase: '"Bro is strictly mewing to mog the entire lecture hall."',
      formalPhrase: '"He is demonstrating intense facial posture to optimize jawline aesthetics."',
      pronounceText: 'Mewing is the practice of resting the tongue on the roof of the mouth',
      sourceUrl: 'https://www.nytimes.com/2024/03/01/style/mewing-jawline-tiktok.html',
      sourceOutlet: 'The New York Times',
      explanation: '<strong>The Lore:</strong> Originally an orthodontic tongue posture technique, it became a massive high school and college meme where students put a finger to their lips and point to their jaw to avoid answering questions.',
      commentsCount: 920,
      repostsCount: '3.4k',
      likesCount: 13800
    },
    {
      id: 'story-11',
      category: 'icon',
      topicTag: 'Real Madrid',
      author: 'Champions League Lore',
      handle: '@uclhistory',
      flair: 'r/Soccer',
      time: '2d ago',
      title: 'Why Real Madrid Has "Black Magic" in Finals',
      role: '15-Time European Champions',
      avatarEmoji: '⚽',
      pronounceText: 'Real Madrid has won fifteen UEFA Champions League titles',
      sourceUrl: 'https://www.goal.com/en/lists/real-madrid-champions-league-dna-explained/',
      sourceOutlet: 'Goal.com',
      explanation: '<strong>The Lore:</strong> Football fans joke that Real Madrid obeys no laws of physics. They can play terribly for 85 minutes, look completely defeated, and score 2 miracle goals in 3 minutes to steal the trophy. Fans call it "UCL DNA".',
      commentsCount: 2400,
      repostsCount: '8.1k',
      likesCount: 31200
    },
    {
      id: 'story-12',
      category: 'icon',
      topicTag: 'IShowSpeed',
      author: 'Streaming & Creator Pulse',
      handle: '@streamwire',
      flair: 'r/LivestreamFail',
      time: '2d ago',
      title: 'IShowSpeed (The Chaotic Global Sensation)',
      role: 'Viral Streamer & YouTube Creator',
      avatarEmoji: '⚡',
      pronounceText: 'IShowSpeed is famous for high-energy travel streams and Cristiano Ronaldo fandom',
      sourceUrl: 'https://www.dexerto.com/entertainment/who-is-ishowspeed-youtube-streamer-viral-2035222/',
      sourceOutlet: 'Dexerto',
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
  initDeck();
  initTitansView();
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

  const triggerFeedTop = () => {
    switchTab('feed');
    playSyntheticTone(1050, 'sine', 0.08);
    const emblems = document.querySelectorAll('.pulse-brand-emblem');
    emblems.forEach(emblem => {
      emblem.style.transform = 'scale(1.2) rotate(8deg)';
      setTimeout(() => emblem.style.transform = '', 280);
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
// 4. CATEGORY FILTERS & DECK PROGRESS
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
      const cat = pill.getAttribute('data-cat');
      
      if (cat === 'icon') {
        switchTab('titans');
        return;
      }

      AppState.activeCategory = cat;
      renderContinuousFeed();
      playSyntheticTone(640, 'sine', 0.05);
      
      const timeline = document.querySelector('.social-timeline');
      if (timeline) timeline.scrollTop = 0;
    });
  });
}

function updateReadingProgressStrip() {
  const timeline = document.querySelector('.social-timeline');
  const badge = document.getElementById('deckTopicBadge');
  const percentText = document.getElementById('deckPercentText');
  const fill = document.getElementById('deckProgressBarFill');
  const cards = getFilteredCards();

  if (!timeline) return;

  const scrollTotal = timeline.scrollHeight - timeline.clientHeight;
  const currentScroll = timeline.scrollTop;
  const percent = scrollTotal > 0 ? Math.min(100, Math.round((currentScroll / scrollTotal) * 100)) : 100;

  if (fill) fill.style.width = `${Math.max(12, percent)}%`;
  if (percentText) percentText.textContent = percent >= 92 ? 'All Caught Up! 🎉' : `${percent}% Read`;
  if (badge) badge.innerHTML = `<span>⚡</span> Continuous Feed: <strong>${cards.length} Stories (Scroll Down)</strong>`;
}

function getCategoryIcon(cat) {
  const map = { slang: '🔥', trend: '⚡', reply: '💼', tech: '💻', icon: '👑' };
  return map[cat] || '⚡';
}

function getCategoryLabel(cat) {
  const map = {
    slang: 'Internet Slang & Lore',
    trend: 'Cultural Trend',
    reply: 'Workplace Fluency',
    tech: 'Developer Concept',
    icon: 'Titan Profile'
  };
  return map[cat] || 'Daily Lore';
}

// ==========================================
// 5. CONTINUOUS SCROLL FEED (No Next Story Clicks Needed)
// ==========================================
function initDeck() {
  renderContinuousFeed();

  const timeline = document.querySelector('.social-timeline');
  if (timeline) {
    timeline.addEventListener('scroll', () => {
      if (AppState.activeTab === 'feed') {
        updateReadingProgressStrip();
      }
    });
  }
}

function renderCardAestheticVisual(card) {
  // 1. Charli XCX Brat Summer Aesthetic Banner
  if (card.id === 'story-1' || card.topicTag === 'Brat Summer') {
    return `
      <div class="aesthetic-visual-banner art-brat-summer">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(138,206,0,0.15); border-color:rgba(138,206,0,0.5); color:#8ace00;">
            <span>🟢</span> <span>VIRAL AESTHETIC • PANTONE 3507 C</span>
          </span>
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700;">Charli XCX</span>
        </div>
        <div style="padding: 18px 0; text-align:center;">
          <div class="brat-typography">brat</div>
          <div class="brat-subline" style="margin-top:6px;">unapologetic confidence • 365 party girl • club classics</div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(138,206,0,0.25); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">Culture Word of the Year</span>
          <button class="sound-mini-btn" style="border-color:#8ace00; color:#8ace00;" onclick="speakText('${card.pronounceText}')" title="Listen">🔊</button>
        </div>
      </div>
    `;
  }

  // 2. Jensen Huang NVIDIA Blackwell Cyberpunk Banner
  if (card.id === 'story-4' || card.topicTag === 'Jensen Huang') {
    return `
      <div class="aesthetic-visual-banner art-jensen-nvidia">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(118,185,0,0.15); border-color:rgba(118,185,0,0.5); color:#76b900;">
            <span>⚡</span> <span>NVIDIA BLACKWELL B200 • 208B TRANSISTORS</span>
          </span>
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700;">CEO Keynote</span>
        </div>
        <div class="nvidia-chip-diagram" style="padding: 12px 0;">
          <div class="nvidia-emblem-badge">🧥</div>
          <div style="flex:1;">
            <div style="font-size:1.18rem; font-weight:800; color:#ffffff; line-height:1.3;">"Domain expertise and problem-solving is the new coding syntax."</div>
            <div style="font-size:0.8rem; color:#76b900; font-weight:700; margin-top:4px;">Jensen Huang • Signature Motorcycle Leather Jacket</div>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(118,185,0,0.25); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">Powering Global AI Superclusters</span>
          <button class="sound-mini-btn" style="border-color:#76b900; color:#76b900;" onclick="speakText('${card.pronounceText}')" title="Listen">🔊</button>
        </div>
      </div>
    `;
  }

  // 3. Real Madrid Champions League Regal Banner
  if (card.id === 'story-11' || card.topicTag === 'Real Madrid') {
    return `
      <div class="aesthetic-visual-banner art-real-madrid">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(234,179,8,0.15); border-color:rgba(234,179,8,0.5); color:#facc15;">
            <span>👑</span> <span>15× CHAMPIONS OF EUROPE • UCL DNA</span>
          </span>
          <div class="ucl-stars-row">★★★★★ ★★★★★ ★★★★★</div>
        </div>
        <div style="display:flex; align-items:center; gap:16px; padding: 14px 0;">
          <div style="font-size: 2.8rem; width: 68px; height: 68px; background: rgba(234,179,8,0.15); border:1.5px solid rgba(234,179,8,0.5); border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 25px rgba(234,179,8,0.35);">🏆</div>
          <div>
            <div style="font-size:1.15rem; font-weight:800; color:#ffffff;">The Santiago Bernabéu Comeback Aura</div>
            <div style="font-size:0.84rem; color:rgba(255,255,255,0.85); font-weight:600; margin-top:2px;">"85 minutes of calm, 3 minutes of miracles."</div>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(234,179,8,0.25); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">Unmatched European Dominance</span>
          <button class="sound-mini-btn" style="border-color:#facc15; color:#facc15;" onclick="speakText('${card.pronounceText}')" title="Listen">🔊</button>
        </div>
      </div>
    `;
  }

  // 4. IShowSpeed High Voltage Electric Banner
  if (card.id === 'story-12' || card.topicTag === 'IShowSpeed') {
    return `
      <div class="aesthetic-visual-banner art-ishowspeed">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(234,179,8,0.18); border-color:rgba(234,179,8,0.5); color:#facc15;">
            <span>⚡</span> <span>LIVE IRL STREAMING • 2.5B VIEWS</span>
          </span>
          <div class="speed-wave-bars">
            <div class="speed-wave-bar" style="animation-delay:0.1s;"></div>
            <div class="speed-wave-bar" style="animation-delay:0.3s;"></div>
            <div class="speed-wave-bar" style="animation-delay:0.2s;"></div>
            <div class="speed-wave-bar" style="animation-delay:0.4s;"></div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:16px; padding: 14px 0;">
          <div style="font-size: 2.8rem; width: 68px; height: 68px; background: rgba(168,85,247,0.2); border:1.5px solid rgba(234,179,8,0.6); border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 25px rgba(234,179,8,0.4);">⚡</div>
          <div>
            <div style="font-size:1.15rem; font-weight:800; color:#ffffff;">"SIUUU!" High-Voltage Global Tours</div>
            <div style="font-size:0.84rem; color:rgba(255,255,255,0.85); font-weight:600; margin-top:2px;">Mobbed by 50,000 fans across Europe, Asia & Brazil.</div>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(234,179,8,0.25); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">The Internet's Most Energetic Creator</span>
          <button class="sound-mini-btn" style="border-color:#facc15; color:#facc15;" onclick="speakText('${card.pronounceText}')" title="Listen">🔊</button>
        </div>
      </div>
    `;
  }

  // 5. Sam Altman AGI Banner
  if (card.id === 'story-9' || card.topicTag === 'Sam Altman') {
    return `
      <div class="aesthetic-visual-banner art-sam-altman">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(6,182,212,0.18); border-color:rgba(6,182,212,0.5); color:#22d3ee;">
            <span>🤖</span> <span>FRONTIER REASONING • o1 & o3 AGI</span>
          </span>
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700;">OpenAI</span>
        </div>
        <div style="display:flex; align-items:center; gap:16px; padding: 14px 0;">
          <div style="font-size: 2.8rem; width: 68px; height: 68px; background: rgba(6,182,212,0.2); border:1.5px solid rgba(6,182,212,0.6); border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 25px rgba(6,182,212,0.4);">🧠</div>
          <div>
            <div style="font-size:1.15rem; font-weight:800; color:#ffffff;">The Shift to Test-Time Compute</div>
            <div style="font-size:0.84rem; color:rgba(255,255,255,0.85); font-weight:600; margin-top:2px;">Models that deliberate, self-correct, and reason.</div>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(6,182,212,0.25); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">The Architect of ChatGPT</span>
          <button class="sound-mini-btn" style="border-color:#22d3ee; color:#22d3ee;" onclick="speakText('${card.pronounceText}')" title="Listen">🔊</button>
        </div>
      </div>
    `;
  }

  // 6. Centering a Div CSS Pattern
  if (card.id === 'story-3' || card.topicTag === 'Center Div') {
    return `
      <div class="aesthetic-visual-banner art-center-div">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span class="art-meta-tag" style="background:rgba(255,255,255,0.08); color:#ffffff;">
            <span>💻</span> <span>MODERN CSS GRID PATTERN</span>
          </span>
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.6); font-family:monospace;">display: grid;</span>
        </div>
        <div class="center-grid-canvas">
          <div class="center-grid-target">place-items: center;</div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; border-top:1px solid rgba(255,255,255,0.12); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">Horizontal & Vertical Centering Solved</span>
          <button class="sound-mini-btn" onclick="speakText('${card.pronounceText}')" title="Listen">🔊</button>
        </div>
      </div>
    `;
  }

  // 7. Slang vs Formal Comparison Embed
  if (card.slangPhrase && card.formalPhrase) {
    return `
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
  }

  // 8. Scenario / Voice Practice
  if (card.scenario) {
    return `
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
  }

  return '';
}

function renderContinuousFeed() {
  const cards = getFilteredCards();
  const container = document.getElementById('activeSocialCardContainer');
  if (!container) return;

  if (!cards || cards.length === 0) {
    container.innerHTML = `
      <div class="social-post-card" style="text-align:center; padding:30px;">
        <h3 style="color:#fff;">No Stories in this category</h3>
      </div>
    `;
    return;
  }

  container.innerHTML = cards.map((card, idx) => {
    const isSaved = AppState.savedItems.some(i => i.title === card.title);
    const isLiked = AppState.likedCards[card.id] || false;
    const bodyEmbedHtml = renderCardAestheticVisual(card);

    return `
      <article class="social-post-card" id="card-${card.id}">
        
        <!-- Card Top Header Bar -->
        <div class="card-meta-topbar">
          <div class="card-category-tag">
            <span class="cat-tag-icon">${getCategoryIcon(card.category)}</span>
            <span class="cat-tag-label">${getCategoryLabel(card.category)}</span>
          </div>
          
          <div class="card-top-actions">
            ${card.sourceUrl ? `
            <a class="card-icon-action-btn" href="${card.sourceUrl}" target="_blank" rel="noopener noreferrer" title="Read original news on ${card.sourceOutlet || 'source'}">
              <span>🔗 Source</span>
            </a>` : ''}
            <button class="card-icon-action-btn ${isSaved ? 'saved' : ''}" onclick="toggleSaveItem('${card.title.replace(/'/g, "\\'")}', '${card.author}', this)" title="${isSaved ? 'Saved to Vault' : 'Save to Vault'}">
              <span>${isSaved ? '⭐ Saved' : '☆ Save'}</span>
            </button>
            <button class="card-icon-action-btn" onclick="speakText('${(card.pronounceText || card.title).replace(/["']/g, '')}')" title="Listen to Pronunciation">
              <span>🔊 Listen</span>
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

        <!-- Pulse AI Context Note -->
        <div class="x-community-note">
          <div class="note-header">
            <span>⚡ Pulse AI Context Note</span>
          </div>
          <div class="note-body">
            Essential fluency & cultural lore for 2026. Mastered by native speakers and digital creators.
          </div>
        </div>

        <!-- Card Action Footer (Natural scrolling stream, no next buttons) -->
        <div class="card-footer-action-bar">
          <div class="footer-left-actions">
            <button class="card-footer-pill-btn ${isLiked ? 'liked' : ''}" onclick="toggleLikeCard('${card.id}')">
              <span>${isLiked ? '❤️' : '🤍'}</span>
              <span>${card.likesCount + (isLiked ? 1 : 0)}</span>
            </button>
            <button class="card-footer-pill-btn" onclick="askAiAboutCard('${card.title.replace(/'/g, "\\'")}')">
              <span>🤖 Ask AI</span>
            </button>
          </div>
          <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700; letter-spacing: 0.04em;">Story ${idx + 1} of ${cards.length}</span>
        </div>

      </article>
    `;
  }).join('');

  updateReadingProgressStrip();
}

// Interactive Likes directly in place (no page jump)
window.toggleLikeCard = function(cardId) {
  AppState.likedCards[cardId] = !AppState.likedCards[cardId];
  localStorage.setItem('dp_likes', JSON.stringify(AppState.likedCards));
  playSyntheticTone(AppState.likedCards[cardId] ? 784 : 440, 'triangle', 0.08);
  addXp(10);
  
  const cardElement = document.getElementById(`card-${cardId}`);
  if (cardElement) {
    const likeBtn = cardElement.querySelector('.card-footer-pill-btn');
    const card = AppState.dailyCards.find(c => c.id === cardId);
    if (likeBtn && card) {
      const isLiked = AppState.likedCards[cardId];
      likeBtn.classList.toggle('liked', isLiked);
      likeBtn.innerHTML = `<span>${isLiked ? '❤️' : '🤍'}</span> <span>${card.likesCount + (isLiked ? 1 : 0)}</span>`;
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
  const streakCount = document.getElementById('streakCount');
  if (streakCount) streakCount.textContent = AppState.streak;
  const sidebarStreak = document.getElementById('sidebarStreakCount');
  if (sidebarStreak) sidebarStreak.textContent = `${AppState.streak} Day`;
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
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🔍</div>
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
            <div class="titan-avatar-circle avatar-${titan.id.replace('titan-', '')}">${titan.avatar}</div>
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
            <span>🎓</span> <span>Why Every Student Must Know Them</span>
          </div>
          <div class="titan-knowledge-text">
            ${titan.essentialWhy}
          </div>

          <div class="titan-core-box">
            <strong>💡 Core Innovation:</strong> ${titan.coreImpact}
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
              <span>🔊 Listen</span>
            </button>
            <a class="titan-action-pill" href="${titan.sourceUrl}" target="_blank" rel="noopener noreferrer" title="Read original news & profile">
              <span>🔗 Source</span>
            </a>
            <button class="titan-action-pill" onclick="saveTitanToVault('${titan.name.replace(/'/g, "\\'")}', '${titan.role.replace(/'/g, "\\'")}')" title="Save to Vault">
              <span>⭐ Save</span>
            </button>
          </div>
          <button class="titan-ask-ai-btn" onclick="askAiAboutLeader('${titan.name.replace(/'/g, "\\'")}', '${titan.aiPrompt.replace(/'/g, "\\'")}')">
            <span>🤖 Ask AI</span>
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

  // Tech Titans & Leaders Knowledge for Students
  if (q.includes('trump') || q.includes('tariff') || q.includes('policy')) {
    return `<strong>Donald Trump & Tech Policy for Students:</strong><br><br>
    • <strong>Semiconductor Tariffs:</strong> Tariffs on imported chips accelerate the push to manufacture electronics domestically (TSMC Arizona, Intel).<br>
    • <strong>AI Deregulation:</strong> Prioritizing minimal regulatory hurdles allows AI labs to scale compute without bureaucratic delays.<br>
    • <strong>Student Impact:</strong> Energy infrastructure (nuclear/gas for data centers) and STEM visa policies directly dictate which tech companies hire and where compute is built.`;
  }

  if (q.includes('linus') || q.includes('git') || q.includes('linux')) {
    return `<strong>Linus Torvalds, Linux & Git Explained:</strong><br><br>
    • <strong>Linux (1991):</strong> Linus built the Linux kernel as a 21-year-old student. Today, it runs virtually every web server, Android phone, Docker container, and cloud infrastructure on Earth.<br>
    • <strong>Git (2005):</strong> Created in just 14 days when BitKeeper revoked their license. Git revolutionized collaboration, version control, and GitHub.<br>
    • <strong>Student Tip:</strong> Master the Linux command line (bash, ssh, grep, permissions) and Git branching early. It is the #1 foundational skill expected of every junior software engineer.`;
  }

  if (q.includes('jensen') || q.includes('nvidia') || q.includes('cuda')) {
    return `<strong>Jensen Huang & NVIDIA's AI Dominance:</strong><br><br>
    • <strong>The CUDA Gamble (2006):</strong> Jensen spent billions adding parallel computing capability to every gaming GPU, laying the groundwork for Deep Learning 10 years before anyone else realized it.<br>
    • <strong>Advice for Students:</strong> Jensen emphasizes that while AI will handle syntax coding, students must focus on <em>domain expertise</em> (biology, finance, physics, math) and systems architecture.<br>
    • <strong>Key Takeaway:</strong> Learn how memory bandwidth, GPU clustering, and parallel algorithms operate under the hood.`;
  }

  if (q.includes('satya') || q.includes('growth mindset') || q.includes('nadella')) {
    return `<strong>Satya Nadella & Growth Mindset Leadership:</strong><br><br>
    • <strong>The Turnaround:</strong> Shifted Microsoft from defensive Windows monopolies to open-source (acquiring GitHub in 2018), Azure cloud, and the historic $13B partnership with OpenAI.<br>
    • <strong>"Learn-it-all vs. Know-it-all":</strong> Replaced internal arrogance with empathy and continuous learning.<br>
    • <strong>Student Takeaway:</strong> Technology changes every 3 years; having the curiosity to learn new tools fast is far more valuable than being an expert in an obsolete framework.`;
  }

  if (q.includes('altman') || q.includes('openai') || q.includes('reasoning') || q.includes('o1')) {
    return `<strong>Sam Altman & Frontier AI Models:</strong><br><br>
    • <strong>From Next-Token to Reasoning:</strong> With the o1/o3 series, AI models now use "test-time compute"—spending seconds thinking and checking their own logic before generating a response.<br>
    • <strong>Student Impact:</strong> Simple boilerplate coding is automated; engineers now act as architectural orchestrators and system designers directing fleets of AI agents.`;
  }

  if (q.includes('zuck') || q.includes('zuckerberg') || q.includes('llama')) {
    return `<strong>Mark Zuckerberg & Open-Source AI:</strong><br><br>
    • <strong>The Open Weights Revolution:</strong> By giving away Llama 2 and 3 for free, Meta prevented closed AI gatekeepers from monopolizing modern AI infrastructure.<br>
    • <strong>Student Tip:</strong> You can download Llama models locally using tools like Ollama or vLLM to run and fine-tune private AI on your own laptop without paying API fees!`;
  }

  if (q.includes('hassabis') || q.includes('alphafold') || q.includes('nobel')) {
    return `<strong>Demis Hassabis & AlphaFold (2024 Nobel Prize):</strong><br><br>
    • <strong>The Breakthrough:</strong> Solved the 50-year-old protein folding problem, predicting the 3D molecular structure of 200+ million proteins.<br>
    • <strong>Why it Matters:</strong> Proved to the world that Computer Science and AI are now the driving engines of biological discovery and cancer medicine.`;
  }

  if (q.includes('guido') || q.includes('python')) {
    return `<strong>Guido van Rossum & The Power of Python:</strong><br><br>
    • <strong>The Philosophy:</strong> 'Readability counts.' Python prioritized human ergonomics over machine verbosity.<br>
    • <strong>Why it Won AI:</strong> Because researchers could write clean math without worrying about memory pointers, Python became the official wrapper for PyTorch and C++ backend compute.`;
  }

  if (q.includes('vitalik') || q.includes('ethereum') || q.includes('smart contract')) {
    return `<strong>Vitalik Buterin & Ethereum:</strong><br><br>
    • <strong>Smart Contracts:</strong> Turning blockchain from a simple ledger (Bitcoin) into a Turing-complete global decentralized computer.<br>
    • <strong>The Merge:</strong> Successfully shifted Ethereum from Proof of Work to Proof of Stake live on mainnet, cutting global power consumption by 99.95%.`;
  }

  if (q.includes('elon') || q.includes('musk') || q.includes('first principles')) {
    return `<strong>Elon Musk & First-Principles Engineering:</strong><br><br>
    • <strong>The Technique:</strong> Boil things down to fundamental physics truths (e.g., what are the raw material costs of a rocket or battery cell?) rather than reasoning by analogy.<br>
    • <strong>Execution:</strong> Built SpaceX, Tesla, Neuralink, and trained Grok 3 on custom superclusters.`;
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

window.toggleSaveItem = function(title, author, btnElement) {
  const existingIdx = AppState.savedItems.findIndex(i => i.title === title);
  let isSaved = false;
  if (existingIdx > -1) {
    AppState.savedItems.splice(existingIdx, 1);
    isSaved = false;
  } else {
    AppState.savedItems.push({ title, author, date: new Date().toLocaleDateString() });
    addXp(15);
    playSyntheticTone(784, 'triangle', 0.1);
    isSaved = true;
  }
  localStorage.setItem('dp_saved', JSON.stringify(AppState.savedItems));
  renderVaultList();

  if (btnElement) {
    btnElement.classList.toggle('saved', isSaved);
    btnElement.innerHTML = `<span>${isSaved ? '⭐ Saved' : '☆ Save'}</span>`;
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
