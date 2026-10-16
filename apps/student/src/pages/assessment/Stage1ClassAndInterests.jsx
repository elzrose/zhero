import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { storageService } from '../../services/storageService';

const CLASS_OPTIONS = [
  '10th Standard (High School)',
  '11th Standard (+1)',
  '12th Standard (+2)',
  'Undergraduate (1st / 2nd Year)',
  'Undergraduate (Final Year)',
  'Postgraduate / Masters',
  'Other'
];

const COURSE_OPTIONS = [
  'Computer Science & Engineering',
  'Science (PCM - Physics, Chemistry, Math)',
  'Science (PCB - Physics, Chem, Biology)',
  'Commerce with Mathematics',
  'Commerce with Informatics / Computer',
  'Humanities & Social Sciences',
  'Mechanical / Civil / Electrical Engg',
  'Business Administration (BBA/BCom)',
  'Design & Digital Media',
  'Other / Self-Taught'
];

const QUICK_INTERESTS = [
  'Web & App Development',
  'UI/UX & Visual Design',
  'Data Analytics & Math',
  'Solving Logic Puzzles',
  'Organizing Events & Teams',
  'Robotics & Hardware',
  'Psychology & Human Behavior'
];

export function Stage1ClassAndInterests({ onProceed }) {
  const saved = storageService.getStage1Context() || {};

  const [classGrade, setClassGrade] = useState(saved.classGrade || '12th Standard (+2)');
  const [courseStream, setCourseStream] = useState(saved.courseStream || 'Computer Science & Engineering');
  const [customCourse, setCustomCourse] = useState(saved.customCourse || '');
  const [descriptiveInterests, setDescriptiveInterests] = useState(
    saved.descriptiveInterests ||
    'I love building digital projects and seeing ideas come to life. In my free time, I enjoy experimenting with technology, designing clean user interfaces, and solving logical problems.'
  );

  const handleChipClick = (chip) => {
    if (descriptiveInterests.includes(chip)) return;
    setDescriptiveInterests((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}, ${chip.toLowerCase()}` : chip;
    });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const finalCourse = courseStream === 'Other / Self-Taught' && customCourse.trim()
      ? customCourse.trim()
      : courseStream;

    const data = {
      classGrade,
      courseStream: finalCourse,
      descriptiveInterests: descriptiveInterests.trim(),
      updatedAt: new Date().toISOString(),
    };

    storageService.saveStage1Context(data);
    onProceed(data);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Spacious Clean Header */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#171717',
          letterSpacing: '-0.02em',
          margin: '0 0 0.5rem 0',
        }}>
          Let's Start with Your Background
        </h2>
        <p style={{ fontSize: '1rem', color: '#77736F', margin: 0, maxWidth: '540px', marginInline: 'auto', lineHeight: '1.6' }}>
          Tell us what class you are in, your current course, and what genuinely excites you. Our AI evaluates your answers in the next step.
        </p>
      </div>

      <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Input 1: Class / Grade */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          padding: '2rem',
          boxShadow: '0 2px 12px rgba(23, 23, 23, 0.02)',
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '1rem',
            fontWeight: 800,
            color: '#171717',
            marginBottom: '1rem',
          }}>
            <GraduationCap size={18} color="#FE6904" />
            <span>1. What class or academic level are you in?</span>
          </label>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '10px',
          }}>
            {CLASS_OPTIONS.map((item) => {
              const isSelected = classGrade === item;
              return (
                <div
                  key={item}
                  onClick={() => setClassGrade(item)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #FE6904' : '1px solid #EAE7E2',
                    backgroundColor: isSelected ? '#FFF8F4' : '#FBFBFA',
                    color: isSelected ? '#FE6904' : '#374151',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{item}</span>
                  {isSelected && <CheckCircle2 size={16} color="#FE6904" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Input 2: Course / Stream */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          padding: '2rem',
          boxShadow: '0 2px 12px rgba(23, 23, 23, 0.02)',
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '1rem',
            fontWeight: 800,
            color: '#171717',
            marginBottom: '1rem',
          }}>
            <BookOpen size={18} color="#FE6904" />
            <span>2. What course or stream are you currently studying?</span>
          </label>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '10px',
            marginBottom: courseStream === 'Other / Self-Taught' ? '1rem' : 0,
          }}>
            {COURSE_OPTIONS.map((course) => {
              const isSelected = courseStream === course;
              return (
                <div
                  key={course}
                  onClick={() => setCourseStream(course)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #FE6904' : '1px solid #EAE7E2',
                    backgroundColor: isSelected ? '#FFF8F4' : '#FBFBFA',
                    color: isSelected ? '#FE6904' : '#374151',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{course}</span>
                  {isSelected && <CheckCircle2 size={16} color="#FE6904" />}
                </div>
              );
            })}
          </div>

          {courseStream === 'Other / Self-Taught' && (
            <input
              type="text"
              value={customCourse}
              onChange={(e) => setCustomCourse(e.target.value)}
              placeholder="Specify your stream or self-directed coursework..."
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1.5px solid #FE6904',
                fontSize: '0.9rem',
                outline: 'none',
                marginTop: '8px',
              }}
            />
          )}
        </div>

        {/* Input 3: Descriptive Interests */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          padding: '2rem',
          boxShadow: '0 2px 12px rgba(23, 23, 23, 0.02)',
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '1rem',
            fontWeight: 800,
            color: '#171717',
            marginBottom: '0.5rem',
          }}>
            <Sparkles size={18} color="#FE6904" />
            <span>3. In your own words, what are your genuine interests?</span>
          </label>
          <p style={{ fontSize: '0.85rem', color: '#77736F', margin: '0 0 1rem 0' }}>
            Write freely about projects you loved, topics you enjoy reading or creating, or things you want to build.
          </p>

          <textarea
            rows={4}
            value={descriptiveInterests}
            onChange={(e) => setDescriptiveInterests(e.target.value)}
            placeholder="Type your interests in your own words..."
            required
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: '14px',
              border: '1.5px solid #EAE7E2',
              fontSize: '0.95rem',
              color: '#171717',
              outline: 'none',
              lineHeight: '1.6',
              backgroundColor: '#FBFBFA',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#FE6904')}
            onBlur={(e) => (e.target.style.borderColor = '#EAE7E2')}
          />

          {/* Quick topic tags */}
          <div style={{ marginTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#77736F', marginRight: '8px' }}>
              Suggestions:
            </span>
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {QUICK_INTERESTS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAE7E2',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    color: '#4B5563',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.borderColor = '#FE6904')}
                  onMouseLeave={(e) => (e.target.style.borderColor = '#EAE7E2')}
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            type="submit"
            disabled={!descriptiveInterests.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: !descriptiveInterests.trim() ? '#EAE7E2' : '#FE6904',
              color: '#FFFFFF',
              border: 'none',
              padding: '14px 36px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: !descriptiveInterests.trim() ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(254, 105, 4, 0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>Start AI MCQ Assessment</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
