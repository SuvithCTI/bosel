import { useState } from "react";

import apj from "../assets/programs/apj.jpg";
import district from "../assets/programs/districtlevel.jpg";
import global from "../assets/programs/globallevel.jpg";
import national from "../assets/programs/nationallevel.jpg";
import state from "../assets/programs/statelevel.jpg";
import achievement from "../assets/programs/achievement.jpg";
import championships1 from "../assets/programs/champ1.jpg";
import championships2 from "../assets/programs/champ2.jpg";
import championships3 from "../assets/programs/champ3.jpg"

import annualday1 from "../assets/programs/annualday1.jpg";
import annualday2 from "../assets/programs/annualday2.jpg";

import hardwork from "../assets/programs/hardwork.jpg";
import excellence from "../assets/programs/excellence.jpg";

import student1 from "../assets/programs/student1.jpg";
import student2 from "../assets/programs/student2.jpg";
import student3 from "../assets/programs/student3.jpg";
import student4 from "../assets/programs/student4.jpg";
import student5 from "../assets/programs/student5.jpg";
import student6 from "../assets/programs/student6.jpg";



const competitions = [
  {
    level: "GLOBAL LEVEL",
    title: "Thej International Abacus Competition",
    description:
      "Our academy and school students participated in this global-level online competition and received 1st, 2nd, 3rd and Merit Awards.",
    image: global,
    number: "01",
  },
  {
    level: "NATIONAL LEVEL",
    title: "Redeemer Academy National Abacus Competition",
    description:
      "Our students participated at the national level and achieved top positions and Merit Awards.",
    image: national,
    number: "02",
  },
  {
    level: "DISTRICT LEVEL",
    title: "G Max Arasi Abacus District Level Competition",
    description:
      "Our students secured 1st, 2nd and 3rd places, along with Merit Awards, demonstrating their speed, accuracy and mental arithmetic skills.",
    image: district,
    number: "03",
  },
  {
    level: "STATE LEVEL",
    title: "G Max Arasi Abacus State Level Competition",
    description:
      "Five schools and 180 students participated in the competition, providing students with a platform to demonstrate their speed, accuracy and mental arithmetic skills.",
    image: state,
    number: "04",
  },
  {
    level: "SPECIAL RECOGNITION",
    title: "APJ Abdul Kalam Awards",
    description:
      "Our students received APJ Abdul Kalam Awards in recognition of their achievements and participation in academic and extracurricular activities.",
    image: apj,
    number: "05",
  },
];





const studentAchievements = [
  {
    id: 1,
    name: "Ram",
    school: "Sacred Heart Nursery & Primary School",
    achievement: "International Level Abacus Competition",
    level: "International",
    award: "International Achievement Award",
    description:
      "Recognized for exceptional mental arithmetic skills, accuracy, and concentration.",
    photo: student1,
    year: "2026",
  },
  {
    id: 2,
    name: "Rani",
    school: "RC Middle School",
    achievement: "National Level Abacus Competition",
    level: "National",
    award: "National Excellence Award",
    description:
      "Demonstrated outstanding calculation speed and problem-solving abilities.",
    photo: student2,
    year: "2026",
  },
  {
    id: 3,
    name: "Raji",
    school: "Amaravathi Matriculation School",
    achievement: "State Level Abacus Competition",
    level: "State",
    award: "State Level Achievement Award",
    description:
      "Showcased excellent numerical skills and dedication during the competition.",
    photo: student3,
    year: "2026",
  },
  // {
  //   id: 4,
  //   name: "Shayam",
  //   school: "Muslims Committee School",
  //   achievement: "District Level Abacus Competition",
  //   level: "District",
  //   award: "District Champion",
  //   description:
  //     "Achieved recognition for accuracy, speed, and consistent practice.",
  //   photo: student4,
  //   year: "2026",
  // },
  // {
  //   id: 5,
  //   name: "Sivani",
  //   school: "St. Maries Nursery and Primary School",
  //   achievement: "National Level Skills Championship",
  //   level: "National",
  //   award: "Student Excellence Award",
  //   description:
  //     "Recognized for dedication, confidence, and impressive learning achievements.",
  //   photo: student5,
  //   year: "2026",
  // },
  // {
  //   id: 6,
  //   name: "Ranjitha",
  //   school: "Sacred Heart Nursery & Primary School",
  //   achievement: "District Level Abacus Competition",
  //   level: "District",
  //   award: "Outstanding Performer",
  //   description:
  //     "Demonstrated strong concentration and enthusiasm for mental mathematics.",
  //   photo: student6,
  //   year: "2026",
  // },
];



const championships = [
  {
    title: "B★SEL Grand Skill Championship",
    description:
      "Sacred Heart Nursery & Primary School.",
    students: "170+ Students",
      image:
      championships1,
    tag: "GRAND CHAMPIONSHIP",
  },
  {
    title: "B★SEL Abacus Skill Championship",
    description:
      "RC Middle School - Uthumalai",
    students: "420+ Students",
    image:
      championships2,
    tag: "STUDENT EXCELLENCE",
  },

  {
    title: "B★SEL Abacus Skill Competition",
    description:
      "Muslims Committee School - Veeranam",
    students: "120+ Students",
    image:
      championships3,
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

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-600">
      <span className="h-px w-7 bg-amber-500" />
      {children}
    </span>
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

        {/* Right Image - First on Mobile */}
        <div className="relative mx-auto order-first w-full max-w-lg lg:order-none lg:col-start-2 lg:row-start-1 lg:max-w-none">
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

        {/* Left Content - After Image on Mobile */}
        <div className="lg:col-start-1 lg:row-start-1">
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
            </a>

            <a
              href="#schools"
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-amber-400 bg-amber-400 px-7 py-4 text-sm font-extrabold text-blue-950 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-amber-300 sm:w-auto sm:text-base"
            >
              Participating Schools
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-300 via-amber-500 to-transparent" />
    </section>
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

        <div className="mt-5 grid grid-cols-3 gap-2.5 sm:mt-7 sm:gap-4 lg:mt-9 lg:grid-cols-3 lg:gap-6">
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
      <div className="mx-auto max-w-2xl text-center pt-5">
          <SectionLabel className="pt-5">Our Competition Reach</SectionLabel>

          <h5 className="mt-3 sm:mt-4 text-2xl font-white leading-tight text-white sm:text-3xl lg:text-4xl">
            700+ Students || 5 Schools || Abacus & Mental Maths
          </h5>

          
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

         
        </div>
      </div>
    </section>
  );
}



function StudentAchievers() {
  const levelStyles = {
    International: "bg-purple-100 text-purple-800",
    National: "bg-blue-100 text-blue-800",
    State: "bg-amber-100 text-amber-800",
    District: "bg-slate-100 text-slate-800",
  };

  return (
    <section
      id="student-achievers"
      className="bg-[#F8F7F3] py-8 sm:py-10 lg:py-16"
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Our Young Achievers</SectionLabel>

          <h2 className="mt-3 text-2xl font-black leading-tight text-blue-950 sm:mt-4 sm:text-4xl lg:text-5xl">
            Celebrating Student
            <span className="block text-amber-600">
              Excellence & Success
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-xs leading-5 text-slate-600 sm:mt-4 sm:text-base sm:leading-8">
            Meet our talented students who have demonstrated dedication,
            confidence, and outstanding skills in district, state, national,
            and international competitions.
          </p>
        </div>

        {/* Student Cards: 2 columns on mobile */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-3 lg:gap-8">
          {studentAchievements.map((student) => (
            <article
              key={student.id}
              className="group min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl sm:rounded-2xl lg:rounded-3xl"
            >
              {/* Student Photo */}
              <div className="relative h-32 overflow-hidden min-[400px]:h-40 sm:h-60 lg:h-72">
                <img
                  src={student.photo}
                  alt={`Photo of ${ student.name } `}
                  className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/85 via-blue-950/10 to-transparent" />

                {/* Competition Level */}
                <span
                  className={`absolute left - 1.5 top - 1.5 max - w - [calc(100 % -12px)] rounded - full px - 1.5 py - 1 text - [7px] font - extrabold uppercase leading - tight tracking - wide sm: left - 3 sm: top - 3 sm: px - 2.5 sm: py - 1.5 sm: text - [10px] lg: left - 4 lg: top - 4 lg: px - 3 lg: py - 2 lg: text - xs ${
  levelStyles[student.level] ||
    "bg-white text-blue-950"
} `}
                >
                  {student.level} Level
                </span>

                {/* Year */}
                <span className="absolute bottom-2 right-2 rounded-full border border-white/30 bg-blue-950/80 px-1.5 py-1 text-[8px] font-bold text-white backdrop-blur-sm sm:bottom-3 sm:right-3 sm:px-2.5 sm:text-xs lg:bottom-4 lg:right-4">
                  {student.year}
                </span>

                {/* Student Name */}
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
                  <p className="text-[7px] font-bold uppercase tracking-wide text-amber-300 sm:text-[10px] sm:tracking-wider">
                    Student Achiever
                  </p>

                  <h3 className="mt-0.5 break-words text-xs font-black leading-4 text-white min-[400px]:text-sm sm:mt-1 sm:text-xl sm:leading-tight lg:text-2xl">
                    {student.name}
                  </h3>
                </div>
              </div>

              {/* Achievement Details */}
              <div className="p-2.5 sm:p-4 lg:p-6">
                <p className="text-[8px] font-extrabold uppercase tracking-wide text-amber-600 sm:text-[10px] sm:tracking-wider lg:text-xs">
                  Achievement
                </p>

                <h4 className="mt-1 break-words text-xs font-extrabold leading-4 text-blue-950 sm:mt-2 sm:text-base sm:leading-5 lg:text-lg lg:leading-6">
                  {student.achievement}
                </h4>

                {/* Award */}
                <div className="mt-2 rounded-lg bg-[#F8F7F3] p-2 sm:mt-4 sm:rounded-xl sm:p-3">
                  <p className="text-[8px] font-bold uppercase leading-3 tracking-wide text-slate-500 sm:text-[10px] lg:text-xs">
                    Award / Recognition
                  </p>

                  <p className="mt-1 break-words text-[10px] font-bold leading-4 text-blue-900 sm:text-sm sm:leading-5">
                    {student.award}
                  </p>
                </div>

                {/* Description */}
                <p className="mt-2 break-words text-[10px] leading-4 text-slate-600 sm:mt-4 sm:text-sm sm:leading-6">
                  {student.description}
                </p>

                {/* School */}
                <div className="mt-3 border-t border-slate-100 pt-2.5 sm:mt-5 sm:pt-4">
                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-500 sm:text-[10px] lg:text-xs">
                    School
                  </p>

                  <p className="mt-1 break-words text-[10px] font-semibold leading-4 text-blue-950 sm:text-sm sm:leading-6">
                    {student.school}
                  </p>
                </div>

                {/* Bottom Accent */}
                <div className="mt-3 h-1 w-8 rounded-full bg-amber-400 transition-all duration-300 group-hover:w-14 sm:mt-5 sm:w-12 sm:group-hover:w-24" />
              </div>
            </article>
          ))}
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
        <AchievementIntro />
        <Competitions />
        <Championships />
        <StudentAchievers />
        <ParticipatingSchools />
        <AnnualDay />
      </main>

    </div>
  );
}