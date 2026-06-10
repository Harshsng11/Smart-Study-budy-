import { CustomNote } from './types';

// Stop words to filter out for keyword analysis
const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'for', 'with', 'by', 'from',
  'in', 'of', 'to', 'that', 'this', 'these', 'those', 'it', 'its', 'they', 'their', 'we', 'our',
  'your', 'you', 'he', 'she', 'him', 'her', 'them', 'who', 'whom', 'whose', 'what', 'which', 'where',
  'when', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just',
  'should', 'would', 'could', 'about', 'above', 'below', 'under', 'again', 'further', 'then', 'once'
]);

// Technical noun bigrams to detect
const TECHNICAL_BIGRAMS = [
  'artificial intelligence', 'machine learning', 'data structure', 'operating system',
  'time complexity', 'space complexity', 'database management', 'functional dependency',
  'acid properties', 'binary tree', 'b+ tree', 'two phase', 'page replacement',
  'virtual memory', 'cpu scheduling', 'network layer', 'transport layer', 'application layer',
  'osi model', 'slide window', 'flow control', 'congestion control', 'software engineering',
  'software development', 'design pattern', 'object oriented', 'system analysis'
];

/**
 * Parses user notes locally.
 * Generates key phrase tags, an extractive summary, and flashcards.
 */
export function processCustomNote(title: string, content: string): CustomNote {
  const cleanContent = content.trim();
  const id = `custom-note-${Date.now()}`;
  const createdAt = new Date().toISOString();

  // 1. Sentence Tokenizer
  // Simple regex splitting by sentence-ending punctuation followed by whitespace
  const sentences = cleanContent
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);

  if (sentences.length === 0) {
    return {
      id,
      title,
      content,
      createdAt,
      inferredKeywords: ['General Study Note'],
      autoSummary: [content],
      autoFlashcards: [{ question: 'What is the main topic of this note?', answer: content.slice(0, 100) + '...' }]
    };
  }

  // 2. Keyword Frequency Counter (Extractive TF-IDF-like ranker)
  const wordFrequency: Record<string, number> = {};
  const normalizedWords: string[] = [];

  // Lowercase content for extraction
  const lowerContent = cleanContent.toLowerCase();

  // Detect custom key technical bigrams first
  const foundBigrams: string[] = [];
  TECHNICAL_BIGRAMS.forEach(bigram => {
    if (lowerContent.includes(bigram)) {
      foundBigrams.push(bigram.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    }
  });

  // Simple word parser
  const words = lowerContent.match(/\b[a-zA-Z]{3,15}\b/g) || [];
  words.forEach(word => {
    if (!STOP_WORDS.has(word)) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      normalizedWords.push(word);
    }
  });

  // Calculate unique sorted keywords
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1))
    .slice(0, 6);

  const finalKeywords = Array.from(new Set([...foundBigrams.slice(0, 3), ...sortedWords])).slice(0, 6);
  if (finalKeywords.length === 0) {
    finalKeywords.push('Study Material');
  }

  // 3. Sentence Ranking Summarizer
  // Score sentences by summing the frequency density score of non-stop words
  const sentenceScores = sentences.map((sentence, index) => {
    const sWords = sentence.toLowerCase().match(/\b[a-zA-Z]{3,15}\b/g) || [];
    let score = 0;
    let wordCount = 0;
    
    sWords.forEach(w => {
      if (!STOP_WORDS.has(w)) {
        score += wordFrequency[w] || 0;
        wordCount++;
      }
    });

    // Subtly reward mid-length sentences (15 to 40 words) for summary quality
    const mathLength = sWords.length;
    let lengthFactor = 1.0;
    if (mathLength > 12 && mathLength < 35) {
      lengthFactor = 1.25;
    } else if (mathLength > 50) {
      lengthFactor = 0.8; // penalize overly verbose paragraphs
    }

    // Adjust score based on sentence position (favor intro/conclusion sentences)
    let positionFactor = 1.0;
    if (index === 0) positionFactor = 1.3; // first sentence is often high value
    if (index === sentences.length - 1) positionFactor = 1.15; // final sentence

    return {
      sentence,
      score: (wordCount > 0 ? (score / wordCount) : 0) * lengthFactor * positionFactor,
      originalIndex: index
    };
  });

  // Get top 3 sentences as the Summary (restored to original order for clarity)
  const summaryCount = Math.min(3, Math.ceil(sentences.length / 3));
  const topScoring = [...sentenceScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, summaryCount);

  const autoSummary = topScoring
    .sort((a, b) => a.originalIndex - b.originalIndex)
    .map(item => item.sentence);

  // 4. Rule-Based Flashcard QA Generator
  const autoFlashcards: { question: string; answer: string }[] = [];

  // Look for definitions to create neat flashcards
  const definitionMarkers = [
    { text: ' is defined as ', split: ' is defined as ' },
    { text: ' refers to ', split: ' refers to ' },
    { text: ' is a mechanism to ', split: ' is a mechanism to ' },
    { text: ' is a process of ', split: ' is a process of ' },
    { text: ' is the process of ', split: ' is the process of ' },
    { text: ' means ', split: ' means ' }
  ];

  sentences.forEach((sentence) => {
    let matched = false;
    for (const marker of definitionMarkers) {
      if (sentence.toLowerCase().includes(marker.text)) {
        const idx = sentence.toLowerCase().indexOf(marker.text);
        const term = sentence.slice(0, idx).trim();
        const definition = sentence.slice(idx + marker.split.length).trim();
        
        // Ensure values are clean
        if (term.length > 2 && term.length < 40 && definition.length > 5) {
          const capitalizedTerm = term.charAt(0).toUpperCase() + term.slice(1);
          const capitalizedDefinition = definition.charAt(0).toUpperCase() + definition.slice(1);
          
          autoFlashcards.push({
            question: `What is the definition of "${capitalizedTerm}"?`,
            answer: capitalizedDefinition
          });
          matched = true;
          break; // only match index per sentence
        }
      }
    }

    // Alternate structural parsing: look for lists, components, or causes
    if (!matched && autoFlashcards.length < 3) {
      if (sentence.toLowerCase().includes('includes') || sentence.toLowerCase().includes('consists of') || sentence.toLowerCase().includes('types of')) {
        autoFlashcards.push({
          question: `According to your notes, what does this key process outline or contain:\n"${sentence.slice(0, 60)}..."?`,
          answer: sentence
        });
      } else if (sentence.toLowerCase().includes('important') || sentence.toLowerCase().includes('critical') || sentence.toLowerCase().includes('crucial')) {
        autoFlashcards.push({
          question: `Why is the following aspect crucial in this context:\n"${sentence.slice(0, 60)}..."?`,
          answer: sentence
        });
      }
    }
  });

  // Fallback if no specific rule matched
  if (autoFlashcards.length === 0) {
    autoFlashcards.push({
      question: `What is the core theme presented in "${title}"?`,
      answer: sentences[0] || content
    });
    if (sentences.length > 1) {
      autoFlashcards.push({
        question: `Explain this key statement from your study material:\n"${sentences[1].slice(0, 80)}..."`,
        answer: sentences[1]
      });
    }
  }

  return {
    id,
    title,
    content,
    createdAt,
    inferredKeywords: finalKeywords,
    autoSummary,
    autoFlashcards: autoFlashcards.slice(0, 4) // cap at 4 flashcards
  };
}
