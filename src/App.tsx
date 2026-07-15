import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BrainCircuit,
  Boxes,
  Layers3,
  Mail,
  MessageCircle,
  PenTool,
  Sparkles,
  Wand2,
} from 'lucide-react';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import LiquidEther from './LiquidEther';

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
};

type Project = {
  number: string;
  title: string;
  category: string;
  description: string;
  images: [string, string, string];
};

const navItems = [
  ['经历', '#about'],
  ['能力', '#services'],
  ['项目', '#projects'],
  ['联系', '#contact'],
];

const marqueeImages = [
  '/assets/project-kv-618.webp',
  '/assets/project-kv-88.webp',
  '/assets/project-kv-1111.webp',
  '/assets/marquee-21-38.webp',
  '/assets/marquee-qixi.webp',
  '/assets/marquee-makeup.webp',
  '/assets/project-overview.webp',
  '/assets/project-ip.webp',
  '/assets/page-618-home.webp',
  '/assets/page-ruby-serum.webp',
  '/assets/page-sunscreen.webp',
  '/assets/live-super.webp',
];

const services = [
  {
    icon: <Layers3 size={24} />,
    title: '品牌视觉系统',
    text: '建立从KV、海报、页面到投放物料的一致视觉秩序，让品牌在不同场景中保持稳定识别。',
  },
  {
    icon: <BrainCircuit size={24} />,
    title: 'AI设计工作流',
    text: '结合AI图像生成、合成与快速方案推演，提升前期探索效率，也扩展视觉表达的可能性。',
  },
  {
    icon: <Boxes size={24} />,
    title: '电商转化表达',
    text: '理解货品、利益点、活动节奏和用户路径，把商业信息转译为清晰、有吸引力的画面层级。',
  },
  {
    icon: <PenTool size={24} />,
    title: '高完成度执行',
    text: '关注版式、字体、光影、材质与细节收口，让作品在真实业务节奏中高质量落地。',
  },
  {
    icon: <Wand2 size={24} />,
    title: '复合创意整合',
    text: '能在品牌、运营、页面、直播与AI内容之间快速切换，把分散素材整合为完整叙事。',
  },
];

const stats = [
  ['2020-2022', '作品集时间跨度'],
  ['50+', '作品集页面'],
  ['6+', '覆盖设计场景'],
  ['AI + Brand', '复合创作方向'],
];

const projects: Project[] = [
  {
    number: '01',
    title: 'PROYA Campaign System',
    category: '电商营销 / 品牌KV',
    description: '围绕大促活动建立强记忆点主视觉，并将产品、利益点和活动节奏延展到多端页面与投放物料。',
    images: ['/assets/project-kv-618.webp', '/assets/project-kv-88.webp', '/assets/page-618-home.webp'],
  },
  {
    number: '02',
    title: 'Aerospace IP Collaboration',
    category: 'IP定制 / 产品物料',
    description: '以航天叙事和产品包装为核心，构建带有科技想象力的跨界视觉资产，兼顾展示感与传播识别。',
    images: ['/assets/project-ip.webp', '/assets/live-super.webp', '/assets/project-overview.webp'],
  },
  {
    number: '03',
    title: 'Product Visual Collection',
    category: '品牌海报 / 页面视觉',
    description: '通过材质、光感和信息层级呈现产品卖点，让单张海报和长页面都具备审美张力与销售效率。',
    images: ['/assets/project-brand-serum.webp', '/assets/project-brand-cream.webp', '/assets/page-ruby-serum.webp'],
  },
];

function FadeIn({ children, className = '', delay = 0, y = 34, x = 0 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function useSecondScreenNav() {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const update = () => setIsFloating(window.scrollY > window.innerHeight * 0.82);
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return isFloating;
}

function GlowButton({ href = '#contact', children }: { href?: string; children: ReactNode }) {
  return (
    <a href={href} className="glow-button group">
      <span className="glow-button__shine" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </a>
  );
}

function HeroCharacter() {
  return (
    <motion.div
      className="hero-character"
      initial={{ opacity: 0, y: 42, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <svg className="hero-character__filters" aria-hidden="true">
        <filter id="green-edge-distort">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.052" numOctaves="2" seed="9">
            <animate attributeName="baseFrequency" dur="3.4s" values="0.009 0.052;0.018 0.082;0.009 0.052" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
      </svg>
      <div className="hero-character__glow" />
      <img className="hero-character__edge hero-character__edge--wide" src="/assets/hero-character.webp" alt="" draggable={false} />
      <img className="hero-character__edge hero-character__edge--fine" src="/assets/hero-character.webp" alt="" draggable={false} />
      <img
        className="hero-character-bg"
        src="/assets/hero-character.webp"
        alt="袁磊个人形象"
        draggable={false}
      />
      <div className="hero-character__mist" />
      <span className="hero-character__edge-scan hero-character__edge-scan--a" />
      <span className="hero-character__edge-scan hero-character__edge-scan--b" />
    </motion.div>
  );
}

function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rowOne = useTransform(scrollYProgress, [0, 1], ['-22%', '4%']);
  const rowTwo = useTransform(scrollYProgress, [0, 1], ['2%', '-24%']);

  return (
    <section ref={ref} className="marquee-clip relative bg-[#050505] py-24 sm:py-32 lg:py-40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b8ff4d]/45 to-transparent" />
      <MarqueeRow images={marqueeImages.slice(0, 6)} x={rowOne} />
      <MarqueeRow images={marqueeImages.slice(6)} x={rowTwo} reverse />
    </section>
  );
}

function MarqueeRow({ images, x, reverse = false }: { images: string[]; x: MotionValue<string>; reverse?: boolean }) {
  const repeated = [...images, ...images, ...images];

  return (
    <motion.div
      style={{ x, willChange: 'transform' }}
      className={`mb-3 flex w-max gap-3 ${reverse ? 'pl-[18vw]' : ''}`}
    >
      {repeated.map((image, index) => (
        <img
          key={`${image}-${index}`}
          src={image}
          alt=""
          loading="lazy"
          className="image-edge h-[220px] w-[340px] rounded-[26px] object-cover sm:h-[270px] sm:w-[420px]"
        />
      ))}
    </motion.div>
  );
}

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <section ref={ref} className="h-[82vh] min-h-[700px]">
      <motion.article
        style={{ scale, top: `calc(6rem + ${index * 28}px)` }}
        className="sticky overflow-hidden rounded-[36px] border border-white/14 bg-[#101112]/94 p-4 shadow-[0_34px_140px_rgba(0,0,0,0.58)] backdrop-blur sm:rounded-[46px] sm:p-6 lg:p-8"
      >
        <div className="mb-5 grid items-end gap-4 lg:grid-cols-[0.34fr_1fr_auto]">
          <span className="font-display text-7xl font-black leading-none text-[#b8ff4d] sm:text-8xl lg:text-9xl">
            {project.number}
          </span>
          <div>
            <p className="mb-2 text-sm text-white/48">{project.category}</p>
            <h3 className="font-display text-4xl font-black uppercase leading-none text-white sm:text-5xl lg:text-7xl">
              {project.title}
            </h3>
          </div>
          <GlowButton href="#contact">
            查看项目
            <ArrowUpRight size={16} />
          </GlowButton>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.42fr_0.58fr]">
          <div className="grid gap-4">
            <img src={project.images[0]} alt={project.title} className="h-[180px] w-full rounded-[26px] object-cover sm:h-[230px] lg:rounded-[34px]" />
            <div className="relative overflow-hidden rounded-[26px] lg:rounded-[34px]">
              <img src={project.images[1]} alt={project.title} className="h-[240px] w-full object-cover sm:h-[330px]" />
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/74 to-transparent p-6 text-sm leading-7 text-white/78">
                {project.description}
              </p>
            </div>
          </div>
          <img src={project.images[2]} alt={project.title} className="h-[438px] w-full rounded-[26px] object-cover sm:h-[577px] lg:rounded-[34px]" />
        </div>
      </motion.article>
    </section>
  );
}

function App() {
  const navFloating = useSecondScreenNav();

  return (
    <main className="min-h-screen overflow-x-clip bg-[#050505] font-body text-white">
      <section id="top" className="relative flex min-h-screen flex-col overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 z-0 opacity-70">
          <LiquidEther
            colors={['#b8ff4d', '#343a34', '#050505']}
            mouseForce={19}
            cursorSize={150}
            resolution={0.58}
            autoDemo
            autoSpeed={0.2}
            autoIntensity={1.25}
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(184,255,77,0.12),transparent_22rem),radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.045),transparent_24rem),linear-gradient(180deg,rgba(5,5,5,0.18),#050505_94%)]" />
        <div className="grid-mask absolute inset-0" />

        <motion.nav
          className={`left-4 right-4 z-50 mx-auto flex max-w-page items-center justify-between px-5 py-4 transition-all duration-300 sm:left-8 sm:right-8 sm:px-7 ${
            navFloating
              ? 'fixed top-4 rounded-[28px] border border-white/16 bg-[#111214]/68 shadow-[0_18px_80px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl'
              : 'absolute top-6 rounded-[24px] border border-white/10 bg-white/[0.035] backdrop-blur-md'
          }`}
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <a href="#top" className="flex items-center gap-3 font-display">
            <span className="grid h-10 min-w-10 place-items-center rounded-xl bg-[#b8ff4d] px-3 text-sm font-black text-[#050505]">Lay</span>
            <span className="hidden text-xs font-bold uppercase text-white/70 sm:block">Design Portfolio</span>
          </a>
          <div className="hidden gap-8 text-sm font-semibold text-white/72 md:flex lg:text-base">
            {navItems.map(([label, href]) => (
              <a key={label} href={href} className="transition hover:text-[#b8ff4d]">
                {label}
              </a>
            ))}
          </div>
          <GlowButton>
            <Mail size={16} />
            联系我
          </GlowButton>
        </motion.nav>

        <div className="relative z-10 mx-auto flex w-[min(calc(100%_-_48px),1700px)] flex-1 flex-col justify-between pb-8 pt-28 sm:pb-10 lg:pt-32">
          <FadeIn delay={0.1} y={40} className="overflow-hidden text-center">
            <p className="mb-2 text-xs font-bold uppercase text-[#b8ff4d] sm:text-sm">
              Visual Designer / AI Designer / Brand Designer
            </p>
            <h1 className="hero-name-heading whitespace-nowrap font-display text-[14vw] font-black uppercase leading-none xl:text-[13vw]">
              Hi, I'm Yuan_
            </h1>
          </FadeIn>

          <HeroCharacter />

          <div className="relative z-20 grid items-end gap-8 lg:grid-cols-[0.9fr_auto_0.9fr]">
            <FadeIn delay={0.32} y={22}>
              <p className="max-w-[430px] text-base font-light uppercase leading-snug text-white/72 sm:text-lg">
                以视觉系统连接品牌、产品、商业转化与AI创作。
              </p>
            </FadeIn>

            <FadeIn delay={0.44} y={22} className="hidden justify-center lg:flex">
              <div className="flex flex-wrap justify-center gap-2 text-xs text-white/72">
                {['品牌设计', '电商视觉', 'AI辅助创意', '运营设计'].map((item) => (
                  <span key={item} className="rounded-full border border-white/12 bg-white/[0.045] px-4 py-3 backdrop-blur transition hover:-translate-y-1 hover:border-[#b8ff4d]/50 hover:text-[#b8ff4d]">
                    {item}
                  </span>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.45} y={22} className="flex justify-start lg:justify-end">
              <GlowButton>
                <Mail size={16} />
                联系我
              </GlowButton>
            </FadeIn>
          </div>
        </div>
      </section>

      <MarqueeSection />

      <section id="about" className="relative grid min-h-screen place-items-center overflow-hidden bg-[#050505] px-6 py-24 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_22%,rgba(255,255,255,0.055),transparent_28rem),radial-gradient(circle_at_88%_74%,rgba(184,255,77,0.085),transparent_26rem)]" />
        <img src="/assets/project-brand-serum.webp" alt="" className="absolute left-[4%] top-[8%] hidden w-[170px] rotate-[-10deg] rounded-[28px] object-cover opacity-70 md:block" />
        <img src="/assets/project-brand-cream.webp" alt="" className="absolute bottom-[8%] right-[6%] hidden w-[190px] rotate-[9deg] rounded-[28px] object-cover opacity-80 md:block" />
        <div className="relative mx-auto grid max-w-4xl justify-items-center text-center">
          <FadeIn>
            <h2 className="section-heading-muted font-display text-7xl font-black uppercase leading-none sm:text-8xl lg:text-9xl">About Me</h2>
          </FadeIn>
          <FadeIn delay={0.18}>
            <p className="mt-12 max-w-5xl text-balance text-xl font-medium leading-10 text-white/78 sm:text-2xl">
              我是袁磊，拥有8年以上品牌视觉设计及管理经验，深耕品牌设计、电商营销设计、AI设计、IP定制物料设计等领域，拥有数码3C、美妆护肤、服饰、家居等类目设计经验；对于视觉设计有极高的要求，不仅关注美感，更加注重信息是否被看见、被理解、被转化。期待与你共创一个精彩项目！
            </p>
          </FadeIn>
          <FadeIn delay={0.32} className="mt-14">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(([value, label]) => (
                <div key={label} className="glass-line rounded-[22px] px-6 py-5 text-left">
                  <strong className="block font-display text-2xl font-black text-white">{value}</strong>
                  <span className="mt-2 block text-xs text-white/54">{label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="services" className="relative rounded-t-[46px] bg-[#0d0e0f] px-6 py-24 text-white sm:px-10 lg:py-32">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b8ff4d]/48 to-transparent" />
        <div className="mx-auto max-w-page">
          <FadeIn>
            <h2 className="section-heading-muted text-center font-display text-7xl font-black uppercase leading-none sm:text-8xl lg:text-9xl">Capabilities</h2>
          </FadeIn>
          <div className="mx-auto mt-16 grid max-w-7xl gap-4 lg:mt-24">
            {services.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.08}>
                <article className="glass-line group grid gap-6 rounded-[28px] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#b8ff4d]/36 hover:bg-white/[0.065] sm:grid-cols-[0.18fr_1fr] lg:p-9">
                  <span className="font-display text-6xl font-black leading-none text-[#b8ff4d]/86 sm:text-7xl">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/12 bg-white/[0.06] text-[#b8ff4d] transition group-hover:scale-110">{item.icon}</div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold uppercase sm:text-4xl">{item.title}</h3>
                      <p className="mt-3 max-w-3xl text-base font-light leading-8 text-white/62 sm:text-lg">{item.text}</p>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="relative z-10 -mt-12 overflow-hidden rounded-t-[46px] bg-[#050505] px-6 py-24 sm:px-10 lg:py-32">
        <div className="mx-auto max-w-page">
          <FadeIn>
            <div className="mb-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <h2 className="section-heading-muted font-display text-7xl font-black uppercase leading-none sm:text-8xl lg:text-9xl">Projects</h2>
              <p className="max-w-xl text-lg leading-8 text-white/62">
                以作品集已有素材搭建首版项目展示。后续可继续拆成详情页、过程页、动效页和AI生成流程页。
              </p>
            </div>
          </FadeIn>
          <div>
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} total={projects.length} />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative z-20 grid min-h-screen place-items-center bg-[radial-gradient(circle_at_18%_40%,rgba(184,255,77,0.12),transparent_28rem),radial-gradient(circle_at_85%_18%,rgba(255,255,255,0.06),transparent_28rem),#050505] px-6 py-24 sm:px-10">
        <div className="mx-auto grid w-full max-w-page items-end gap-12 lg:grid-cols-[1fr_auto]">
          <FadeIn>
            <p className="mb-6 text-xs font-bold uppercase text-[#b8ff4d]">Contact</p>
            <h2 className="section-heading-muted max-w-5xl font-display text-7xl font-black uppercase leading-none sm:text-8xl lg:text-9xl">
              期待与您合作！
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70">
              欢迎联系查看完整作品集，讨论品牌视觉、AI设计工作流或项目合作。
            </p>
          </FadeIn>
          <FadeIn delay={0.18} className="grid gap-3">
            <GlowButton href="mailto:875204105@qq.com">
              <Mail size={19} />
              875204105@qq.com
            </GlowButton>
            <GlowButton href="#top">
              <Sparkles size={19} />
              返回首页
            </GlowButton>
            <GlowButton href="tel:18668039627">
              <MessageCircle size={19} />
              微信/电话：18668039627
            </GlowButton>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}

export default App;
