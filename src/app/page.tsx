"use client";

import { useState, useRef, createContext, useContext } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Users, Globe, TrendingUp, Shield, Award, CheckCircle, ArrowRight,
  Menu, X, Star, Clock, Target, BarChart3, Phone, Mail, MapPin,
  ChevronRight, Building2, UtensilsCrossed, Heart, ShoppingBag,
  Briefcase, Plane, Quote, Zap, Languages, GraduationCap, Bookmark,
  Calendar, Send,
} from "lucide-react";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const TEAL       = "#1A9CB0";
const TEAL_DARK  = "#147A8A";
const TEAL_LIGHT = "#E8F7FA";
const TEAL_TEXT  = "#0E7A8A";   // darker teal — passes WCAG AA on light bg
const IVORY      = "#FAFAF7";
const GOLD       = "#C9963A";
const GOLD_LIGHT = "#FDF3E3";
const CHARCOAL   = "#2D3748";
const DARK_HEADING = "#1A202C"; // headings on light bg
const BODY_TEXT  = "#4A5568";   // body copy on white cards
const GRAY       = "#6B7280";   // muted text — passes WCAG AA on white
const BORDER     = "#E2E8F0";
const WHITE      = "#FFFFFF";
const WA_GREEN   = "#25D366";
const IG_PINK    = "#E1306C";

// ─── Types ────────────────────────────────────────────────────────────────────
type Lang = "EN" | "FR" | "AR";
type JobSector = "All" | "Hotels" | "Restaurants" | "Healthcare" | "Retail" | "Corporate";

interface Job {
  id: number; title: string; company: string; location: string; flag: string;
  salary: string; sector: Exclude<JobSector, "All">; requirements: string[]; posted: string;
}

interface ServiceItem { title: string; desc: string; tag: string | null; }
interface StepItem    { title: string; desc: string; }
interface IndItem     { name: string; desc: string; }
interface WhyItem     { title: string; desc: string; }
interface CertTier    { tier: string; level: string; }

interface Translations {
  nav: { links: string[]; cta: string; };
  hero: { badge: string; h1: string; sub: string; cta1: string; cta2: string; };
  stats: string[];
  mission: { eyebrow: string; paragraph: string; stats: string[]; };
  services: { tag: string; title: string; subtitle: string; learnMore: string; items: ServiceItem[]; };
  howItWorks: { tag: string; title: string; subtitle: string; steps: StepItem[]; };
  industries: { tag: string; title: string; subtitle: string; items: IndItem[]; };
  why: { tag: string; title: string; subtitle: string; credential: string; credentialSub: string; items: WhyItem[]; };
  testimonials: { tag: string; title: string; subtitle: string; };
  jobs: {
    tag: string; bannerTitle: string; bannerSub: string; bannerBadge: string;
    allJobs: string; shortlist: string; shortlisted: string; rolesaved: string; rolesavedPlural: string;
    saved: string; save: string; apply: string; posted: string;
    noShortlist: string; noShortlistSub: string; applyAll: string;
    postTitle: string; postSub: string; postCta: string; contactBtn: string;
  };
  cert: { tag: string; title: string; subtitle: string; enrol: string; tiers: CertTier[]; mostPopular: string; };
  cta: { tag: string; title: string; sub: string; cta1: string; cta2: string; };
  footer: {
    tagline: string; services: string; serviceLinks: string[];
    company: string; companyLinks: string[]; contact: string;
    rights: string; privacy: string; terms: string; cookies: string;
  };
  modal: {
    title: string; roleLabel: string; interestLabel: string;
    messageLabel: string; messagePlaceholder: string; submit: string;
    nameLabel: string; emailLabel: string; phoneLabel: string;
    roles: string[]; interests: string[];
  };
}

// ─── Translations ─────────────────────────────────────────────────────────────
const TR: Record<Lang, Translations> = {
  EN: {
    nav: { links: ["Services", "Programs", "Industries", "Careers", "About", "Contact"], cta: "Book a Consultation" },
    hero: {
      badge: "The #1 Hospitality & Service Training Company in Algeria & the GCC",
      h1: "Your Team Is Your Brand. We Make It Exceptional.",
      sub: "Addiafah delivers certified training in customer service, hospitality, and service quality auditing — empowering teams across Algeria and the GCC to perform at the highest level.",
      cta1: "Book a Free Consultation", cta2: "Explore Programs",
    },
    stats: ["Staff Trained", "GCC Countries", "Client Retention", "Years Experience"],
    mission: {
      eyebrow: "Our Mission",
      paragraph: "At Addiafah — which means hospitality in Arabic — we believe that exceptional service is not a luxury, it's a standard. We exist to help businesses across Algeria and the Gulf transform their teams into their most powerful competitive asset. Through certified training, on-the-ground auditing and qualified staff deployment, we make excellence repeatable, measurable and lasting.",
      stats: ["500+ Professionals Trained", "4 GCC Countries", "98% Client Retention"],
    },
    services: {
      tag: "What We Do Best", title: "What We Do Best",
      subtitle: "Four pillars of excellence built to transform your team and your results.",
      learnMore: "Learn More",
      items: [
        { title: "Customer Service Training", desc: "We don't teach scripts — we build service cultures. Your frontline team will handle every interaction with confidence, empathy and measurable impact.", tag: null },
        { title: "Hospitality Training", desc: "From front desk to fine dining — we train your teams to deliver five-star experiences that guests remember and return for.", tag: null },
        { title: "Staff Outsourcing", desc: "Access a ready pool of Addiafah-certified hospitality professionals. Trained, vetted and deployable across Algeria and the Gulf.", tag: null },
        { title: "Service Quality Auditing", desc: "We go undercover. Mystery shopping, floor observation and customer journey mapping — delivered as a clear report with scores, gaps and a prioritized action plan.", tag: "Hotels · Clinics · Retail · Restaurants — Mystery Shopping & Gap Analysis" },
      ],
    },
    howItWorks: {
      tag: "The Process", title: "How It Works",
      subtitle: "A proven four-step framework that delivers measurable transformation every single time.",
      steps: [
        { title: "Needs Assessment", desc: "Deep-dive analysis of your team's current performance, identifying skill gaps and growth opportunities." },
        { title: "Custom Program Design", desc: "Our experts craft a bespoke training program aligned with your industry, culture, and business objectives." },
        { title: "Immersive Training", desc: "Hands-on engaging sessions by certified trainers — delivered on-site or remotely across the region." },
        { title: "Measure & Optimise", desc: "Track ROI with our performance dashboard. We refine continuously until you see measurable results." },
      ],
    },
    industries: {
      tag: "Industries We Serve", title: "Built for Excellence Sectors",
      subtitle: "Specialised expertise across every industry where exceptional service makes the difference.",
      items: [
        { name: "Luxury Hotels", desc: "5-star & boutique properties" },
        { name: "Fine Dining", desc: "Upscale restaurants & catering" },
        { name: "Healthcare", desc: "Clinics & private hospitals" },
        { name: "Premium Retail", desc: "Luxury & lifestyle brands" },
        { name: "Corporate", desc: "Enterprises & multinationals" },
        { name: "Travel & Aviation", desc: "Airlines, agencies & tourism" },
      ],
    },
    why: {
      tag: "Why Choose Us", title: "The Addiafah Difference",
      subtitle: "What sets us apart in a region where service excellence is the ultimate competitive advantage.",
      credential: "GCC-Accredited Training",
      credentialSub: "Recognised across Algeria, UAE, KSA, Qatar & Kuwait",
      items: [
        { title: "Arabic, French & English", desc: "Every program delivered in the client's language. No friction, full impact." },
        { title: "Born in Algeria, Built for the Gulf", desc: "We understand both markets deeply — the culture, the expectations, the standards." },
        { title: "Guaranteed Results", desc: "We set measurable targets before we start. If the numbers don't move, we come back at no charge." },
        { title: "On-site or Remote", desc: "We come to your team — across Algeria, Saudi Arabia, UAE, Qatar and Kuwait." },
      ],
    },
    testimonials: { tag: "Client Success", title: "What Our Clients Say", subtitle: "Trusted by leading organisations across Algeria and the GCC." },
    jobs: {
      tag: "Career Opportunities", bannerTitle: "Find Your Next Role in Hospitality & Service Excellence",
      bannerSub: "Join the hospitality and service excellence sector across Algeria and the GCC.",
      bannerBadge: "Career Opportunities / فرص العمل / Opportunités de Carrière",
      allJobs: "All Jobs", shortlist: "Shortlist", shortlisted: "Shortlisted Jobs",
      rolesaved: "role", rolesavedPlural: "roles", saved: "★ Saved", save: "☆ Shortlist",
      apply: "Apply Now →", posted: "Posted", noShortlist: "No jobs shortlisted yet",
      noShortlistSub: "Click ☆ on any job card to save it", applyAll: "Apply to All",
      postTitle: "Are you an employer?",
      postSub: "Post your opening and reach 500+ certified candidates across Algeria and the GCC.",
      postCta: "Post a Job Opening", contactBtn: "Contact",
    },
    cert: {
      tag: "Certification Tracks", title: "Get Certified",
      subtitle: "Three progressive tiers designed for every stage of your professional journey.",
      enrol: "Enrol Now",
      tiers: [{ tier: "Foundation", level: "Entry Level" }, { tier: "Professional", level: "Mid Level" }, { tier: "Expert", level: "Senior Level" }],
      mostPopular: "Most Popular",
    },
    cta: {
      tag: "Ready to Transform?", title: "Ready to raise the bar?",
      sub: "Let's talk about your team and build a program that delivers.",
      cta1: "Book a Free Consultation", cta2: "Call Us Today",
    },
    footer: {
      tagline: "Excellence is not a moment. It's a standard.",
      services: "Services", serviceLinks: ["Customer Service Training", "Hospitality Training", "Staff Outsourcing", "Service Quality Auditing", "Executive Coaching"],
      company: "Company", companyLinks: ["About Us", "Our Team", "Certifications", "Case Studies", "Careers", "Blog"],
      contact: "Contact", rights: "© 2024 Addiafah. All rights reserved.",
      privacy: "Privacy Policy", terms: "Terms of Service", cookies: "Cookie Policy",
    },
    modal: {
      title: "Get in Touch", nameLabel: "Full Name", emailLabel: "Email", phoneLabel: "Phone",
      roleLabel: "I am a...", interestLabel: "I'm interested in...",
      messageLabel: "Message (optional)", messagePlaceholder: "Tell us more about your needs...",
      submit: "Send Message",
      roles: ["Business Owner", "HR Manager", "Hotel Manager", "Restaurant Owner", "Clinic Manager", "Job Seeker", "Other"],
      interests: ["Customer Service Training", "Hospitality Training", "Staff Outsourcing", "Service Quality Auditing", "Career Opportunity", "General Inquiry"],
    },
  },

  FR: {
    nav: { links: ["Services", "Programmes", "Industries", "Carrières", "À propos", "Contact"], cta: "Commencer" },
    hero: {
      badge: "N°1 de la Formation Hôtelière & Service Client — Algérie et Golfe",
      h1: "Votre équipe est votre marque. Nous la rendons exceptionnelle.",
      sub: "Addiafah propose des formations certifiées en service client, hôtellerie et audit qualité — pour des équipes performantes en Algérie et dans les pays du Golfe.",
      cta1: "Réserver une Consultation Gratuite", cta2: "Explorer les Programmes",
    },
    stats: ["Personnels Formés", "Pays du CCG", "Fidélisation Client", "Ans d'Expérience"],
    mission: {
      eyebrow: "Notre Mission",
      paragraph: "Addiafah — qui signifie l'hospitalité en arabe — est née d'une conviction simple : le service d'exception n'est pas un luxe, c'est un standard. Nous accompagnons les entreprises en Algérie et dans le Golfe pour transformer leurs équipes en leur atout concurrentiel le plus puissant. Grâce à des formations certifiées, des audits terrain et un déploiement de personnel qualifié, nous rendons l'excellence répétable, mesurable et durable.",
      stats: ["+500 Professionnels Formés", "4 Pays du Golfe", "98% de Fidélisation"],
    },
    services: {
      tag: "Nos Expertises", title: "Nos Expertises",
      subtitle: "Quatre piliers d'excellence pour transformer vos équipes et vos résultats.",
      learnMore: "En Savoir Plus",
      items: [
        { title: "Formation au Service Client", desc: "Nous ne formons pas des scripts — nous construisons des cultures de service. Vos équipes terrain gèreront chaque interaction avec assurance, empathie et impact mesurable.", tag: null },
        { title: "Formation Hôtelière", desc: "De la réception à la restauration gastronomique — nous formons vos équipes à offrir des expériences cinq étoiles que les clients mémorisent et redemandent.", tag: null },
        { title: "Externalisation du Personnel", desc: "Accédez à un vivier de professionnels certifiés Addiafah, prêts à être déployés en Algérie ou dans le Golfe.", tag: null },
        { title: "Audit Qualité du Service", desc: "Nous passons en mode client mystère. Observation terrain, cartographie du parcours client — livrés sous forme d'un rapport clair avec scores, lacunes et plan d'action priorisé.", tag: "Hôtels · Cliniques · Retail · Restauration — Visite Mystère & Analyse des Écarts" },
      ],
    },
    howItWorks: {
      tag: "Notre Processus", title: "Comment Ça Marche",
      subtitle: "Un cadre éprouvé en quatre étapes qui garantit une transformation mesurable à chaque fois.",
      steps: [
        { title: "Évaluation des Besoins", desc: "Analyse approfondie des performances actuelles de votre équipe, identification des lacunes et opportunités de croissance." },
        { title: "Conception du Programme", desc: "Nos experts conçoivent un programme sur mesure aligné sur votre secteur, votre culture et vos objectifs." },
        { title: "Formation Immersive", desc: "Sessions engageantes animées par des formateurs certifiés — en présentiel ou à distance dans toute la région." },
        { title: "Mesure & Optimisation", desc: "Suivez le ROI avec notre tableau de bord. Nous affinons continuellement jusqu'à obtenir des résultats mesurables." },
      ],
    },
    industries: {
      tag: "Secteurs Couverts", title: "Secteurs d'Excellence",
      subtitle: "Une expertise spécialisée dans chaque secteur où l'excellence du service fait la différence.",
      items: [
        { name: "Hôtels de Luxe", desc: "Propriétés 5 étoiles & boutique" },
        { name: "Gastronomie", desc: "Restaurants & traiteurs haut de gamme" },
        { name: "Santé", desc: "Cliniques & hôpitaux privés" },
        { name: "Commerce Premium", desc: "Marques de luxe & lifestyle" },
        { name: "Entreprises", desc: "Grandes entreprises & multinationales" },
        { name: "Voyage & Aviation", desc: "Compagnies aériennes & tourisme" },
      ],
    },
    why: {
      tag: "Pourquoi Nous Choisir", title: "La Différence Addiafah",
      subtitle: "Ce qui nous distingue dans une région où l'excellence du service est l'avantage concurrentiel ultime.",
      credential: "Formation Accréditée CCG",
      credentialSub: "Reconnue en Algérie, EAU, KSA, Qatar & Koweït",
      items: [
        { title: "Arabe, Français & Anglais", desc: "Chaque programme est dispensé dans la langue du client. Zéro friction, impact total." },
        { title: "Née en Algérie, pensée pour le Golfe", desc: "Nous maîtrisons les deux marchés — la culture, les attentes, les standards." },
        { title: "Résultats Garantis", desc: "Nous fixons des objectifs mesurables avant de commencer. Si les chiffres ne bougent pas, nous revenons sans frais." },
        { title: "Présentiel ou Distanciel", desc: "Nous venons à votre équipe — en Algérie, en Arabie Saoudite, aux EAU, au Qatar et au Koweït." },
      ],
    },
    testimonials: { tag: "Succès Clients", title: "Ce Que Disent Nos Clients", subtitle: "La confiance des grandes organisations d'Algérie et du CCG." },
    jobs: {
      tag: "Opportunités de Carrière", bannerTitle: "Trouvez Votre Prochain Poste en Hôtellerie & Excellence du Service",
      bannerSub: "Rejoignez le secteur de l'hôtellerie et de l'excellence en Algérie et dans le Golfe.",
      bannerBadge: "Career Opportunities / فرص العمل / Opportunités de Carrière",
      allJobs: "Tous les Postes", shortlist: "Liste Courte", shortlisted: "Postes Sélectionnés",
      rolesaved: "poste", rolesavedPlural: "postes", saved: "★ Sauvegardé", save: "☆ Sélectionner",
      apply: "Postuler →", posted: "Publié", noShortlist: "Aucun poste sélectionné",
      noShortlistSub: "Cliquez ☆ sur une offre pour la sauvegarder", applyAll: "Postuler à Tout",
      postTitle: "Vous êtes employeur ?",
      postSub: "Publiez votre offre et atteignez plus de 500 candidats certifiés en Algérie et dans le CCG.",
      postCta: "Publier une Offre d'Emploi", contactBtn: "Contacter",
    },
    cert: {
      tag: "Parcours de Certification", title: "Obtenez Votre Certification",
      subtitle: "Trois niveaux progressifs conçus pour chaque étape de votre parcours professionnel.",
      enrol: "S'inscrire",
      tiers: [{ tier: "Fondation", level: "Niveau Débutant" }, { tier: "Professionnel", level: "Niveau Intermédiaire" }, { tier: "Expert", level: "Niveau Senior" }],
      mostPopular: "Le Plus Populaire",
    },
    cta: {
      tag: "Prêt à Transformer ?", title: "Prêt à élever votre niveau ?",
      sub: "Parlons de votre équipe et construisons un programme qui délivre.",
      cta1: "Réserver une Consultation Gratuite", cta2: "Nous Appeler",
    },
    footer: {
      tagline: "L'excellence n'est pas un instant. C'est un standard.",
      services: "Services", serviceLinks: ["Formation Service Client", "Formation Hôtelière", "Externalisation Personnel", "Audit Qualité du Service", "Coaching Dirigeants"],
      company: "Entreprise", companyLinks: ["À propos", "Notre Équipe", "Certifications", "Études de Cas", "Carrières", "Blog"],
      contact: "Contact", rights: "© 2024 Addiafah. Tous droits réservés.",
      privacy: "Politique de Confidentialité", terms: "Conditions d'Utilisation", cookies: "Politique des Cookies",
    },
    modal: {
      title: "Nous Contacter", nameLabel: "Nom Complet", emailLabel: "Courriel", phoneLabel: "Téléphone",
      roleLabel: "Je suis...", interestLabel: "Je suis intéressé par...",
      messageLabel: "Message (facultatif)", messagePlaceholder: "Dites-nous en plus sur vos besoins...",
      submit: "Envoyer",
      roles: ["Dirigeant d'entreprise", "Responsable RH", "Directeur d'hôtel", "Propriétaire de restaurant", "Directeur de clinique", "Chercheur d'emploi", "Autre"],
      interests: ["Formation au Service Client", "Formation Hôtelière", "Externalisation du Personnel", "Audit Qualité", "Opportunité de Carrière", "Renseignements Généraux"],
    },
  },

  AR: {
    nav: { links: ["الخدمات", "البرامج", "القطاعات", "الوظائف", "عن الضيافة", "تواصل معنا"], cta: "ابدأ الآن" },
    hero: {
      badge: "الرقم 1 في تدريب الضيافة وخدمة العملاء — الجزائر والخليج العربي",
      h1: "فريقك هو علامتك التجارية. نحن نجعله استثنائياً.",
      sub: "الضيافة تقدّم برامج تدريب معتمدة في خدمة العملاء والضيافة وتدقيق جودة الخدمة — لتأهيل فرق متميزة في الجزائر ودول الخليج.",
      cta1: "احجز استشارة مجانية", cta2: "استكشف البرامج",
    },
    stats: ["موظف مدرَّب", "دول الخليج", "معدل الاحتفاظ بالعملاء", "سنة خبرة"],
    mission: {
      eyebrow: "مهمتنا",
      paragraph: "أسّسنا الضيافة على قناعة راسخة: الخدمة الاستثنائية ليست ترفاً، بل هي معيار. نحن هنا لمساعدة الشركات في الجزائر ودول الخليج على تحويل فرقها إلى أقوى ميزة تنافسية لديها. من خلال التدريب المعتمد والتدقيق الميداني وتوفير الكوادر المؤهلة، نجعل التميز قابلاً للتكرار والقياس والاستدامة.",
      stats: ["+500 محترف مدرَّب", "4 دول خليجية", "98% نسبة الاحتفاظ بالعملاء"],
    },
    services: {
      tag: "ما نتقنه", title: "ما نتقنه",
      subtitle: "أربعة محاور للتميز صُمِّمت لتحويل فريقك ونتائجك.",
      learnMore: "اعرف المزيد",
      items: [
        { title: "تدريب خدمة العملاء", desc: "نحن لا نُدرّب على السكريبت — بل نبني ثقافة خدمة حقيقية. سيتعامل فريقك مع كل تفاعل بثقة وتعاطف وأثر ملموس.", tag: null },
        { title: "تدريب الضيافة الفندقية", desc: "من الاستقبال إلى المطاعم الراقية — نُعِدّ فرقك لتقديم تجارب خمس نجوم يتذكرها الضيف ويعود إليها.", tag: null },
        { title: "الاستعانة بكوادر بشرية", desc: "احصل على محترفين معتمدين من الضيافة، مدرَّبين ومؤهَّلين للانتشار في الجزائر ودول الخليج.", tag: null },
        { title: "تدقيق جودة الخدمة", desc: "نعمل بأسلوب العميل السري. زيارات ميدانية وتقييم تجربة العميل — يُسلَّم في تقرير واضح بالنقاط والثغرات وخطة عمل فورية.", tag: "الفنادق · العيادات · التجزئة · المطاعم — تقييم سري وتحليل الفجوات" },
      ],
    },
    howItWorks: {
      tag: "منهجيتنا", title: "كيف نعمل",
      subtitle: "إطار عمل مُثبَت بأربع خطوات يحقق تحولاً قابلاً للقياس في كل مرة.",
      steps: [
        { title: "تقييم الاحتياجات", desc: "تحليل معمّق لأداء فريقك الحالي وتحديد الثغرات وفرص النمو." },
        { title: "تصميم البرنامج", desc: "يصمم خبراؤنا برنامجاً تدريبياً مخصصاً يتوافق مع قطاعك وثقافتك وأهداف أعمالك." },
        { title: "التدريب التفاعلي", desc: "جلسات تفاعلية يقدمها مدربون معتمدون — حضورياً أو عن بُعد في جميع أنحاء المنطقة." },
        { title: "القياس والتحسين", desc: "تتبّع عائد الاستثمار عبر لوحة الأداء الخاصة بنا. نحسّن باستمرار حتى ترى نتائج ملموسة." },
      ],
    },
    industries: {
      tag: "القطاعات التي نخدمها", title: "قطاعات التميز",
      subtitle: "خبرة متخصصة في كل قطاع تكون فيه جودة الخدمة هي الفارق الحقيقي.",
      items: [
        { name: "الفنادق الفاخرة", desc: "فنادق 5 نجوم وبوتيك" },
        { name: "المطاعم الراقية", desc: "مطاعم وخدمات تموين فاخرة" },
        { name: "الرعاية الصحية", desc: "عيادات ومستشفيات خاصة" },
        { name: "تجارة التجزئة الراقية", desc: "علامات الفخامة والأسلوب الراقي" },
        { name: "الشركات", desc: "مؤسسات وشركات متعددة الجنسيات" },
        { name: "السفر والطيران", desc: "شركات طيران ووكالات سياحية" },
      ],
    },
    why: {
      tag: "لماذا تختارنا", title: "ما يميّز الضيافة",
      subtitle: "ما يميزنا في منطقة تمثّل فيها جودة الخدمة الميزة التنافسية الأهم.",
      credential: "تدريب معتمد خليجياً",
      credentialSub: "معترف به في الجزائر والإمارات والسعودية وقطر والكويت",
      items: [
        { title: "العربية والفرنسية والإنجليزية", desc: "كل برنامج يُقدَّم بلغة العميل. بدون عوائق، تأثير كامل." },
        { title: "جزائرية الأصل، خليجية التطلع", desc: "نفهم السوقين بعمق — الثقافة والتوقعات والمعايير." },
        { title: "نتائج مضمونة", desc: "نضع أهدافاً قابلة للقياس قبل البدء. إن لم تتحرك الأرقام، نعود بدون رسوم." },
        { title: "حضوري أو عن بُعد", desc: "نصل إلى فريقك في الجزائر والسعودية والإمارات وقطر والكويت." },
      ],
    },
    testimonials: { tag: "نجاحات عملائنا", title: "ماذا يقول عملاؤنا", subtitle: "ثقة المؤسسات الرائدة في الجزائر ودول الخليج." },
    jobs: {
      tag: "فرص العمل", bannerTitle: "ابحث عن دورك القادم في الضيافة وتميز الخدمة",
      bannerSub: "انضم إلى قطاع الضيافة والتميز في الخدمة بالجزائر ودول الخليج.",
      bannerBadge: "Career Opportunities / فرص العمل / Opportunités de Carrière",
      allJobs: "جميع الوظائف", shortlist: "القائمة المختصرة", shortlisted: "الوظائف المحفوظة",
      rolesaved: "وظيفة", rolesavedPlural: "وظائف", saved: "★ محفوظة", save: "☆ احفظ",
      apply: "تقدّم الآن ←", posted: "نُشرت", noShortlist: "لا توجد وظائف محفوظة بعد",
      noShortlistSub: "انقر ☆ على أي بطاقة وظيفة لحفظها", applyAll: "التقدم للكل",
      postTitle: "هل أنت صاحب عمل؟",
      postSub: "انشر وظيفتك والوصول إلى أكثر من 500 مرشح معتمد في الجزائر ودول الخليج.",
      postCta: "انشر وظيفة ←", contactBtn: "تواصل",
    },
    cert: {
      tag: "مسارات الشهادات", title: "احصل على شهادتك",
      subtitle: "ثلاثة مستويات تدريجية مصممة لكل مرحلة في مسيرتك المهنية.",
      enrol: "سجّل الآن",
      tiers: [{ tier: "الأساس", level: "المستوى المبتدئ" }, { tier: "المحترف", level: "المستوى المتوسط" }, { tier: "الخبير", level: "المستوى المتقدم" }],
      mostPopular: "الأكثر طلباً",
    },
    cta: {
      tag: "هل أنت مستعد للتحول؟", title: "مستعد لرفع المستوى؟",
      sub: "دعنا نتحدث عن فريقك ونبني برنامجاً يُحدث الفرق.",
      cta1: "احجز استشارة مجانية", cta2: "اتصل بنا اليوم",
    },
    footer: {
      tagline: "التميز ليس لحظة. إنه معيار.",
      services: "الخدمات", serviceLinks: ["تدريب خدمة العملاء", "تدريب الضيافة", "الاستعانة بكوادر بشرية", "تدقيق جودة الخدمة", "تدريب المديرين التنفيذيين"],
      company: "الشركة", companyLinks: ["عن الضيافة", "فريقنا", "الشهادات", "دراسات الحالة", "الوظائف", "المدونة"],
      contact: "تواصل", rights: "© 2024 الضيافة. جميع الحقوق محفوظة.",
      privacy: "سياسة الخصوصية", terms: "شروط الاستخدام", cookies: "سياسة ملفات تعريف الارتباط",
    },
    modal: {
      title: "تواصل معنا", nameLabel: "الاسم الكامل", emailLabel: "البريد الإلكتروني", phoneLabel: "رقم الهاتف",
      roleLabel: "أنا...", interestLabel: "أنا مهتم بـ...",
      messageLabel: "رسالة (اختياري)", messagePlaceholder: "أخبرنا المزيد عن احتياجاتك...",
      submit: "إرسال",
      roles: ["صاحب عمل", "مدير موارد بشرية", "مدير فندق", "صاحب مطعم", "مدير عيادة", "باحث عن عمل", "أخرى"],
      interests: ["تدريب خدمة العملاء", "تدريب الضيافة", "الاستعانة بكوادر بشرية", "تدقيق جودة الخدمة", "فرصة وظيفية", "استفسار عام"],
    },
  },
};

// ─── Language + modal context ─────────────────────────────────────────────────
interface LangCtx { lang: Lang; setLang: (l: Lang) => void; t: Translations; openModal: () => void; }
const LangContext = createContext<LangCtx>({ lang: "EN", setLang: () => {}, t: TR.EN, openModal: () => {} });
const useLang = () => useContext(LangContext);

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};
const stagger = (d = 0.1) => ({ hidden: {}, visible: { transition: { staggerChildren: d } } });

function InView({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden"
      animate={inView ? "visible" : "hidden"} transition={{ delay }} className={className}>
      {children}
    </motion.div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5"
      style={{ backgroundColor: `${TEAL}15`, color: TEAL_TEXT, border: `1px solid ${TEAL}30` }}>
      {children}
    </span>
  );
}

function SectionHeading({ tag, title, subtitle, align = "center" }: {
  tag: string; title: string; subtitle?: string; align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={`mb-14 ${centered ? "text-center" : ""}`}>
      <InView>
        <Tag>{tag}</Tag>
        <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight" style={{ color: DARK_HEADING }}>{title}</h2>
        <div className="w-14 h-1 rounded-full mb-5"
          style={{ background: `linear-gradient(90deg,${TEAL},${GOLD})`, ...(centered ? { margin: "0 auto 20px" } : {}) }} />
        {subtitle && <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: GRAY }}>{subtitle}</p>}
      </InView>
    </div>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function WaIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstaIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  );
}

// ─── Email copy button (copies addiafah@gmail.com, shows toast) ───────────────
function EmailCopyButton({ className, style, children }: {
  className?: string; style?: React.CSSProperties; children?: React.ReactNode;
}) {
  const { lang } = useLang();
  const [copied, setCopied] = useState(false);
  const toastText = lang === "FR" ? "Email copié !" : lang === "AR" ? "تم نسخ الإيميل!" : "Email copied!";

  const copy = () => {
    navigator.clipboard.writeText("addiafah@gmail.com").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-flex">
      <button onClick={copy} className={className} style={style}>{children}</button>
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap pointer-events-none"
            style={{ backgroundColor: "#22C55E", color: WHITE, zIndex: 100 }}>
            {toastText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Contact Modal ────────────────────────────────────────────────────────────
interface ContactForm { name: string; email: string; phone: string; role: string; interest: string; message: string; }

function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useLang();
  const m = t.modal;
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", phone: "", role: "", interest: "", message: "" });

  const set = (k: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Addiafah] ${form.interest || "Inquiry"} — ${form.role || "Contact"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nRole: ${form.role}\nInterest: ${form.interest}\n\nMessage:\n${form.message}`
    );
    window.open(`mailto:addiafah@gmail.com?subject=${subject}&body=${body}`, "_blank");
    onClose();
    setForm({ name: "", email: "", phone: "", role: "", interest: "", message: "" });
  };

  const inputStyle = { border: `1px solid ${BORDER}`, backgroundColor: IVORY, color: CHARCOAL };
  const inputCls = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2";

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-[520px] rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ backgroundColor: WHITE }}
            dir={lang === "AR" ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b"
              style={{ borderColor: BORDER, background: `linear-gradient(135deg, ${TEAL_LIGHT}, ${WHITE})` }}>
              <div>
                <h3 className="text-xl font-black" style={{ color: DARK_HEADING }}>{m.title}</h3>
                <p className="text-xs mt-0.5" style={{ color: GRAY }}>addiafah@gmail.com</p>
              </div>
              <button onClick={onClose} title="Close"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
                style={{ color: GRAY }}>
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
              {(["name", "email", "phone"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: DARK_HEADING }}>
                    {field === "name" ? m.nameLabel : field === "email" ? m.emailLabel : m.phoneLabel}
                    {field !== "phone" && <span style={{ color: TEAL }}> *</span>}
                  </label>
                  <input
                    required={field !== "phone"}
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    value={form[field]}
                    onChange={set(field)}
                    className={inputCls}
                    style={{ ...inputStyle, outlineColor: `${TEAL}50` }}
                    placeholder={field === "email" ? "you@company.com" : field === "phone" ? "+213 …" : ""}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: DARK_HEADING }}>
                  {m.roleLabel} <span style={{ color: TEAL }}>*</span>
                </label>
                <select required value={form.role} onChange={set("role")}
                  className={inputCls} style={{ ...inputStyle, outlineColor: `${TEAL}50` }}>
                  <option value="">{m.roleLabel}</option>
                  {m.roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: DARK_HEADING }}>
                  {m.interestLabel} <span style={{ color: TEAL }}>*</span>
                </label>
                <select required value={form.interest} onChange={set("interest")}
                  className={inputCls} style={{ ...inputStyle, outlineColor: `${TEAL}50` }}>
                  <option value="">{m.interestLabel}</option>
                  {m.interests.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: DARK_HEADING }}>{m.messageLabel}</label>
                <textarea rows={3} value={form.message} onChange={set("message")}
                  className={`${inputCls} resize-none`}
                  style={{ ...inputStyle, outlineColor: `${TEAL}50` }}
                  placeholder={m.messagePlaceholder} />
              </div>

              <button type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                style={{ backgroundColor: TEAL, color: WHITE, boxShadow: `0 4px 20px ${TEAL}45` }}>
                <Send size={16} /> {m.submit}
              </button>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <a href="https://wa.me/00966547896783" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: WA_GREEN, color: WHITE, boxShadow: `0 3px 12px ${WA_GREEN}40` }}>
                  <WaIcon size={16} /> WhatsApp
                </a>
                <EmailCopyButton
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-teal-50 w-full cursor-pointer"
                  style={{ borderColor: TEAL, color: TEAL_TEXT, background: "transparent" }}>
                  <Mail size={15} /> addiafah@gmail.com
                </EmailCopyButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Floating contact bar ─────────────────────────────────────────────────────
function FloatingBar() {
  const { openModal, lang } = useLang();
  const label = lang === "AR" ? "تواصل" : "Contact";
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2"
      style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.15))" }}>
      <a href="https://wa.me/00966547896783" target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center w-11 h-11 rounded-l-xl transition-all hover:w-14"
        title="WhatsApp"
        style={{ backgroundColor: WA_GREEN, color: WHITE }}>
        <WaIcon size={20} />
      </a>
      <a href="https://www.instagram.com/Addiafah" target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center w-11 h-11 rounded-l-xl transition-all hover:w-14"
        title="Instagram"
        style={{ backgroundColor: IG_PINK, color: WHITE }}>
        <InstaIcon size={20} />
      </a>
      <EmailCopyButton
        className="flex items-center justify-center w-11 h-11 rounded-l-xl transition-all hover:w-14 cursor-pointer"
        style={{ backgroundColor: TEAL, color: WHITE }}>
        <Mail size={20} />
      </EmailCopyButton>
      <button onClick={openModal} title={label}
        className="flex items-center justify-center h-11 rounded-l-xl px-3 text-xs font-bold tracking-wide transition-all hover:px-4"
        style={{ backgroundColor: CHARCOAL, color: WHITE, minWidth: 44, writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}>
        {label}
      </button>
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const JOBS: Job[] = [
  { id: 1, title: "Front Desk Manager", company: "Sofitel Algiers", location: "Algiers", flag: "🇩🇿", salary: "85,000–120,000 DZD", sector: "Hotels", requirements: ["3+ years luxury hotel front desk experience", "Fluent in French, Arabic & English", "Addiafah Foundation Certificate preferred"], posted: "2 days ago" },
  { id: 2, title: "Restaurant Supervisor", company: "Noura Restaurant Group", location: "Dubai", flag: "🇦🇪", salary: "$2,500–3,200/mo", sector: "Restaurants", requirements: ["2+ years F&B supervision experience", "Service excellence certification", "Strong communication & leadership skills"], posted: "5 days ago" },
  { id: 3, title: "Patient Experience Officer", company: "Al Noor Hospital", location: "Abu Dhabi", flag: "🇦🇪", salary: "$2,800–3,500/mo", sector: "Healthcare", requirements: ["Healthcare or hospitality background", "Patient-centric mindset required", "English + Arabic fluency required"], posted: "1 week ago" },
  { id: 4, title: "Luxury Retail Trainer", company: "Chalhoub Group", location: "Riyadh", flag: "🇸🇦", salary: "$3,000–4,000/mo", sector: "Retail", requirements: ["3+ years retail training experience", "Knowledge of luxury brand standards", "Addiafah Professional Certificate"], posted: "3 days ago" },
  { id: 5, title: "Guest Relations Manager", company: "Four Seasons Kuwait", location: "Kuwait City", flag: "🇰🇼", salary: "$3,500–4,500/mo", sector: "Hotels", requirements: ["5-star hotel experience required", "Proven guest recovery expertise", "Multilingual: EN/AR/FR a plus"], posted: "Today" },
  { id: 6, title: "F&B Service Trainer", company: "Doha Marriott", location: "Doha", flag: "🇶🇦", salary: "$2,200–2,800/mo", sector: "Restaurants", requirements: ["Training facilitation 2+ years", "International hotel brand knowledge", "WSET or equivalent certification a plus"], posted: "4 days ago" },
];

const SECTOR_ICONS: Record<string, React.ElementType> = {
  Hotels: Building2, Restaurants: UtensilsCrossed, Healthcare: Heart, Retail: ShoppingBag, Corporate: Briefcase,
};
const SECTOR_COLORS: Record<string, string> = {
  Hotels: "#1A9CB0", Restaurants: "#C9963A", Healthcare: "#E05C7A", Retail: "#7C5CBF", Corporate: "#3B82F6",
};

const SERVICES_META = [
  { img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800", features: ["Communication Excellence", "Conflict Resolution", "Brand Voice Alignment", "KPI Tracking"] },
  { img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800", features: ["Luxury Service Standards", "Guest Experience Design", "F&B Excellence", "Cultural Sensitivity"] },
  { img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800", features: ["Certified Professionals", "Rapid Deployment", "Flexible Contracts", "Quality Guaranteed"] },
  { img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80", features: ["Mystery Shopping Audits", "Customer Journey Mapping", "Gap Analysis Reports", "Action Plan Delivery"] },
];

const INDUSTRY_ICONS = [Building2, UtensilsCrossed, Heart, ShoppingBag, Briefcase, Plane];
const WHY_ICONS      = [Languages, Globe, TrendingUp, Shield];
const STEP_ICONS     = [Target, Zap, Users, BarChart3];

// ─── Nav section IDs ──────────────────────────────────────────────────────────
const NAV_IDS = ["services", "programs", "industries", "careers", "about", "contact"];

// ─── Navbar ───────────────────────────────────────────────────────────────────
const LANGS: Lang[] = ["EN", "FR", "AR"];

function Navbar() {
  const { lang, setLang, t, openModal } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    const el = document.getElementById(NAV_IDS[idx]);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-50"
      style={{ backgroundColor: WHITE, borderBottom: `1px solid ${BORDER}`, boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        <a href="/" className="flex-shrink-0" aria-label="Addiafah home">
          <Image src="/logo.png" alt="الضيافة — Addiafah logo" width={90} height={90}
            className="object-contain" priority />
        </a>

        <div className="hidden lg:flex items-center gap-7">
          {t.nav.links.map((link, i) => (
            <a key={i} href={`#${NAV_IDS[i]}`} onClick={(e) => scrollTo(e, i)}
              className="relative text-sm font-medium transition-colors group cursor-pointer"
              style={{ color: "#374151" }}>
              {link}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 rounded-full"
                style={{ backgroundColor: TEAL }} />
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1 px-2 py-1.5 rounded-full border" style={{ borderColor: BORDER }}>
            {LANGS.map(l => (
              <button key={l} onClick={() => setLang(l)}
                className="text-xs font-bold px-2.5 py-0.5 rounded-full transition-all"
                style={{ backgroundColor: lang === l ? TEAL : "transparent", color: lang === l ? WHITE : GRAY }}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={openModal}
            className="px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
            style={{ backgroundColor: TEAL, color: WHITE, boxShadow: `0 4px 16px ${TEAL}40` }}>
            {t.nav.cta}
          </button>
        </div>

        <button className="lg:hidden flex-shrink-0" style={{ color: CHARCOAL }} onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="lg:hidden overflow-hidden"
            style={{ backgroundColor: WHITE, borderTop: `1px solid ${BORDER}` }}>
            <div className="px-6 py-5 flex flex-col gap-3">
              {t.nav.links.map((link, i) => (
                <a key={i} href={`#${NAV_IDS[i]}`} onClick={(e) => scrollTo(e, i)}
                  className="py-2.5 font-medium border-b transition-colors cursor-pointer"
                  style={{ color: "#374151", borderColor: BORDER }}>{link}</a>
              ))}
              <div className="flex gap-2 mt-2">
                {LANGS.map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    className="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
                    style={{ backgroundColor: lang === l ? TEAL : TEAL_LIGHT, color: lang === l ? WHITE : TEAL_TEXT }}>
                    {l}
                  </button>
                ))}
              </div>
              <button onClick={() => { openModal(); setMenuOpen(false); }}
                className="mt-1 py-3 rounded-full text-sm font-bold text-center"
                style={{ backgroundColor: TEAL, color: WHITE }}>{t.nav.cta}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { t, openModal } = useLang();

  const scrollToPrograms = () => {
    const el = document.getElementById("programs");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20" aria-label="Hero">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600"
          alt="A professional team in a customer service training session"
          className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(105deg, rgba(250,250,247,0.97) 0%, rgba(250,250,247,0.90) 40%, rgba(250,250,247,0.55) 70%, rgba(250,250,247,0.15) 100%)" }} />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 w-full">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
            style={{ borderColor: `${TEAL}40`, backgroundColor: TEAL_LIGHT, color: TEAL_TEXT }}>
            <Star size={13} fill={TEAL_TEXT} style={{ color: TEAL_TEXT }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: TEAL_TEXT }}>{t.hero.badge}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="text-5xl md:text-7xl font-black leading-[1.08] mb-6" style={{ color: "#1A202C" }}>
            {t.hero.h1}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-lg md:text-xl leading-relaxed mb-10"
            style={{ color: "#374151", fontWeight: 500 }}>
            {t.hero.sub}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-4">
            <button onClick={openModal}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105"
              style={{ backgroundColor: TEAL, color: WHITE, boxShadow: `0 8px 28px ${TEAL}45` }}>
              {t.hero.cta1} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={scrollToPrograms}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base border transition-all hover:bg-white/60"
              style={{ borderColor: TEAL, color: TEAL_TEXT, backgroundColor: "rgba(255,255,255,0.6)" }}>
              {t.hero.cta2} <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4" style={{ backgroundColor: TEAL }}>
          {[{ v: "500+", i: 0 }, { v: "5", i: 1 }, { v: "98%", i: 2 }, { v: "12+", i: 3 }].map(({ v, i }) => (
            <div key={i} className="py-6 px-6 text-center border-r last:border-r-0"
              style={{ borderColor: "rgba(255,255,255,0.2)" }}>
              <div className="text-3xl font-black" style={{ color: WHITE }}>{v}</div>
              <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.85)" }}>{t.stats[i]}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Marquee ──────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "Luxury Hotels", "Fine Dining", "Private Healthcare", "Luxury Retail",
  "Corporate", "Algiers", "Riyadh", "Dubai", "Doha", "Kuwait City",
  "Abu Dhabi", "Casablanca", "Oran",
];

function Marquee() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="py-3.5 overflow-hidden border-y" style={{ borderColor: BORDER, backgroundColor: WHITE }}
      aria-hidden="true">
      <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap will-change-transform">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center"
            style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.15em", color: TEAL_TEXT, textTransform: "uppercase" }}>
            {item}
            <span className="mx-5" style={{ color: BORDER, fontSize: 10, fontWeight: 300 }}>·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Mission ──────────────────────────────────────────────────────────────────
function Mission() {
  const { t } = useLang();
  const m = t.mission;
  return (
    <section id="about" aria-label="Our Mission" className="py-24 px-6" style={{ backgroundColor: IVORY }}>
      <div className="max-w-4xl mx-auto text-center">
        <InView>
          <Tag>{m.eyebrow}</Tag>
          <div className="relative mt-4 mb-10">
            <span className="absolute -top-6 left-0 md:-left-8 text-9xl font-black leading-none select-none pointer-events-none"
              style={{ color: `${TEAL}18`, fontFamily: "Georgia, serif", lineHeight: 1 }}>&ldquo;</span>
            <p className="relative text-lg md:text-xl leading-[1.9] font-medium mx-auto"
              style={{ color: BODY_TEXT, maxWidth: 780 }}>
              {m.paragraph}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {m.stats.map((stat, i) => (
              <div key={i}
                className="px-6 py-3 rounded-full text-sm font-bold border-2"
                style={{ borderColor: TEAL, color: TEAL_TEXT, backgroundColor: TEAL_LIGHT }}>
                {stat}
              </div>
            ))}
          </div>
        </InView>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  const { t, openModal } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id="services" aria-label="Services" className="py-28 px-6" style={{ backgroundColor: WHITE }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeading tag={t.services.tag} title={t.services.title} subtitle={t.services.subtitle} />
        <motion.div ref={ref} variants={stagger(0.12)} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {SERVICES_META.map((meta, i) => {
            const item = t.services.items[i];
            return (
              <motion.article key={i} variants={fadeUp} whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="rounded-2xl overflow-hidden border flex flex-col transition-shadow hover:shadow-xl"
                style={{ backgroundColor: WHITE, borderColor: BORDER }}>
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={meta.img} alt={`${item.title} — Addiafah training`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(45,55,72,0.35), transparent)" }} />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-2" style={{ color: DARK_HEADING }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: BODY_TEXT }}>{item.desc}</p>
                  {item.tag && (
                    <p className="text-xs font-semibold mb-4 px-3 py-2 rounded-lg"
                      style={{ backgroundColor: TEAL_LIGHT, color: TEAL_TEXT }}>{item.tag}</p>
                  )}
                  <ul className="space-y-1.5 mb-5">
                    {meta.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs" style={{ color: BODY_TEXT }}>
                        <CheckCircle size={12} style={{ color: TEAL }} />{f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={openModal}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5 self-start"
                    style={{ color: TEAL_TEXT }}>
                    {t.services.learnMore} <ArrowRight size={14} />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section aria-label="How It Works" className="py-28 px-6" style={{ backgroundColor: IVORY }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeading tag={t.howItWorks.tag} title={t.howItWorks.title} subtitle={t.howItWorks.subtitle} />
        <div ref={ref} className="relative">
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${TEAL}50, ${TEAL}50, transparent)` }} />
          <motion.div variants={stagger(0.18)} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="grid md:grid-cols-4 gap-10">
            {t.howItWorks.steps.map((step, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <motion.div key={i} variants={fadeUp} className="text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto"
                    style={{ backgroundColor: TEAL_LIGHT, border: `2px solid ${TEAL}35` }}>
                    <Icon size={30} style={{ color: TEAL }} />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center"
                      style={{ backgroundColor: GOLD, color: WHITE }}>{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: DARK_HEADING }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: BODY_TEXT }}>{step.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Industries ───────────────────────────────────────────────────────────────
function Industries() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id="industries" aria-label="Industries We Serve" className="py-28 px-6" style={{ backgroundColor: WHITE }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeading tag={t.industries.tag} title={t.industries.title} subtitle={t.industries.subtitle} />
        <motion.div ref={ref} variants={stagger(0.1)} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {t.industries.items.map((ind, i) => {
            const Icon = INDUSTRY_ICONS[i];
            return (
              <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="group flex items-center gap-4 p-6 rounded-xl border cursor-pointer transition-shadow hover:shadow-md"
                style={{ backgroundColor: WHITE, borderColor: BORDER }}>
                <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center transition-all group-hover:scale-110 duration-300"
                  style={{ backgroundColor: TEAL_LIGHT }}>
                  <Icon size={22} style={{ color: TEAL }} />
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: DARK_HEADING }}>{ind.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: GRAY }}>{ind.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Why Addiafah ─────────────────────────────────────────────────────────────
function WhyAddiafah() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section aria-label="Why Addiafah" className="py-28 px-6" style={{ backgroundColor: IVORY }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading tag={t.why.tag} title={t.why.title} subtitle={t.why.subtitle} align="left" />
            <motion.div ref={ref} variants={stagger(0.15)} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="grid sm:grid-cols-2 gap-5 mt-6">
              {t.why.items.map((item, i) => {
                const Icon = WHY_ICONS[i];
                return (
                  <motion.div key={i} variants={fadeUp}
                    className="p-6 rounded-xl border" style={{ backgroundColor: WHITE, borderColor: BORDER }}>
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: TEAL_LIGHT }}>
                      <Icon size={22} style={{ color: TEAL }} />
                    </div>
                    <h3 className="font-bold mb-2 text-sm" style={{ color: DARK_HEADING }}>{item.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: BODY_TEXT }}>{item.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
          <InView className="relative rounded-2xl overflow-hidden shadow-2xl h-[520px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
              alt="Addiafah training professionals in a modern office setting"
              className="w-full h-full object-cover" />
            <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl"
              style={{ backgroundColor: "rgba(250,250,247,0.92)", backdropFilter: "blur(12px)", border: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: TEAL_LIGHT }}>
                  <Award size={20} style={{ color: TEAL }} />
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: DARK_HEADING }}>{t.why.credential}</div>
                  <div className="text-xs" style={{ color: GRAY }}>{t.why.credentialSub}</div>
                </div>
              </div>
            </div>
          </InView>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { quote: "Addiafah completely transformed how our front-of-house team communicates with guests. Our satisfaction scores went from 72% to 94% in just three months.", name: "Karim Benali", title: "General Manager, Le Méridien Algiers", flag: "🇩🇿" },
  { quote: "The trilingual delivery was a game-changer for our diverse team. ROI was evident within weeks — we saw a 40% reduction in customer complaints.", name: "Fatima Al-Rashidi", title: "VP Operations, Rotana Hotels", flag: "🇦🇪" },
  { quote: "Professional, culturally aware, and results-driven. Addiafah's certification gave our staff the confidence and skills to perform at an international level.", name: "Youssef Mansour", title: "Director of Training, Qatar Hospitality Group", flag: "🇶🇦" },
];

function Testimonials() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section aria-label="Client Testimonials" className="py-28 px-6" style={{ backgroundColor: GOLD_LIGHT }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeading tag={t.testimonials.tag} title={t.testimonials.title} subtitle={t.testimonials.subtitle} />
        <motion.div ref={ref} variants={stagger(0.15)} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((tm, i) => (
            <motion.article key={i} variants={fadeUp}
              className="relative flex flex-col p-8 rounded-2xl border shadow-sm"
              style={{ backgroundColor: WHITE, borderColor: BORDER }}>
              <Quote size={40} className="absolute top-6 right-6 opacity-15" style={{ color: GOLD }} fill={GOLD} />
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={14} style={{ color: GOLD }} fill={GOLD} />)}
              </div>
              <p className="text-sm leading-relaxed flex-1 mb-6 italic" style={{ color: BODY_TEXT }}>
                &ldquo;{tm.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: BORDER }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: TEAL_LIGHT }}>{tm.flag}</div>
                <div>
                  <div className="font-bold text-sm" style={{ color: DARK_HEADING }}>{tm.name}</div>
                  <div className="text-xs" style={{ color: GRAY }}>{tm.title}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Job Board ────────────────────────────────────────────────────────────────
function JobBoard() {
  const { t, openModal } = useLang();
  const jt = t.jobs;
  const [activeFilter, setActiveFilter] = useState<JobSector>("All");
  const [shortlist, setShortlist] = useState<Set<number>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const filters: JobSector[] = ["All", "Hotels", "Restaurants", "Healthcare", "Retail", "Corporate"];
  const filtered = activeFilter === "All" ? JOBS : JOBS.filter(j => j.sector === activeFilter);
  const shortlisted = JOBS.filter(j => shortlist.has(j.id));

  const toggleShortlist = (id: number) => {
    setShortlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="careers" aria-label="Career Opportunities" className="py-28 px-6" style={{ backgroundColor: IVORY }}>
      <div className="max-w-7xl mx-auto">
        <InView>
          <div className="rounded-2xl p-10 mb-14 text-center relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)` }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase"
                style={{ backgroundColor: "rgba(255,255,255,0.2)", color: WHITE }}>
                <Briefcase size={12} /> {jt.bannerBadge}
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: WHITE }}>{jt.bannerTitle}</h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.85)" }}>{jt.bannerSub}</p>
            </div>
          </div>
        </InView>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  backgroundColor: activeFilter === f ? TEAL : WHITE,
                  color: activeFilter === f ? WHITE : CHARCOAL,
                  border: `1px solid ${activeFilter === f ? TEAL : BORDER}`,
                  boxShadow: activeFilter === f ? `0 4px 14px ${TEAL}35` : "none",
                }}>
                {f === "All" ? jt.allJobs : f}
                {f !== "All" && <span className="ml-1.5 text-xs opacity-70">({JOBS.filter(j => j.sector === f).length})</span>}
              </button>
            ))}
          </div>
          <button onClick={() => setDrawerOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all hover:shadow-md"
            style={{ borderColor: shortlist.size > 0 ? GOLD : BORDER, color: shortlist.size > 0 ? GOLD : GRAY, backgroundColor: shortlist.size > 0 ? GOLD_LIGHT : WHITE }}>
            <Bookmark size={15} fill={shortlist.size > 0 ? GOLD : "none"} />
            {jt.shortlist}
            {shortlist.size > 0 && (
              <span className="w-5 h-5 rounded-full text-xs font-black flex items-center justify-center"
                style={{ backgroundColor: GOLD, color: WHITE }}>{shortlist.size}</span>
            )}
          </button>
        </div>

        <motion.div ref={ref} variants={stagger(0.1)} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <AnimatePresence mode="popLayout">
            {filtered.map(job => {
              const Icon = SECTOR_ICONS[job.sector] ?? Briefcase;
              const color = SECTOR_COLORS[job.sector] ?? TEAL;
              const saved = shortlist.has(job.id);
              return (
                <motion.article key={job.id} variants={fadeUp} layout exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border overflow-hidden flex flex-col shadow-sm hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: WHITE, borderColor: BORDER }}>
                  <div className="px-6 py-5 flex items-start justify-between"
                    style={{ background: `linear-gradient(135deg, ${color}12, ${color}06)`, borderBottom: `1px solid ${color}20` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                        <Icon size={20} style={{ color }} />
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${color}18`, color }}>{job.sector}</span>
                    </div>
                    <button onClick={() => toggleShortlist(job.id)} title={saved ? "Remove from shortlist" : "Add to shortlist"}
                      className="p-1.5 rounded-lg transition-all hover:scale-110"
                      style={{ color: saved ? GOLD : GRAY }}>
                      <Bookmark size={18} fill={saved ? GOLD : "none"} />
                    </button>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-black mb-1" style={{ color: DARK_HEADING }}>{job.title}</h3>
                    <div className="flex items-center gap-1.5 mb-3 text-sm" style={{ color: GRAY }}>
                      <span className="font-medium" style={{ color: BODY_TEXT }}>{job.company}</span>
                      <span>·</span><MapPin size={12} />{job.location} {job.flag}
                    </div>
                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold mb-4 self-start"
                      style={{ backgroundColor: TEAL_LIGHT, color: TEAL_TEXT }}>{job.salary}</div>
                    <ul className="space-y-2 mb-5 flex-1">
                      {job.requirements.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs" style={{ color: BODY_TEXT }}>
                          <CheckCircle size={12} className="mt-0.5 flex-shrink-0" style={{ color: TEAL }} />{r}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: GRAY }}>
                      <Calendar size={12} />{jt.posted} {job.posted}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => toggleShortlist(job.id)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                        style={{ borderColor: saved ? GOLD : BORDER, color: saved ? GOLD : GRAY, backgroundColor: saved ? GOLD_LIGHT : WHITE }}>
                        {saved ? jt.saved : jt.save}
                      </button>
                      <button onClick={openModal}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                        style={{ backgroundColor: TEAL, color: WHITE, boxShadow: `0 4px 14px ${TEAL}30` }}>
                        {jt.apply}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <InView>
          <div className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border"
            style={{ backgroundColor: WHITE, borderColor: BORDER, borderLeft: `4px solid ${GOLD}` }}>
            <div>
              <h3 className="text-xl font-black mb-2" style={{ color: DARK_HEADING }}>{jt.postTitle}</h3>
              <p className="text-sm" style={{ color: BODY_TEXT }}>{jt.postSub}</p>
            </div>
            <button onClick={openModal}
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
              style={{ backgroundColor: GOLD, color: WHITE, boxShadow: `0 4px 16px ${GOLD}40` }}>
              {jt.postCta} <ArrowRight size={16} />
            </button>
          </div>
        </InView>
      </div>

      {/* Shortlist Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div className="fixed inset-0 z-50 flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
            <motion.div className="w-full max-w-sm h-full flex flex-col shadow-2xl"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ backgroundColor: WHITE }}>
              <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
                <div>
                  <h3 className="font-black text-lg" style={{ color: DARK_HEADING }}>{jt.shortlisted}</h3>
                  <p className="text-sm" style={{ color: GRAY }}>{shortlisted.length} {shortlisted.length !== 1 ? jt.rolesavedPlural : jt.rolesaved}</p>
                </div>
                <button onClick={() => setDrawerOpen(false)} title="Close" style={{ color: GRAY }}><X size={22} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {shortlisted.length === 0 ? (
                  <div className="text-center py-16">
                    <Bookmark size={40} className="mx-auto mb-4 opacity-30" style={{ color: GRAY }} />
                    <p className="text-sm font-medium" style={{ color: GRAY }}>{jt.noShortlist}</p>
                    <p className="text-xs mt-1" style={{ color: GRAY }}>{jt.noShortlistSub}</p>
                  </div>
                ) : shortlisted.map(job => {
                  const Icon = SECTOR_ICONS[job.sector] ?? Briefcase;
                  const color = SECTOR_COLORS[job.sector] ?? TEAL;
                  return (
                    <div key={job.id} className="p-4 rounded-xl border" style={{ backgroundColor: IVORY, borderColor: BORDER }}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2"><Icon size={16} style={{ color }} /><span className="text-xs font-bold" style={{ color }}>{job.sector}</span></div>
                        <button onClick={() => toggleShortlist(job.id)} title="Remove" style={{ color: GRAY }}><X size={14} /></button>
                      </div>
                      <h4 className="font-bold text-sm mb-0.5" style={{ color: DARK_HEADING }}>{job.title}</h4>
                      <p className="text-xs mb-3" style={{ color: GRAY }}>{job.company} · {job.location} {job.flag}</p>
                      <div className="flex gap-2">
                        <button onClick={() => { openModal(); setDrawerOpen(false); }}
                          className="flex-1 py-2 rounded-lg text-xs font-bold"
                          style={{ backgroundColor: TEAL, color: WHITE }}>{jt.apply}</button>
                        <button onClick={() => { openModal(); setDrawerOpen(false); }}
                          className="flex-1 py-2 rounded-lg text-xs font-bold text-center border"
                          style={{ borderColor: BORDER, color: CHARCOAL }}>{jt.contactBtn}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {shortlisted.length > 0 && (
                <div className="p-4 border-t" style={{ borderColor: BORDER }}>
                  <button onClick={openModal}
                    className="w-full py-3 rounded-xl text-sm font-bold"
                    style={{ backgroundColor: GOLD, color: WHITE }}>
                    {jt.applyAll} ({shortlisted.length}) →
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Certification ────────────────────────────────────────────────────────────
const CERT_META = [
  { icon: Award, duration: "3 Days", modules: 6, features: ["Core Service Standards", "Communication Basics", "Brand Awareness", "Digital Certificate"], accent: "#C9963A", bg: "#FDF3E3" },
  { icon: Star, duration: "5 Days", modules: 12, features: ["Advanced Service Excellence", "Leadership Fundamentals", "Cross-cultural Skills", "Physical + Digital Cert"], accent: TEAL, bg: TEAL_LIGHT, featured: true },
  { icon: Shield, duration: "8 Days", modules: 20, features: ["Master Trainer Certification", "Program Design Skills", "Regional Recognition", "GCC-Accredited Diploma"], accent: "#7C5CBF", bg: "#F3F0FA" },
];

function Certification() {
  const { t, openModal } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id="programs" aria-label="Certification Programs" className="py-28 px-6" style={{ backgroundColor: WHITE }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeading tag={t.cert.tag} title={t.cert.title} subtitle={t.cert.subtitle} />
        <motion.div ref={ref} variants={stagger(0.15)} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 items-start">
          {CERT_META.map((cert, i) => {
            const tier = t.cert.tiers[i];
            return (
              <motion.article key={i} variants={fadeUp}
                className="relative rounded-2xl border p-8 transition-shadow hover:shadow-xl"
                style={{
                  backgroundColor: WHITE,
                  borderColor: cert.featured ? cert.accent : BORDER,
                  boxShadow: cert.featured ? `0 12px 40px ${cert.accent}25` : undefined,
                  transform: cert.featured ? "scale(1.03)" : undefined,
                }}>
                {cert.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase whitespace-nowrap"
                    style={{ backgroundColor: cert.accent, color: WHITE }}>
                    {t.cert.mostPopular}
                  </div>
                )}
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: cert.bg }}>
                  <cert.icon size={28} style={{ color: cert.accent }} />
                </div>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-black" style={{ color: DARK_HEADING }}>{tier.tier}</h3>
                  <span className="text-xs font-semibold px-2 py-1 rounded-md"
                    style={{ backgroundColor: cert.bg, color: cert.accent }}>{tier.level}</span>
                </div>
                <div className="flex gap-5 mb-6">
                  <span className="text-sm flex items-center gap-1.5" style={{ color: GRAY }}>
                    <Clock size={13} style={{ color: cert.accent }} />{cert.duration}
                  </span>
                  <span className="text-sm flex items-center gap-1.5" style={{ color: GRAY }}>
                    <GraduationCap size={13} style={{ color: cert.accent }} />{cert.modules} Modules
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {cert.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm" style={{ color: BODY_TEXT }}>
                      <CheckCircle size={14} style={{ color: cert.accent }} />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={openModal}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                  style={{
                    backgroundColor: cert.featured ? cert.accent : "transparent",
                    border: `1px solid ${cert.accent}`,
                    color: cert.featured ? WHITE : cert.accent,
                  }}>
                  {t.cert.enrol}
                </button>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTABanner() {
  const { t, openModal } = useLang();
  return (
    <section id="contact" aria-label="Contact and CTA" className="py-28 px-6" style={{ backgroundColor: IVORY }}>
      <div className="max-w-5xl mx-auto">
        <InView>
          <div className="relative rounded-3xl overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)` }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: `url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800")`, backgroundSize: "cover", backgroundPosition: "center", mixBlendMode: "overlay" }} />
            <div className="relative z-10 text-center px-8 py-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-bold tracking-widest uppercase"
                style={{ backgroundColor: "rgba(255,255,255,0.2)", color: WHITE }}>
                <Zap size={12} fill={WHITE} style={{ color: WHITE }} /> {t.cta.tag}
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight" style={{ color: WHITE }}>{t.cta.title}</h2>
              <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed"
                style={{ color: "rgba(255,255,255,0.9)" }}>{t.cta.sub}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={openModal}
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105"
                  style={{ backgroundColor: WHITE, color: TEAL_TEXT, boxShadow: "0 8px 28px rgba(0,0,0,0.2)" }}>
                  <Mail size={18} /> {t.cta.cta1}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <a href="tel:+213000000000"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base border-2 transition-all hover:bg-white/10"
                  style={{ borderColor: "rgba(255,255,255,0.5)", color: WHITE }}>
                  <Phone size={18} /> {t.cta.cta2}
                </a>
              </div>
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
const COUNTRIES = [
  { flag: "🇩🇿", name: "Algeria" }, { flag: "🇸🇦", name: "Saudi Arabia" },
  { flag: "🇦🇪", name: "UAE" }, { flag: "🇶🇦", name: "Qatar" }, { flag: "🇰🇼", name: "Kuwait" },
];

function Footer() {
  const { t, openModal } = useLang();
  return (
    <footer style={{ backgroundColor: CHARCOAL }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-5">
              <Image src="/logo.png" alt="الضيافة — Addiafah" width={75} height={75}
                className="object-contain" />
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.75)" }}>
              {t.footer.tagline}
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/Addiafah" target="_blank" rel="noopener noreferrer"
                title="Instagram"
                className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all hover:scale-110"
                style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", backgroundColor: "rgba(255,255,255,0.06)" }}>
                <InstaIcon size={16} />
              </a>
              <a href="https://wa.me/00966547896783" target="_blank" rel="noopener noreferrer"
                title="WhatsApp"
                className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all hover:scale-110"
                style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", backgroundColor: "rgba(255,255,255,0.06)" }}>
                <WaIcon size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                title="LinkedIn"
                className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all hover:scale-110"
                style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", backgroundColor: "rgba(255,255,255,0.06)" }}>
                <LinkedInIcon size={16} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-5 text-xs tracking-widest uppercase" style={{ color: WHITE }}>{t.footer.services}</h4>
            <ul className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
              {t.footer.serviceLinks.map(item => (
                <li key={item}><button onClick={openModal} className="hover:text-white transition-colors text-left">{item}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-5 text-xs tracking-widest uppercase" style={{ color: WHITE }}>{t.footer.company}</h4>
            <ul className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
              {t.footer.companyLinks.map(item => (
                <li key={item}><button onClick={openModal} className="hover:text-white transition-colors text-left">{item}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-5 text-xs tracking-widest uppercase" style={{ color: WHITE }}>{t.footer.contact}</h4>
            <ul className="space-y-4 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
              <li className="flex items-center gap-2.5"><MapPin size={14} style={{ color: TEAL }} />Algiers, Algeria</li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} style={{ color: TEAL }} />
                <EmailCopyButton
                  className="hover:text-white transition-colors text-sm cursor-pointer"
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.75)", padding: 0 }}>
                  addiafah@gmail.com
                </EmailCopyButton>
              </li>
              <li className="flex items-center gap-2.5">
                <div style={{ color: WA_GREEN }}><WaIcon size={14} /></div>
                <a href="https://wa.me/00966547896783" target="_blank" rel="noopener noreferrer"
                  className="hover:text-white transition-colors">WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-y flex flex-wrap gap-6 justify-center"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          {COUNTRIES.map(c => (
            <div key={c.name} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
              <span className="text-xl">{c.flag}</span>{c.name}
            </div>
          ))}
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{ color: "rgba(255,255,255,0.55)" }}>
          <span>{t.footer.rights}</span>
          <div className="flex gap-6">
            {[t.footer.privacy, t.footer.terms, t.footer.cookies].map(item => (
              <button key={item} onClick={openModal} className="hover:text-white transition-colors">{item}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [lang, setLang]     = useState<Lang>("EN");
  const [modalOpen, setModalOpen] = useState(false);
  const t = TR[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, t, openModal: () => setModalOpen(true) }}>
      <main dir={lang === "AR" ? "rtl" : "ltr"} style={{ backgroundColor: IVORY }}>
        <Navbar />
        <Hero />
        <Marquee />
        <Mission />
        <Services />
        <HowItWorks />
        <Industries />
        <WhyAddiafah />
        <Testimonials />
        <JobBoard />
        <Certification />
        <CTABanner />
        <Footer />
        <FloatingBar />
        <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </main>
    </LangContext.Provider>
  );
}
