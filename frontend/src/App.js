import "@/App.css";

const HandoffDiagnosticBrief = () => {
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

      {/* Method Section */}
      <section className="section method" data-testid="method-section">
        <div className="section-header">
          <span className="section-number">03</span>
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
          <span className="section-number">04</span>
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
          <span className="section-number">05</span>
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
          <span className="section-number">06</span>
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
