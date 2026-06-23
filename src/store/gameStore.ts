import { create } from 'zustand';

interface GameState {
  unlockedChapters: number[];
  activeChapter: number;
  score: number;
  
  // Chapter 1 Specific State
  chapter1: {
    isDecrypted: boolean;
    solvedQuestions: string[];
    evidenceCollected: string[];
  };

  // Chapter 2 Specific State
  chapter2: {
    isDecrypted: boolean;
    solvedQuestions: string[];
    evidenceCollected: string[];
  };

  chapter3: {
    isDecrypted: boolean;
    solvedQuestions: string[];
    evidenceCollected: string[];
  };

  chapter4: {
    isDecrypted: boolean;
    solvedQuestions: string[];
    evidenceCollected: string[];
  };

  chapter5: {
    isDecrypted: boolean;
    solvedQuestions: string[];
    evidenceCollected: string[];
  };

  // Global Time Remaining in seconds (3 hours = 10800 seconds)
  timeRemaining: number;
  
  // Actions
  setActiveChapter: (chapter: number) => void;
  addScore: (points: number) => void;
  unlockChapter: (chapter: number) => void;
  decrementTime: () => void;
  
  // Chapter 1 Actions
  decryptChapter1: () => void;
  solveChapter1Question: (questionId: string, points: number) => void;
  completeChapter1: () => void;

  // Chapter 2 Actions
  decryptChapter2: () => void;
  solveChapter2Question: (questionId: string, points: number) => void;
  completeChapter2: () => void;

  // Chapter 3 Actions
  decryptChapter3: () => void;
  solveChapter3Question: (questionId: string, points: number) => void;
  completeChapter3: () => void;

  // Chapter 4 Actions
  decryptChapter4: () => void;
  solveChapter4Question: (questionId: string, points: number) => void;
  completeChapter4: () => void;

  // Chapter 5 Actions
  decryptChapter5: () => void;
  solveChapter5Question: (questionId: string, points: number) => void;
  completeChapter5: () => void;

  // Authentication
  teamId: string | null;
  teamName: string | null;
  setTeam: (id: string, name: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  unlockedChapters: [1],
  activeChapter: 1,
  score: 0,
  timeRemaining: 10800,
  teamId: null,
  teamName: null,
  
  chapter1: {
    isDecrypted: false,
    solvedQuestions: [],
    evidenceCollected: []
  },

  chapter2: {
    isDecrypted: false,
    solvedQuestions: [],
    evidenceCollected: []
  },

  chapter3: {
    isDecrypted: false,
    solvedQuestions: [],
    evidenceCollected: []
  },

  chapter4: {
    isDecrypted: false,
    solvedQuestions: [],
    evidenceCollected: []
  },

  chapter5: {
    isDecrypted: false,
    solvedQuestions: [],
    evidenceCollected: []
  },

  setTeam: (id, name) => set({ teamId: id, teamName: name }),
  setActiveChapter: (chapter) => set({ activeChapter: chapter }),
  
  addScore: (points) => set((state) => ({ score: state.score + points })),
  
  unlockChapter: (chapter) => set((state) => ({
    unlockedChapters: state.unlockedChapters.includes(chapter) 
      ? state.unlockedChapters 
      : [...state.unlockedChapters, chapter]
  })),
  
  decrementTime: () => set((state) => ({ timeRemaining: Math.max(0, state.timeRemaining - 1) })),

  decryptChapter1: () => set((state) => {
    if (state.chapter1.isDecrypted) return state;
    const timeBonus = Math.floor(state.timeRemaining / 100);
    return {
      score: state.score + 250 + timeBonus,
      chapter1: { ...state.chapter1, isDecrypted: true }
    };
  }),

  solveChapter1Question: (questionId, points) => set((state) => {
    if (state.chapter1.solvedQuestions.includes(questionId)) return state;
    const timeBonus = Math.floor(state.timeRemaining / 100);
    return {
      score: state.score + points + timeBonus,
      chapter1: {
        ...state.chapter1,
        solvedQuestions: [...state.chapter1.solvedQuestions, questionId]
      }
    };
  }),

  completeChapter1: () => set((state) => ({
    chapter1: {
      ...state.chapter1,
      evidenceCollected: [...state.chapter1.evidenceCollected, 'D']
    },
    unlockedChapters: state.unlockedChapters.includes(2) ? state.unlockedChapters : [...state.unlockedChapters, 2]
  })),

  decryptChapter2: () => set((state) => {
    if (state.chapter2.isDecrypted) return state;
    const timeBonus = Math.floor(state.timeRemaining / 100);
    return {
      score: state.score + 250 + timeBonus,
      chapter2: { ...state.chapter2, isDecrypted: true }
    };
  }),

  solveChapter2Question: (questionId, points) => set((state) => {
    if (state.chapter2.solvedQuestions.includes(questionId)) return state;
    const timeBonus = Math.floor(state.timeRemaining / 100);
    return {
      score: state.score + points + timeBonus,
      chapter2: {
        ...state.chapter2,
        solvedQuestions: [...state.chapter2.solvedQuestions, questionId]
      }
    };
  }),

  completeChapter2: () => set((state) => ({
    chapter2: {
      ...state.chapter2,
      evidenceCollected: [...state.chapter2.evidenceCollected, 'O']
    },
    unlockedChapters: state.unlockedChapters.includes(3) ? state.unlockedChapters : [...state.unlockedChapters, 3]
  })),

  decryptChapter3: () => set((state) => {
    if (state.chapter3.isDecrypted) return state;
    const timeBonus = Math.floor(state.timeRemaining / 100);
    return {
      score: state.score + 250 + timeBonus,
      chapter3: { ...state.chapter3, isDecrypted: true }
    };
  }),

  solveChapter3Question: (questionId, points) => set((state) => {
    if (state.chapter3.solvedQuestions.includes(questionId)) return state;
    const timeBonus = Math.floor(state.timeRemaining / 100);
    return {
      score: state.score + points + timeBonus,
      chapter3: {
        ...state.chapter3,
        solvedQuestions: [...state.chapter3.solvedQuestions, questionId]
      }
    };
  }),

  completeChapter3: () => set((state) => ({
    chapter3: {
      ...state.chapter3,
      evidenceCollected: [...state.chapter3.evidenceCollected, 'I']
    },
    unlockedChapters: state.unlockedChapters.includes(4) ? state.unlockedChapters : [...state.unlockedChapters, 4]
  })),

  decryptChapter4: () => set((state) => {
    if (state.chapter4.isDecrypted) return state;
    const timeBonus = Math.floor(state.timeRemaining / 100);
    return {
      score: state.score + 250 + timeBonus,
      chapter4: { ...state.chapter4, isDecrypted: true }
    };
  }),

  solveChapter4Question: (questionId, points) => set((state) => {
    if (state.chapter4.solvedQuestions.includes(questionId)) return state;
    const timeBonus = Math.floor(state.timeRemaining / 100);
    return {
      score: state.score + points + timeBonus,
      chapter4: {
        ...state.chapter4,
        solvedQuestions: [...state.chapter4.solvedQuestions, questionId]
      }
    };
  }),

  completeChapter4: () => set((state) => ({
    chapter4: {
      ...state.chapter4,
      evidenceCollected: [...state.chapter4.evidenceCollected, 'V']
    },
    unlockedChapters: state.unlockedChapters.includes(5) ? state.unlockedChapters : [...state.unlockedChapters, 5]
  })),

  decryptChapter5: () => set((state) => {
    if (state.chapter5.isDecrypted) return state;
    const timeBonus = Math.floor(state.timeRemaining / 100);
    return {
      score: state.score + 250 + timeBonus,
      chapter5: { ...state.chapter5, isDecrypted: true }
    };
  }),

  solveChapter5Question: (questionId, points) => set((state) => {
    if (state.chapter5.solvedQuestions.includes(questionId)) return state;
    const timeBonus = Math.floor(state.timeRemaining / 100);
    return {
      score: state.score + points + timeBonus,
      chapter5: {
        ...state.chapter5,
        solvedQuestions: [...state.chapter5.solvedQuestions, questionId]
      }
    };
  }),

  completeChapter5: () => set((state) => ({
    chapter5: {
      ...state.chapter5,
      evidenceCollected: [...state.chapter5.evidenceCollected, 'MISSION COMPLETE']
    }
  }))
}));

// Subscribe to state changes and sync to Supabase
useGameStore.subscribe(async (state, prevState) => {
  // Only sync if logged in and state has meaningfully changed
  if (state.teamId && (
    state.score !== prevState.score ||
    state.activeChapter !== prevState.activeChapter ||
    state.unlockedChapters.length !== prevState.unlockedChapters.length ||
    state.chapter1 !== prevState.chapter1 ||
    state.chapter2 !== prevState.chapter2 ||
    state.chapter3 !== prevState.chapter3 ||
    state.chapter4 !== prevState.chapter4 ||
    state.chapter5 !== prevState.chapter5
  )) {
    const { supabase } = await import('../lib/supabase');
    await supabase.from('teams').update({
      score: state.score,
      time_remaining: state.timeRemaining,
      active_chapter: state.activeChapter,
      unlocked_chapters: state.unlockedChapters,
      chapter1: state.chapter1,
      chapter2: state.chapter2,
      chapter3: state.chapter3,
      chapter4: state.chapter4,
      chapter5: state.chapter5
    }).eq('id', state.teamId);
  }
});
