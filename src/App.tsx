import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  TrendingDown, 
  Cpu, 
  Zap, 
  Plug, 
  ArrowRight, 
  Car,
  Truck,
  BrainCircuit,
  Layers,
  ChevronDown,
  Mail
} from 'lucide-react';

const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M100 10 L10 190 L95 190 L95 150 L50 150 L65 110 L95 110 L95 10 Z" fill="#1436FF" />
    <path d="M35 180 L45 160 L95 160 L95 180 Z" fill="#1436FF" />
    <path d="M105 10 L190 190 L150 190 L135 150 L105 150 L105 10 Z" fill="#1436FF" />
    <path d="M105 80 L125 130 L105 130 Z" fill="#1436FF" />
  </svg>
);

const MotionTrails = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-apex-dark">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* Glowing Core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-apex-blue/20 rounded-full blur-[120px] opacity-60"></div>

      {/* Animated Trails */}
      {Array.from({ length: 30 }).map((_, i) => {
        const size = Math.random() * 2 + 1;
        return (
          <motion.div
            key={i}
            className="absolute bg-apex-blue rounded-full"
            style={{
              width: size,
              height: size * 40,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 20px 2px rgba(20, 54, 255, 0.5)'
            }}
            animate={{
              y: [1000, -1000],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 3
            }}
          />
        );
      })}
    </div>
  );
};

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined;

const ContactForm = () => {
  const [interest, setInterest] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'form-submitted' && event.data?.success) {
        setSubmitSuccess(true);
        setIsSubmitting(false);
        setInterest('');
        setCustomInterest('');
        setEmail('');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const interestValue = interest === 'other' ? customInterest : interest;
    if (!SCRIPT_URL) {
      setSubmitError('Google 시트 연동 URL이 설정되지 않았습니다. .env에 VITE_GOOGLE_SCRIPT_URL을 넣어주세요.');
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    const form = formRef.current;
    if (form) {
      const interestInput = form.querySelector<HTMLInputElement>('input[name="interest"]');
      const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
      if (interestInput) interestInput.value = interestValue;
      if (emailInput) emailInput.value = email;
      form.submit();
    }
    // 응답이 오지 않으면 8초 후 로딩만 해제 (재제출 가능)
    setTimeout(() => setIsSubmitting(false), 8000);
  };

  return (
    <>
      {/* Google 시트로 전송하는 숨김 폼 (iframe으로 제출해 CORS 없이 동작) */}
      <form
        ref={formRef}
        action={SCRIPT_URL}
        method="POST"
        target="google-sheet-iframe"
        className="hidden"
      >
        <input type="text" name="interest" readOnly aria-hidden />
        <input type="email" name="email" readOnly aria-hidden />
      </form>
      <iframe
        ref={iframeRef}
        name="google-sheet-iframe"
        title="제출 처리"
        className="hidden"
        style={{ position: 'absolute', width: 0, height: 0, border: 0 }}
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-400">관심 분야 (Interest)</label>
        <div className="relative">
          <select 
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full bg-apex-surface border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-apex-blue transition-colors"
            required
          >
            <option value="" disabled className="bg-apex-dark text-white">선택해주세요</option>
            <option value="b2b" className="bg-apex-dark text-white">B2B 솔루션 도입</option>
            <option value="saas" className="bg-apex-dark text-white">SaaS 구독 서비스</option>
            <option value="partnership" className="bg-apex-dark text-white">파트너십 및 제휴</option>
            <option value="other" className="bg-apex-dark text-white">직접 입력 (Other)</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {interest === 'other' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-col gap-2"
        >
          <label className="text-sm font-medium text-gray-400">관심 분야 직접 입력</label>
          <input 
            type="text"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            placeholder="관심 분야를 입력해주세요"
            className="w-full bg-apex-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-apex-blue transition-colors"
            required
          />
        </motion.div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-400">이메일 (Email)</label>
        <div className="relative">
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@example.com"
            className="w-full bg-apex-surface border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-apex-blue transition-colors"
            required
          />
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {submitSuccess && (
        <p className="text-green-400 text-sm">문의가 접수되었습니다. 감사합니다.</p>
      )}
      {submitError && (
        <p className="text-red-400 text-sm">{submitError}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button 
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          disabled={isSubmitting}
          className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50"
        >
          뒤로 가기
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-apex-blue hover:bg-blue-700 text-white font-medium py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? '제출 중...' : '문의 남기기'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
    </>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-apex-dark text-white selection:bg-apex-blue selection:text-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-apex-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/BA로고.png" alt="BLUE APEX Logo" className="h-12 w-auto" />
            <span className="font-bold tracking-widest text-apex-blue text-lg">BLUE APEX</span>
          </div>
          <a href="#contact" className="text-sm font-medium px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            Contact Us
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MotionTrails />
        </div>
        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-apex-dark/40 to-apex-dark pointer-events-none"></div>
        
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto pointer-events-none mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="text-apex-blue font-mono text-sm md:text-base tracking-[0.2em] uppercase mb-6">
              Blue Apex
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] mb-8">
              Where Intelligence <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 inline-block">
                Becomes Motion
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light break-keep">
              고가 자산인 모빌리티의 구조적 한계를 극복하고, <br className="hidden md:block" />
              안전과 효율을 극대화하는 Physical AI 기반 상황 인지 · 판단 솔루션
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 md:py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-20 md:w-2/3">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">The Mobility Dilemma</h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed break-keep">
              고가 자산인 모빌리티가 기술의 발전 속도를 따라가지 못하고 도태되는 구조적 문제로 인해,<br />
              <span className="text-white font-medium">예방 가능한 사고가 반복되고</span> <span className="text-white font-medium">운영 비용의 누수</span>가 발생합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-apex-surface border border-white/5 p-8 rounded-3xl flex flex-col gap-8"
            >
              <div className="w-full h-48 md:h-56 rounded-2xl overflow-hidden relative shrink-0">
                <img src="/예방가능한사고.png" alt="예방 가능한 사고" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-apex-surface to-transparent opacity-80"></div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-6">예방 가능한 사고</h3>
                <ul className="space-y-4">
                  {[
                    '페달 오조작 및 고령 운전자 사고',
                    '음주 운전 사고',
                    '인지 지연으로 인한 돌발 사고'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0" />
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-apex-surface border border-white/5 p-8 rounded-3xl flex flex-col gap-8"
            >
              <div className="w-full h-48 md:h-56 rounded-2xl overflow-hidden relative shrink-0">
                <img src="/운영비용누수.png" alt="운영 비용의 누수" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-apex-surface to-transparent opacity-80"></div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingDown className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold mb-6">운영 비용의 누수</h3>
                <ul className="space-y-4">
                  {[
                    '타이어 마모 및 소모품 진단 불능',
                    '물류 장비 병목 현상 및 사고 발생',
                    '데이터 없이 달리는 트럭의 운영 누수'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 shrink-0" />
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 md:py-32 px-6 bg-white text-apex-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-apex-blue font-mono text-sm tracking-[0.2em] uppercase mb-4">Our Solutions</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">안전과 효율의 극대화</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Safety */}
            <div>
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-black/10">
                <ShieldAlert className="w-8 h-8 text-apex-blue" />
                <h4 className="text-2xl font-bold">안전 극대화 솔루션</h4>
              </div>
              <div className="space-y-8">
                {[
                  { title: '교통 약자용 AI 어시스턴트', desc: '실시간 주행 상황을 정밀하게 판단하여, 운전자의 인지 능력을 보완하는 최적화된 시·청각 피드백 제공' },
                  { title: '음주 운전 방지 솔루션', desc: '운전자의 제스처를 분석하는 동작인식 기술과 초정밀 알코올 측정 센싱 기술로 음주운전을 원천 차단' },
                  { title: '멀티모달 AI 기반 페달 오조작 방지 장치', desc: '페달 조작 패턴과 내·외부 상황을 실시간 분석하여, 오조작 상황을 정밀하게 판단하고 경고 및 제어 수행' }
                ].map((item, i) => (
                  <div key={i} className="group">
                    <h5 className="text-xl font-bold mb-2 group-hover:text-apex-blue transition-colors break-keep">{item.title}</h5>
                    <p className="text-gray-600 break-keep">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Efficiency */}
            <div>
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-black/10">
                <Zap className="w-8 h-8 text-apex-blue" />
                <h4 className="text-2xl font-bold">효율 극대화 솔루션</h4>
              </div>
              <div className="space-y-8">
                {[
                  { title: '모빌리티 부품 마모도 실시간 추적', desc: '차량 데이터를 실시간으로 수집·분석하여 부품 마모도를 정밀하게 추적하고, 고장 발생 전 최적의 정비 시점을 예측하여 관리' },
                  { title: 'AMR 인지 판단 성능 향상 솔루션', desc: '작업자와 장비의 이동 경로를 정밀하게 예측하여, AMR의 인지·판단 성능을 극대화하고 작업 동선의 병목 현상을 해결' },
                  { title: '물류 트럭 자율주행 운영 최적화 솔루션', desc: '최적의 자율주행 경로 생성과 통합 운행 제어를 통해 차량 가동률을 극대화하고, 불필요한 운행 구간을 제거하여 전체 물류 비용을 혁신적으로 낮춤' }
                ].map((item, i) => (
                  <div key={i} className="group">
                    <h5 className="text-xl font-bold mb-2 group-hover:text-apex-blue transition-colors break-keep">{item.title}</h5>
                    <p className="text-gray-600 break-keep">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apex Technology */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-apex-blue/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Apex Technology</h2>
            <p className="text-xl text-gray-400 font-light">모빌리티의 두뇌를 진화시키는 독보적인 AI 기술</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-apex-surface/80 backdrop-blur-sm border border-white/10 p-8 rounded-3xl"
            >
              <BrainCircuit className="w-10 h-10 text-apex-blue mb-6" />
              <h3 className="text-2xl font-bold mb-4 break-keep">Driving Curator AI</h3>
              <p className="text-gray-400 leading-relaxed break-keep">
                단순한 센서 데이터 수집을 넘어, 주행 상황을 깊이 이해하고 맥락을 파악하는 고도화된 멀티 모달 AI
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-apex-surface/80 backdrop-blur-sm border border-white/10 p-8 rounded-3xl"
            >
              <Cpu className="w-10 h-10 text-apex-blue mb-6" />
              <h3 className="text-2xl font-bold mb-4 break-keep">Edge-Driven Reactions</h3>
              <p className="text-gray-400 leading-relaxed break-keep">
                제한된 임베디드 시스템 사양에서도 실시간으로 반응할 수 있도록 설계된 AI 연산 최적화 및 경량화 기술
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-apex-surface/80 backdrop-blur-sm border border-white/10 p-8 rounded-3xl"
            >
              <Plug className="w-10 h-10 text-apex-blue mb-6" />
              <h3 className="text-2xl font-bold mb-4 break-keep">Plug & Driving</h3>
              <p className="text-gray-400 leading-relaxed break-keep">
                기존 모빌리티 시스템에 손쉽게 장착 가능하며, OTA를 통한 지속적인 성능 업데이트 지원
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Business Model & Scalability */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-12 tracking-tight">Business & Scalability</h2>
              
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <Layers className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-apex-blue break-keep">B2B Solution</h3>
                    <p className="text-gray-400 leading-relaxed break-keep">
                      모빌리티 제조/부품사, 상용차/특장차 제조사에 최적화된 온디바이스 AI 모듈 및 소프트웨어 솔루션 공급
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-apex-blue break-keep">SaaS Platform</h3>
                    <p className="text-gray-400 leading-relaxed break-keep">
                      물류 및 운수 기업을 대상으로 한 실시간 예지 정비 및 통합 안전 관제 클라우드 구독 서비스 제공
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-apex-blue break-keep">Infinite Scalability</h3>
                    <p className="text-gray-400 leading-relaxed break-keep">
                      이동하는 모든 시스템에 손쉽게 이식 가능한 범용 지능 플랫폼으로, 로봇, 해운, 항공 등 다양한 모빌리티 시장으로 무한 확장
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-apex-surface">
              {/* Abstract visualization of scalability */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,54,255,0.15)_0%,transparent_70%)]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-8 w-full h-full">
                  <div className="bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-colors p-4 text-center">
                    <Car className="w-12 h-12 text-gray-400" />
                    <span className="text-sm font-medium text-gray-400">Passenger Vehicles</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-colors p-4 text-center">
                    <Truck className="w-12 h-12 text-gray-400" />
                    <span className="text-sm font-medium text-gray-400">Commercial Fleets</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-colors p-4 text-center">
                    <Cpu className="w-12 h-12 text-gray-400" />
                    <span className="text-sm font-medium text-gray-400">AMR & Robotics</span>
                  </div>
                  <div className="bg-apex-blue/20 rounded-2xl border border-apex-blue/50 flex flex-col items-center justify-center gap-4 relative overflow-hidden p-4 text-center">
                    <div className="absolute inset-0 bg-apex-blue/20 animate-pulse"></div>
                    <Layers className="w-12 h-12 text-apex-blue relative z-10" />
                    <span className="text-sm font-bold text-apex-blue relative z-10">BLUE APEX Core</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-32 px-6 bg-white text-apex-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Execution-Driven Engineering Team</h2>
            <p className="text-xl text-gray-600">모빌리티의 미래를 현실로 만드는 사람들</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                role: 'CEO', 
                name: '김병건', 
                img: '/김병건.png',
                history: [
                  '한양대학교 기계공학 학사 (2019)',
                  'SK 하이닉스 공정 TL (2019 ~ 2020)',
                  '한양대학교 자동차전자제어공학 석사 (2022)',
                  '현대자동차그룹 친환경 차량 제어기 연구원 (2022 ~)',
                  '현대자동차그룹 사내 스타트업 리더(2025 ~)',
                  '한양대학교 인공지능학 박사과정 (2026 ~)'
                ]
              },
              { 
                role: 'COO', 
                name: '권나현', 
                img: '/권나현.png',
                history: [
                  '한양대학교 미래자동차공학 학사 (2020)',
                  '한양대학교 자동차전자제어공학 석사 (2022)',
                  '현대자동차 자율주행 제어 연구원 (2022 ~ 2026)',
                  '한양대학교 인공지능학 박사과정 (2026 ~ )'
                ]
              },
              { 
                role: 'CPO', 
                name: '김도형', 
                img: '/김도형.png',
                history: [
                  '영남대학교 전자공학과 학사',
                  '크루셜텍 신사업팀장 (2014 ~ 2019)',
                  '아이큐브랩 대표이사 (2019 ~ )'
                ]
              },
              { 
                role: 'Technical Advisor', 
                name: '김동찬', 
                img: '/김동찬.png',
                history: [
                  '한양대학교 미래자동차공학 학사 (2015)',
                  '한양대학교 미래자동차공학 박사 (2022)',
                  '42dot 모션 플래닝 엔지니어 (2022 ~ 2025)',
                  '한양대학교 인공지능학과 조교수 (2025 ~ )'
                ]
              }
            ].map((member, i) => (
              <div key={i} className="group cursor-pointer flex flex-col h-full">
                <div className="relative w-1/2 aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-gray-100 shrink-0">
                  <img 
                    src={member.img} 
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-apex-blue font-medium text-sm uppercase tracking-wider mb-4">{member.role}</p>
                <ul className="space-y-2 mt-4">
                  {member.history.map((line, j) => (
                    <li key={j} className="text-sm text-gray-400 leading-snug flex items-start gap-2">
                      <span className="text-apex-blue mt-1 shrink-0">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Achievements */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 tracking-tight text-center">Milestones & Recognition</h2>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            
            {/* 2026 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-apex-dark text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-xs font-bold text-apex-blue">'26</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-white/10 bg-apex-surface/50 backdrop-blur-sm">
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-apex-blue font-mono mb-1">02.21</div>
                    <div className="font-bold text-lg">한양대학교 AI-dea Challenge 최우수상</div>
                    <div className="text-sm text-gray-400 mt-1">한양대학교 주관</div>
                  </div>
                  <div>
                    <div className="text-sm text-apex-blue font-mono mb-1">01.16</div>
                    <div className="font-bold text-lg">KOIIA AC 배치 프로그램 1기</div>
                    <div className="text-sm text-gray-400 mt-1">한국산업지능화협회 주관</div>
                  </div>
                  <div>
                    <div className="text-sm text-apex-blue font-mono mb-1">01.10</div>
                    <div className="font-bold text-lg">한양대학교 캠퍼스랩 스타트업 브릿지 우수상</div>
                    <div className="text-sm text-gray-400 mt-1">한양대학교 주관</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2025 Late */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-apex-dark text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-xs font-bold text-gray-400">'25</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-white/10 bg-apex-surface/50 backdrop-blur-sm">
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-400 font-mono mb-1">12.24</div>
                    <div className="font-bold text-lg">AI 라이프 솔루션 챌린지 장려상</div>
                    <div className="text-sm text-gray-500 mt-1">한국산업기술기획평가원 주관</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 font-mono mb-1">12.24</div>
                    <div className="font-bold text-lg">한양대 ERICA 산학협력단지 조성사업 선정</div>
                    <div className="text-sm text-gray-500 mt-1">한양대학교 ERICA 주관</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 font-mono mb-1">12.23</div>
                    <div className="font-bold text-lg">한양대학교 캠퍼스타운 창업경진대회 선발</div>
                    <div className="text-sm text-gray-500 mt-1">서울특별시 주관</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 font-mono mb-1">12.10</div>
                    <div className="font-bold text-lg">안산시 청년큐브 창업지원사업 선정</div>
                    <div className="text-sm text-gray-500 mt-1">경기테크노파크 주관</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 font-mono mb-1">12.09</div>
                    <div className="font-bold text-lg">KAIST Hu-Robotics Startup Cup 우수상</div>
                    <div className="text-sm text-gray-500 mt-1">과학기술정보통신부 주관</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2025 Early/Mid */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-apex-dark text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-xs font-bold text-gray-400">'25</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-white/10 bg-apex-surface/50 backdrop-blur-sm">
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-400 font-mono mb-1">07 ~ '27.12</div>
                    <div className="font-bold text-lg">자동차산업기술개발사업 연구개발과제 참여</div>
                    <div className="text-sm text-gray-500 mt-1">산업통상자원부 주관 <br/>(교통약자를 위한 AI 기반 능동형 운전자 어시스턴스 시스템/서비스 개발)</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 font-mono mb-1">02 ~ 12</div>
                    <div className="font-bold text-lg">현대자동차그룹 사내 스타트업 프로그램 선발</div>
                    <div className="text-sm text-gray-500 mt-1">현대자동차그룹 주관</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-apex-blue/10 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Ready to Move Forward?</h2>
          <p className="text-xl text-gray-400 mb-12 break-keep">
            <span className="text-apex-blue font-bold">BLUE APEX</span>와 함께 모빌리티의 지능화를 시작하세요.
          </p>
          
          <div className="bg-apex-surface/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl text-left">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/BA로고.png" alt="BLUE APEX Logo" className="h-12 w-auto" />
            <span className="font-bold tracking-widest text-apex-blue text-lg">BLUE APEX</span>
          </div>
          <p>© 2026 <span className="text-apex-blue font-bold">BLUE APEX</span>. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
