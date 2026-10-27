import { useState } from "react";


import apj from "../assets/programs/apj.jpg";
import district from "../assets/programs/districtlevel.jpg";
import global from "../assets/programs/globallevel.jpg";
import national from "../assets/programs/nationallevel.jpg";
import state from "../assets/programs/statelevel.jpg";
import achievement from "../assets/programs/achievement.jpg";
import championships1 from "../assets/programs/champ1.jpg";
import championships2 from "../assets/programs/champ2.jpg";

import annualday1 from "../assets/programs/annualday1.jpg";
import annualday2 from "../assets/programs/annualday2.jpg";

import hardwork from "../assets/programs/hardwork.jpg";
import excellence from "../assets/programs/excellence.jpg";


const competitions = [
  {
    level: "GLOBAL LEVEL",
    title: "Competition",
    description:
      "Celebrating students who demonstrate exceptional skills, confidence, and dedication at the global level.",
    image: global,
    number: "01",
  },
  {
    level: "NATIONAL LEVEL",
    title: "Redeemer Academy National Abacus Competition",
    description:
      "Recognizing students for their outstanding mental arithmetic and abacus calculation abilities.",
    image: national,
    number: "02",
  },
  {
    level: "DISTRICT LEVEL",
    title: "G Max Arasi Abacus District Level Competition",
    description:
      "Showcasing the talent, accuracy, speed, and concentration of our young abacus learners.",
    image: district,
    number: "03",
  },
  {
    level: "STATE LEVEL",
    title: "G Max Arasi Abacus State Level Competition",
    description:
      "Encouraging students to challenge themselves and demonstrate their learning achievements.",
    image: state,
    number: "04",
  },
  {
    level: "SPECIAL RECOGNITION",
    title: "APJ Abdul Kalam Awards",
    description:
      "Honouring student excellence, dedication, and achievements that inspire future generations.",
    image: apj,
    number: "05",
  },
];


const championships = [
  {
    title: "4th Grand Skills Championship",
    description:
      "Sample descriptions of our students showcasing their skills, confidence, and learning achievements.",
    image:
      championships1,
    tag: "GRAND CHAMPIONSHIP",
  },
  {
    title: "B★SEL Grand Skill Championship",
    description:
      "Sacred Heart Nursery & Primary School",
    students: "170+ Students",
    image:
      championships2,
    tag: "STUDENT EXCELLENCE",
  },
];

const schools = [
  {
    name: "RC Middle School",
    location: "Uthumalai",
    number: "01",
  },
  {
    name: "Sacred Heart Nursery & Primary School",
    location: "Panagudi",
    number: "02",
  },
  {
    name: "Amaravathi Matriculation School",
    location: "",
    number: "03",
  },
  {
    name: "Muslims Committee School",
    location: "Veeranam",
    number: "04",
  },
  {
    name: "St. Maries Nursery and Primary School",
    location: "Tuticorin",
    number: "05",
  },
];

const activities = [
  {
    number: "01",
    title: "Prize Distribution",
    description:
      "Celebrating the hard work and accomplishments of our students.",
  },
  {
    number: "02",
    title: "Student Recognition",
    description:
      "Appreciating students who demonstrate outstanding skills and dedication.",
  },
  {
    number: "03",
    title: "Handwriting Activities",
    description:
      "Encouraging neat handwriting, presentation, and attention to detail.",
  },
  {
    number: "04",
    title: "Abacus Activities",
    description:
      "Developing concentration, calculation speed, and numerical confidence.",
  },
  {
    number: "05",
    title: "School-Level Competitions",
    description:
      "Providing opportunities for students to demonstrate their learning.",
  },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "School Programs", href: "/school-programs" },
  { label: "Franchise", href: "/franchise" },
  { label: "Achievements", href: "/achievements" },
  { label: "Support", href: "/support" },
];

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-600">
      <span className="h-px w-7 bg-amber-500" />
      {children}
    </span>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-5 sm:py-4 lg:px-5">
        <a
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="BSEL home"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-950 text-lg font-black text-amber-400 shadow-md">
            B★
          </div>

          <div>
            <p className="text-xl font-black tracking-tight text-blue-950">
              B★SEL
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Learn · Grow · Achieve
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-semibold transition-colors ${link.label === "Achievements"
                ? "text-amber-600"
                : "text-slate-600 hover:text-blue-950"
                }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="/contact"
          className="hidden rounded-full bg-blue-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-500 hover:text-blue-950 lg:inline-flex"
        >
          Get in Touch
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-blue-950 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="text-2xl leading-none">
            {menuOpen ? "×" : "☰"}
          </span>
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-100 bg-white px-5 py-4 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`border-b border-slate-100 py-3 text-sm font-semibold ${link.label === "Achievements"
                  ? "text-amber-600"
                  : "text-slate-700"
                  }`}
              >
                {link.label}
              </a>
            ))}

            <a
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-4 rounded-xl bg-blue-950 px-5 py-3 text-center text-sm font-bold text-white"
            >
              Get in Touch
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return ( 
<section className="relative overflow-hidden bg-white">
  {/* Background */}
  <div className="absolute inset-0">
    <img
      src={achievement}
      alt="Students participating in educational activities"
      className="h-full w-full object-cover opacity-[0.05]"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/80" />
  </div>

  <div className="relative mx-auto grid max-w-[1440px] items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:px-10 lg:py-20">
    {/* Left Content */}
    <div>
    

          
          <h1
            className="max-w-3xl text-5xl font-bold italic leading-[1.05] tracking-tight text-blue-950 sm:text-6xl lg:text-6xl xl:text-7xl"
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              fontStyle: "italic",
            }}
          >
            Every Achievement
            <span className="mt-1 block text-amber-500">
              Tells a story
            </span>
          </h1>
          

      <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-slate-900 sm:text-xl">
        Celebrating the dedication, skills, and accomplishments of our
        students through competitions, championships, and school
        recognition programs.
      </p>

      <p className="mt-5 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
        Empowering school children with fundamental life skills,
        mathematical speed, artistic flair, and cultural discipline
        through structured training and national-level competitions.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:flex-wrap">
        <a
          href="#competitions"
          className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-blue-900 px-7 py-4 text-sm font-extrabold text-white shadow-md transition duration-300 hover:-translate-y-1 hover:bg-blue-950 sm:w-auto sm:text-base"
        >
          Explore Achievements
          <span aria-hidden="true" className="text-amber-400">→</span>
        </a>

        <a
          href="#schools"
          className="inline-flex w-full items-center justify-center rounded-full border-2 border-amber-400 bg-amber-400 px-7 py-4 text-sm font-extrabold text-blue-950 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-amber-300 sm:w-auto sm:text-base"
        >
          Participating Schools
        </a>
      </div>
    </div>

    {/* Right Image */}
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full border-2 border-amber-400/50" />
      <div className="absolute -bottom-4 -left-4 h-28 w-28 rounded-full border-2 border-blue-200" />

      <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-3 shadow-xl">
        <img
          src={achievement}
          alt="Students learning and developing their skills"
          className="h-[280px] w-full rounded-[1.5rem] object-cover sm:h-[380px] lg:h-[440px]"
        />

        
      </div>
    </div>
  </div>

  {/* Bottom Accent */}
  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-300 via-amber-500 to-transparent" />
</section>
  );
}

function Breadcrumb() {
  return (
    <div className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-2 px-3 py-2.5 text-xs sm:px-4 sm:py-3 sm:text-sm lg:px-5">
        <a href="/" className="font-medium text-slate-500 hover:text-blue-950">
          Home
        </a>
        <span className="text-slate-300">/</span>
        <span className="font-bold text-blue-950">Achievements</span>
      </div>
    </div>
  );
}

function AchievementIntro() {
  return (
    <section className="bg-[#F8F7F3] py-8 sm:py-10 lg:py-14">
      <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 sm:gap-10 sm:px-5 lg:grid-cols-2 lg:gap-10 lg:px-5">
        <div>
          <SectionLabel>Our Student Achievements</SectionLabel>

          <h2 className="mt-3 sm:mt-4 text-2xl font-black leading-tight text-blue-950 sm:text-3xl lg:text-4xl">
            Hard Work Today.
            <span className="block text-amber-600">
              Excellence Tomorrow.
            </span>
          </h2>

          <p className="mt-3 sm:mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            At B★SEL, every achievement represents dedication, consistent
            practice, and a willingness to learn. Our students participate in
            educational competitions and recognition programs that encourage
            them to build confidence and demonstrate their abilities.
          </p>

          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-8">
            We celebrate each milestone as an opportunity to inspire students,
            appreciate their efforts, and motivate them to keep improving.
          </p>

          <a
            href="#competitions"
            className="mt-5 sm:mt-7 inline-flex items-center gap-3 font-extrabold text-blue-950 transition hover:text-amber-600"
          >
            Discover Our Competitions
            <span className="text-xl" aria-hidden="true">→</span>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={hardwork}
              alt="Students working together"
              className="h-36 w-full object-cover sm:h-56 lg:h-64"
              loading="lazy"
            />
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl sm:mt-8 sm:rounded-3xl">
            <img
              src={excellence}
              alt="Teacher supporting students"
              className="h-36 w-full object-cover sm:h-56 lg:h-64"
              loading="lazy"
            />
          </div>

          <div className="col-span-2 rounded-3xl bg-blue-950 p-4 sm:p-6 lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              The B★SEL Spirit
            </p>
            <p className="mt-3 text-lg font-bold leading-7 text-white sm:text-xl sm:leading-8">
              Every student has the potential to achieve something remarkable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Competitions() {
  return (
    <section id="competitions" className="bg-white py-8 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-5">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Learning Beyond Classrooms</SectionLabel>

          <h2 className="mt-3 sm:mt-4 text-2xl font-black leading-tight text-blue-950 sm:text-3xl lg:text-4xl">
            Competitions & Recognition
          </h2>

          <p className="mt-3 sm:mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-8">
            Opportunities that encourage students to develop their skills,
            challenge themselves, and celebrate their learning journey.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-7 sm:gap-4 lg:mt-9 lg:grid-cols-3 lg:gap-6">
          {competitions.map((item) => (
            <article
              key={item.number}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-2 hover:border-amber-300 hover:shadow-xl"
            >
              <div className="relative h-28 overflow-hidden sm:h-44 lg:h-52">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent" />

                <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-1 text-[7px] font-black tracking-wide text-blue-950 sm:left-3 sm:top-3 sm:px-2.5 sm:text-[9px] lg:left-4 lg:top-4 lg:px-3 lg:py-2 lg:text-[10px]">
                  {item.level}
                </span>

                <span className="absolute bottom-4 right-5 text-3xl font-black text-white/70 sm:text-4xl">
                  {item.number}
                </span>
              </div>

              <div className="p-2.5 sm:p-4 lg:p-5">
                <h3 className="text-xs font-extrabold leading-4 text-blue-950 sm:text-base sm:leading-5 lg:text-lg lg:leading-6">
                  {item.title}
                </h3>

                <p className="mt-2 text-[10px] leading-4 text-slate-600 sm:mt-3 sm:text-xs sm:leading-5 lg:text-sm lg:leading-6">
                  {item.description}
                </p>

                <div className="mt-4 sm:mt-5 h-1 w-12 rounded-full bg-amber-400 transition-all duration-300 group-hover:w-20" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Championships() {
  return (
    <section className="bg-blue-950 py-8 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-5">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>Celebrating Greatness</SectionLabel>

            <h2 className="mt-3 sm:mt-4 max-w-2xl text-2xl font-black leading-tight text-white sm:text-3xl lg:text-5xl">
              Championships That
              <span className="block text-amber-400">
                Inspire Excellence.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-blue-100 sm:text-base sm:leading-7 lg:leading-8">
            Recognizing students and schools for their commitment to learning,
            participation, and skill development.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-7 sm:gap-4 lg:mt-9 lg:grid-cols-2 lg:gap-6">
          {championships.map((item, index) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white"
            >
              <div className="relative h-28 overflow-hidden sm:h-44 lg:h-64">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent" />

                <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-1 text-[7px] font-black tracking-wide text-blue-950 sm:left-3 sm:top-3 sm:px-2.5 sm:text-[9px] lg:left-5 lg:top-5 lg:px-3 lg:py-2 lg:text-[10px]">
                  {item.tag}
                </span>

                <div className="absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center rounded-lg border border-white/30 bg-blue-950/70 text-xs font-black text-amber-400 backdrop-blur sm:bottom-3 sm:left-3 sm:h-10 sm:w-10 sm:rounded-xl sm:text-base lg:bottom-5 lg:left-5 lg:h-14 lg:w-14 lg:rounded-2xl lg:text-2xl">
                  {index === 0 ? "04" : "★"}
                </div>
              </div>

              <div className="p-2.5 sm:p-4 lg:p-6">
                <h3 className="text-xs font-black leading-4 text-blue-950 sm:text-base sm:leading-5 lg:text-2xl lg:leading-tight">
                  {item.title}
                </h3>

                <p className="mt-2 text-[10px] leading-4 text-slate-600 sm:mt-3 sm:text-xs sm:leading-5 lg:mt-4 lg:text-base lg:leading-7">
                  {item.description}
                </p>

                {item.students && (
                  <div className="mt-4 sm:mt-5 inline-flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3">
                    <span className="text-[9px] font-black text-amber-700 sm:text-xs lg:text-sm">
                      {item.students}
                    </span>
                  </div>
                )}

                <div className="mt-3 border-t border-slate-100 pt-2 sm:mt-4 sm:pt-3 lg:mt-5 lg:pt-4">
                  <span className="text-[9px] font-bold text-blue-950 sm:text-xs lg:text-sm">
                    B★SEL Student Achievements
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ParticipatingSchools() {
  return (
    <section id="schools" className="bg-[#F8F7F3] py-8 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-5">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Our School Community</SectionLabel>

          <h2 className="mt-3 sm:mt-4 text-2xl font-black leading-tight text-blue-950 sm:text-3xl lg:text-4xl">
            Growing Together
          </h2>

          <p className="mt-3 sm:mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-8">
            Celebrating the schools and educational communities involved in
            our learning activities and student recognition programs.
          </p>
        </div>

        <div className="mt-5 sm:mt-7 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 md:mt-12">
          {schools.map((school) => (
            <div
              key={school.number}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition duration-300 hover:border-amber-300 hover:shadow-lg sm:gap-4 sm:rounded-2xl sm:p-5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-950 text-[10px] font-black text-amber-400 transition group-hover:bg-amber-400 group-hover:text-blue-950 sm:h-11 sm:w-11 sm:rounded-xl sm:text-xs lg:h-14 lg:w-14 lg:rounded-2xl lg:text-sm">
                {school.number}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-extrabold leading-5 text-blue-950 sm:text-base sm:leading-6 lg:text-lg">
                  {school.name}
                </h3>

                {school.location && (
                  <p className="mt-2 text-sm text-slate-500">
                    {school.location}
                  </p>
                )}
              </div>

             
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnnualDay() {
  return (
    <section className="bg-white py-8 sm:py-10 lg:py-14">
      <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 sm:gap-10 sm:px-5 lg:grid-cols-2 lg:gap-10 lg:px-5">
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <img
              src={annualday1}
              alt="School celebration"
              className="h-36 w-full rounded-2xl object-cover sm:h-56 sm:rounded-3xl lg:h-64"
              loading="lazy"
            />

            <img
              src={annualday2}
              alt="Students celebrating together"
              className="mt-5 h-36 w-full rounded-2xl object-cover sm:mt-7 sm:h-56 sm:rounded-3xl lg:h-64"
              loading="lazy"
            />

            <div className="col-span-2 rounded-3xl bg-amber-400 p-4 sm:p-6 lg:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-950">
                A Moment to Remember
              </p>
              <p className="mt-3 text-xl font-black leading-tight text-blue-950 sm:text-2xl lg:text-4xl">
                Celebrating every effort, every milestone, and every success.
              </p>
            </div>
          </div>
        </div>

        <div>
          <SectionLabel>Special School Events</SectionLabel>

          <h2 className="mt-3 sm:mt-4 text-2xl font-black leading-tight text-blue-950 sm:text-3xl lg:text-4xl">
            Annual Day & Prize Distribution
          </h2>

          <p className="mt-3 sm:mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Annual Day and Prize Distribution programs provide opportunities
            to recognize students' efforts, celebrate accomplishments, and
            encourage continued learning.
          </p>

          <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-8">
            Through student recognition and school-level activities, we
            encourage confidence, participation, creativity, and a positive
            attitude toward learning.
          </p>

          <div className="mt-5 sm:mt-7 space-y-4">
            {[
              "Recognition of student achievements",
              "Prize distribution and appreciation",
              "Handwriting and abacus activities",
              "School-level learning competitions",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-700">
                  ✓
                </span>

                <p className="font-semibold leading-6 text-slate-700">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <a
            href="/contact"
            className="mt-6 sm:mt-8 inline-flex items-center gap-3 rounded-full bg-blue-950 px-5 py-3 sm:px-7 sm:py-4 text-sm font-bold text-white transition hover:bg-amber-400 hover:text-blue-950"
          >
            Contact B★SEL
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// function Activities() {
//   return (
//     <section className="bg-[#F8F7F3] py-8 sm:py-10 lg:py-14">
//       <div className="mx-auto max-w-[1440px] px-3 sm:px-4 lg:px-5">
//         <div className="mx-auto max-w-2xl text-center">
//           <SectionLabel>Learning in Action</SectionLabel>

//           <h2 className="mt-3 sm:mt-4 text-2xl font-black leading-tight text-blue-950 sm:text-3xl lg:text-4xl">
//             Activities That Build Confidence
//           </h2>

//           <p className="mt-3 sm:mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-8">
//             Learning experiences that support skill development and help
//             students celebrate their progress.
//           </p>
//         </div>

//         <div className="mt-5 sm:mt-7 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-3">
//           {activities.map((activity) => (
//             <article
//               key={activity.number}
//               className="rounded-xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg sm:rounded-2xl sm:p-5 lg:rounded-3xl lg:p-6"
//             >
//               <div className="flex items-center justify-between">
//                 <span className="text-2xl font-black text-amber-500 sm:text-3xl">
//                   {activity.number}
//                 </span>

//                 <span className="h-10 w-10 rounded-full border border-amber-200 bg-amber-50" />
//               </div>

//               <h3 className="mt-4 sm:mt-5 text-lg font-extrabold text-blue-950 sm:text-xl">
//                 {activity.title}
//               </h3>

//               <p className="mt-3 text-sm leading-7 text-slate-600">
//                 {activity.description}
//               </p>
//             </article>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

function ContactCTA() {
  return (
    <section className="bg-white px-3 py-7 sm:px-4 sm:py-10 lg:px-5 lg:py-14">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[2rem] bg-blue-950 px-4 py-6 sm:px-7 sm:py-9 lg:px-10 lg:py-12">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -right-4 -top-8 h-44 w-44 rounded-full border border-amber-400/20" />

        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
              Be Part of Our Journey
            </p>

            <h2 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl lg:text-5xl">
              Every Young Mind Deserves to Shine.
            </h2>

            <p className="mt-4 text-sm leading-6 text-blue-100 sm:mt-3 sm:mt-4 sm:text-base sm:leading-8">
              Connect with B★SEL to learn more about our programs,
              achievements, and educational opportunities.
            </p>
          </div>

          <a
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-xs font-extrabold text-blue-950 transition hover:bg-white sm:gap-3 sm:px-7 sm:py-4 sm:text-sm"
          >
            Get in Touch
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}



export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      <main>
        <Hero />
        {/* <Breadcrumb /> */}
        <AchievementIntro />
        <Competitions />
        <Championships />
        <ParticipatingSchools />
        <AnnualDay />
        {/* <Activities /> */}
        {/* <ContactCTA /> */}
      </main>

    </div>
  );
}