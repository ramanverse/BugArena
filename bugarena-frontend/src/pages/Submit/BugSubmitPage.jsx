import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import Sidebar from '../../components/layout/Sidebar'
import PageTransition from '../../components/layout/PageTransition'
import { submitReport } from '../../api/report.api'

const SEVERITIES = [
  { value: 'CRITICAL', color: 'border-error bg-error-container/10 hover:border-error', label: 'CRITICAL', desc: 'CVSS 9.0+' },
  { value: 'HIGH', color: 'border-secondary bg-secondary/5 hover:border-secondary', label: 'HIGH', desc: 'CVSS 7.0–8.9' },
  { value: 'MEDIUM', color: 'border-tertiary bg-tertiary/5 hover:border-tertiary', label: 'MEDIUM', desc: 'CVSS 4.0–6.9' },
  { value: 'LOW', color: 'border-primary bg-primary/5 hover:border-primary', label: 'LOW', desc: 'CVSS 0.1–3.9' },
  { value: 'INFO', color: 'border-outline-variant hover:border-outline', label: 'INFO', desc: 'Informational' },
]

const schema = z.object({
  title: z.string().min(5, 'Title too short'),
  program: z.string().min(1, 'Select a program'),
  vulnerabilityType: z.string().min(1, 'Select vuln type'),
  severity: z.string().min(1, 'Select severity'),
  affectedUrl: z.string().url('Must be a valid URL'),
  cvssScore: z.number().min(0).max(10),
  stepsToReproduce: z.string().min(20, 'Provide detailed steps'),
  impactDescription: z.string().min(10, 'Describe the impact'),
  pocVideoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

export default function BugSubmitPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [files, setFiles] = useState([])
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [loading, setLoading] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted) => setFiles((prev) => [...prev, ...accepted]),
    accept: { 'image/*': [] },
    maxFiles: 10,
  })

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { cvssScore: 5 },
  })

  const watchAll = watch()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await submitReport({ ...data, severity: selectedSeverity })
      toast.success('Report submitted successfully')
      navigate('/reports')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  const STEPS_LABELS = ['Target & Severity', 'Vulnerability Details', 'Evidence & Submit']

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />
        <PageTransition>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface uppercase mb-2">
              Submit <span className="text-primary">Report</span>
            </h1>
            <p className="text-on-surface-variant font-mono text-xs mb-8 uppercase tracking-widest">
              Document your vulnerability finding
            </p>

            {/* Progress Bar */}
            <div className="mb-10">
              <div className="flex gap-2 mb-4">
                {STEPS_LABELS.map((label, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 transition-all duration-300 ${i <= step ? 'bg-primary' : 'bg-surface-container-high'}`}
                  />
                ))}
              </div>
              <div className="flex justify-between">
                {STEPS_LABELS.map((label, i) => (
                  <span key={i} className={`font-mono text-[10px] uppercase tracking-widest ${i === step ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 0 */}
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1.5">Report Title</label>
                    <input type="text" className="input-field" placeholder="XSS in login form" {...register('title')} />
                    {errors.title && <p className="mt-1 text-error font-mono text-[10px]">{errors.title.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1.5">Target Program</label>
                    <select className="input-field bg-surface-container-lowest" {...register('program')}>
                      <option value="">Select program...</option>
                      <option value="paypal">PayPal</option>
                      <option value="github">GitHub</option>
                      <option value="google">Google</option>
                    </select>
                    {errors.program && <p className="mt-1 text-error font-mono text-[10px]">{errors.program.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1.5">Vulnerability Type</label>
                    <select className="input-field bg-surface-container-lowest" {...register('vulnerabilityType')}>
                      <option value="">Select type...</option>
                      <option>XSS</option><option>SQL Injection</option><option>SSRF</option>
                      <option>RCE</option><option>IDOR</option><option>Open Redirect</option>
                      <option>CSRF</option><option>Authentication Bypass</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-3">Severity Rating</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {SEVERITIES.map(({ value, color, label, desc }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setSelectedSeverity(value)}
                          className={`p-4 border-2 text-left transition-all duration-200 ${
                            selectedSeverity === value ? color : 'border-outline-variant/20 hover:border-outline-variant/50'
                          }`}
                        >
                          <p className="font-mono text-xs font-bold text-on-surface">{label}</p>
                          <p className="font-mono text-[10px] text-on-surface-variant">{desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1.5">Affected URL</label>
                    <input type="url" className="input-field" placeholder="https://example.com/vuln" {...register('affectedUrl')} />
                    {errors.affectedUrl && <p className="mt-1 text-error font-mono text-[10px]">{errors.affectedUrl.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-3">
                      CVSS Score: <span className="text-primary">{watchAll.cvssScore}</span>
                    </label>
                    <input
                      type="range" min="0" max="10" step="0.1"
                      className="w-full accent-primary h-1 cursor-pointer"
                      {...register('cvssScore', { valueAsNumber: true })}
                    />
                    <div className="flex justify-between font-mono text-[10px] text-on-surface-variant mt-1">
                      <span>0 — None</span><span>5 — Medium</span><span>10 — Critical</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1.5">Steps to Reproduce</label>
                    <textarea rows={6} className="input-field resize-none" placeholder="1. Navigate to..&#10;2. Enter payload..." {...register('stepsToReproduce')} />
                    {errors.stepsToReproduce && <p className="mt-1 text-error font-mono text-[10px]">{errors.stepsToReproduce.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1.5">Impact Description</label>
                    <textarea rows={4} className="input-field resize-none" placeholder="An attacker could..." {...register('impactDescription')} />
                    {errors.impactDescription && <p className="mt-1 text-error font-mono text-[10px]">{errors.impactDescription.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Dropzone */}
                  <div>
                    <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-3">Screenshots / Evidence</label>
                    <div
                      {...getRootProps()}
                      className={`bg-surface-container-high border border-dashed p-12 text-center cursor-pointer transition-colors duration-200 ${
                        isDragActive ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-4 block">cloud_upload</span>
                      <p className="font-mono text-sm text-on-surface-variant">
                        {isDragActive ? 'Drop files here...' : 'Drag & drop screenshots, or click to browse'}
                      </p>
                      <p className="font-mono text-[10px] text-outline mt-2">PNG, JPG, GIF up to 10 files</p>
                    </div>
                    {files.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {files.map((f, i) => (
                          <span key={i} className="px-3 py-1 bg-surface-container-high font-mono text-[10px] text-on-surface-variant border border-white/5">
                            {f.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1.5">PoC Video URL (optional)</label>
                    <input type="url" className="input-field" placeholder="https://youtube.com/..." {...register('pocVideoUrl')} />
                  </div>

                  {/* Summary Preview */}
                  <div className="bg-surface-container-low p-6 border-t border-white/5 space-y-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary mb-4">Submission Preview</p>
                    {[
                      { label: 'Title', val: watchAll.title },
                      { label: 'Program', val: watchAll.program },
                      { label: 'Type', val: watchAll.vulnerabilityType },
                      { label: 'Severity', val: selectedSeverity },
                      { label: 'CVSS', val: watchAll.cvssScore },
                      { label: 'URL', val: watchAll.affectedUrl },
                    ].map(({ label, val }) => (
                      <div key={label} className="flex gap-4 font-mono text-xs">
                        <span className="text-on-surface-variant uppercase w-20 shrink-0">{label}</span>
                        <span className="text-on-surface">{val || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="px-6 py-2.5 border border-outline-variant text-on-surface hover:bg-white/5 font-mono text-xs uppercase tracking-widest transition-all disabled:opacity-30"
                >
                  Previous
                </button>

                {step < 2 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-2.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
                  >
                    {loading ? 'Submitting...' : 'Submit Report'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
