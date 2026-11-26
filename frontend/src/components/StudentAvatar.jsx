import React, { useState } from 'react';
import { getStudentPhotoUrl, SAMPLE_STUDENT_PHOTOS } from '../utils/studentDataHelpers';

export default function StudentAvatar({
  student,
  index = 0,
  className = 'w-9 h-9',
  onClick,
  title
}) {
  const [triedFallback, setTriedFallback] = useState(false);
  const samplePhoto = SAMPLE_STUDENT_PHOTOS[Math.abs(index) % SAMPLE_STUDENT_PHOTOS.length];
  const customPhoto = getStudentPhotoUrl(student, index);
  const photoUrl = triedFallback ? samplePhoto : (customPhoto || samplePhoto);

  const name = (student?.studentName || student?.name || 'Student').trim();
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || name.charAt(0).toUpperCase() || 'S';

  const colorPalettes = [
    'bg-sky-100 text-sky-800 border-sky-300',
    'bg-indigo-100 text-indigo-800 border-indigo-300',
    'bg-emerald-100 text-emerald-800 border-emerald-300',
    'bg-amber-100 text-amber-800 border-amber-300',
    'bg-purple-100 text-purple-800 border-purple-300',
    'bg-rose-100 text-rose-800 border-rose-300',
    'bg-teal-100 text-teal-800 border-teal-300'
  ];
  const colorClass = colorPalettes[Math.abs(index) % colorPalettes.length];

  return (
    <div
      onClick={onClick}
      className={`relative ${className} rounded-lg overflow-hidden border shadow-2xs shrink-0 select-none cursor-pointer hover:border-sky-500 hover:scale-105 transition flex items-center justify-center ${colorClass}`}
      title={title || `View Admission Form for ${name}`}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt=""
          className="w-full h-full object-cover object-top"
          onError={() => {
            if (!triedFallback) {
              setTriedFallback(true);
            }
          }}
          loading="lazy"
        />
      ) : (
        <span className="font-black text-xs tracking-tight">{initials}</span>
      )}
    </div>
  );
}
