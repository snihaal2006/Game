import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { chaptersData } from '../../data/chapters';
import { Terminal, Send, Code, AlertCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';

const QuestionView = () => {
  const currentChapter = useGameStore((state) => state.currentChapter);
  const currentQuestionIndex = useGameStore((state) => state.currentQuestionIndex);
  const nextQuestion = useGameStore((state) => state.nextQuestion);
  const addScore = useGameStore((state) => state.addScore);
  
  const chapterData = chaptersData[currentChapter];
  if (!chapterData) return null;

  const question = chapterData.questions[currentQuestionIndex];
  
  const [answer, setAnswer] = useState('');
  const [codeAnswer, setCodeAnswer] = useState(question.initialCode || '');
  const [error, setError] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    let isCorrect = false;

    if (question.type === 'DEBUG') {
      // Very basic validation - usually you'd run this code or do AST parsing
      // For now, checking if they included the correct snippet
      isCorrect = codeAnswer.includes(question.correctCodeSnippet || '');
    } else {
      isCorrect = answer.trim().toUpperCase() === question.correctAnswer?.toUpperCase();
    }

    if (isCorrect) {
      setError(false);
      addScore(100); // 100 points per correct answer
      setAnswer('');
      nextQuestion();
    } else {
      setError(true);
    }
  };

  const renderMultipleChoice = () => (
    <div className="space-y-4 mt-8 w-full max-w-lg mx-auto">
      {question.options?.map((opt) => (
        <button
          key={opt}
          onClick={() => {
            setAnswer(opt);
            // Auto submit for multiple choice
            if (opt.toUpperCase() === question.correctAnswer?.toUpperCase()) {
              setError(false);
              addScore(100);
              setAnswer('');
              nextQuestion();
            } else {
              setError(true);
            }
          }}
          className={`w-full text-left px-6 py-4 rounded-xl border ${answer === opt ? 'border-purple-500 bg-purple-500/20' : 'border-white/10 bg-white/5'} hover:bg-white/10 transition-colors text-white text-lg`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  const renderTextInput = () => (
    <form onSubmit={handleSubmit} className="space-y-6 mt-8 w-full max-w-lg mx-auto">
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter your answer..."
        className={`w-full bg-black/40 border ${error ? 'border-red-500/50' : 'border-purple-500/30'} rounded-xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xl font-mono transition-colors`}
        autoFocus
      />
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
      >
        <span>Submit Answer</span>
        <Send size={20} />
      </button>
    </form>
  );

  const renderDebug = () => (
    <div className="mt-8 w-full max-w-4xl mx-auto flex flex-col space-y-6">
      <div className="h-64 sm:h-96 w-full border border-purple-500/30 rounded-xl overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={codeAnswer}
          onChange={(val) => setCodeAnswer(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            fontFamily: "'Fira Code', monospace",
          }}
        />
      </div>
      <button
        onClick={() => handleSubmit()}
        className="w-full sm:w-auto self-end bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center space-x-2"
      >
        <Code size={20} />
        <span>Run Code & Verify</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center px-4 py-12 relative">
      
      {/* Background styling */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black z-0" />
      
      <div className="relative z-10 w-full max-w-4xl bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(168,85,247,0.1)]">
        
        {/* Header */}
        <div className="flex items-center space-x-4 mb-2">
          <Terminal className="text-purple-400" size={28} />
          <h2 className="text-xl text-purple-400 font-mono tracking-widest uppercase">
            {question.type === 'DEBUG' ? 'Debug Challenge' : `Question ${currentQuestionIndex + 1}`}
          </h2>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
          {question.title}
        </h1>
        <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl">
          {question.description}
        </p>

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-3 text-red-200 animate-pulse">
            <AlertCircle size={20} />
            <span>Access Denied: Incorrect Solution. Try again.</span>
          </div>
        )}

        {/* Question Type Renderers */}
        {question.type === 'TECHNICAL' && renderMultipleChoice()}
        {question.type === 'NON_TECHNICAL' && renderTextInput()}
        {question.type === 'DEBUG' && renderDebug()}
      </div>
    </div>
  );
};

export default QuestionView;
