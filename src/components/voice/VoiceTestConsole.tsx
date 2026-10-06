import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Sparkles, 
  RotateCcw, 
  X,
  Volume2,
  Check
} from 'lucide-react';
import { GlassModal } from '../glass/GlassModal';
import { GlassButton } from '../glass/GlassButton';
import { useVoice } from '../../voice/VoiceContext';
import { parseVoiceCommand } from '../../voice/VoiceCommandParser';
import { routeVoiceIntent } from '../../voice/VoiceIntentRouter';

interface TestCase {
  id: string;
  input: string;
  expectedIntent: string;
  expectedOutcome: string;
  isTamil?: boolean;
}

export const VoiceTestConsole: React.FC = () => {
  const {
    isTestConsoleOpen,
    setIsTestConsoleOpen,
    processTextInputCommand,
    settings,
  } = useVoice();

  const [testResults, setTestResults] = useState<Record<string, { status: 'PASS' | 'FAIL' | 'RUNNING'; details: string }>>({});
  const [isRunningAll, setIsRunningAll] = useState(false);

  if (!isTestConsoleOpen) return null;

  const testCases: TestCase[] = [
    {
      id: 'TEST_01',
      input: 'Open What If',
      expectedIntent: 'NAVIGATE',
      expectedOutcome: 'Navigates to simulator view',
    },
    {
      id: 'TEST_02',
      input: 'Increase tree cover by 20 percent',
      expectedIntent: 'SET_SIMULATION_VARIABLE',
      expectedOutcome: 'Adjusts treeCoverDelta to +20%',
    },
    {
      id: 'TEST_03',
      input: 'Run the simulation',
      expectedIntent: 'RUN_SIMULATION',
      expectedOutcome: 'Executes biophysical coupled simulation',
    },
    {
      id: 'TEST_04',
      input: 'Compare with baseline',
      expectedIntent: 'COMPARE_SCENARIOS',
      expectedOutcome: 'Opens Scenario Comparison Matrix',
    },
    {
      id: 'TEST_05',
      input: 'Show flood risk',
      expectedIntent: 'SELECT_LAYER',
      expectedOutcome: 'Activates flood overlay layer',
    },
    {
      id: 'TEST_06',
      input: 'Go to Amazon',
      expectedIntent: 'SELECT_LOCATION',
      expectedOutcome: 'Selects Amazon Rainforest hotspot',
    },
    {
      id: 'TEST_07',
      input: 'Go to 2018',
      expectedIntent: 'SELECT_YEAR',
      expectedOutcome: 'Sets Earth Memory temporal slice to 2018',
    },
    {
      id: 'TEST_08',
      input: 'Start Science Expo',
      expectedIntent: 'OPEN_EXHIBITION',
      expectedOutcome: 'Launches Science Expo mode',
    },
    {
      id: 'TEST_09',
      input: 'Stop speaking',
      expectedIntent: 'STOP_SPEAKING',
      expectedOutcome: 'Stops active speech synthesis',
    },
    {
      id: 'TEST_10',
      input: 'Generate report',
      expectedIntent: 'GENERATE_REPORT',
      expectedOutcome: 'Navigates to Executive Reports view',
    },
    {
      id: 'TEST_11_TAMIL',
      input: 'Tree cover twenty percent increase pannu',
      expectedIntent: 'SET_SIMULATION_VARIABLE',
      expectedOutcome: 'Thanglish: parsed to treeCoverDelta +20%',
      isTamil: true,
    },
    {
      id: 'TEST_12_TAMIL',
      input: 'Flood risk show pannu',
      expectedIntent: 'SELECT_LAYER',
      expectedOutcome: 'Thanglish: parsed to flood overlay',
      isTamil: true,
    },
  ];

  const runSingleTest = async (test: TestCase) => {
    setTestResults((prev) => ({
      ...prev,
      [test.id]: { status: 'RUNNING', details: 'Parsing and routing...' },
    }));

    // 1. Verify Parser
    const parsed = parseVoiceCommand(test.input, settings.language);
    const intentMatches = parsed.intent === test.expectedIntent;

    // 2. Verify Router
    const route = routeVoiceIntent(parsed, settings);

    if (intentMatches && (route.actionable || test.expectedIntent === 'STOP_SPEAKING')) {
      // Execute on real app state
      await processTextInputCommand(test.input);

      setTestResults((prev) => ({
        ...prev,
        [test.id]: {
          status: 'PASS',
          details: `Intent: ${parsed.intent} (Confidence ${(parsed.confidence * 100).toFixed(0)}%) • ${parsed.explanation}`,
        },
      }));
    } else {
      setTestResults((prev) => ({
        ...prev,
        [test.id]: {
          status: 'FAIL',
          details: `Expected ${test.expectedIntent}, parsed as ${parsed.intent}`,
        },
      }));
    }
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    for (const test of testCases) {
      await runSingleTest(test);
      await new Promise((res) => setTimeout(res, 350));
    }
    setIsRunningAll(false);
  };

  const passCount = Object.values(testResults).filter((r) => r.status === 'PASS').length;
  const failCount = Object.values(testResults).filter((r) => r.status === 'FAIL').length;

  return (
    <GlassModal
      isOpen={isTestConsoleOpen}
      onClose={() => setIsTestConsoleOpen(false)}
      title="Voice Intelligence Test Console"
      subtitle="Automated test suite verifying 10+ core voice scenarios on live application state"
      maxWidth="lg"
    >
      <div className="space-y-4 max-h-[72vh] overflow-y-auto pr-1 custom-scrollbar">
        {/* Banner with Stats & Run All */}
        <div className="p-4 rounded-2xl glass-panel-2 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-earth-aurora/20 border border-earth-aurora/40">
              <Terminal className="w-5 h-5 text-earth-aurora" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-white">
                Automated Verification Suite
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Tests: {testCases.length} | Passed: <span className="text-earth-emerald font-bold">{passCount}</span> | Failed: <span className="text-earth-coral font-bold">{failCount}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <GlassButton
              variant="aurora"
              size="sm"
              onClick={runAllTests}
              disabled={isRunningAll}
              leftIcon={<Play className={`w-3.5 h-3.5 ${isRunningAll ? 'animate-spin' : ''}`} />}
            >
              {isRunningAll ? 'Testing...' : 'Run All 12 Tests'}
            </GlassButton>
          </div>
        </div>

        {/* Test Matrix Table */}
        <div className="space-y-2">
          {testCases.map((test) => {
            const res = testResults[test.id];
            return (
              <div
                key={test.id}
                className="p-3.5 rounded-xl glass-panel-1 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                      {test.id}
                    </span>
                    <span className="text-xs font-bold text-white font-mono">
                      "{test.input}"
                    </span>
                    {test.isTamil && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-earth-leaf/20 text-earth-leaf border border-earth-leaf/30 font-mono">
                        Thanglish / Tamil
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Expected: <span className="text-earth-aqua">{test.expectedIntent}</span> • {test.expectedOutcome}
                  </div>
                  {res && (
                    <div
                      className={`text-[11px] font-mono ${
                        res.status === 'PASS'
                          ? 'text-earth-emerald'
                          : res.status === 'FAIL'
                          ? 'text-earth-coral'
                          : 'text-earth-sun'
                      }`}
                    >
                      Result: {res.details}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {res?.status === 'PASS' && (
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-earth-emerald">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>PASS</span>
                    </div>
                  )}
                  {res?.status === 'FAIL' && (
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-earth-coral">
                      <XCircle className="w-4 h-4" />
                      <span>FAIL</span>
                    </div>
                  )}
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => runSingleTest(test)}
                    disabled={isRunningAll}
                  >
                    Run Test
                  </GlassButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassModal>
  );
};
