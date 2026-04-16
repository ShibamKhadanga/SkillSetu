import { useState } from 'react'
import { Brain, CheckCircle, XCircle, RotateCcw, Trophy, Clock, Zap, ChevronRight } from 'lucide-react'

const SKILL_QUIZZES = {
  'Python': {
    color: '#3b82f6', icon: '🐍',
    questions: [
      { q: 'What is the output of: print(type([]))?', options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "Error"], answer: 0 },
      { q: 'Which keyword is used to define a function in Python?', options: ['function', 'def', 'fn', 'func'], answer: 1 },
      { q: 'What does "pip" stand for in Python?', options: ['Python Install Package', 'Pip Installs Packages', 'Package In Python', 'Python Index Protocol'], answer: 1 },
      { q: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Array', 'Linked List'], answer: 1 },
      { q: 'What is a decorator in Python?', options: ['A design pattern', 'A function that modifies another function', 'A class method', 'A variable type'], answer: 1 },
    ]
  },
  'React': {
    color: '#06b6d4', icon: '⚛️',
    questions: [
      { q: 'What hook is used for side effects in React?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], answer: 1 },
      { q: 'JSX stands for?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript eXtension'], answer: 0 },
      { q: 'Which is NOT a React hook?', options: ['useState', 'useEffect', 'useHistory', 'useClass'], answer: 3 },
      { q: 'What does React.memo() do?', options: ['Memoizes a component', 'Creates a memo', 'Stores state', 'Handles routing'], answer: 0 },
      { q: 'Virtual DOM is used to:', options: ['Replace the real DOM', 'Optimize rendering performance', 'Handle events', 'Store data'], answer: 1 },
    ]
  },
  'SQL': {
    color: '#f59e0b', icon: '🗃️',
    questions: [
      { q: 'Which SQL clause is used to filter rows?', options: ['SELECT', 'WHERE', 'FROM', 'ORDER BY'], answer: 1 },
      { q: 'JOIN that returns only matching rows from both tables?', options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], answer: 2 },
      { q: 'Which function counts total rows?', options: ['SUM()', 'COUNT()', 'TOTAL()', 'ROWS()'], answer: 1 },
      { q: 'What does DISTINCT do?', options: ['Sorts results', 'Removes duplicates', 'Groups rows', 'Limits output'], answer: 1 },
      { q: 'Which is a DDL command?', options: ['SELECT', 'INSERT', 'CREATE', 'UPDATE'], answer: 2 },
    ]
  },
  'JavaScript': {
    color: '#f97316', icon: '📜',
    questions: [
      { q: 'What is the output of: typeof null?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], answer: 2 },
      { q: 'Which method adds an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], answer: 0 },
      { q: '"===" checks for?', options: ['Value only', 'Type only', 'Value and type', 'Reference'], answer: 2 },
      { q: 'What is a closure?', options: ['A closed function', 'Function with access to outer scope', 'An IIFE', 'A class'], answer: 1 },
      { q: 'Promise.all() resolves when?', options: ['First promise resolves', 'All promises resolve', 'Any promise resolves', 'First promise rejects'], answer: 1 },
    ]
  },
  'Data Structures': {
    color: '#8b5cf6', icon: '🌳',
    questions: [
      { q: 'Time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 1 },
      { q: 'Which uses FIFO?', options: ['Stack', 'Queue', 'Tree', 'Graph'], answer: 1 },
      { q: 'Hash table average lookup time?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], answer: 2 },
      { q: 'Height of a balanced BST with n nodes?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 1 },
      { q: 'Linked list advantage over array?', options: ['Faster access', 'Dynamic size', 'Cache friendly', 'Less memory'], answer: 1 },
    ]
  },
  'General Knowledge (India)': {
    color: '#22c55e', icon: '🇮🇳',
    questions: [
      { q: 'Which article of Indian Constitution deals with Right to Education?', options: ['Article 14', 'Article 19', 'Article 21A', 'Article 32'], answer: 2 },
      { q: 'NITI Aayog replaced which body?', options: ['Finance Commission', 'Planning Commission', 'Election Commission', 'UGC'], answer: 1 },
      { q: 'Which exam is for IAS/IPS selection?', options: ['SSC CGL', 'UPSC CSE', 'IBPS PO', 'GATE'], answer: 1 },
      { q: 'NEP 2020 promotes which education structure?', options: ['10+2', '5+3+3+4', '8+4', '6+3+3'], answer: 1 },
      { q: 'Digital India initiative was launched in?', options: ['2014', '2015', '2016', '2017'], answer: 1 },
    ]
  },
}

export default function SkillQuiz() {
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)

  const skills = Object.keys(SKILL_QUIZZES)
  const quiz = selectedSkill ? SKILL_QUIZZES[selectedSkill] : null
  const questions = quiz?.questions || []

  const startQuiz = (skill) => {
    setSelectedSkill(skill)
    setCurrentQ(0)
    setAnswers([])
    setSelected(null)
    setShowResult(false)
  }

  const submitAnswer = () => {
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    setSelected(null)
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1)
    } else {
      setShowResult(true)
    }
  }

  const score = answers.filter((a, i) => a === questions[i]?.answer).length
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
  const level = percentage >= 80 ? 'Advanced' : percentage >= 50 ? 'Intermediate' : 'Beginner'
  const levelColor = percentage >= 80 ? '#22c55e' : percentage >= 50 ? '#f59e0b' : '#ef4444'

  // Quiz Selection Screen
  if (!selectedSkill) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>🧪 Skill Assessment Quiz</h2>
          <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>Test your knowledge — 5 questions, instant score & skill level</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map(skill => {
            const q = SKILL_QUIZZES[skill]
            return (
              <button key={skill} onClick={() => startQuiz(skill)}
                className="glass-card-hover rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.02]">
                <span className="text-4xl">{q.icon}</span>
                <p className="font-display font-bold text-base mt-3" style={{ color: q.color }}>{skill}</p>
                <p className="font-body text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{q.questions.length} questions</p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  <span className="font-body text-xs px-3 py-1 rounded-full" style={{ background: `${q.color}15`, color: q.color }}>
                    Start Quiz <ChevronRight size={12} className="inline" />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Results Screen
  if (showResult) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-8 text-center">
          <span className="text-5xl">{percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '📚'}</span>
          <h2 className="font-display font-black text-2xl mt-4" style={{ color: 'var(--text-primary)' }}>
            {selectedSkill} — Quiz Complete!
          </h2>
          <div className="mt-6 flex justify-center gap-6">
            <div className="text-center">
              <p className="font-display font-black text-4xl" style={{ color: quiz.color }}>{score}/{questions.length}</p>
              <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>Correct</p>
            </div>
            <div className="text-center">
              <p className="font-display font-black text-4xl" style={{ color: levelColor }}>{percentage}%</p>
              <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>Score</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="px-4 py-2 rounded-full font-display font-bold text-sm"
              style={{ background: `${levelColor}20`, color: levelColor }}>
              Level: {level}
            </span>
          </div>

          {/* Answer Review */}
          <div className="mt-8 space-y-3 text-left">
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.answer
              return (
                <div key={i} className="rounded-xl p-3" style={{ background: isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                  <div className="flex items-start gap-2">
                    {isCorrect ? <CheckCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} /> : <XCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />}
                    <div>
                      <p className="font-body text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{q.q}</p>
                      <p className="font-body text-xs mt-1" style={{ color: '#22c55e' }}>✓ {q.options[q.answer]}</p>
                      {!isCorrect && <p className="font-body text-xs" style={{ color: '#ef4444' }}>✗ Your answer: {q.options[answers[i]]}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex gap-3 justify-center">
            <button onClick={() => startQuiz(selectedSkill)} className="btn-primary flex items-center gap-2">
              <RotateCcw size={14} /> Retry
            </button>
            <button onClick={() => setSelectedSkill(null)}
              className="px-4 py-2 rounded-xl font-display font-semibold text-sm transition-all"
              style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
              Other Quizzes
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Quiz In Progress
  const question = questions[currentQ]
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl" style={{ color: quiz.color }}>{quiz.icon} {selectedSkill} Quiz</h2>
          <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>Question {currentQ + 1} of {questions.length}</p>
        </div>
        <button onClick={() => setSelectedSkill(null)} className="text-xs font-body underline" style={{ color: 'var(--text-muted)' }}>← Exit</button>
      </div>

      {/* Progress */}
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((currentQ) / questions.length) * 100}%`, background: quiz.color }} />
      </div>

      {/* Question Card */}
      <div className="glass-card rounded-2xl p-6">
        <p className="font-display font-bold text-base mb-6" style={{ color: 'var(--text-primary)' }}>{question.q}</p>
        <div className="space-y-3">
          {question.options.map((opt, oi) => (
            <button key={oi} onClick={() => setSelected(oi)}
              className="w-full text-left rounded-xl p-4 transition-all duration-200"
              style={{
                background: selected === oi ? `${quiz.color}15` : 'var(--bg-input)',
                border: `2px solid ${selected === oi ? quiz.color : 'transparent'}`,
                boxShadow: selected === oi ? `0 4px 16px ${quiz.color}25` : 'none',
              }}>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-display font-bold text-xs"
                  style={{ background: selected === oi ? quiz.color : 'var(--bg-card)', color: selected === oi ? 'white' : 'var(--text-muted)' }}>
                  {String.fromCharCode(65 + oi)}
                </div>
                <span className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>{opt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button onClick={submitAnswer} disabled={selected === null}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
        <Zap size={16} />
        {currentQ + 1 < questions.length ? 'Next Question' : 'Submit Quiz'}
      </button>
    </div>
  )
}
