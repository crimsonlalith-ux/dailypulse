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

  // 13 Rich Dynamic Cards across categories
  dailyCards: [
    {
      id: 'story-xt-1',
      category: 'tech',
      isXPost: true,
      topicTag: '𝕏 Tech: Reasoning Models',
      author: 'Andrej Karpathy',
      handle: '@karpathy',
      time: '2h ago',
      title: 'Andrej Karpathy on Reasoning LLMs: The Shift to Test-Time Compute',
      xTweetText: 'Deep dive on reasoning models (o1/o3/DeepSeek-R1): The paradigm is shifting from pre-training compute to inference test-time compute. A model spending 2 minutes thinking before answering is fundamentally an agent searching through chain-of-thought tokens using reinforcement learning with verifiable rewards.',
      sourceUrl: 'https://x.com/karpathy',
      sourceOutlet: '𝕏 (formerly Twitter)',
      explanation: '<strong>The Paradigm Shift:</strong> Andrej Karpathy (ex-Tesla AI Director, OpenAI founding scientist) explains that scaling model parameters is giving way to test-time search. Instead of spitting out the first plausible token, models explore alternative solution paths.<br><br><strong>Student Takeaway:</strong> Modern AI engineers must understand search algorithms, tree search, and reward models, not just transformer prompt engineering.',
      pronounceText: 'The paradigm is shifting from pre-training compute to inference test-time compute',
      commentsCount: 940,
      repostsCount: '6.2k',
      likesCount: 28400
    },
    {
      id: 'story-xt-2',
      category: 'tech',
      isXPost: true,
      topicTag: '𝕏 Tech: AI Infrastructure',
      author: 'Sam Altman',
      handle: '@sama',
      time: '4h ago',
      title: 'Sam Altman on The Next Frontier: Gigawatt Clusters & Physical Power Grids',
      xTweetText: 'The compute trajectory is unprecedented. Building gigawatt-class AI clusters requires rewriting how power grids, cooling infrastructure, and optical interconnects operate. The next frontier isn\'t just software—it\'s physical infrastructure, nuclear power, and silicon co-design.',
      sourceUrl: 'https://x.com/sama',
      sourceOutlet: '𝕏 (formerly Twitter)',
      explanation: '<strong>The Hardware Wall:</strong> Sam Altman highlights that frontier AI progress is bottlenecked by physical electricity grids and cooling. Training future foundation models demands multi-gigawatt power, prompting partnerships with nuclear energy and custom silicon fabs.<br><br><strong>Student Takeaway:</strong> Infrastructure, electrical engineering, and systems optimization are just as critical as machine learning algorithms.',
      pronounceText: 'Building gigawatt class AI clusters requires rewriting how power grids and cooling operate',
      commentsCount: 1420,
      repostsCount: '9.8k',
      likesCount: 42100
    },
    {
      id: 'story-xt-3',
      category: 'tech',
      isXPost: true,
      topicTag: '𝕏 Tech: World Models',
      author: 'Yann LeCun',
      handle: '@ylecun',
      time: '6h ago',
      title: 'Yann LeCun on Why LLMs Need World Models (V-JEPA & Objective-Driven AI)',
      xTweetText: 'Autoregressive LLMs cannot achieve human-level intelligence alone because they lack world models and common-sense physics. They predict words, not reality. We need Joint Embedding Predictive Architectures (JEPA) that predict in abstract representation space, not pixel space.',
      sourceUrl: 'https://x.com/ylecun',
      sourceOutlet: '𝕏 (formerly Twitter)',
      explanation: '<strong>The Core Debate:</strong> Meta Chief AI Scientist Yann LeCun argues that simply predicting the next token cannot solve physical reasoning or plan long horizons. Meta\'s V-JEPA architecture learns by watching video and predicting abstract representations rather than generating raw pixels.<br><br><strong>Student Takeaway:</strong> Don\'t treat LLMs as the final architecture; self-supervised world models and non-generative representations are the future.',
      pronounceText: 'Autoregressive models cannot achieve human level intelligence alone because they lack world models',
      commentsCount: 880,
      repostsCount: '4.1k',
      likesCount: 19500
    },
    {
      id: 'story-xt-4',
      category: 'tech',
      isXPost: true,
      topicTag: '𝕏 Tech: Physical AI',
      author: 'Dr. Jim Fan',
      handle: '@DrJimFan',
      time: '8h ago',
      title: 'Jim Fan on Physical AI: Humanoid Robotics Translating Sim-to-Real',
      xTweetText: '2026 is the year of Physical AI. Translating internet-scale video into robot motor policies using simulation-to-real reinforcement learning (Omniverse + Isaac Lab). Robots are learning dexterous manipulation via foundation models that generalize across zero-shot environments.',
      sourceUrl: 'https://x.com/DrJimFan',
      sourceOutlet: '𝕏 (formerly Twitter)',
      explanation: '<strong>Embodied Intelligence:</strong> NVIDIA AI Research Lead Jim Fan describes how foundation models are moving from screens into physical robots. Using physics-accurate GPU simulation (Omniverse), robots practice thousands of years of trial-and-error in hours before deploying to physical hardware.<br><br><strong>Student Takeaway:</strong> Robotics is entering its "ImageNet moment", where generalized neural policies replace rigid hand-coded kinematics.',
      pronounceText: 'Translating internet scale video into robot motor policies using simulation to real reinforcement learning',
      commentsCount: 650,
      repostsCount: '3.4k',
      likesCount: 16800
    },
    {
      id: 'story-xt-5',
      category: 'tech',
      isXPost: true,
      topicTag: '𝕏 Tech: Python Systems',
      author: 'Guido van Rossum',
      handle: '@gvanrossum',
      time: '12h ago',
      title: 'Guido van Rossum on Python 3.13: The No-GIL Free-Threaded Epoch',
      xTweetText: 'Python 3.13 marks a historic milestone: PEP 703 enables free-threaded execution without the Global Interpreter Lock (GIL), unlocking true multi-core CPU parallelism for scientific computing, web workers, and AI data pipelines with zero thread contention.',
      sourceUrl: 'https://x.com/gvanrossum',
      sourceOutlet: '𝕏 (formerly Twitter)',
      explanation: '<strong>Multithreading Unlocked:</strong> Python creator Guido van Rossum celebrates the removal of the 30-year-old Global Interpreter Lock (GIL). Previously, Python could only run one OS thread at a time per process. Now, machine learning preprocessing and data pipelines run in true parallel multi-core mode.<br><br><strong>Student Takeaway:</strong> Understanding GIL elimination, thread safety, and memory management makes you a top-tier Python systems engineer.',
      pronounceText: 'PEP 703 enables free-threaded execution without the Global Interpreter Lock unlocking true multicore parallelism',
      commentsCount: 1100,
      repostsCount: '7.9k',
      likesCount: 31200
    },
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
      scenario: '<strong>Scenario Analysis:</strong> A colleague messages you at 8:15 PM requesting a project status update after business hours. You want to decline politely without working overtime. What would you say?',
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
      scenario: '<strong>Scenario Analysis:</strong> You realize you cannot finish a project report by 5:00 PM today without sacrificing quality. How do you request an extension from your manager?',
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
  
  if (AppState.activeCategory !== 'all') {
    if (AppState.activeCategory === 'xtech') {
      pool = pool.filter(c => c.isXPost || c.category === 'tech');
    } else {
      pool = pool.filter(c => c.category === AppState.activeCategory);
    }
  }

  // Filter out posts already seen by the user
  const unseenCards = pool.filter(c => !AppState.seenPosts.has(c.title));

  // If fewer than 4 unseen cards, pull unseen items from INFINITE_STORIES_POOL
  if (unseenCards.length < 4) {
    const infiniteUnseen = INFINITE_STORIES_POOL.filter(s => {
      const matchCat = (AppState.activeCategory === 'all') || 
                       (AppState.activeCategory === 'xtech' && (s.isXPost || s.category === 'tech')) ||
                       (s.category === AppState.activeCategory);
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
  // Progress and task bars eliminated as requested
}

function getCategoryIcon(cat) {
  const map = {
    slang: `<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`,
    trend: `<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    reply: `<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    tech: `<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    icon: `<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`
  };
  return map[cat] || `<svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
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
// 5. CONTINUOUS INFINITE SCROLL FEED
// ==========================================
let infiniteScrollObserver = null;
let isFetchingInfiniteBatch = false;
let infiniteStoryIndex = 0;

// High-Yield Infinite Stories Pool
const INFINITE_STORIES_POOL = [
  {
    topicTag: '𝕏 Tech: GPU Clusters',
    category: 'tech',
    isXPost: true,
    author: 'Greg Brockman',
    handle: '@gdb',
    time: '1d ago',
    title: 'Greg Brockman on Cluster Resilience: Training Across 100k GPUs Without Downtime',
    xTweetText: 'When you run distributed training across 100,000 GPUs, hardware failures are continuous. Our infrastructure team solved zero-downtime hot-swapping of nodes and sub-second asynchronous checkpointing directly to NVMe fabric. Systems engineering is what turns theory into models.',
    sourceUrl: 'https://x.com/gdb',
    sourceOutlet: '𝕏 (formerly Twitter)',
    explanation: '<strong>Distributed Reliability:</strong> OpenAI President Greg Brockman explains that hardware MTBF (Mean Time Between Failures) at massive cluster scale means GPUs fail every few hours. Transparent node failover and fast checkpointing prevent weeks of wasted compute.<br><br><strong>Student Takeaway:</strong> High-performance distributed systems, NCCL communication, and fault tolerance are among the most lucrative engineering skills today.',
    pronounceText: 'Systems engineering is what turns machine learning theory into working foundation models',
    commentsCount: 790,
    repostsCount: '4.8k',
    likesCount: 22400
  },
  {
    topicTag: '𝕏 Tech: Founder Velocity',
    category: 'tech',
    isXPost: true,
    author: 'Paul Graham',
    handle: '@paulg',
    time: '1d ago',
    title: 'Paul Graham on Why Technical Founders Who Code Build the Strongest AI Companies',
    xTweetText: 'In AI today, the technology changes so rapidly that non-technical CEOs cannot make product decisions fast enough. The strongest founders are the engineers who understand model weights, latency, and context limits directly and can ship prototypes over a weekend.',
    sourceUrl: 'https://x.com/paulg',
    sourceOutlet: '𝕏 (formerly Twitter)',
    explanation: '<strong>Technical Velocity:</strong> Y Combinator co-founder Paul Graham stresses that AI startup founders must write code themselves to feel the edges of what models can and cannot do.<br><br><strong>Student Takeaway:</strong> Deep technical mastery coupled with shipping speed is the ultimate superpower in modern tech.',
    pronounceText: 'The strongest founders are the engineers who understand model weights latency and context limits directly',
    commentsCount: 1350,
    repostsCount: '8.2k',
    likesCount: 38900
  },
  {
    topicTag: 'DeepSeek V3',
    category: 'tech',
    author: 'AI Open Source Watch',
    handle: '@deepseeknews',
    flair: 'r/MachineLearning',
    time: 'Live',
    title: 'DeepSeek-V3: The Open-Weights Architecture Shaking Global Tech',
    sourceUrl: 'https://www.reuters.com/technology/artificial-intelligence/deepseek-ai-model-open-source-2025/',
    sourceOutlet: 'Reuters & MIT Tech Review',
    explanation: '<strong>The Breakthrough:</strong> DeepSeek launched V3 with Multi-head Latent Attention (MLA) and DeepSeekMoE architecture, delivering GPT-4o tier reasoning at a fraction of training compute.<br><br><strong>Key Vocabulary:</strong> <em>"Compute efficiency"</em> means achieving maximum machine intelligence using minimal electricity and GPU cycles.',
    pronounceText: 'DeepSeek V3 achieves frontier reasoning efficiency with open weights architecture',
    commentsCount: 1840,
    repostsCount: '6.8k',
    likesCount: 28400
  },
  {
    topicTag: 'Rust Mandate',
    category: 'tech',
    author: 'Systems Engineering Pulse',
    handle: '@systems_core',
    flair: 'r/rust',
    time: '4h ago',
    title: 'White House & CISA Urge Developers to Transition to Memory-Safe Languages (Rust)',
    sourceUrl: 'https://arstechnica.com/information-technology/2024/02/white-house-urges-developers-to-dump-c-and-c-for-memory-safe-languages/',
    sourceOutlet: 'Ars Technica',
    explanation: '<strong>Why It Matters:</strong> Over 70% of historical cybersecurity vulnerabilities in C and C++ stem from buffer overflows and dangling pointers. The White House and CISA officially recommended memory-safe languages like Rust.<br><br><strong>Fluency Tip:</strong> <em>"Memory safety"</em> refers to programming languages preventing code from accessing invalid RAM addresses.',
    pronounceText: 'The White House urges software engineers to adopt memory safe languages like Rust',
    commentsCount: 920,
    repostsCount: '3.1k',
    likesCount: 14200
  },
  {
    topicTag: 'AlphaFold Nobel',
    category: 'icon',
    author: 'Scientific Breakthroughs',
    handle: '@nobelradar',
    flair: 'r/science',
    time: '6h ago',
    title: 'Demis Hassabis & John Jumper Awarded Nobel Prize in Chemistry for AlphaFold',
    sourceUrl: 'https://www.nobelprize.org/prizes/chemistry/2024/summary/',
    sourceOutlet: 'The Nobel Prize Official & Nature',
    explanation: '<strong>The 50-Year Grand Challenge:</strong> Demis Hassabis and John Jumper at Google DeepMind solved the 50-year protein folding problem with AlphaFold, predicting 200 million protein structures.<br><br><strong>Student Insight:</strong> Combines computational graph neural networks with biophysics, accelerating drug discovery from decades to seconds.',
    pronounceText: 'Demis Hassabis received the Nobel Prize in Chemistry for AlphaFold protein structure prediction',
    commentsCount: 2400,
    repostsCount: '8.9k',
    likesCount: 39500
  },
  {
    topicTag: 'Python 3.13 No-GIL',
    category: 'tech',
    author: 'Python Core Developers',
    handle: '@pythontrend',
    flair: 'r/python',
    time: '1d ago',
    title: 'Python 3.13 Officially Introduces Free-Threaded Mode (No-GIL)',
    sourceUrl: 'https://www.infoworld.com/article/3715560/python-3-13-preview-free-threading-comes-to-python.html',
    sourceOutlet: 'InfoWorld & Python Software Foundation',
    explanation: '<strong>The 30-Year Barrier:</strong> For decades, the Global Interpreter Lock (GIL) prevented Python threads from running concurrently on multiple CPU cores. Python 3.13 enables free-threaded execution.<br><br><strong>Term to Know:</strong> <em>"True parallelism"</em> means CPU threads executing simultaneously on separate physical processor cores.',
    pronounceText: 'Python three point thirteen introduces free threaded execution without the global interpreter lock',
    commentsCount: 1120,
    repostsCount: '4.2k',
    likesCount: 18700
  },
  {
    topicTag: 'Touch Grass',
    category: 'slang',
    author: 'Digital Wellness & Lore',
    handle: '@modernslang',
    flair: 'r/OutOfTheLoop',
    time: 'Live',
    title: '"Touch Grass": The Universal Cultural Call to Disconnect from the Screen',
    slangPhrase: '"Bro, you have been arguing on Reddit for 8 hours. Go touch grass."',
    formalPhrase: '"I suggest stepping away from your screen and re-engaging with the physical world."',
    pronounceText: 'I suggest stepping away from your screen and re-engaging with the physical world',
    sourceUrl: 'https://knowyourmeme.com/memes/touch-grass',
    sourceOutlet: 'Know Your Meme',
    explanation: '<strong>Cultural Lore:</strong> Originated as gaming slang used to mock players who spend all day indoors. Now recognized in mainstream dictionaries as a phrase for digital mindfulness and mental grounding.',
    commentsCount: 640,
    repostsCount: '2.4k',
    likesCount: 12400
  },
  {
    topicTag: 'Negotiating Salary',
    category: 'reply',
    author: 'Executive Career Mentor',
    handle: '@careeredge',
    flair: 'r/careerguidance',
    time: '3h ago',
    title: 'How to Professionally Counter an Initial Job Offer',
    scenario: 'You received a software engineering offer of $90,000, but market rate for your skillset is $105,000. How do you counter with confidence?',
    slangPhrase: '"Nah that offer is way too low, you gotta pay me more."',
    formalPhrase: '"Thank you for the offer. Based on my research and the specific impact I will bring, I was expecting a range closer to $105,000. Is there flexibility here?"',
    pronounceText: 'Thank you for the offer. Based on my research and the specific impact I will bring, I was expecting a range closer to one hundred and five thousand dollars.',
    sourceUrl: 'https://hbr.org/2014/04/15-rules-for-negotiating-a-job-offer',
    sourceOutlet: 'Harvard Business Review',
    explanation: '<strong>Professional Etiquette:</strong> Always express gratitude first, cite market benchmark data rather than personal expenses, and ask open questions about compensation flexibility.',
    commentsCount: 880,
    repostsCount: '3.7k',
    likesCount: 16800
  },
  {
    topicTag: 'Claude 3.5 Sonnet',
    category: 'tech',
    author: 'Frontier AI Laboratory',
    handle: '@anthropicnews',
    flair: 'r/artificial',
    time: '5h ago',
    title: 'Anthropic Launches Claude 3.5 Sonnet with Computer Use Capability',
    sourceUrl: 'https://techcrunch.com/2024/10/22/anthropic-claude-3-5-sonnet-computer-use/',
    sourceOutlet: 'TechCrunch',
    explanation: '<strong>Autonomous GUI Agents:</strong> Claude 3.5 Sonnet became the first frontier model capable of directly controlling desktop computers by moving the mouse, clicking buttons, and typing text across web applications.<br><br><strong>Engineering Term:</strong> <em>"Action space"</em> represents the set of possible actions (clicks, keypresses) an AI model can take in an environment.',
    pronounceText: 'Anthropic launched Claude three point five Sonnet with autonomous computer use capabilities',
    commentsCount: 1540,
    repostsCount: '5.9k',
    likesCount: 26100
  },
  {
    topicTag: 'Roman Empire',
    category: 'slang',
    author: 'Viral Trend Tracker',
    handle: '@historiclore',
    flair: 'r/tiktoktrends',
    time: '12h ago',
    title: '"How Often Do You Think About the Roman Empire?"',
    slangPhrase: '"That concept has become my personal Roman Empire."',
    formalPhrase: '"That particular subject occupies my thoughts on a remarkably frequent basis."',
    pronounceText: 'That particular subject occupies my thoughts on a remarkably frequent basis',
    sourceUrl: 'https://www.washingtonpost.com/lifestyle/2023/09/14/roman-empire-trend-tiktok-women-men/',
    sourceOutlet: 'The Washington Post',
    explanation: '<strong>The Viral Lore:</strong> A global social experiment where women asked men how often they think about ancient Rome, discovering millions think about it daily. Now used as slang for any topic you are quietly obsessed with.',
    commentsCount: 2200,
    repostsCount: '9.4k',
    likesCount: 34200
  },
  {
    topicTag: 'xAI Colossus',
    category: 'icon',
    author: 'Silicon Supercomputers',
    handle: '@elonwire',
    flair: 'r/hardware',
    time: '8h ago',
    title: 'Elon Musk Activates 100,000 Liquid-Cooled H100 GPU Cluster in Memphis (Colossus)',
    sourceUrl: 'https://www.tomshardware.com/tech-industry/artificial-intelligence/elon-musk-reveals-xai-100k-gpu-colossus-cluster-brought-online-in-just-122-days',
    sourceOutlet: 'Tom\'s Hardware & CNBC',
    explanation: '<strong>122 Days to Deployment:</strong> Built in Memphis, Tennessee in just 122 days, Colossus connects 100,000 liquid-cooled Nvidia H100 GPUs via a flat RoCE Ethernet fabric to train Grok 3.<br><br><strong>Student Relevance:</strong> Demonstrates high-performance computing infrastructure at hyperscale.',
    pronounceText: 'Elon Musk brought the one hundred thousand liquid cooled GPU Colossus cluster online in Memphis',
    commentsCount: 1980,
    repostsCount: '7.3k',
    likesCount: 31200
  },
  {
    topicTag: 'WebGPU',
    category: 'tech',
    author: 'Web Standards Group',
    handle: '@browsertech',
    flair: 'r/webdev',
    time: '2d ago',
    title: 'WebGPU Replaces WebGL: Delivering Native Graphics & On-Device ML to Browsers',
    sourceUrl: 'https://developer.chrome.com/docs/web-platform/webgpu',
    sourceOutlet: 'Chrome Developers & W3C',
    explanation: '<strong>The New Web Standard:</strong> WebGPU provides modern low-overhead access to Vulkan, Metal, and DirectX 12 hardware APIs from JavaScript, enabling local LLMs and neural rendering to run inside browsers with zero installation.<br><br><strong>Student Takeaway:</strong> Bridges the performance gap between native desktop software and web applications.',
    pronounceText: 'WebGPU brings native hardware graphics and in browser neural machine learning to web applications',
    commentsCount: 840,
    repostsCount: '2.9k',
    likesCount: 13500
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
  // 0. Twitter / 𝕏 Tech News Post Embed
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
          <button class="x-source-brand-pill clickable-pill" onclick="openRealApp(event, '${(card.sourceUrl || ('https://x.com/' + (card.handle ? card.handle.replace('@','') : ''))).replace(/'/g, "\\'")}', 'x')" title="Open post directly in 𝕏 app">
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

  // 1. Charli XCX Brat Summer
  if (card.id === 'story-1' || card.topicTag === 'Brat Summer') {
    return `
      <div class="aesthetic-visual-banner art-brat-summer" style="background: radial-gradient(circle at 50% 40%, rgba(138, 206, 0, 0.22) 0%, rgba(12, 18, 5, 0.95) 100%); border: 1px solid rgba(138, 206, 0, 0.4);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(138,206,0,0.15); border-color:rgba(138,206,0,0.5); color:#8ace00;">
            <svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>VIRAL AESTHETIC • PANTONE 3507 C</span>
          </span>
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700;">Charli XCX</span>
        </div>
        
        <div class="art-vector-card" style="background: rgba(138,206,0,0.06); border: 1px solid rgba(138,206,0,0.25); height: 90px; margin: 12px 0;">
          <svg viewBox="0 0 320 80" fill="none" style="width:100%; height:80px;">
            <text x="160" y="44" fill="#8ace00" font-size="34" font-weight="900" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" letter-spacing="-2px">brat</text>
            <path d="M20 62 Q 90 48, 160 62 T 300 62" stroke="#8ace00" stroke-width="1.8" fill="none" opacity="0.6"/>
            <path d="M40 68 Q 100 56, 160 68 T 280 68" stroke="#ffffff" stroke-width="1" stroke-dasharray="2 3" fill="none" opacity="0.4"/>
          </svg>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(138,206,0,0.25); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">Collins Dictionary Word of the Year</span>
          ${soundBtn(card.pronounceText, '#8ace00')}
        </div>
      </div>
    `;
  }

  // 2. Jensen Huang NVIDIA Blackwell
  if (card.id === 'story-4' || card.topicTag === 'Jensen Huang') {
    return `
      <div class="aesthetic-visual-banner art-jensen-nvidia" style="background: radial-gradient(circle at 80% 20%, rgba(118, 185, 0, 0.25) 0%, rgba(8, 12, 6, 0.95) 100%); border: 1px solid rgba(118, 185, 0, 0.45);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(118,185,0,0.15); border-color:rgba(118,185,0,0.5); color:#76b900;">
            <svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            <span>NVIDIA BLACKWELL B200 • 208B TRANSISTORS</span>
          </span>
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700;">GTC Global Keynote</span>
        </div>
        
        <div class="art-vector-card" style="background: rgba(0,0,0,0.7); border: 1px solid rgba(118,185,0,0.3); height: 95px; margin: 12px 0;">
          <svg viewBox="0 0 320 90" fill="none" style="width:100%; height:90px;">
            <rect x="25" y="8" width="270" height="74" rx="6" stroke="rgba(118,185,0,0.4)" stroke-width="1.2" fill="rgba(8,16,6,0.85)"/>
            <rect x="40" y="16" width="105" height="58" rx="4" stroke="#76b900" stroke-width="1.8" fill="rgba(118,185,0,0.15)"/>
            <text x="92" y="38" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle" font-family="system-ui">B200 MONOLITH A</text>
            <text x="92" y="54" fill="#76b900" font-size="8" font-weight="700" text-anchor="middle" font-family="monospace">104B TRANSISTORS</text>
            <rect x="152" y="24" width="16" height="42" rx="2" stroke="#ffffff" stroke-width="1.2" fill="rgba(255,255,255,0.1)"/>
            <line x1="155" y1="32" x2="165" y2="32" stroke="#ffffff" stroke-width="1.2"/>
            <line x1="155" y1="39" x2="165" y2="39" stroke="#ffffff" stroke-width="1.2"/>
            <line x1="155" y1="46" x2="165" y2="46" stroke="#ffffff" stroke-width="1.2"/>
            <line x1="155" y1="53" x2="165" y2="53" stroke="#ffffff" stroke-width="1.2"/>
            <rect x="175" y="16" width="105" height="58" rx="4" stroke="#76b900" stroke-width="1.8" fill="rgba(118,185,0,0.15)"/>
            <text x="227" y="38" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle" font-family="system-ui">B200 MONOLITH B</text>
            <text x="227" y="54" fill="#76b900" font-size="8" font-weight="700" text-anchor="middle" font-family="monospace">104B TRANSISTORS</text>
          </svg>
        </div>

        <div style="font-size:0.92rem; font-weight:700; color:#ffffff; line-height:1.35; margin-bottom:8px;">
          "Domain expertise and problem-solving is the new coding syntax."
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(118,185,0,0.25); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">Powering Frontier AI Superclusters</span>
          ${soundBtn(card.pronounceText, '#76b900')}
        </div>
      </div>
    `;
  }

  // 3. Real Madrid Champions League
  if (card.id === 'story-11' || card.topicTag === 'Real Madrid') {
    return `
      <div class="aesthetic-visual-banner art-real-madrid" style="background: radial-gradient(circle at 50% 30%, rgba(234, 179, 8, 0.22) 0%, rgba(15, 23, 42, 0.95) 100%); border: 1px solid rgba(234, 179, 8, 0.45);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(234,179,8,0.15); border-color:rgba(234,179,8,0.5); color:#facc15;">
            <svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            <span>15× CHAMPIONS OF EUROPE • UCL DNA</span>
          </span>
          <span style="font-size:0.75rem; color:#facc15; font-weight:800; letter-spacing:0.04em;">XV TROPHIES</span>
        </div>

        <div class="art-vector-card" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(234,179,8,0.3); height: 95px; margin: 12px 0;">
          <svg viewBox="0 0 320 90" fill="none" style="width:100%; height:90px;">
            <circle cx="160" cy="45" r="36" stroke="rgba(234,179,8,0.4)" stroke-width="1.5" />
            <path d="M142 28 L178 28 L172 58 C172 66 148 66 148 58 Z" stroke="#facc15" stroke-width="2" fill="rgba(250,204,21,0.2)" />
            <path d="M136 34 C124 34 124 48 143 51" stroke="#facc15" stroke-width="1.8" fill="none" />
            <path d="M184 34 C196 34 196 48 177 51" stroke="#facc15" stroke-width="1.8" fill="none" />
            <line x1="154" y1="64" x2="166" y2="64" stroke="#facc15" stroke-width="2" />
            <line x1="148" y1="72" x2="172" y2="72" stroke="#facc15" stroke-width="2.5" />
            <line x1="160" y1="64" x2="160" y2="72" stroke="#facc15" stroke-width="2" />
            <text x="60" y="48" fill="rgba(255,255,255,0.75)" font-size="9" font-weight="700" text-anchor="middle" font-family="system-ui">SANTIAGO BERNABÉU</text>
            <text x="260" y="48" fill="rgba(255,255,255,0.75)" font-size="9" font-weight="700" text-anchor="middle" font-family="system-ui">MIRACLE MINUTES</text>
          </svg>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(234,179,8,0.25); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">Unmatched European Football Dominance</span>
          ${soundBtn(card.pronounceText, '#facc15')}
        </div>
      </div>
    `;
  }

  // 4. IShowSpeed High Voltage Broadcast
  if (card.id === 'story-12' || card.topicTag === 'IShowSpeed') {
    return `
      <div class="aesthetic-visual-banner art-ishowspeed" style="background: radial-gradient(circle at 50% 50%, rgba(234,179,8,0.18), rgba(126,34,206,0.25) 50%, rgba(0,0,0,0.95) 100%); border: 1px solid rgba(234,179,8,0.45);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(234,179,8,0.18); border-color:rgba(234,179,8,0.5); color:#facc15;">
            <svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            <span>LIVE IRL STREAMING • 2.5B VIEWS</span>
          </span>
          <span style="font-size:0.75rem; color:#facc15; font-weight:800; font-family:monospace;">BROADCAST 4K</span>
        </div>

        <div class="art-vector-card" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(168,85,247,0.3); height: 85px; margin: 12px 0;">
          <svg viewBox="0 0 320 80" fill="none" style="width:100%; height:80px;">
            <circle cx="36" cy="40" r="14" stroke="#facc15" stroke-width="1.8" />
            <polygon points="32,32 44,40 32,48" fill="#facc15" />
            <path d="M65 40 L85 40 L95 18 L105 62 L115 28 L125 50 L135 40 L160 40 L170 22 L180 58 L190 32 L200 46 L210 40 L245 40" stroke="#c084fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <text x="280" y="44" fill="#facc15" font-size="9" font-weight="800" font-family="monospace">IRL FEED</text>
          </svg>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(234,179,8,0.25); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">High-Voltage Global Creator Tours</span>
          ${soundBtn(card.pronounceText, '#facc15')}
        </div>
      </div>
    `;
  }

  // 5. Sam Altman / OpenAI o3 Reasoning
  if (card.id === 'story-9' || card.topicTag === 'Sam Altman') {
    return `
      <div class="aesthetic-visual-banner art-sam-altman" style="background: radial-gradient(circle at 50% 40%, rgba(6, 182, 212, 0.22) 0%, rgba(124, 58, 237, 0.2) 60%, rgba(0, 0, 0, 0.95) 100%); border: 1px solid rgba(6, 182, 212, 0.45);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(6,182,212,0.18); border-color:rgba(6,182,212,0.5); color:#22d3ee;">
            <svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3c0 4.5-3.5 8-8 8 4.5 0 8 3.5 8 8 0-4.5 3.5-8 8-8-4.5 0-8-3.5-8-8z"></path></svg>
            <span>FRONTIER REASONING • o1 & o3 AGI</span>
          </span>
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700;">OpenAI Architecture</span>
        </div>

        <div class="art-vector-card" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(6,182,212,0.3); height: 85px; margin: 12px 0;">
          <svg viewBox="0 0 320 80" fill="none" style="width:100%; height:80px;">
            <circle cx="36" cy="40" r="9" stroke="#22d3ee" stroke-width="1.8" fill="rgba(34,211,238,0.2)" />
            <text x="36" y="44" fill="#ffffff" font-size="8.5" font-weight="800" text-anchor="middle">IN</text>
            <path d="M46 40 L84 24 M46 40 L84 56" stroke="rgba(34,211,238,0.5)" stroke-width="1.5" />
            <circle cx="95" cy="24" r="8" stroke="#38bdf8" stroke-width="1.5" fill="rgba(56,189,248,0.2)" />
            <circle cx="95" cy="56" r="8" stroke="#38bdf8" stroke-width="1.5" fill="rgba(56,189,248,0.2)" />
            <path d="M104 24 L150 34 M104 56 L150 46" stroke="rgba(34,211,238,0.5)" stroke-width="1.5" />
            <circle cx="162" cy="40" r="10" stroke="#c084fc" stroke-width="2" fill="rgba(192,132,252,0.2)" />
            <text x="162" y="44" fill="#ffffff" font-size="7.5" font-weight="800" text-anchor="middle">DELIB</text>
            <path d="M173 40 L220 40" stroke="#22d3ee" stroke-width="1.8" stroke-dasharray="3 3" />
            <circle cx="235" cy="40" r="11" stroke="#4ade80" stroke-width="2" fill="rgba(74,222,128,0.2)" />
            <text x="235" y="44" fill="#ffffff" font-size="8" font-weight="800" text-anchor="middle">VERIF</text>
            <text x="282" y="44" fill="#22d3ee" font-size="9.5" font-weight="800" font-family="monospace">o3 AGI</text>
          </svg>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(6,182,212,0.25); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">Test-Time Deliberation & Proof Search</span>
          ${soundBtn(card.pronounceText, '#22d3ee')}
        </div>
      </div>
    `;
  }

  // 6. Centering a Div CSS Pattern
  if (card.id === 'story-3' || card.topicTag === 'Center Div') {
    return `
      <div class="aesthetic-visual-banner art-center-div" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.2);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(255,255,255,0.08); color:#ffffff;">
            <svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            <span>MODERN CSS GRID PATTERN</span>
          </span>
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.6); font-family:monospace;">display: grid;</span>
        </div>

        <div class="art-vector-card" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.18); height: 85px; margin: 12px 0;">
          <svg viewBox="0 0 320 80" fill="none" style="width:100%; height:80px;">
            <rect x="25" y="8" width="270" height="64" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" stroke-dasharray="4 4" fill="rgba(255,255,255,0.02)"/>
            <line x1="25" y1="40" x2="295" y2="40" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
            <line x1="160" y1="8" x2="160" y2="72" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
            <rect x="105" y="25" width="110" height="30" rx="4" stroke="#ffffff" stroke-width="1.8" fill="rgba(255,255,255,0.12)"/>
            <text x="160" y="44" fill="#ffffff" font-size="9" font-weight="800" text-anchor="middle" font-family="monospace">place-items: center;</text>
          </svg>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.15); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:600;">The 2-Line CSS Perfection Standard</span>
          ${soundBtn(card.pronounceText, '#ffffff')}
        </div>
      </div>
    `;
  }

  // 7. DeepSeek V3 Architecture
  if (card.topicTag === 'DeepSeek V3') {
    return `
      <div class="aesthetic-visual-banner" style="background: radial-gradient(circle at top right, rgba(6,182,212,0.22), rgba(99,102,241,0.15), rgba(0,0,0,0.95)); border: 1px solid rgba(6,182,212,0.45);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(6,182,212,0.18); border-color:rgba(6,182,212,0.5); color:#22d3ee;">
            <svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3c0 4.5-3.5 8-8 8 4.5 0 8 3.5 8 8 0-4.5 3.5-8 8-8-4.5 0-8-3.5-8-8z"></path></svg>
            <span>MULTI-HEAD LATENT ATTENTION (MLA)</span>
          </span>
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700;">671B MoE Model</span>
        </div>

        <div class="art-vector-card" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(6,182,212,0.3); height: 85px; margin: 12px 0;">
          <svg viewBox="0 0 320 80" fill="none" style="width:100%; height:80px;">
            <rect x="25" y="10" width="70" height="60" rx="4" stroke="#22d3ee" stroke-width="1.5" fill="rgba(34,211,238,0.15)"/>
            <text x="60" y="36" fill="#ffffff" font-size="8.5" font-weight="800" text-anchor="middle">MLA KV</text>
            <text x="60" y="50" fill="#22d3ee" font-size="7.5" font-weight="700" text-anchor="middle">COMPRESS</text>
            <path d="M96 40 L140 22 M96 40 L140 40 M96 40 L140 58" stroke="rgba(34,211,238,0.5)" stroke-width="1.5"/>
            <rect x="145" y="12" width="60" height="18" rx="2" stroke="#818cf8" stroke-width="1.2" fill="rgba(129,140,248,0.15)"/>
            <rect x="145" y="31" width="60" height="18" rx="2" stroke="#818cf8" stroke-width="1.2" fill="rgba(129,140,248,0.15)"/>
            <rect x="145" y="50" width="60" height="18" rx="2" stroke="#818cf8" stroke-width="1.2" fill="rgba(129,140,248,0.15)"/>
            <text x="175" y="24" fill="#ffffff" font-size="7" font-weight="800" text-anchor="middle">ROUTER A</text>
            <text x="175" y="43" fill="#ffffff" font-size="7" font-weight="800" text-anchor="middle">ROUTER B</text>
            <text x="175" y="62" fill="#ffffff" font-size="7" font-weight="800" text-anchor="middle">ROUTER C</text>
            <path d="M206 40 L240 40" stroke="#4ade80" stroke-width="1.8"/>
            <rect x="245" y="16" width="55" height="48" rx="4" stroke="#4ade80" stroke-width="1.5" fill="rgba(74,222,128,0.15)"/>
            <text x="272" y="38" fill="#ffffff" font-size="8" font-weight="800" text-anchor="middle">8/256</text>
            <text x="272" y="50" fill="#4ade80" font-size="7" font-weight="700" text-anchor="middle">EXPERTS</text>
          </svg>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(6,182,212,0.25); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">Open-Weights Engineering Breakthrough</span>
          ${soundBtn(card.pronounceText, '#22d3ee')}
        </div>
      </div>
    `;
  }

  // 8. Memory Safety & Rust
  if (card.topicTag === 'Rust Memory Safety') {
    return `
      <div class="aesthetic-visual-banner" style="background: radial-gradient(circle at top right, rgba(249,115,22,0.22), rgba(220,38,38,0.15), rgba(0,0,0,0.95)); border: 1px solid rgba(249,115,22,0.45);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(249,115,22,0.18); border-color:rgba(249,115,22,0.5); color:#fb923c;">
            <svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span>MEMORY SAFETY MANDATE • CISA STANDARDS</span>
          </span>
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700;">Systems Code</span>
        </div>

        <div class="art-vector-card" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(249,115,22,0.3); height: 85px; margin: 12px 0;">
          <svg viewBox="0 0 320 80" fill="none" style="width:100%; height:80px;">
            <path d="M160 12 L195 24 L190 56 L160 70 L130 56 L125 24 Z" stroke="#fb923c" stroke-width="2" fill="rgba(249,115,22,0.2)"/>
            <polyline points="148 40 156 48 174 30" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <text x="60" y="44" fill="rgba(255,255,255,0.75)" font-size="8.5" font-weight="700" text-anchor="middle" font-family="monospace">0× BUFFER OVERFLOW</text>
            <text x="260" y="44" fill="rgba(255,255,255,0.75)" font-size="8.5" font-weight="700" text-anchor="middle" font-family="monospace">COMPILE-TIME BORROW</text>
          </svg>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(249,115,22,0.25); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">Systems Engineering Gold Standard</span>
          ${soundBtn(card.pronounceText, '#fb923c')}
        </div>
      </div>
    `;
  }

  // 9. AlphaFold Nobel Prize
  if (card.topicTag === 'AlphaFold Nobel') {
    return `
      <div class="aesthetic-visual-banner" style="background: radial-gradient(circle at top right, rgba(234,179,8,0.25), rgba(16,185,129,0.18), rgba(0,0,0,0.95)); border: 1px solid rgba(234,179,8,0.45);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(234,179,8,0.18); border-color:rgba(234,179,8,0.5); color:#facc15;">
            <svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>
            <span>NOBEL PRIZE IN CHEMISTRY • 200M PROTEINS</span>
          </span>
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700;">Google DeepMind</span>
        </div>

        <div class="art-vector-card" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(234,179,8,0.3); height: 85px; margin: 12px 0;">
          <svg viewBox="0 0 320 80" fill="none" style="width:100%; height:80px;">
            <path d="M40 20 Q 90 60, 140 20 T 240 20 T 300 20" stroke="#10b981" stroke-width="2" fill="none"/>
            <path d="M40 60 Q 90 20, 140 60 T 240 60 T 300 60" stroke="#3b82f6" stroke-width="2" fill="none"/>
            <line x1="90" y1="36" x2="90" y2="44" stroke="#facc15" stroke-width="1.8"/>
            <line x1="140" y1="20" x2="140" y2="60" stroke="#facc15" stroke-width="1.8"/>
            <line x1="190" y1="36" x2="190" y2="44" stroke="#facc15" stroke-width="1.8"/>
            <line x1="240" y1="20" x2="240" y2="60" stroke="#facc15" stroke-width="1.8"/>
          </svg>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(234,179,8,0.25); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">Transforming Global Molecular Medicine</span>
          ${soundBtn(card.pronounceText, '#facc15')}
        </div>
      </div>
    `;
  }

  // 10. Claude 3.5 Sonnet Computer Use
  if (card.topicTag === 'Claude 3.5 Sonnet') {
    return `
      <div class="aesthetic-visual-banner" style="background: radial-gradient(circle at top right, rgba(217,119,6,0.25), rgba(244,63,94,0.15), rgba(0,0,0,0.95)); border: 1px solid rgba(217,119,6,0.45);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="art-meta-tag" style="background:rgba(217,119,6,0.18); border-color:rgba(217,119,6,0.5); color:#fbbf24;">
            <svg class="cat-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            <span>AUTONOMOUS COMPUTER USE • AGENT API</span>
          </span>
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.7); font-weight:700;">Anthropic</span>
        </div>

        <div class="art-vector-card" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(217,119,6,0.3); height: 85px; margin: 12px 0;">
          <svg viewBox="0 0 320 80" fill="none" style="width:100%; height:80px;">
            <rect x="25" y="8" width="270" height="64" rx="4" stroke="rgba(255,255,255,0.2)" stroke-width="1.2" fill="rgba(15,15,18,0.9)"/>
            <circle cx="38" cy="18" r="2.5" fill="#ef4444"/>
            <circle cx="46" cy="18" r="2.5" fill="#facc15"/>
            <circle cx="54" cy="18" r="2.5" fill="#22c55e"/>
            <text x="36" y="38" fill="#4ade80" font-size="8" font-family="monospace">$ claude-agent execute --task "deploy"</text>
            <text x="36" y="52" fill="rgba(255,255,255,0.8)" font-size="8" font-family="monospace">→ Cursor moved to (x:840, y:520), clicked [Merge]</text>
            <polygon points="215,48 225,56 220,57 222,62 219,63 217,58 213,60" fill="#ffffff" stroke="#000000" stroke-width="0.8"/>
          </svg>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(217,119,6,0.25); padding-top:10px;">
          <span style="font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600;">Autonomous Human-Like Screen Navigation</span>
          ${soundBtn(card.pronounceText, '#fbbf24')}
        </div>
      </div>
    `;
  }

  // 11. Slang vs Formal Comparison Embed
  if (card.slangPhrase && card.formalPhrase) {
    return `
      <div class="slang-formal-embed">
        <div class="embed-quote-row">
          <div>
            <span class="quote-label-tag slang-color">Casual / Vernacular</span>
            <span class="quote-phrase-text">${card.slangPhrase}</span>
          </div>
          <button class="sound-mini-btn" onclick="speakText('${card.slangPhrase.replace(/["']/g, '')}')" title="Listen">
            <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            <span>Listen</span>
          </button>
        </div>
        <div class="embed-quote-row">
          <div>
            <span class="quote-label-tag formal-color">Executive / Fluent English</span>
            <span class="quote-phrase-text">${card.formalPhrase}</span>
          </div>
          <button class="sound-mini-btn" onclick="speakText('${card.formalPhrase.replace(/["']/g, '')}')" title="Listen">
            <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            <span>Listen</span>
          </button>
        </div>
      </div>
    `;
  }

  // 12. Scenario / Voice Practice
  if (card.scenario) {
    return `
      <div class="voice-practice-container">
        <div style="color:#d1fae5; font-size:0.92rem;">${card.scenario}</div>
        <div class="voice-input-row">
          <input type="text" id="userReplyInput" class="dm-input" placeholder="Type or click the microphone to speak..." />
          <button class="mic-record-btn" id="micRecordBtn" onclick="toggleSpeechRecording()" title="Speak aloud in English">
            <svg class="btn-svg-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          </button>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <button onclick="evaluateReplySocial()" style="background:var(--x-blue); color:#fff; border:none; padding:8px 18px; border-radius:var(--radius-pill); font-weight:700; cursor:pointer;">
            Evaluate Phrasing
          </button>
          <span id="micStatusText" style="font-size:0.75rem; color:var(--text-muted);">Microphone ready</span>
        </div>
        <div id="replySocialFeedback" style="display:none; font-size:0.88rem; color:#ffffff; background:rgba(255,255,255,0.08); padding:12px; border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.2); backdrop-filter:blur(20px);"></div>
      </div>
    `;
  }

  return '';
}

// Native Real-App Deep Linking Engine (Mobile twitter://, reddit:// & Universal Fallback)
window.openRealApp = function(event, url, platform) {
  if (event) {
    if (typeof event.stopPropagation === 'function') event.stopPropagation();
    if (typeof event.preventDefault === 'function') event.preventDefault();
  }
  if (!url) return;
  
  // Auditory tactile feedback
  try {
    playSyntheticTone(820, 'sine', 0.05);
  } catch (e) {}

  const ua = navigator.userAgent || '';
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
  const targetUrl = url.trim();

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
      const liveItem = {
        id: 'hn-live-' + story.id,
        platform: 'hn',
        platformIcon: 'hn',
        platformLabel: 'Hacker News (Live)',
        author: story.by ? 'u/' + story.by : 'Hacker News',
        handle: '@hackernews',
        title: story.title,
        summary: `Breaking live discussion with ${story.descendants || 0} comments and ${story.score || 1} points.`,
        metric: `▲ ${story.score || 1} Points • ${story.descendants || 0} Comments`,
        link: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        aiPrompt: `Explain this trending technology story: "${story.title}" in simple, accessible English.`
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
  typingMsg.innerHTML = `<em>✦ Analyzing inquiry and synthesizing editorial breakdown${statusNote ? ` (${statusNote})` : ''}...</em>`;
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

  const collegeCard = (title, emoji, whatIsIt, analogy, whyCollege, howToSay) => `
    <div class="ai-college-card">
      <div class="college-card-header">
        <span class="college-card-emoji">${emoji}</span>
        <div class="college-card-title-box">
          <span class="college-guide-chip">🎓 1ST-YEAR COLLEGE CHEAT-SHEET</span>
          <h3 class="college-card-title">${title}</h3>
        </div>
      </div>

      <div class="college-card-block">
        <div class="block-label"><span class="label-dot green"></span> 💡 What is that, basically?</div>
        <div class="block-body">${whatIsIt}</div>
      </div>

      <div class="college-card-block analogy">
        <div class="block-label"><span class="label-dot blue"></span> 🍕 Everyday Real-World Analogy:</div>
        <div class="block-body">${analogy}</div>
      </div>

      <div class="college-card-block">
        <div class="block-label"><span class="label-dot amber"></span> 🎯 Why does this matter to you in college?</div>
        <div class="block-body">${whyCollege}</div>
      </div>

      <div class="college-card-block quote">
        <div class="block-label"><span class="label-dot purple"></span> 🗣️ How to explain it confidently:</div>
        <div class="block-body"><em>"${howToSay}"</em></div>
      </div>
    </div>
  `;

  // 1. "Cooked" / "Locked In"
  if (q.includes('cooked') || q.includes('locked in')) {
    return collegeCard(
      '"Cooked" & "Locked In" Explained',
      '🔥',
      '<strong>"Cooked"</strong> is modern campus and internet slang meaning you are totally doomed, exhausted, or unprepared.<br><strong>"Locked In"</strong> means reaching 100% laser focus with zero phone distractions.',
      '<strong>Cooked:</strong> Walking into an exam hall and realizing you prepared Unit 1 when the question paper is entirely from Unit 4. You are completely cooked!<br><br><strong>Locked In:</strong> Putting your phone on Do Not Disturb, putting on noise-canceling headphones, and coding through the night before project submission.',
      'You will hear your batchmates, seniors, and Discord servers use this 50 times a day in your hostel. Knowing it helps you fit into college culture immediately.',
      'Casual: "Bro, if the professor checks the code line by line, I am cooked."<br>Professional in Viva/Email: "I am currently at maximum capacity and will prioritize this deliverable tomorrow."'
    );
  }

  // 2. Reasoning Models / Test-Time Compute (Karpathy / Altman / o1 / o3 / DeepSeek)
  if (q.includes('reasoning') || q.includes('test-time') || q.includes('karpathy') || q.includes('o1') || q.includes('o3') || q.includes('deepseek')) {
    return collegeCard(
      'Reasoning Models & Test-Time Compute (Karpathy & Altman)',
      '🧠',
      'Older AI (like ChatGPT-3.5) was like a student blurting out the first word that comes to mind without thinking. <strong>Reasoning models</strong> (like OpenAI o1/o3 or DeepSeek-R1) pause for 20 to 60 seconds, write "rough work" in their head, check their own logic, test alternative ideas, and fix mistakes before giving you the final answer.',
      'Imagine your college math exam. Instead of instantly guessing an answer in 1 second, you take rough scratch paper, solve it step-by-step, verify the calculation, cross out mistakes, and then write the final clean answer. That rough paper thinking time is what scientists call <strong>"Test-Time Compute"</strong>.',
      'As a 1st-year student, this changes everything. AI won\'t just write simple 5-line homework scripts; it can design complex software architectures. Your job as a future software engineer is learning how to direct, verify, and orchestrate these reasoning agents.',
      'Instead of just training bigger models on more text, we give models extra compute during inference time so they can search and think through chain-of-thought tokens.'
    );
  }

  // 3. GPUs vs CPUs & Jensen Huang (NVIDIA)
  if (q.includes('jensen') || q.includes('nvidia') || q.includes('gpu') || q.includes('cuda')) {
    return collegeCard(
      'GPUs vs CPUs & Why NVIDIA Dominates AI',
      '⚡',
      'A <strong>CPU</strong> is like 1 university math professor who can solve any complex, tricky equation one step at a time. A <strong>GPU</strong> is like 5,000 school students who can all do simple arithmetic at the exact same millisecond in parallel.',
      'Imagine stamping 10,000 college festival passes. 1 genius professor (CPU) stamps them one-by-one. 5,000 students (GPU) each stamp two passes simultaneously and finish in 2 seconds. Because AI neural networks are millions of simple multiplications, GPUs run AI 100x faster than CPUs.',
      'In college, whether you take machine learning courses, play games, or train deep learning models in PyTorch, you will be using GPUs and CUDA (NVIDIA\'s software language). Knowing how memory bandwidth and parallel cores work will make you stand out in campus placements.',
      'CPUs excel at complex single-threaded tasks, while GPUs dominate parallel matrix math which makes modern generative AI possible.'
    );
  }

  // 4. Linux & Git (Linus Torvalds)
  if (q.includes('linus') || q.includes('git') || q.includes('linux')) {
    return collegeCard(
      'Linux & Git (Linus Torvalds) Explained',
      '🐧',
      '<strong>Linux</strong> is the underlying engine (operating system) that runs without Windows bloat. It runs 96% of web servers, Android phones, and supercomputers.<br><strong>Git</strong> is a "Time Machine" for your code files created by Linus in 2005.',
      'Imagine a 4-person college group project. Without Git, people email files named <code>project_v2_final_FINAL.zip</code> and accidentally overwrite each other\'s work. With Git, everyone codes simultaneously in separate branches, merges them cleanly, and if code breaks, you press one button to travel back in time.',
      'Git and the Linux command line (bash, ssh, terminal commands) are the <strong>#1 foundational skill</strong> every software company expects on Day 1 of internships. Learn Git in your 1st semester!',
      'Git is our distributed version control system that tracks every commit, while Linux is the core OS powering modern cloud deployments.'
    );
  }

  // 5. Centering a Div in CSS
  if (q.includes('centering a div') || q.includes('css') || q.includes('div')) {
    return collegeCard(
      'Centering a Div in CSS (The Legend)',
      '🎯',
      'In web development, putting a box in the dead center of a webpage (vertically and horizontally) was historically so painful that it became the most famous programming meme on the internet.',
      'Think of hanging a picture frame on your hostel wall. In the old days, you had to measure margins, use negative offsets, and pray it didn\'t slide off. Modern CSS gave us an instant laser-level tool.',
      'You\'ll build your first HTML/CSS personal portfolio website this year. Instead of fighting with confusing margins, write these 2 lines on the parent container:<br><br><code>display: grid;<br>place-items: center;</code><br><br>Boom! Whatever is inside sits in the exact dead center.',
      'In modern CSS, centering any element takes just two lines: display grid and place-items center.'
    );
  }

  // 6. World Models & Yann LeCun (V-JEPA)
  if (q.includes('world model') || q.includes('lecun') || q.includes('jepa')) {
    return collegeCard(
      'World Models & Yann LeCun\'s Critique of LLMs',
      '🌍',
      'A <strong>"World Model"</strong> is having a mental simulation of how the physical world works. If a glass rolls off a desk, you instinctively know it will fall down and smash on the floor. Current text models don\'t know that—they only predict the next word in a sentence.',
      'A 1-year-old baby doesn\'t read 10,000 encyclopedia articles about gravity. The baby watches the world, pushes objects, and builds an intuitive visual model of physics. Yann LeCun (Turing Award winner) says AI must learn from video and abstract representations, not just text tokens.',
      'Helps you realize that current LLMs are not the end of AI—they have big blindspots. Your generation in college will be the engineers who build real world models for robotics and autonomous systems.',
      'Autoregressive language models predict words, but true physical intelligence requires world models that understand cause and effect in abstract space.'
    );
  }

  // 7. Physical AI & Robotics (Jim Fan)
  if (q.includes('physical ai') || q.includes('robot') || q.includes('fan')) {
    return collegeCard(
      'Physical AI & Humanoid Robotics (Dr. Jim Fan)',
      '🤖',
      '<strong>Physical AI</strong> means taking artificial intelligence out of computer screens and putting it into physical bodies—humanoid robots, robotic arms, and autonomous machines that navigate the real world.',
      'Learning to drive in a realistic video game simulator for 1,000 hours before sitting in a real car. In Physical AI, robots practice in super-fast GPU physics simulations (NVIDIA Omniverse) for 10,000 virtual years, learning how to walk and grasp objects before touching physical hardware.',
      'When you graduate college in 3-4 years, robotics and embodied AI will be at the exact stage smartphones were in 2010. Understanding robotic simulation and motor policies will be a massive career track.',
      'Physical AI uses sim-to-real reinforcement learning to let foundation models control robot actuators directly.'
    );
  }

  // 8. Python & The Global Interpreter Lock (Guido van Rossum)
  if (q.includes('python') || q.includes('guido') || q.includes('gil')) {
    return collegeCard(
      'Why Python Won AI & What is the "GIL"?',
      '🐍',
      'Python creator Guido van Rossum designed Python to read like plain, friendly English sentences rather than cryptic machine code. Because it\'s so clean, AI researchers used Python as the control dashboard for deep learning.',
      'Imagine an 8-lane highway (your 8 CPU cores), but a single toll booth operator (the GIL - Global Interpreter Lock) only allows 1 car through at a time. In Python 3.13, they eliminated that toll booth, allowing all CPU cores to drive at full speed together!',
      'Python is almost certainly your first programming language in college. It\'s the language of data science, AI, web servers, and automation. Knowing that Python 3.13 now supports true multi-threaded CPU speed makes you look super sharp in class.',
      'Python prioritized human readability, and with Python 3.13\'s free-threaded execution, it removes the GIL to unlock multi-core parallel computing.'
    );
  }

  // 9. APIs (What is an API?)
  if (q.includes('api') || q.includes('rest') || q.includes('backend')) {
    return collegeCard(
      'What is an API? (The Waiter Concept)',
      '🔌',
      '<strong>API</strong> stands for Application Programming Interface. It\'s simply a digital bridge that lets two different software programs talk to each other and share data.',
      'You are sitting at a restaurant table. The kitchen has the food (the database/server). You don\'t walk into the kitchen yourself—you give your order to the <strong>waiter (the API)</strong>. The waiter tells the kitchen, gets your food, and brings it back to your table. That\'s an API!',
      'In your 1st-year college mini-projects, you won\'t build everything from scratch. You will connect your frontend app to third-party APIs (Weather API, Gemini AI API, Google Maps API, Spotify API).',
      'An API is a standardized interface that allows our frontend application to request and receive structured data from a backend server.'
    );
  }

  // 10. Data Structures & Algorithms (Why LeetCode?)
  if (q.includes('dsa') || q.includes('leetcode') || q.includes('algorithm') || q.includes('data structure')) {
    return collegeCard(
      'Why Everyone in College Stresses Over "DSA"',
      '📚',
      '<strong>Data Structures</strong> are simply ways to organize data in computer memory (like arrays, stacks, queues, hash maps). <strong>Algorithms</strong> are step-by-step recipe instructions to solve a problem with that data.',
      'If you have 10 books in your hostel room, throwing them on the floor in a messy pile is fine. But if you are managing a university library with 1,000,000 books, you need an alphabetized catalog system or finding one book will take 3 weeks. DSA teaches you how to keep software fast when data grows huge.',
      'Every major tech company (Google, Microsoft, Amazon, startups) uses DSA coding problems during campus placements to test if you write clean, efficient code that won\'t crash their servers.',
      'Data structures organize memory, while algorithms minimize time and space complexity so software scales efficiently.'
    );
  }

  // 11. "Demure and Mindful"
  if (q.includes('demure') || q.includes('mindful')) {
    return collegeCard(
      '"Very Demure, Very Mindful" Explained',
      '🎀',
      'A viral internet phrase coined by creator Jools Lebron. It is used humorously to describe acting polite, classy, modest, and composed instead of being loud or dramatic.',
      'Submitting your college assignment at 11:59 PM with 30 seconds left on the clock, quietly closing your laptop lid, and taking a calm sip of water. See how I don\'t panic? Very demure. Very mindful.',
      'Modern workplace English loves irony and subtle humor. Understanding cultural phrases helps you connect naturally with international teams on Slack and LinkedIn.',
      'It\'s an ironic, playful way to highlight being understated, considerate, and professional in any situation.'
    );
  }

  // 12. Satya Nadella & Growth Mindset
  if (q.includes('satya') || q.includes('nadella') || q.includes('growth mindset')) {
    return collegeCard(
      'Satya Nadella\'s "Learn-It-All" Mindset',
      '🌱',
      'When Satya took over Microsoft, he replaced company arrogance with a simple philosophy: <em>"The learn-it-all will always beat the know-it-all in the long run."</em>',
      'Think of two students in your 1st-year coding class. Student A thinks they already know everything and refuses to ask for help when stuck. Student B admits when they don\'t know, asks questions, reads documentation, and improves every single day. By 4th year, Student B is miles ahead.',
      'Tech frameworks change every 2-3 years. The most valuable skill you can build in college isn\'t memorizing a syntax textbook—it\'s learning how to learn new technologies without feeling intimidated.',
      'Technology shifts constantly, so having the curiosity to be a continuous learner is far more valuable than trying to be a know-it-all.'
    );
  }

  // 13. Elon Musk & First Principles Thinking
  if (q.includes('elon') || q.includes('musk') || q.includes('first principles')) {
    return collegeCard(
      'First-Principles Thinking (Elon Musk)',
      '🚀',
      '<strong>First-Principles Thinking</strong> means boiling a problem down to fundamental physical truths and building up a solution from scratch, rather than copying what everyone else is doing (reasoning by analogy).',
      'Everyone told Elon that space rockets cost $65M because that was the industry price. Elon asked: <em>"What is a rocket physically made of? Aerospace-grade aluminum, titanium, copper, and carbon fiber. What do those raw metals cost on the London exchange? Only 2% of the rocket\'s price!"</em> So SpaceX built their own rockets from scratch at 1/10th the cost.',
      'In engineering college, whenever a senior or professor says "that\'s impossible" or "we\'ve always done it this way", break it down into fundamental facts. That\'s how you build standout hackathon projects.',
      'First-principles thinking strips away conventional assumptions and builds innovative solutions from fundamental truths.'
    );
  }

  // 14. Fallback: Friendly, Welcoming 1st-Year College Guide for ANY query
  const cleanTitle = query.length > 50 ? query.slice(0, 47) + '...' : query;
  return collegeCard(
    `Decoding: "${cleanTitle}"`,
    '✨',
    `When you're in 1st year, tech jargon can feel like an alien language. In plain English: <strong>"${cleanTitle}"</strong> is a concept where engineers or digital creators are solving a real problem to make software, communication, or workflows faster and smarter.`,
    'Think of your college campus or hostel. Everyone is looking for the cleanest shortcut to get good results without wasting energy. Whenever a new trend, library, or tool appears, it exists because someone got tired of doing things the slow, painful way!',
    'As a 1st-year student, you don\'t need to stress over memorizing every tiny detail right now. Focus on understanding <strong>the big picture</strong>—what problem does this solve, and why do people care? Having that conceptual clarity will put you in the top 10% of your class.',
    `It's basically a modern, clean approach to solving that challenge more efficiently than traditional methods.`
  );
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
