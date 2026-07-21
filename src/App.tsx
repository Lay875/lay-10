import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BrainCircuit,
  Boxes,
  Building2,
  Check,
  Download,
  Layers3,
  Mail,
  MessageCircle,
  PenTool,
  Play,
  Phone,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import BorderGlow from './BorderGlow';
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
  detailImage: string;
};

type MarqueeMedia = {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  title?: string;
  detailImage?: string;
  detailVideo?: string;
};

type ActiveMedia = {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  title?: string;
};

const navItems = [
  ['经历', '#about'],
  ['能力', '#services'],
  ['项目', '#projects'],
  ['联系', '#contact'],
];

const marqueeMedia: MarqueeMedia[] = [
  { type: 'image', src: '/assets/db-scroll-1.jpg', title: '当贝智能耳机视觉', detailImage: '/assets/db-detail-1.jpg' },
  { type: 'video', src: '/assets/video-july15.mp4', poster: '/assets/poster-july15.webp', title: '当贝投影AI视频TVC' },
  { type: 'image', src: '/assets/db-scroll-2.jpg', title: '当贝投影产品视觉', detailImage: '/assets/db-detail-2.jpg' },
  { type: 'video', src: '/assets/video-haqu-headphones-1.mp4', poster: '/assets/poster-haqu-headphones-1.webp', title: '耳机AI视频作品' },
  { type: 'image', src: '/assets/db-scroll-3.jpg', title: '当贝投影产品视觉', detailImage: '/assets/db-detail-3.jpg' },
  { type: 'image', src: '/assets/db-scroll-4.jpg', title: '当贝投影产品视觉', detailImage: '/assets/db-detail-4.jpg' },
  { type: 'image', src: '/assets/db-scroll-5.jpg', title: '哈趣耳机产品视觉' },
  { type: 'image', src: '/assets/db-scroll-6.jpg', title: '生活场景产品视觉' },
  { type: 'video', src: '/assets/video-haqu-headphones-2.mp4', poster: '/assets/poster-haqu-headphones-2.webp', title: '耳机AI视频作品2' },
  { type: 'image', src: '/assets/db-scroll-7.jpg', title: '天猫双11官方猫头海报', detailVideo: '/assets/db-detail-7.mp4' },
  { type: 'image', src: '/assets/db-scroll-8.jpg', title: '户外投影视觉' },
  { type: 'image', src: '/assets/db-scroll-9.jpg', title: '光影产品视觉' },
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

const experienceCards = [
  ['3C数码', '设计经理', '杭州当贝网络科技有限公司'],
  ['美妆护肤', '设计主管', '杭州珀莱雅化妆品有限公司'],
  ['服饰鞋帽', '视觉设计师', '杭州舒朗服饰有限公司'],
  ['AI设计', '创新与创新', 'AI驱动化设计/AI工作流/自动化'],
];

const portfolioUrl = 'https://pan.baidu.com/s/1j550xHGtGQb2KTRNA3H7JA';

const projects: Project[] = [
  {
    number: '01',
    title: 'Dangbei Campaign System',
    category: '电商营销 / 品牌KV',
    description: '围绕大促活动建立强记忆点主视觉，并将产品、利益点和活动节奏延展到多端页面与投放物料。',
    images: ['/assets/project-card-1-1.jpg', '/assets/project-card-1-2.jpg', '/assets/project-card-1-3.jpg'],
    detailImage: '/assets/project-detail-01.jpg',
  },
  {
    number: '02',
    title: 'Product Visual Collection',
    category: '品牌海报 / 页面视觉',
    description: '通过材质、光感和信息层级呈现产品卖点，让单张海报和长页面都具备审美张力与销售效率。',
    images: ['/assets/project-card-3-1.jpg', '/assets/project-card-3-2.jpg', '/assets/project-card-3-3.jpg'],
    detailImage: '/assets/project-detail-02.jpg',
  },
  {
    number: '03',
    title: 'Aerospace IP Collaboration',
    category: 'IP定制 / 产品物料',
    description: '以航天叙事和产品包装为核心，构建带有科技想象力的跨界视觉资产，兼顾展示感与传播识别。',
    images: ['/assets/project-card-2-1.jpg', '/assets/project-card-2-2.jpg', '/assets/project-card-2-3.jpg'],
    detailImage: '/assets/project-detail-03.jpg',
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

function GlowButton({ href = '#contact', children, external = false }: { href?: string; children: ReactNode; external?: boolean }) {
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="glow-button group">
      <span className="glow-button__shine" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </a>
  );
}

function ActionButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="glow-button group">
      <span className="glow-button__shine" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
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
      <div className="hero-character__glow" />
      <div className="hero-character__contour">
        <img className="hero-character__edge hero-character__edge--wide" src="/assets/hero-character.webp" alt="" draggable={false} />
        <img className="hero-character__edge hero-character__edge--fine" src="/assets/hero-character.webp" alt="" draggable={false} />
        <img className="hero-character__edge hero-character__edge--scan hero-character__edge--scan-a" src="/assets/hero-character.webp" alt="" draggable={false} />
        <img className="hero-character__edge hero-character__edge--scan hero-character__edge--scan-b" src="/assets/hero-character.webp" alt="" draggable={false} />
        <img
          className="hero-character-bg"
          src="/assets/hero-character.webp"
          alt="袁磊个人形象"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}

function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText('18668039627');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = 'tel:18668039627';
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="contact-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <BorderGlow
              className="contact-card"
              borderRadius={30}
              glowColor="84 100 70"
              glowIntensity={0.9}
              fillOpacity={0.28}
              colors={['#b8ff4d', '#ffffff', '#38bdf8']}
            >
              <button type="button" className="contact-card__close" onClick={onClose} aria-label="关闭联系弹窗">
                <X size={22} />
              </button>
              <img className="contact-card__avatar" src="/assets/hero-character.webp" alt="袁磊" draggable={false} />
              <h3>袁磊</h3>
              <p>杭州</p>
              <div className="contact-card__company">
                <Building2 size={19} />
                <div>
                  <span>当贝网络科技有限公司</span>
                  <strong>视觉设计经理</strong>
                </div>
              </div>
              <a href="mailto:875204105@qq.com" className="contact-card__row">
                <Mail size={18} />
                <span>邮箱：875204105@qq.com</span>
              </a>
              <button type="button" className="contact-card__row" onClick={copyPhone}>
                {copied ? <Check size={18} /> : <Phone size={18} />}
                <span>微信/手机：18668039627</span>
                <em>{copied ? '已复制' : '点击复制'}</em>
              </button>
              <a href={portfolioUrl} target="_blank" rel="noreferrer" className="contact-card__row">
                <Download size={18} />
                <span>查看/下载完整作品集</span>
              </a>
            </BorderGlow>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MediaModal({ media, onClose }: { media: ActiveMedia | null; onClose: () => void }) {
  useEffect(() => {
    if (!media) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [media, onClose]);

  return (
    <AnimatePresence>
      {media && (
        <motion.div
          className="video-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="video-modal__panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="video-modal__close" onClick={onClose} aria-label="关闭视频">
              <X size={22} />
            </button>
            {media.type === 'video' ? (
              <video
                key={media.src}
                src={media.src}
                poster={media.poster}
                className="video-modal__player"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <div className="video-modal__image-scroll">
                <img src={media.src} alt={media.title ?? '项目详情'} />
              </div>
            )}
            {media.title && <p className="video-modal__title">{media.title}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const [activeMedia, setActiveMedia] = useState<ActiveMedia | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rowOne = useTransform(scrollYProgress, [0, 1], ['-22%', '4%']);
  const rowTwo = useTransform(scrollYProgress, [0, 1], ['2%', '-24%']);

  return (
    <section ref={ref} className="marquee-clip relative bg-[#050505] py-24 sm:py-32 lg:py-40">
      <MediaModal media={activeMedia} onClose={() => setActiveMedia(null)} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b8ff4d]/45 to-transparent" />
      <MarqueeRow items={marqueeMedia.slice(0, 6)} x={rowOne} onMediaClick={setActiveMedia} />
      <MarqueeRow items={marqueeMedia.slice(6)} x={rowTwo} onMediaClick={setActiveMedia} reverse />
    </section>
  );
}

function MarqueeRow({
  items,
  x,
  reverse = false,
  onMediaClick,
}: {
  items: MarqueeMedia[];
  x: MotionValue<string>;
  reverse?: boolean;
  onMediaClick: (item: ActiveMedia) => void;
}) {
  const repeated = [...items, ...items, ...items];
  const openMedia = (item: MarqueeMedia) => {
    if (item.type === 'video') {
      onMediaClick({ type: 'video', src: item.src, poster: item.poster, title: item.title });
      return;
    }
    if (item.detailVideo) {
      onMediaClick({ type: 'video', src: item.detailVideo, poster: item.src, title: item.title });
      return;
    }
    if (item.detailImage) {
      onMediaClick({ type: 'image', src: item.detailImage, title: item.title });
    }
  };

  return (
    <motion.div
      style={{ x, willChange: 'transform' }}
      className={`mb-3 flex w-max gap-3 ${reverse ? 'pl-[18vw]' : ''}`}
    >
      {repeated.map((item, index) => (
        item.type === 'video' ? (
          <button
            key={`${item.src}-${index}`}
            type="button"
            className="marquee-video image-edge group h-[220px] w-[340px] rounded-[26px] sm:h-[270px] sm:w-[420px]"
            onClick={() => openMedia(item)}
            aria-label={`播放${item.title ?? '视频作品'}`}
          >
            <video
              src={item.src}
              poster={item.poster}
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
            <span className="marquee-video__overlay" />
            <span className="marquee-video__play">
              <Play size={24} fill="currentColor" />
            </span>
            <span className="marquee-video__label">{item.title ?? 'Video Work'}</span>
          </button>
        ) : item.detailImage || item.detailVideo ? (
          <button
            key={`${item.src}-${index}`}
            type="button"
            className={`marquee-detail image-edge group h-[220px] w-[340px] rounded-[26px] sm:h-[270px] sm:w-[420px] ${item.detailVideo ? 'marquee-detail--video' : ''}`}
            onClick={() => openMedia(item)}
            aria-label={`查看${item.title ?? '项目详情'}`}
          >
            <img src={item.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            <span className="marquee-video__overlay" />
            {item.detailVideo && (
              <span className="marquee-video__play">
                <Play size={24} fill="currentColor" />
              </span>
            )}
            <span className="marquee-video__label">{item.title ?? 'View Detail'}</span>
          </button>
        ) : (
          <img
            key={`${item.src}-${index}`}
            src={item.src}
            alt=""
            loading="lazy"
            className="image-edge h-[220px] w-[340px] rounded-[26px] object-cover sm:h-[270px] sm:w-[420px]"
          />
        )
      ))}
    </motion.div>
  );
}

function ProjectCard({
  project,
  index,
  total,
  onProjectOpen,
}: {
  project: Project;
  index: number;
  total: number;
  onProjectOpen: (project: Project) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <section ref={ref} className="project-stack-section h-[82vh] min-h-[700px]">
      <motion.article
        style={{ scale, top: `calc(6rem + ${index * 28}px)` }}
        className="project-card sticky overflow-hidden rounded-[36px] border border-white/14 bg-[#101112]/94 p-4 shadow-[0_34px_140px_rgba(0,0,0,0.58)] backdrop-blur sm:rounded-[46px] sm:p-6 lg:p-8"
      >
        <div className="project-card__head mb-5 grid items-end gap-4 lg:grid-cols-[0.34fr_1fr_auto]">
          <span className="project-card__number font-display text-7xl font-black leading-none text-[#b8ff4d] sm:text-8xl lg:text-9xl">
            {project.number}
          </span>
          <div>
            <p className="mb-2 text-sm text-white/48">{project.category}</p>
            <h3 className="project-title-heading font-display text-[38px] font-black uppercase leading-none text-white sm:text-[42px] lg:text-6xl">
              {project.title}
            </h3>
          </div>
          <button type="button" className="project-card__button glow-button group" onClick={() => onProjectOpen(project)}>
            <span className="glow-button__shine" />
            <span className="relative z-10 inline-flex items-center gap-2">
            查看项目
            <ArrowUpRight size={16} />
            </span>
          </button>
        </div>

        <div className="project-card__media grid gap-4 lg:grid-cols-[0.42fr_0.58fr]">
          <div className="grid gap-4">
            <img src={project.images[0]} alt={project.title} className="project-card__image project-card__image--short h-[180px] w-full rounded-[26px] object-cover sm:h-[230px] lg:rounded-[34px]" />
            <div className="relative overflow-hidden rounded-[26px] lg:rounded-[34px]">
              <img src={project.images[1]} alt={project.title} className="project-card__image project-card__image--mid h-[240px] w-full object-cover sm:h-[330px]" />
            </div>
          </div>
          <img src={project.images[2]} alt={project.title} className="project-card__image project-card__image--tall h-[438px] w-full rounded-[26px] object-cover sm:h-[577px] lg:rounded-[34px]" />
        </div>
      </motion.article>
    </section>
  );
}

function App() {
  const navFloating = useSecondScreenNav();
  const [contactOpen, setContactOpen] = useState(false);
  const [projectMedia, setProjectMedia] = useState<ActiveMedia | null>(null);
  const openContact = () => setContactOpen(true);
  const closeContact = () => setContactOpen(false);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#050505] font-body text-white">
      <ContactModal open={contactOpen} onClose={closeContact} />
      <MediaModal media={projectMedia} onClose={() => setProjectMedia(null)} />
      <section id="top" className="relative flex min-h-screen flex-col overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 z-0 opacity-70">
          <LiquidEther
            colors={['#1a1d1a', '#343a34', '#b8ff4d']}
            mouseForce={20}
            cursorSize={75}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={1.6}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
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
          <ActionButton onClick={openContact}>
            <Mail size={16} />
            联系我
          </ActionButton>
        </motion.nav>

        <div className="relative z-10 mx-auto flex w-[min(calc(100%_-_48px),1700px)] flex-1 flex-col justify-between pb-8 pt-28 sm:pb-10 lg:pt-32">
          <FadeIn delay={0.1} y={40} className="overflow-hidden text-center">
            <p className="mb-2 text-xs font-bold uppercase text-[#b8ff4d] sm:text-sm">
              Visual Designer / AI Designer / Brand Designer
            </p>
            <h1 className="hero-name-heading display-title whitespace-nowrap font-display text-[34px] font-black uppercase leading-none sm:text-[14vw] xl:text-[13vw]">
              Hi, I'm YuanLei_
            </h1>
          </FadeIn>

          <HeroCharacter />

          <div className="relative z-20 flex justify-center">
            <FadeIn delay={0.38} y={22} className="flex justify-center">
              <div className="hero-tags flex flex-wrap justify-center gap-2 text-xs text-white/72">
                {['品牌设计', '电商视觉', 'AI辅助创意', '运营设计'].map((item) => (
                  <span key={item} className="hero-tag">
                    <Sparkles size={15} />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <MarqueeSection />

      <section id="about" className="relative grid min-h-screen place-items-center overflow-hidden bg-[#050505] px-6 py-24 sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_22%,rgba(255,255,255,0.055),transparent_28rem),radial-gradient(circle_at_88%_74%,rgba(184,255,77,0.085),transparent_26rem)]" />
        <img src="/assets/about-left-111.jpg" alt="" className="absolute left-[4%] top-[8%] hidden h-[220px] w-[170px] rotate-[-10deg] rounded-[28px] object-cover object-center opacity-70 md:block" />
        <img src="/assets/about-right-222.jpg" alt="" className="absolute bottom-[8%] right-[6%] hidden h-[240px] w-[190px] rotate-[9deg] rounded-[28px] object-cover object-center opacity-80 md:block" />
        <div className="relative mx-auto grid max-w-4xl justify-items-center text-center">
          <FadeIn>
            <h2 className="section-heading-muted display-title font-display text-7xl font-black uppercase leading-none sm:text-8xl lg:text-9xl">About Me</h2>
          </FadeIn>
          <FadeIn delay={0.18}>
            <p className="about-copy mt-12 max-w-5xl text-center text-xl font-normal leading-10 text-white/78 sm:text-2xl">
              <span>我是袁磊，拥有8年以上品牌视觉设计及管理经验，</span>
              <span>深耕品牌设计、电商营销设计、AI设计、IP定制物料设计等领域，</span>
              <span>拥有数码3C、美妆护肤、服饰、家居等类目设计经验；</span>
              <span>对于视觉设计有极高的要求，不仅关注美感，更加注重信息是否被看见、被理解、被转化。</span>
              <span>期待与你共创精彩项目！</span>
            </p>
          </FadeIn>
          <FadeIn delay={0.32} className="mt-14">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {experienceCards.map(([category, role, company]) => (
                <div key={category} className="experience-card glass-line rounded-[22px] px-6 py-5 text-left">
                  <strong>{category}</strong>
                  <span>{role}</span>
                  <em>{company}</em>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="services" className="relative rounded-t-[46px] bg-[#f7f7f7] px-6 py-24 text-[#050505] sm:px-10 lg:py-32">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/16 to-transparent" />
        <div className="mx-auto max-w-page">
          <FadeIn>
            <h2 className="section-heading-muted display-title text-center font-display text-7xl font-black uppercase leading-none sm:text-8xl lg:text-9xl">Capabilities</h2>
          </FadeIn>
          <div className="mx-auto mt-16 grid max-w-7xl gap-4 lg:mt-24">
            {services.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.08}>
                <article className="service-card group grid gap-6 p-7 sm:grid-cols-[0.18fr_1fr] lg:p-9">
                  <span className="font-display text-6xl font-black leading-none text-[#050505] sm:text-7xl">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-black/12 bg-black/[0.035] text-[#050505] transition group-hover:scale-110">{item.icon}</div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold uppercase sm:text-4xl">{item.title}</h3>
                      <p className="mt-3 max-w-3xl text-base font-light leading-8 text-[#707070] sm:text-lg">{item.text}</p>
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
              <h2 className="section-heading-muted display-title font-display text-7xl font-black uppercase leading-none sm:text-8xl lg:text-9xl">Projects</h2>
              <p className="max-w-xl text-lg leading-8 text-white/62">
                视觉设计经理 | 袁磊 YUAN LEI
              </p>
            </div>
          </FadeIn>
          <div>
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                total={projects.length}
                onProjectOpen={(item) =>
                  setProjectMedia({ type: 'image', src: item.detailImage, title: item.title })
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative z-20 grid min-h-screen place-items-center bg-[radial-gradient(circle_at_18%_40%,rgba(184,255,77,0.12),transparent_28rem),radial-gradient(circle_at_85%_18%,rgba(255,255,255,0.06),transparent_28rem),#050505] px-6 py-24 sm:px-10">
        <div className="mx-auto grid w-full max-w-page items-end gap-12 lg:grid-cols-[1fr_auto]">
          <FadeIn>
            <p className="mb-6 text-xs font-bold uppercase text-[#b8ff4d]">Contact</p>
            <h2 className="section-heading-muted contact-heading max-w-5xl font-display text-7xl font-black uppercase leading-none sm:text-8xl lg:text-9xl">
              期待与您合作！
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70">
              欢迎联系查看完整作品集，讨论品牌视觉、AI设计工作流或项目合作。
            </p>
          </FadeIn>
          <FadeIn delay={0.18} className="contact-actions grid gap-3">
            <GlowButton href="mailto:875204105@qq.com">
              <Mail size={19} />
              875204105@qq.com
            </GlowButton>
            <GlowButton href={portfolioUrl} external>
              <Download size={19} />
              查看/下载完整作品集
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

