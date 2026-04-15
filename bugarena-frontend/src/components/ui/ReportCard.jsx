import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import SeverityBadge from './SeverityBadge'
import { formatDate } from '../../utils/formatDate'

export default function ReportCard({ report }) {
  return (
    <Link
      to={`/reports/${report?._id}`}
      className="block bg-surface-container-high p-5 border border-white/5 hover:bg-surface-container-highest hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors">
            {report?.title || 'Untitled Report'}
          </h4>
          <p className="font-mono text-[10px] text-on-surface-variant mt-0.5">
            {report?.program?.name || 'Unknown Program'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={report?.severity} />
          <StatusBadge status={report?.status} />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
        <span className="font-mono text-[10px] text-on-surface-variant">
          {formatDate(report?.createdAt)}
        </span>
        {report?.reward ? (
          <span className="font-mono text-xs text-primary font-bold">${report.reward}</span>
        ) : (
          <span className="font-mono text-xs text-on-surface-variant">---</span>
        )}
      </div>
    </Link>
  )
}
