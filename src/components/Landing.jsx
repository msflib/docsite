import { Link } from 'react-router-dom'
import { libs } from '../lib/docs'
import { IconArrowRight, IconBolt, IconBox, IconCode, IconLayer } from '../lib/icons'
import TopBar from './TopBar'
import { LibCardLogo } from './Logo'

function LibraryCard({ lib }) {
  return (
    <Link
      to={`/${lib.id}/${lib.nav[0].items[0].id}`}
      className="lib-card"
      style={{ '--lib-c': lib.color }}
    >
      <div className="lc-top">
        <LibCardLogo libId={lib.id} />
        <span className="lib-badge">{lib.version}</span>
      </div>
      <div>
        <h3>{lib.pkg}</h3>
        <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '2px 0 0', fontWeight: 600 }}>
          {lib.tagline}
        </p>
      </div>
      <p className="lib-desc">{lib.blurb}</p>
      <div className="lib-tags">
        {lib.chips.map((chip) => (
          <span key={chip} className="lib-tag">
            {chip}
          </span>
        ))}
      </div>
      <span className="lc-link">
        Read the docs <IconArrowRight />
      </span>
    </Link>
  )
}

export default function Landing() {
  return (
    <div
      className="landing"
      style={{
        '--lib-vue': '#34d399',
        '--lib-react': '#38bdf8',
        '--lib-fastapi': '#2dd4bf',
      }}
    >
      <TopBar />

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <span className="hero-kicker">
          <span className="kdot" />
          Documentation for the MSFLib platform
        </span>
        <h1>
          One ecosystem.
          <br />
          <span className="grad">Three libraries.</span>
        </h1>
        <p className="sub">
          Guides, API references and recipes for the MSFLib stack — Vue 3 UI components, a
          monorepo of React modules, and a FastAPI backend core with installable feature
          modules.
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#libraries">
            Explore the libraries
          </a>
          <Link className="btn btn-ghost" to="/vue/overview">
            Start with Vue components
          </Link>
        </div>
      </section>

      <section className="libs-section" id="libraries">
        <div className="libs-grid">
          {libs.map((lib) => (
            <LibraryCard key={lib.id} lib={lib} />
          ))}
        </div>
      </section>

      <section className="feature-strip">
        <div className="feature-strip-inner">
          <div className="feature">
            <h4>
              <IconBox />
              Business-ready UI kits
            </h4>
            <p>
              Schema-driven form builders, data tables with selection and pagination, file
              uploads, pickers and modals — for both Vue and React.
            </p>
          </div>
          <div className="feature">
            <h4>
              <IconLayer />
              Feature modules, not monoliths
            </h4>
            <p>
              Install only what you need: auth, payments, notifications, drive storage or AI
              — each module is an independently versioned package.
            </p>
          </div>
          <div className="feature">
            <h4>
              <IconBolt />
              Multi-tenant by design
            </h4>
            <p>
              Workspace-scoped endpoints, tiered configuration (tenant → workspace → user)
              and a policy engine are first-class citizens across the stack.
            </p>
          </div>
          <div className="feature">
            <h4>
              <IconCode />
              Typed end-to-end
            </h4>
            <p>
              TypeScript sources with generated declarations for React, strict Pydantic v2
              models for FastAPI, and consistent conventions everywhere.
            </p>
          </div>
        </div>
      </section>

      <footer>
        MSFLib documentation · built with React + Vite · content generated from the library
        sources
      </footer>
    </div>
  )
}
