import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { GraduationCap, BookOpen } from '../../components/icons';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';

export type AcademyDifficulty = 'Beginner' | 'School' | 'College' | 'Advanced' | 'Research';

interface QuizQuestion {
  id: number;
  question: string;
  difficulty: AcademyDifficulty;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  scientificReference: string;
}

const ACADEMY_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'How does urban canopy loss primarily intensify downstream flood discharge?',
    difficulty: 'School',
    options: [
      'By evaporating groundwater reservoirs directly',
      'By removing canopy interception storage and reducing soil macropore infiltration',
      'By converting nitrogen into atmospheric ammonia',
      'By cooling rainfall droplets before they touch ground',
    ],
    correctAnswerIndex: 1,
    explanation: 'Tree canopies physically intercept 15–30% of gross precipitation, while root systems preserve soil macropores. When trees are removed, rainfall immediately converts into overland surface runoff.',
    scientificReference: 'IPCC AR6 WGII Report & NASA GEDI Hydrological Studies',
  },
  {
    id: 2,
    question: 'What is the primary physical cause of the Urban Heat Island (UHI) effect?',
    difficulty: 'College',
    options: [
      'Depletion of the upper stratospheric ozone layer over cities',
      'Low albedo and high thermal mass of concrete/asphalt combined with reduced evapotranspirative cooling',
      'Excessive geothermal heat released from tectonic plates under urban bedrock',
      'Refraction of moonlight through urban pollution haze',
    ],
    correctAnswerIndex: 1,
    explanation: 'Asphalt and concrete absorb shortwave solar radiation during daylight and re-radiate longwave thermal infrared at night. Simultaneously, the lack of vegetative transpiration removes the natural cooling mechanism.',
    scientificReference: 'Landsat-9 Thermal Infrared Sensor-2 (TIRS-2) Radiometric Observations',
  },
  {
    id: 3,
    question: 'Why does synthetic aperture radar (SAR) altimetry remain essential during monsoonal storm events?',
    difficulty: 'Advanced',
    options: [
      'It measures groundwater salinity through microwave acoustics',
      'It uses active microwave bands (C/L-Band) that penetrate thick cloud cover and rain to detect surface specular reflection',
      'It operates exclusively during nighttime using thermal sensors',
      'It requires optical cameras without solar illumination',
    ],
    correctAnswerIndex: 1,
    explanation: 'Optical sensors (e.g. Sentinel-2, Landsat) cannot view the Earth through monsoonal cloud decks. Active SAR microwaves penetrate clouds and detect standing water via specular reflection.',
    scientificReference: 'Copernicus Sentinel-1 SAR Mission User Guide',
  },
  {
    id: 4,
    question: 'In climate projections, what does the SSP2-4.5 pathway signify?',
    difficulty: 'College',
    options: [
      'A carbon-negative pathway with net-zero achieved by 2030',
      'A medium emissions reference scenario with CO2 stabilizing around 540 ppm by 2100',
      'A runaway fossil-fueled development trajectory exceeding +4.5°C warming',
      'A theoretical solar radiation management geoengineering scenario',
    ],
    correctAnswerIndex: 1,
    explanation: 'SSP2-4.5 is the intermediate "middle-of-the-road" scenario where social, economic, and technological trends do not shift markedly from historical patterns, resulting in ~2.7°C warming by 2100.',
    scientificReference: 'IPCC Sixth Assessment Report (AR6) Shared Socioeconomic Pathways',
  },
  {
    id: 5,
    question: 'What metric does satellite gravimetry (GRACE-FO) measure to deduce deep aquifer depletion?',
    difficulty: 'Research',
    options: [
      'Near-infrared chlorophyll reflectance in deep-rooted shrubs',
      'Microwave dielectric permittivity of surface topsoil (0-5cm)',
      'Time-variable gravitational field anomalies translated into equivalent water height (EWH)',
      'Subterranean seismic wave velocity refraction',
    ],
    correctAnswerIndex: 2,
    explanation: 'Twin GRACE-FO satellites continuously track their inter-satellite microwave distance to detect sub-micron velocity variations caused by regional Earth gravity variations as water mass depletes.',
    scientificReference: 'NASA JPL / GFZ GRACE-FO Gravity Mass Anomaly Products',
  },
];

export const EarthMindAcademyView: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<AcademyDifficulty>('College');
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = ACADEMY_QUIZ[activeQuestionIdx];
  const selectedAnswer = selectedAnswers[currentQ.id];

  const handleSelectOption = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: index }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (activeQuestionIdx < ACADEMY_QUIZ.length - 1) {
      setActiveQuestionIdx((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setActiveQuestionIdx(0);
    setShowExplanation(false);
    setIsCompleted(false);
  };

  const score = Object.entries(selectedAnswers).filter(
    ([qId, ansIdx]) => {
      const q = ACADEMY_QUIZ.find((item) => item.id === Number(qId));
      return q && q.correctAnswerIndex === ansIdx;
    }
  ).length;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono tracking-wider text-earth-aqua uppercase">
              EARTHMIND SCIENTIFIC ACADEMY
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Planetary Intelligence Academy</h1>
          <p className="text-sm text-slate-400 mt-1">
            Test and elevate your comprehension of remote sensing, biophysical mechanics, and planetary systems.
          </p>
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl glass-panel-1 border border-white/10">
          {(['Beginner', 'School', 'College', 'Advanced', 'Research'] as AcademyDifficulty[]).map((level) => (
            <button
              key={level}
              onClick={() => setCurrentLevel(level)}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all ${
                currentLevel === level
                  ? 'bg-earth-aqua text-black font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {!isCompleted ? (
        <GlassCard variant="strong" className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>QUESTION {activeQuestionIdx + 1} OF {ACADEMY_QUIZ.length}</span>
            <GlassBadge tone="aqua">{currentQ.difficulty}</GlassBadge>
          </div>

          <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = currentQ.correctAnswerIndex === idx;

              let btnStyle = 'border-white/10 hover:border-earth-aqua/40 text-slate-200';
              if (showExplanation) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500/80 bg-emerald-500/15 text-emerald-300 font-semibold';
                } else if (isSelected) {
                  btnStyle = 'border-rose-500/80 bg-rose-500/15 text-rose-300';
                } else {
                  btnStyle = 'opacity-50 border-white/5 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl glass-panel-1 border transition-all flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-mono shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm leading-relaxed">{option}</span>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="p-4 rounded-xl glass-panel-2 border border-earth-aqua/30 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                {selectedAnswer === currentQ.correctAnswerIndex ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  {selectedAnswer === currentQ.correctAnswerIndex ? 'Accurate Scientific Reasoning' : 'Correction Notice'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
              <div className="pt-1 text-[11px] font-mono text-earth-aqua/80">
                Peer Citation: {currentQ.scientificReference}
              </div>
            </div>
          )}

          {showExplanation && (
            <div className="flex justify-end pt-2">
              <GlassButton
                variant="primary"
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                <span>{activeQuestionIdx < ACADEMY_QUIZ.length - 1 ? 'Next Question' : 'View Performance Report'}</span>
                <ArrowRight className="w-4 h-4" />
              </GlassButton>
            </div>
          )}
        </GlassCard>
      ) : (
        <GlassCard variant="strong" className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-earth-aqua/20 border border-earth-aqua/40 flex items-center justify-center mx-auto text-earth-aqua">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Assessment Completed</h2>
            <p className="text-sm text-slate-400 mt-1">
              You scored <span className="text-earth-aqua font-bold text-lg font-mono">{score}</span> out of {ACADEMY_QUIZ.length} on {currentLevel} planetary physics.
            </p>
          </div>

          <div className="p-4 rounded-xl glass-panel-1 border border-white/10 max-w-md mx-auto text-xs text-slate-300">
            {score === 5 ? (
              <span className="text-emerald-400 font-semibold">Distinguished Master of Planetary Systems: 100% Accuracy</span>
            ) : score >= 3 ? (
              <span className="text-earth-aqua font-semibold">Proficient Operator: Solid biophysical foundation verified</span>
            ) : (
              <span className="text-amber-400 font-semibold">Foundational Competency: Review Earth Memory and Forensics</span>
            )}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <GlassButton variant="ghost" onClick={handleRestart} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Retry Assessment</span>
            </GlassButton>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
