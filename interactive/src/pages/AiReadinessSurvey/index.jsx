import { useState, useEffect } from 'react'
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react'
import { loginRequest } from '../../config/msal'
import { QUESTIONS, USAGE_LEVELS, QUADRANTS } from './surveyData'
import './survey.css'

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL

// ── Helpers ──────────────────────────────────────────────────────────────────

function classifyQuadrant(answers) {
  const beliefIds = QUESTIONS.filter(q => q.axis === 'belief').map(q => q.id)
  const riskIds = QUESTIONS.filter(q => q.axis === 'risk').map(q => q.id)
  const beliefAvg = beliefIds.reduce((s, id) => s + (answers[id] || 3), 0) / beliefIds.length
  const riskAvg = riskIds.reduce((s, id) => s + (answers[id] || 3), 0) / riskIds.length
  const highBelief = beliefAvg >= 3
  const highRisk = riskAvg >= 3
  let name
  if (highBelief && !highRisk) name = 'Visionary'
  else if (highBelief && highRisk) name = 'Disruptor'
  else if (!highBelief && highRisk) name = 'Endangered'
  else name = 'Complacent'
  return { name, beliefAvg: Math.round(beliefAvg * 10) / 10, riskAvg: Math.round(riskAvg * 10) / 10 }
}

function inferUsageLevel(checked) {
  for (let i = USAGE_LEVELS.length - 1; i >= 0; i--) {
    if (USAGE_LEVELS[i].items.some(item => checked[item.id])) return i
  }
  return 0
}

// ── Shared Components ────────────────────────────────────────────────────────

function CardHeader({ subtitle }) {
  return (
    <div className="card-header">
      <div className="header-eyebrow">Catalyst Medical Education &middot; CAMEOS</div>
      <div className="header-title">AI Readiness Check-In</div>
      {subtitle && <div className="header-subtitle">{subtitle}</div>}
    </div>
  )
}

function MicrosoftLogo() {
  return (
    <svg viewBox="0 0 21 21" width="18" height="18" style={{ marginRight: 8, flexShrink: 0 }}>
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  )
}

// ── Login Page ───────────────────────────────────────────────────────────────

function LoginPage() {
  const { instance } = useMsal()
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    try {
      setError(null)
      await instance.loginRedirect({
        ...loginRequest,
        domainHint: 'catalystmeded.com',
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="survey-bg">
      <div className="card" style={{ maxWidth: 440 }}>
        <CardHeader subtitle="Pre-training &middot; About 5 minutes" />
        <div className="card-body" style={{ textAlign: 'center' }}>
          <p className="body-text" style={{ marginBottom: 24 }}>
            Sign in with your Catalyst Microsoft account to begin.
          </p>
          <button className="btn-primary btn-ms" onClick={handleLogin}>
            <MicrosoftLogo />
            Sign in with Microsoft
          </button>
          {error && <p className="error-text">{error}</p>}
          <p className="helper-text" style={{ marginTop: 16 }}>
            Restricted to @catalystmeded.com accounts
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Survey App ───────────────────────────────────────────────────────────────

function SurveyApp() {
  const { instance, accounts } = useMsal()
  const account = accounts[0]

  // Domain gate
  if (account && !account.username?.endsWith('@catalystmeded.com')) {
    return (
      <div className="survey-bg">
        <div className="card" style={{ maxWidth: 440 }}>
          <CardHeader subtitle="Account not authorized" />
          <div className="card-body" style={{ textAlign: 'center' }}>
            <p className="body-text">
              This survey is restricted to @catalystmeded.com accounts.
              You signed in as <strong>{account.username}</strong>.
            </p>
            <button className="btn-primary" onClick={() => instance.logoutRedirect()}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  const firstName = account?.name?.split(' ')[0] || ''
  const fullName = account?.name || ''
  const email = account?.username || ''

  // State
  const [screen, setScreen] = useState('intro')
  const [userName, setUserName] = useState(firstName)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})
  const [openText, setOpenText] = useState('')
  const [submitStatus, setSubmitStatus] = useState(null)
  const [result, setResult] = useState(null)
  const [usageLvl, setUsageLvl] = useState(0)
  const [barsAnimated, setBarsAnimated] = useState(false)

  // Scroll to top on screen/question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [screen, currentQ])

  // Animate result bars
  useEffect(() => {
    if (screen === 'result') {
      setBarsAnimated(false)
      const t = setTimeout(() => setBarsAnimated(true), 150)
      return () => clearTimeout(t)
    }
  }, [screen])

  // Handlers
  function selectLikert(val) {
    const q = QUESTIONS[currentQ]
    setAnswers(prev => ({ ...prev, [q.id]: val }))
  }

  function qNext() {
    if (!answers[QUESTIONS[currentQ].id]) return
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1)
    } else {
      setScreen('usage')
    }
  }

  function qBack() {
    if (currentQ > 0) setCurrentQ(prev => prev - 1)
  }

  function toggleCheck(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  async function submitSurvey() {
    const r = classifyQuadrant(answers)
    const lvl = inferUsageLevel(checked)
    const checkedIds = Object.entries(checked).filter(([, v]) => v).map(([k]) => k)

    setResult(r)
    setUsageLvl(lvl)
    setScreen('result')
    setSubmitStatus('sending')

    const payload = {
      submitted_at: new Date().toISOString(),
      respondent: userName || fullName,
      respondent_email: email,
      quadrant: r.name,
      belief_avg: r.beliefAvg,
      risk_avg: r.riskAvg,
      usage_level: lvl,
      usage_level_label: USAGE_LEVELS[lvl].label,
      likert_answers: answers,
      checked_items: checkedIds,
      open_response: openText.trim(),
    }

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setSubmitStatus('success')
      } else {
        throw new Error('HTTP ' + res.status)
      }
    } catch (err) {
      setSubmitStatus('error')
      console.error('Webhook error:', err)
    }
  }

  // Computed values
  const q = screen === 'questions' ? QUESTIONS[currentQ] : null
  const qPct = q ? Math.round(((currentQ + 1) / QUESTIONS.length) * 33) : 0
  const totalChecked = Object.values(checked).filter(Boolean).length
  const inferredLevel = inferUsageLevel(checked)

  return (
    <div className="survey-bg">
      <div className="card">

        {/* ══ INTRO ══ */}
        {screen === 'intro' && (
          <>
            <CardHeader subtitle="Pre-training &middot; About 5 minutes" />
            <div className="card-body">
              <div className="badge">&#x1f512; Confidential &middot; No wrong answers &middot; Results go only to Lou</div>
              <p className="body-text">
                Before the CAMEOS training starts, we want to understand where you're coming from
                &mdash; not to grade you, but to make the training as useful as possible <em>for you specifically</em>.
              </p>
              <p className="body-text" style={{ marginBottom: 26 }}>
                Three short sections: ten quick statements about AI, a checklist of how you currently
                use it, and a free field for anything on your mind. No right answers &mdash; honest
                responses make the training better.
              </p>
              <label className="field-label" htmlFor="name-input">Your first name</label>
              <input
                type="text"
                id="name-input"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && userName.trim()) setScreen('questions') }}
                placeholder="e.g. Sarah"
                style={{ marginBottom: 24 }}
              />
              <br />
              <button
                className="btn-primary"
                disabled={!userName.trim()}
                onClick={() => setScreen('questions')}
              >
                Begin &rarr;
              </button>
              <p className="helper-text">
                Your name is only used to personalize your result screen.
                Nothing is stored without your submission.
              </p>
            </div>
          </>
        )}

        {/* ══ QUESTIONS ══ */}
        {screen === 'questions' && q && (
          <>
            <CardHeader subtitle={`Hi ${userName} \u00b7 Section 1 of 3 \u2014 AI Readiness`} />
            <div className="card-body">
              <div className="progress-wrap">
                <div className="progress-labels">
                  <span className="progress-label-left">Question {currentQ + 1} of {QUESTIONS.length}</span>
                  <span className="progress-label-right">{qPct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: qPct + '%' }} />
                </div>
              </div>
              <div className="question-axis">
                {q.axis === 'belief' ? 'About AI in general' : 'About you personally'}
              </div>
              <div className="question-text">{q.text}</div>
              <div className="likert-row">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    className={'likert-btn' + (answers[q.id] === n ? ' selected' : '')}
                    onClick={() => selectLikert(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="likert-labels">
                <span>{q.lo}</span>
                <span>{q.hi}</span>
              </div>
              <div className="btn-row">
                <button
                  className="btn-back"
                  style={{ visibility: currentQ === 0 ? 'hidden' : 'visible' }}
                  onClick={qBack}
                >
                  &larr; Back
                </button>
                <button
                  className="btn-primary"
                  disabled={!answers[q.id]}
                  onClick={qNext}
                >
                  {currentQ === QUESTIONS.length - 1 ? 'Next: AI usage \u2192' : 'Next \u2192'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ══ USAGE ══ */}
        {screen === 'usage' && (
          <>
            <CardHeader subtitle={`Hi ${userName} \u00b7 Section 2 of 3 \u2014 How You Currently Use AI`} />
            <div className="card-body">
              <div className="progress-wrap">
                <div className="progress-labels">
                  <span className="progress-label-left">AI usage patterns</span>
                  <span className="progress-label-right">Section 2 of 3</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: '55%' }} />
                </div>
              </div>
              <p className="usage-intro">
                Check everything that applies &mdash; any tool, any context, personal or professional.
                If you've done it even once, check it.
              </p>
              <p className="usage-hint">No judgment here. The point is to see where you're starting from.</p>

              {USAGE_LEVELS.map(lvl => {
                const cnt = lvl.items.filter(item => checked[item.id]).length
                return (
                  <div key={lvl.level} className="level-block" style={{ border: `1.5px solid ${lvl.border}` }}>
                    <div className="level-header" style={{ background: lvl.bg, borderBottom: `1px solid ${lvl.border}` }}>
                      <span className="level-badge" style={{ color: lvl.color, border: `1px solid ${lvl.border}` }}>
                        LEVEL {lvl.level}
                      </span>
                      <span className="level-name" style={{ color: lvl.color }}>{lvl.label}</span>
                      {cnt > 0 && (
                        <span className="level-count" style={{ background: lvl.color }}>
                          {cnt} checked
                        </span>
                      )}
                    </div>
                    {lvl.items.map((item, idx) => (
                      <label
                        key={item.id}
                        className={'check-item' + (checked[item.id] ? ' checked' : '')}
                        style={{
                          borderBottom: idx === lvl.items.length - 1 ? 'none' : '1px solid #f2f2f2',
                          background: checked[item.id] ? lvl.bg : '#fff',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!checked[item.id]}
                          onChange={() => toggleCheck(item.id)}
                        />
                        <span>{item.text}</span>
                      </label>
                    ))}
                  </div>
                )
              })}

              {totalChecked > 0 && (
                <div className="usage-summary">
                  <strong>{totalChecked} item{totalChecked !== 1 ? 's' : ''} checked</strong>
                  {' '}&mdash; places you at approximately{' '}
                  <strong>Level {inferredLevel}: {USAGE_LEVELS[inferredLevel].label}</strong>
                </div>
              )}

              <div className="btn-row">
                <button className="btn-back" onClick={() => { setCurrentQ(QUESTIONS.length - 1); setScreen('questions') }}>
                  &larr; Back
                </button>
                <button className="btn-primary" onClick={() => setScreen('openended')}>
                  Next: your thoughts &rarr;
                </button>
              </div>
              <p className="skip-note">This section is optional &mdash; skip ahead if you prefer.</p>
            </div>
          </>
        )}

        {/* ══ OPEN ENDED ══ */}
        {screen === 'openended' && (
          <>
            <CardHeader subtitle={`Hi ${userName} \u00b7 Section 3 of 3 \u2014 Your Thoughts`} />
            <div className="card-body">
              <div className="progress-wrap">
                <div className="progress-labels">
                  <span className="progress-label-left">Almost done</span>
                  <span className="progress-label-right">Section 3 of 3</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: '88%' }} />
                </div>
              </div>
              <div className="open-callout">
                <div className="open-callout-label">OPEN FIELD &mdash; ANYTHING GOES</div>
                <p className="open-callout-text">
                  Questions, concerns, things you're excited about, things you're skeptical of,
                  things you wish we'd asked, something you want us to know before the training
                  starts &mdash; all welcome. Or leave it blank entirely.
                </p>
              </div>
              <label className="field-label">Thoughts, Questions, Concerns, Ideas</label>
              <textarea
                rows={8}
                value={openText}
                onChange={e => setOpenText(e.target.value)}
                placeholder="Write as much or as little as you want. Spelling and grammar don't matter. Write like you're talking."
              />
              <div className="btn-row">
                <button className="btn-back" onClick={() => setScreen('usage')}>
                  &larr; Back
                </button>
                <button className="btn-primary" onClick={submitSurvey}>
                  See my result &rarr;
                </button>
              </div>
              <p className="skip-note">Optional &mdash; you can submit without filling this in.</p>
            </div>
          </>
        )}

        {/* ══ RESULT ══ */}
        {screen === 'result' && result && (() => {
          const quad = QUADRANTS[result.name]
          const lvl = USAGE_LEVELS[usageLvl]
          const beliefPct = Math.round(((result.beliefAvg - 1) / 4) * 100)
          const riskPct = Math.round(((result.riskAvg - 1) / 4) * 100)

          return (
            <>
              <CardHeader subtitle={`${userName}\u2019s result`} />
              <div className="card-body">
                {submitStatus && (
                  <div className={`submit-status ${submitStatus}`}>
                    {submitStatus === 'sending' && 'Sending your responses\u2026'}
                    {submitStatus === 'success' && '\u2713 Your responses have been submitted.'}
                    {submitStatus === 'error' && 'Submission could not be sent automatically. Please screenshot this page and share with Lou.'}
                  </div>
                )}

                <div className="quadrant-card" style={{ background: quad.bg, borderColor: quad.border }}>
                  <div className="quadrant-top">
                    <span className="quadrant-icon" style={{ color: quad.color }}>{quad.icon}</span>
                    <span className="quadrant-name" style={{ color: quad.color }}>{result.name}</span>
                  </div>
                  <p className="quadrant-tagline">{quad.tagline}</p>
                  <p className="quadrant-desc">{quad.desc}</p>
                </div>

                <div className="axis-bars">
                  <div className="axis-bar">
                    <div className="axis-bar-labels">
                      <span>Belief in AI's potential</span>
                      <span style={{ fontWeight: 700, color: '#1A7A4A' }}>{result.beliefAvg} / 5</span>
                    </div>
                    <div className="axis-bar-track">
                      <div className="axis-bar-fill" style={{ background: '#1A7A4A', width: barsAnimated ? beliefPct + '%' : '0%' }} />
                    </div>
                  </div>
                  <div className="axis-bar" style={{ marginTop: 12 }}>
                    <div className="axis-bar-labels">
                      <span>Concern about personal impact</span>
                      <span style={{ fontWeight: 700, color: '#B45309' }}>{result.riskAvg} / 5</span>
                    </div>
                    <div className="axis-bar-track">
                      <div className="axis-bar-fill" style={{ background: '#B45309', width: barsAnimated ? riskPct + '%' : '0%' }} />
                    </div>
                  </div>
                </div>

                <div className="level-result-card" style={{ background: lvl.bg, borderColor: lvl.border }}>
                  <div className="level-result-top">
                    <span className="level-result-badge" style={{ color: lvl.color, border: `1px solid ${lvl.border}` }}>
                      LEVEL {lvl.level}
                    </span>
                    <span className="level-result-name" style={{ color: lvl.color }}>
                      Current AI usage: {lvl.label}
                    </span>
                  </div>
                  <p className="level-result-desc">{lvl.desc}</p>
                  <p className="level-result-note">
                    CAMEOS HITL reviewers operate at <strong>Level 4</strong> &mdash; reviewing,
                    correcting, and formally approving AI-generated outputs as part of a governed
                    pipeline. That's where this training takes you.
                  </p>
                </div>

                <div className="training-callout">
                  <div className="training-callout-label">Your role in training</div>
                  <p className="training-callout-text">{quad.training}</p>
                </div>

                {openText.trim() && (
                  <div className="open-response-card">
                    <div className="open-response-label">YOUR OPEN RESPONSE</div>
                    <p className="open-response-text">&ldquo;{openText.trim()}&rdquo;</p>
                  </div>
                )}

                <p className="result-footer">
                  This result is confidential and will be used to help shape how training is delivered.
                </p>
              </div>
            </>
          )
        })()}

      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function AiReadinessSurvey() {
  return (
    <>
      <UnauthenticatedTemplate>
        <LoginPage />
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <SurveyApp />
      </AuthenticatedTemplate>
    </>
  )
}
