import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import RiskBadge from '../components/RiskBadge'

const SAMPLE = [
  { id: 'INC-1042', title: 'Lookalike domain live', level: 'High' },
  { id: 'INC-1041', title: 'Credential dump hit', level: 'Critical' },
  { id: 'INC-1039', title: 'Social impersonation', level: 'Medium' },
]

export default function Incidents() {
  return (
    <Layout>
      <header className="overview__head">
        <h1>Incidents</h1>
        <p>Investigate and track digital risk cases.</p>
      </header>
      <article className="panel">
        <ul>
          {SAMPLE.map((incident) => (
            <li key={incident.id}>
              <RiskBadge level={incident.level} />
              <div>
                <Link to={`/incidents/${incident.id}`}>
                  <strong>{incident.title}</strong>
                </Link>
                <p>{incident.id}</p>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </Layout>
  )
}
