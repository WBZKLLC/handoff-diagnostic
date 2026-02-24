import { useState } from "react";
import "@/App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HandoffDiagnosticBrief = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      await axios.post(`${API}/pilot-inquiry`, formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="brief-container" data-testid="brief-container">
      {/* Hero Section */}
      <header className="hero" data-testid="hero-section">
        <div className="hero-content">
          <div className="badge">Technical Brief</div>
          <h1>Handoff Diagnostic</h1>
          <p className="tagline">Operational Safety Layer for AI-Integrated Systems</p>
        </div>
        <div className="hero-visual">
          <div className="node node-1">Human</div>
          <div className="connector c1"></div>
          <div className="node node-2">Model</div>
          <div className="connector c2"></div>
          <div className="node node-3">System</div>
        </div>
      </header>

      {/* Problem Section */}
      <section className="section problem" data-testid="problem-section">
        <div className="section-header">
          <span className="section-number">01</span>
          <h2>Problem</h2>
        </div>
        <div className="section-content">
          <p className="lead">Current AI safety frameworks focus primarily on:</p>
          <div className="focus-areas">
            <div className="focus-item">Model alignment</div>
            <div className="focus-item">Bias and robustness</div>
            <div className="focus-item">Adversarial misuse</div>
          </div>
          <p className="highlight">However, in deployed environments, many failures arise at <strong>handoffs</strong>:</p>
          <div className="handoff-grid">
            <div className="handoff-item">Human → Model</div>
            <div className="handoff-item">Model → Human</div>
            <div className="handoff-item">Model → System</div>
            <div className="handoff-item">System → Decision Authority</div>
          </div>
          <p>These transitions introduce:</p>
          <ul className="risk-list">
            <li>Accountability drift</li>
            <li>Silent override normalization</li>
            <li>Signal degradation</li>
            <li>Diffuse responsibility</li>
            <li>Hidden decision gaps</li>
          </ul>
          <div className="callout">These risks are rarely instrumented or measured.</div>
        </div>
      </section>

      {/* Hypothesis Section */}
      <section className="section hypothesis" data-testid="hypothesis-section">
        <div className="section-header">
          <span className="section-number">02</span>
          <h2>Core Hypothesis</h2>
        </div>
        <div className="section-content">
          <blockquote>
            AI safety requires an <strong>operational integrity layer</strong> that measures the reliability of transitions between actors and systems — not just model outputs.
          </blockquote>
        </div>
      </section>

      {/* HIS Score Section */}
      <section className="section his-score" data-testid="his-section">
        <div className="section-header">
          <span className="section-number">03</span>
          <h2>Handoff Integrity Score (HIS) v0.1</h2>
        </div>
        <div className="section-content">
          <p className="lead"><strong>Goal:</strong> quantify how reliably decisions and responsibility move across human–AI–system boundaries.</p>
          
          <div className="score-overview">
            <div className="score-range">
              <span className="score-label">Score range:</span>
              <span className="score-value">0–100</span>
            </div>
          </div>

          <div className="interpretation-grid">
            <h4>Interpretation:</h4>
            <div className="interpretation-item level-excellent">
              <span className="range">90–100</span>
              <span className="desc">reliable handoffs, low hidden risk</span>
            </div>
            <div className="interpretation-item level-acceptable">
              <span className="range">70–89</span>
              <span className="desc">acceptable with known weak spots</span>
            </div>
            <div className="interpretation-item level-elevated">
              <span className="range">50–69</span>
              <span className="desc">elevated operational risk</span>
            </div>
            <div className="interpretation-item level-high">
              <span className="range">&lt;50</span>
              <span className="desc">high likelihood of silent failure or governance breakdown</span>
            </div>
          </div>

          <h4 className="subsection-title">Components (5 sub-scores, each 0–20)</h4>
          
          <div className="components-grid">
            <div className="component-card">
              <div className="component-header">
                <span className="component-abbr">AC</span>
                <h5>Accountability Clarity</h5>
              </div>
              <p>Measures whether every step has a named owner and explicit escalation rules.</p>
              <div className="signals">
                <span className="signals-label">Signals:</span> missing owner fields, ambiguous escalation, unassigned approvals.
              </div>
            </div>

            <div className="component-card">
              <div className="component-header">
                <span className="component-abbr">DT</span>
                <h5>Decision Traceability</h5>
              </div>
              <p>Measures whether a final decision can be reconstructed from inputs, AI outputs, and human edits.</p>
              <div className="signals">
                <span className="signals-label">Signals:</span> missing rationale, missing source, no versioning, no audit trail.
              </div>
            </div>

            <div className="component-card">
              <div className="component-header">
                <span className="component-abbr">OH</span>
                <h5>Override Health</h5>
              </div>
              <p>Measures whether overrides are rare, justified, and reviewed—rather than normalized.</p>
              <div className="signals">
                <span className="signals-label">Signals:</span> repeated overrides, no reasons, no second-party review, rising override trend.
              </div>
            </div>

            <div className="component-card">
              <div className="component-header">
                <span className="component-abbr">SI</span>
                <h5>Signal Integrity</h5>
              </div>
              <p>Measures whether uncertainty/confidence and warnings survive handoffs intact.</p>
              <div className="signals">
                <span className="signals-label">Signals:</span> confidence stripped, warnings ignored, transformations losing metadata.
              </div>
            </div>

            <div className="component-card">
              <div className="component-header">
                <span className="component-abbr">RA</span>
                <h5>Role/Authority Alignment</h5>
              </div>
              <p>Measures whether the person/system making the decision is authorized and informed.</p>
              <div className="signals">
                <span className="signals-label">Signals:</span> decisions made below authority threshold, unclear sign-off, policy mismatch.
              </div>
            </div>
          </div>

          <div className="calculation-box">
            <h4>Calculation (simple, legible)</h4>
            <div className="formula">HIS = AC + DT + OH + SI + RA</div>
            <p>Each sub-score uses binary and rate-based checks from the data fields below.</p>
          </div>

          <h4 className="subsection-title">Minimal data fields required (v0.1)</h4>
          <div className="data-fields">
            <div className="field-item">Workflow name / use-case</div>
            <div className="field-item">Step name</div>
            <div className="field-item">Step owner (role + person/team)</div>
            <div className="field-item">Input source(s)</div>
            <div className="field-item">AI involvement (none / assist / recommend / decide)</div>
            <div className="field-item">AI output stored (yes/no)</div>
            <div className="field-item">Confidence/uncertainty stored (yes/no)</div>
            <div className="field-item">Human modification logged (yes/no)</div>
            <div className="field-item">Override occurred (yes/no)</div>
            <div className="field-item">Override reason captured (required/free text)</div>
            <div className="field-item">Secondary review required (yes/no)</div>
            <div className="field-item">Final decision + decision rationale captured (yes/no)</div>
            <div className="field-item">Escalation step present (yes/no)</div>
          </div>

          <h4 className="subsection-title">What the score produces</h4>
          <ul className="output-list">
            <li>HIS overall score (0–100)</li>
            <li>5 sub-scores (0–20)</li>
            <li>Top 3 failure modes detected</li>
            <li>"Fix next" actions (≤5)</li>
            <li>Trend tracking over time (optional)</li>
          </ul>
        </div>
      </section>

      {/* Example Section */}
      <section className="section example" data-testid="example-section">
        <div className="section-header">
          <span className="section-number">04</span>
          <h2>Example: where failures actually happen</h2>
        </div>
        <div className="section-content">
          <div className="use-case-header">
            <span className="use-case-label">Use case:</span>
            <span className="use-case-title">Compliance review workflow using an LLM to draft risk summaries.</span>
          </div>

          <div className="workflow-steps">
            <div className="workflow-step">
              <span className="step-marker">1</span>
              <p>Analyst prompts model for summary of evidence</p>
            </div>
            <div className="workflow-step">
              <span className="step-marker">2</span>
              <p>Model returns draft + <strong>low confidence</strong> on one claim</p>
            </div>
            <div className="workflow-step warning">
              <span className="step-marker">3</span>
              <p>Analyst edits wording and <strong>removes confidence note</strong></p>
            </div>
            <div className="workflow-step warning">
              <span className="step-marker">4</span>
              <p>Team lead approves <strong>without seeing original evidence</strong></p>
            </div>
            <div className="workflow-step warning">
              <span className="step-marker">5</span>
              <p>Decision is logged <strong>without rationale</strong></p>
            </div>
          </div>

          <div className="flags-box">
            <h4>Handoff Diagnostic flags:</h4>
            <ul className="flags-list">
              <li><strong>Signal Degradation:</strong> confidence metadata removed between steps</li>
              <li><strong>Decision Traceability gap:</strong> final decision cannot be reconstructed</li>
              <li><strong>Role/Authority mismatch:</strong> approver did not see the original basis</li>
              <li><strong>Override Health risk:</strong> "remove warning" becomes routine</li>
            </ul>
          </div>

          <div className="output-box">
            <span className="output-score">HIS = 62</span>
            <span className="output-status">(elevated risk)</span>
            <span className="output-note">with specific remediation steps</span>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="section architecture" data-testid="architecture-section">
        <div className="section-header">
          <span className="section-number">05</span>
          <h2>Implementation Architecture (High-Level)</h2>
        </div>
        <div className="section-content">
          <p className="lead">Handoff Diagnostic is designed to be <strong>lightweight</strong>:</p>
          
          <div className="arch-components">
            <div className="arch-item">
              <span className="arch-label">Capture layer</span>
              <span className="arch-desc">a simple structured form or API event per workflow step</span>
            </div>
            <div className="arch-item">
              <span className="arch-label">Storage</span>
              <span className="arch-desc">append-only log (audit-friendly)</span>
            </div>
            <div className="arch-item">
              <span className="arch-label">Scoring engine</span>
              <span className="arch-desc">computes HIS + sub-scores from minimal fields</span>
            </div>
            <div className="arch-item">
              <span className="arch-label">Reporting</span>
              <span className="arch-desc">produces a one-page audit report + recommended fixes</span>
            </div>
            <div className="arch-item">
              <span className="arch-label">Governance hooks</span>
              <span className="arch-desc">optional thresholds that trigger review (e.g., override spikes)</span>
            </div>
          </div>

          <h4 className="subsection-title">Integration options:</h4>
          <div className="integration-options">
            <div className="integration-item">
              <span className="integration-type">Manual</span>
              <span className="integration-team">(small teams)</span>
              <p>structured entry per step</p>
            </div>
            <div className="integration-item">
              <span className="integration-type">Semi-automated</span>
              <span className="integration-team">(mid teams)</span>
              <p>ingest from tickets/docs + approvals</p>
            </div>
            <div className="integration-item">
              <span className="integration-type">Automated</span>
              <span className="integration-team">(large teams)</span>
              <p>event logging from workflow systems</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Report Section */}
      <section className="section sample-report" data-testid="report-section">
        <div className="section-header">
          <span className="section-number">06</span>
          <h2>Sample Output: Handoff Audit Report (v0.1)</h2>
        </div>
        <div className="section-content">
          <div className="report-card">
            <div className="report-header">
              <div className="report-meta">
                <div className="report-field">
                  <span className="field-label">Workflow:</span>
                  <span className="field-value">[Example Workflow Name]</span>
                </div>
                <div className="report-field">
                  <span className="field-label">Date Range:</span>
                  <span className="field-value">Jan 1–Feb 15, 2026</span>
                </div>
              </div>
              <div className="report-score">
                <span className="score-number">74</span>
                <span className="score-max">/100</span>
                <span className="score-status">acceptable with weak spots</span>
              </div>
            </div>

            <div className="subscores">
              <h4>Sub-scores (0–20):</h4>
              <div className="subscore-grid">
                <div className="subscore-item">
                  <span className="subscore-name">Accountability Clarity</span>
                  <span className="subscore-value">16</span>
                </div>
                <div className="subscore-item">
                  <span className="subscore-name">Decision Traceability</span>
                  <span className="subscore-value low">12</span>
                </div>
                <div className="subscore-item">
                  <span className="subscore-name">Override Health</span>
                  <span className="subscore-value">14</span>
                </div>
                <div className="subscore-item">
                  <span className="subscore-name">Signal Integrity</span>
                  <span className="subscore-value low">11</span>
                </div>
                <div className="subscore-item">
                  <span className="subscore-name">Role/Authority Alignment</span>
                  <span className="subscore-value good">20</span>
                </div>
              </div>
            </div>

            <div className="findings">
              <h4>Top findings (ranked):</h4>
              <ol className="findings-list">
                <li>Signal Integrity loss in <strong>38%</strong> of steps (confidence/warnings not retained)</li>
                <li>Decision rationale missing in <strong>22%</strong> of final approvals</li>
                <li>Override reasons absent in <strong>31%</strong> of overrides</li>
              </ol>
            </div>

            <div className="risk-statement">
              <h4>Risk statement:</h4>
              <p>Current workflow allows decisions to be approved without preserved uncertainty and without reconstructable rationale, creating <strong>silent governance failure risk</strong>.</p>
            </div>

            <div className="fix-actions">
              <h4>Fix-next actions (highest ROI):</h4>
              <ol className="actions-list">
                <li>Require confidence + warning metadata to persist across handoffs</li>
                <li>Make "decision rationale" mandatory at final approval</li>
                <li>Require override reason + second review above a defined threshold</li>
              </ol>
            </div>

            <div className="retest">
              <h4>Retest criteria:</h4>
              <p>Recompute HIS after 30 days. Target ≥85.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section className="section method" data-testid="method-section">
        <div className="section-header">
          <span className="section-number">07</span>
          <h2>Method</h2>
        </div>
        <div className="section-content">
          <div className="method-steps">
            <div className="method-step">
              <span className="step-num">1</span>
              <p>Formalize a taxonomy of AI handoff failure modes.</p>
            </div>
            <div className="method-step">
              <span className="step-num">2</span>
              <p>Develop measurable "Handoff Integrity Indicators."</p>
            </div>
            <div className="method-step">
              <span className="step-num">3</span>
              <p>Prototype a lightweight diagnostic tool for workflow instrumentation.</p>
            </div>
            <div className="method-step">
              <span className="step-num">4</span>
              <p>Pilot integrations with 1–5 organizations.</p>
            </div>
            <div className="method-step">
              <span className="step-num">5</span>
              <p>Publish open-source framework and implementation guide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className="section deliverables" data-testid="deliverables-section">
        <div className="section-header">
          <span className="section-number">08</span>
          <h2>Deliverables</h2>
          <span className="timeline">6 Months</span>
        </div>
        <div className="section-content">
          <div className="deliverables-grid">
            <div className="deliverable-card">
              <div className="deliverable-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3>Open Whitepaper</h3>
              <p>AI handoff failure modes</p>
            </div>
            <div className="deliverable-card">
              <div className="deliverable-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3>Diagnostic Prototype</h3>
              <p>Mobile + structured framework</p>
            </div>
            <div className="deliverable-card">
              <div className="deliverable-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Governance Guide</h3>
              <p>Integration documentation</p>
            </div>
            <div className="deliverable-card">
              <div className="deliverable-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <h3>Empirical Data</h3>
              <p>Pilot study results</p>
            </div>
            <div className="deliverable-card">
              <div className="deliverable-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Workshop & Toolkit</h3>
              <p>Open-source presentation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Now Section */}
      <section className="section why-now" data-testid="why-now-section">
        <div className="section-header">
          <span className="section-number">09</span>
          <h2>Why Now</h2>
        </div>
        <div className="section-content">
          <div className="urgency-points">
            <div className="urgency-item">
              <span className="urgency-marker"></span>
              <p>AI capability is increasing rapidly.</p>
            </div>
            <div className="urgency-item">
              <span className="urgency-marker"></span>
              <p>Deployment velocity is accelerating faster than governance capacity.</p>
            </div>
          </div>
          <div className="warning-box">
            <h4>Without operational instrumentation:</h4>
            <ul>
              <li>Overrides normalize silently</li>
              <li>Risk compounds invisibly</li>
              <li>Accountability erodes</li>
            </ul>
          </div>
          <div className="conclusion">
            <strong>Handoff integrity is a missing safety primitive.</strong>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section vision" data-testid="vision-section">
        <div className="section-header">
          <span className="section-number">10</span>
          <h2>Long-Term Vision</h2>
          <span className="timeline">3 Years</span>
        </div>
        <div className="section-content">
          <div className="vision-timeline">
            <div className="vision-item">
              <div className="vision-dot"></div>
              <p>Standardized "Handoff Integrity Score"</p>
            </div>
            <div className="vision-item">
              <div className="vision-dot"></div>
              <p>Integration into AI deployment audits</p>
            </div>
            <div className="vision-item">
              <div className="vision-dot"></div>
              <p>Simulation-based organizational stress testing</p>
            </div>
            <div className="vision-item">
              <div className="vision-dot"></div>
              <p>Adoption within enterprise AI governance teams</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section contact" data-testid="contact-section">
        <div className="section-header">
          <span className="section-number">11</span>
          <h2>Join the Pilot Program</h2>
        </div>
        <div className="section-content">
          <p className="lead">Interested in being one of our 1–5 pilot organizations? Get in touch.</p>
          
          {!submitted ? (
            <form className="contact-form" onSubmit={handleSubmit} data-testid="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    data-testid="input-name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@organization.com"
                    data-testid="input-email"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="organization">Organization</label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                  placeholder="Your organization name"
                  data-testid="input-organization"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Tell us about your AI workflows</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the AI-integrated workflows you'd like to assess..."
                  data-testid="input-message"
                ></textarea>
              </div>
              <button type="submit" className="submit-btn" data-testid="submit-btn">
                Request Pilot Access
              </button>
            </form>
          ) : (
            <div className="success-message" data-testid="success-message">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>Thank you for your interest!</h3>
              <p>We'll be in touch soon to discuss how Handoff Diagnostic can help your organization.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="brief-footer" data-testid="footer">
        <p>Handoff Diagnostic — Operational Safety Layer for AI-Integrated Systems</p>
      </footer>
    </div>
  );
};

function App() {
  return <HandoffDiagnosticBrief />;
}

export default App;
