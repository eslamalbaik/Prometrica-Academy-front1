<script setup lang="ts">
definePage({
  meta: {
    layout: 'pure',
    public: true,
  },
})

import {
  GraduationCap, Stethoscope, ClipboardCheck, MessageSquare,
  FlaskConical, Compass, Sparkles, ShieldCheck, Globe2, Users,
  Headphones, Briefcase, ArrowRight, CheckCircle2, Calendar, BookOpen, Star, Gift,
} from "lucide-vue-next";
import Navbar from "../landing/components/Navbar.vue";
import Footer from "../landing/components/Footer.vue";
import HeroVisual from "../landing/components/HeroVisual.vue";
import Counter from "../landing/components/Counter.vue";
import "../landing/landing.css";

const why = [
  { icon: Globe2, title: "Learn from anywhere", text: "Fully online platform built for pharmacists worldwide." },
  { icon: Users, title: "Elite faculty", text: "Lectures led by top clinical experts and exam strategists." },
  { icon: BookOpen, title: "Every specialty", text: "Curricula covering Prometric, clinical, and practice areas." },
  { icon: Gift, title: "Free starter materials", text: "Sample question banks and study guides on signup." },
];

const programs = [
  { icon: GraduationCap, title: "Prometric Prep", text: "Intensive, targeted programs to pass health professional certification exams." },
  { icon: Stethoscope, title: "Clinical Pharmacy", text: "Develop evidence-based decision-making for real clinical practice." },
  { icon: ClipboardCheck, title: "Mock Exams", text: "Realistic simulations of testing environments to assess readiness." },
  { icon: MessageSquare, title: "Interview Readiness", text: "Pass interviews at leading hospitals and pharmaceutical companies." },
  { icon: FlaskConical, title: "Modern Practice", text: "Stay current with the latest treatment protocols and guidelines." },
  { icon: Compass, title: "Strategic Mentorship", text: "Custom study plans tailored to your level and target exam date." },
];

const courses = [
  { date: { d: "12", m: "Jun" }, day: "Wednesday", title: "Prometric DHA Pharmacy", subtitle: "Full preparation track", price: 150, classes: 12, tag: "Bestseller" },
  { date: { d: "20", m: "Jun" }, day: "Thursday", title: "Clinical Pharmacy Essentials", subtitle: "Evidence-based decision making", price: 180, classes: 10, tag: "New" },
  { date: { d: "05", m: "Jul" }, day: "Saturday", title: "Saudi SCFHS Exam Prep", subtitle: "Targeted intensive program", price: 200, classes: 14, tag: "Live" },
  { date: { d: "18", m: "Jul" }, day: "Friday", title: "Hospital Interview Mastery", subtitle: "Realistic interview drills", price: 120, classes: 6, tag: "Limited" },
];

const whyCards = [
  { icon: Users, title: "Elite Faculty", text: "A select group of lecturers and clinical experts guiding every cohort." },
  { icon: Sparkles, title: "Continuous Updates", text: "Medical curricula refreshed against the latest international standards." },
  { icon: Globe2, title: "Flexible Distance Learning", text: "Access world-class training from anywhere, at your own pace." },
  { icon: ShieldCheck, title: "Smart Exam Strategies", text: "Innovative test-solving frameworks engineered for high-pressure exams." },
  { icon: Headphones, title: "24/7 Support", text: "Ongoing technical and academic support whenever you need it." },
  { icon: Briefcase, title: "Career Insight", text: "A complete view of the medical job market and hiring landscape." },
];

const steps = [
  { n: "01", title: "Discovery & Analysis", text: "Initial assessment to determine your current level and gaps." },
  { n: "02", title: "Personalized Plan", text: "A tailored roadmap built around your exam date and goal." },
  { n: "03", title: "Interactive Learning", text: "Live sessions, recorded modules, and case-based practice." },
  { n: "04", title: "Mock Exams & Review", text: "Realistic simulations with deep diagnostic feedback." },
  { n: "05", title: "Certification & Success", text: "Pass your licensing exam and step into your career." },
];

const testimonials = [
  { q: "Prometrica Academy completely changed my study method, and I passed the licensing exam on my first attempt.", a: "Layla H.", r: "Licensed Pharmacist" },
  { q: "The level of professionalism and the practice questions were exceptional and realistic.", a: "Omar S.", r: "Clinical Pharmacist" },
  { q: "Finally, an educational partner that focuses on deep understanding and confidence — not rote memorization.", a: "Dr. Sara M.", r: "Hospital Pharmacist" },
];

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0, transition: { delay: i * 60, duration: 600, ease: [0.22, 1, 0.36, 1] } },
  visible: { opacity: 1, y: 0, transition: { delay: i * 60, duration: 600, ease: [0.22, 1, 0.36, 1] } }
});
</script>

<template>
  <div id="react-landing-root" class="relative min-h-screen overflow-x-clip bg-background text-foreground" dir="ltr">
    <Navbar />

    <!-- Top announcement strip -->
    <div class="relative z-40 mt-0 hidden bg-primary/95 py-2 text-xs text-primary-foreground md:block">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6">
        <div class="flex items-center gap-6">
          <span>Online pharmacy education worldwide</span>
          <span class="text-primary-foreground/60">•</span>
          <span>Pharmacist community</span>
        </div>
        <div class="flex items-center gap-4 text-primary-foreground/80">
          <span>Free starter materials available</span>
        </div>
      </div>
    </div>

    <!-- HERO -->
    <section class="relative pt-24 pb-20 md:pt-28 md:pb-28">
      <div class="absolute inset-0 grid-soft" />
      <div class="absolute -left-32 top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div class="absolute right-0 top-40 h-80 w-80 rounded-full bg-[oklch(0.78_0.16_55/0.12)] blur-3xl" />

      <div class="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div v-motion :initial="fadeUp().initial" :enter="fadeUp().enter">
          <div
            v-motion
            :initial="fadeUp(0).initial" :enter="fadeUp(0).enter"
            class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"
          >
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" style="animation: pulse-ring 1.6s cubic-bezier(0,0,0.2,1) infinite;" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Learning platform for healthcare professionals
          </div>

          <h1
            v-motion
            :initial="fadeUp(1).initial" :enter="fadeUp(1).enter"
            class="mt-6 text-balance text-5xl font-bold leading-[1.05] text-primary md:text-6xl lg:text-7xl"
          >
            The platform that turns pharmacists into{" "}
            <span class="relative inline-block">
              <span class="text-gradient">licensed experts.</span>
              <svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path
                  d="M2 8 C 80 2, 220 2, 298 8"
                  stroke="oklch(0.78 0.16 175)"
                  stroke-width="3"
                  stroke-linecap="round"
                  v-motion
                  :initial="{ strokeDasharray: '300', strokeDashoffset: '300' }"
                  :enter="{ strokeDashoffset: '0', transition: { duration: 1400, delay: 600 } }"
                />
              </svg>
            </span>
          </h1>

          <p v-motion :initial="fadeUp(2).initial" :enter="fadeUp(2).enter" class="mt-6 max-w-xl text-lg text-muted-foreground">
            Prometrica Academy delivers strategic learning paths, realistic exams, and complete
            professional development — built so pharmacists pass Prometric exams and excel in
            competitive job markets.
          </p>

          <div v-motion :initial="fadeUp(3).initial" :enter="fadeUp(3).enter" class="mt-8 flex flex-wrap gap-3">
            <a href="#contact" class="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110">
              Register & Get Gifts
              <ArrowRight class="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a href="#programs" class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold text-primary transition hover:border-accent">
              Explore Programs
            </a>
          </div>

          <div v-motion :initial="fadeUp(4).initial" :enter="fadeUp(4).enter" class="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <div v-for="t in ['Globally aligned', '98% pass rate', 'Live mentorship']" :key="t" class="flex items-center gap-2">
              <CheckCircle2 class="h-4 w-4 text-accent" /> {{ t }}
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <HeroVisual />
        </div>
      </div>
    </section>

    <!-- MARQUEE / TRUST -->
    <section class="relative overflow-hidden border-y border-border bg-card/60 py-5">
      <div class="flex w-max animate-marquee gap-16 whitespace-nowrap text-sm font-medium text-muted-foreground">
        <div v-for="k in 2" :key="k" class="flex items-center gap-16">
          <span v-for="t in ['DHA', 'MOH', 'HAAD / DOH', 'SCFHS', 'QCHP', 'NHRA', 'OMSB', 'Prometric']" :key="t" class="flex items-center gap-3">
            <span class="h-1.5 w-1.5 rounded-full bg-accent" /> {{ t }}
          </span>
        </div>
      </div>
    </section>

    <!-- WHY ROW -->
    <section id="why" class="relative py-24">
      <div class="mx-auto max-w-7xl px-6">
        <div v-motion :initial="fadeUp().initial" :visible-once="fadeUp().visible" class="mb-12 max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Why Prometrica</p>
          <h2 class="mt-3 text-4xl font-bold text-primary md:text-5xl">
            Built for pharmacists who want to <span class="text-gradient">win the exam.</span>
          </h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(w, i) in why"
            :key="w.title"
            v-motion
            :initial="fadeUp(i).initial"
            :visible-once="fadeUp(i).visible"
            class="group relative rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-card)]"
          >
            <div class="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-accent-foreground">
              <component :is="w.icon" class="h-5 w-5" />
            </div>
            <h3 class="text-base font-semibold text-primary">{{ w.title }}</h3>
            <p class="mt-2 text-sm text-muted-foreground">{{ w.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT band -->
    <section id="about" class="relative py-10">
      <div class="mx-auto max-w-5xl px-6 text-center">
        <h2 v-motion :initial="{ opacity: 0, y: 20 }" :visible-once="{ opacity: 1, y: 0 }" class="text-3xl font-bold text-primary md:text-5xl">
          Educational webinars and courses for{" "}
          <span class="text-gradient">pharmacists and doctors.</span>
        </h2>
        <p v-motion :initial="{ opacity: 0 }" :visible-once="{ opacity: 1, transition: { delay: 200 } }" class="mx-auto mt-5 max-w-2xl text-muted-foreground">
          Stay at the edge of healthcare with our specialist webinars. Build deep understanding,
          present your expertise, and grow your professional reach.
        </p>
        <a href="#programs" class="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:bg-accent hover:text-accent-foreground">
          Learn more <ArrowRight class="h-4 w-4" />
        </a>
      </div>
    </section>

    <!-- PROGRAMS -->
    <section id="programs" class="relative py-24">
      <div class="mx-auto max-w-7xl px-6">
        <div class="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Core Solutions</p>
            <h2 class="mt-3 text-4xl font-bold text-primary md:text-5xl">Our academic programs</h2>
          </div>
          <p class="max-w-md text-muted-foreground">
            Six interlocking programs that take you from foundation to licensure to a flourishing career.
          </p>
        </div>
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(p, i) in programs"
            :key="p.title"
            v-motion
            :initial="fadeUp(i).initial"
            :visible-once="fadeUp(i).visible"
            class="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-card)]"
          >
            <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/25" />
            <div class="relative">
              <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground transition group-hover:bg-accent group-hover:text-accent-foreground">
                <component :is="p.icon" class="h-5 w-5" />
              </div>
              <h3 class="mt-5 text-xl font-semibold text-primary">{{ p.title }}</h3>
              <p class="mt-2 text-sm text-muted-foreground">{{ p.text }}</p>
              <div class="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-accent">
                Learn more <ArrowRight class="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- COURSES -->
    <section id="courses" class="relative bg-secondary/50 py-24">
      <div class="mx-auto max-w-7xl px-6">
        <div class="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Live Courses</p>
            <h2 class="mt-3 text-4xl font-bold text-primary md:text-5xl">Courses</h2>
          </div>
          <a href="#contact" class="text-sm font-semibold text-accent hover:text-primary">
            View all →
          </a>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <div
            v-for="(c, i) in courses"
            :key="c.title"
            v-motion
            :initial="fadeUp(i).initial"
            :visible-once="fadeUp(i).visible"
            class="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:border-accent"
          >
            <div class="flex items-start justify-between gap-6">
              <div class="flex items-start gap-6">
                <div class="text-center">
                  <div class="text-3xl font-bold leading-none text-primary">{{ c.date.d }}</div>
                  <div class="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{{ c.date.m }}</div>
                </div>
                <div class="h-12 w-px bg-border" />
                <div>
                  <div class="text-xs font-medium uppercase tracking-wider text-muted-foreground">{{ c.day }}</div>
                  <h3 class="mt-1 text-lg font-semibold text-primary">{{ c.title }}</h3>
                  <p class="text-sm text-muted-foreground">{{ c.subtitle }}</p>
                </div>
              </div>
              <span class="rounded-full bg-accent/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">{{ c.tag }}</span>
            </div>
            <div class="mt-6 flex items-center justify-between border-t border-border pt-5">
              <div class="text-2xl font-bold text-accent">${{ c.price }}</div>
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen class="h-4 w-4" /> {{ c.classes }} classes
              </div>
              <a href="#contact" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-accent">
                More details <ArrowRight class="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        <div class="mt-10 flex justify-center">
          <button class="rounded-full border border-border bg-card px-7 py-3 text-sm font-semibold text-primary transition hover:border-accent hover:text-accent">
            Load more
          </button>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="relative py-24">
      <div class="mx-auto max-w-7xl px-6">
        <div class="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-primary-foreground md:px-14">
          <div class="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          <div class="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-[oklch(0.78_0.16_55/0.35)] blur-3xl" />
          <div class="relative grid gap-10 text-center md:grid-cols-4 md:text-left">
            <div v-for="s in [
              { v: 10, s: '+', l: 'Years of Experience' },
              { v: 5000, s: '+', l: 'Certified Pharmacists' },
              { v: 98, s: '%', l: 'Exam Pass Rate' },
              { v: 24, s: '/7', l: 'Academic Support' },
            ]" :key="s.l">
              <div class="text-5xl font-bold md:text-6xl">
                <span class="bg-gradient-to-r from-accent to-[oklch(0.78_0.16_55)] bg-clip-text text-transparent">
                  <Counter :to="s.v" :suffix="s.s" />
                </span>
              </div>
              <p class="mt-2 text-sm text-primary-foreground/70">{{ s.l }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY CHOOSE -->
    <section id="speakers" class="relative py-24">
      <div class="mx-auto max-w-7xl px-6">
        <div class="mb-12 max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Confidence</p>
          <h2 class="mt-3 text-4xl font-bold text-primary md:text-5xl">
            Why do elite pharmacists <span class="text-gradient">trust us?</span>
          </h2>
        </div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(w, i) in whyCards"
            :key="w.title"
            v-motion
            :initial="fadeUp(i).initial"
            :visible-once="fadeUp(i).visible"
            class="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-card)]"
          >
            <div class="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
              <component :is="w.icon" class="h-5 w-5" />
            </div>
            <h3 class="text-base font-semibold text-primary">{{ w.title }}</h3>
            <p class="mt-2 text-sm text-muted-foreground">{{ w.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PROCESS -->
    <section id="process" class="relative bg-secondary/50 py-24">
      <div class="mx-auto max-w-7xl px-6">
        <div class="mb-14 max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-accent">The Journey</p>
          <h2 class="mt-3 text-4xl font-bold text-primary md:text-5xl">
            Your steps toward <span class="text-gradient">professional certification.</span>
          </h2>
        </div>
        <div class="relative">
          <div class="absolute left-1/2 top-0 hidden h-full w-px bg-gradient-to-b from-accent via-accent/60 to-transparent md:block" />
          <div class="space-y-6">
            <div
              v-for="(s, i) in steps"
              :key="s.n"
              v-motion
              :initial="{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }"
              :visible-once="{ opacity: 1, x: 0 }"
              :class="['flex flex-col gap-4 md:items-center md:flex-row', i % 2 === 1 ? 'md:flex-row-reverse' : '']"
            >
              <div class="md:w-1/2">
                <div :class="['rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] max-w-md', i % 2 === 1 ? 'md:ml-auto' : '']">
                  <div class="text-xs font-bold uppercase tracking-wider text-accent">Step {{ s.n }}</div>
                  <h3 class="mt-1 text-xl font-semibold text-primary">{{ s.title }}</h3>
                  <p class="mt-2 text-sm text-muted-foreground">{{ s.text }}</p>
                </div>
              </div>
              <div class="relative hidden h-5 w-5 shrink-0 items-center justify-center md:flex">
                <div class="h-3 w-3 rounded-full bg-accent shadow-[0_0_0_6px_oklch(0.78_0.16_175/0.2)]" />
              </div>
              <div class="md:w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="relative py-24">
      <div class="mx-auto max-w-7xl px-6">
        <div class="mb-12 max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Voices</p>
          <h2 class="mt-3 text-4xl font-bold text-primary md:text-5xl">Trusted by pharmacists worldwide.</h2>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          <figure
            v-for="(t, i) in testimonials"
            :key="i"
            v-motion
            :initial="fadeUp(i).initial"
            :visible-once="fadeUp(i).visible"
            class="relative rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]"
          >
            <div class="flex gap-0.5 text-accent">
              <Star v-for="k in 5" :key="k" class="h-4 w-4 fill-current" />
            </div>
            <blockquote class="mt-4 text-sm leading-relaxed text-primary/90">
              "{{ t.q }}"
            </blockquote>
            <figcaption class="mt-6 border-t border-border pt-4">
              <div class="text-sm font-semibold text-primary">{{ t.a }}</div>
              <div class="text-xs text-muted-foreground">{{ t.r }}</div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="relative pb-12 pt-12">
      <div class="mx-auto max-w-6xl px-6">
        <div class="relative overflow-hidden rounded-[2rem] border border-border bg-card px-8 py-16 text-center shadow-[var(--shadow-card)] md:px-16">
          <div class="absolute -left-20 top-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          <div class="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[oklch(0.78_0.16_55/0.12)] blur-3xl" />
          <Calendar class="mx-auto h-10 w-10 text-accent" />
          <h2 class="mt-6 text-4xl font-bold text-primary md:text-5xl">
            Build your pharmacy career <span class="text-gradient">with confidence.</span>
          </h2>
          <p class="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Begin your journey with Prometrica Academy to secure your professional license,
            sharpen your clinical knowledge, and excel in healthcare.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#contact" class="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110">
              Start Your Journey <ArrowRight class="h-4 w-4" />
            </a>
            <a href="#contact" class="inline-flex items-center gap-2 rounded-full border border-border bg-background px-7 py-3.5 text-sm font-semibold text-primary transition hover:border-accent">
              Contact Advisor
            </a>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>
