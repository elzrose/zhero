import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { storageService } from '../../services/storageService';

const CLASS_OPTIONS = [
  '10th Standard (High School)',
  '11th Standard (+1)',
  '12th Standard (+2)',
  'Undergraduate (1st / 2nd Year)',
  'Undergraduate (Final Year)',
  'Postgraduate / Masters',
  'Other / Working Professional'
];

const COURSE_OPTIONS = [
  'Computer Science & Engineering',
  'Science (Physics, Chemistry, Math - PCM)',
  'Science (Physics, Chem, Biology - PCB)',
  'Commerce with Mathematics',
  'Commerce with Computer / IP',
  'Humanities & Social Sciences',
  'Mechanical / Electrical Engineering',
  'Business Administration (BBA/BCom)',
  'Design, Media & Communication',
  'Other / Self-Taught'
];

const INTEREST_CHIPS = [
  'Building web & mobile apps',
  'Visual UI/UX design & sketching',
  'Analyzing numbers & finding patterns',
  'Solving difficult logical puzzles',
  'Organizing events & team leadership',
  'Robotics & hardware prototyping',
  'Psychology & understanding people',
  'Creative writing & digital storytelling'
];

export function Stage1ClassAndInterests({ onProceed }) {
  const saved = storageService.getStage1Context() || {};

  const [classGrade, setClassGrade] = useState(saved.classGrade || '12th Standard (+2)');
  const [courseStream, setCourseStream] = useState(saved.courseStream || 'Computer Science & Engineering');
  const [customCourse, setCustomCourse] = useState(saved.customCourse || '');
  const [descriptiveInterests, setDescriptiveInterests] = useState(
    saved.descriptiveInterests ||
    'I love building digital projects and seeing ideas come to life. In my free time, I enjoy experimenting with technology, designing clean user interfaces, and solving logical problems that require creative thinking.'
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
    <div style={{ maxWidth: '840px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Introduction Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 10px rgba(23, 23, 23, 0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '999px',
            backgroundColor: '#FFE5CE',
            color: '#FE6904',
          }}>
            Stage 1 of 6
          </span>
          <span style={{ fontSize: '0.8rem', color: '#77736F' }}>Student Intake</span>
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#171717', margin: '0 0 8px 0' }}>
          Tell Us About Your Academic Path & Passions
        </h2>
        <p style={{ fontSize: '0.925rem', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
          Before taking the AI MCQ assessment, help us understand what class you're in, your current course, and what genuinely excites you in your own words.
        </p>
      </div>

      <form onSubmit={handleContinue}>
        {/* Question 1: What class are you in? */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          padding: '1.75rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(23, 23, 23, 0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#FFE5CE',
              color: '#FE6904',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#171717' }}>
                1. What class / education level are you currently studying?
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#77736F' }}>
                Select your current grade or collegiate level
              </p>
            </div>
          </div>

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
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #FE6904' : '1px solid #EAE7E2',
                    backgroundColor: isSelected ? '#FFF8F4' : '#F8F8F7',
                    color: isSelected ? '#FE6904' : '#171717',
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

        {/* Question 2: What course are you doing? */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          padding: '1.75rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(23, 23, 23, 0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#FFE5CE',
              color: '#FE6904',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#171717' }}>
                2. What course, stream, or major are you enrolled in?
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#77736F' }}>
                Choose your academic stream or specify custom subjects
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '10px',
            marginBottom: '1rem',
          }}>
            {COURSE_OPTIONS.map((course) => {
              const isSelected = courseStream === course;
              return (
                <div
                  key={course}
                  onClick={() => setCourseStream(course)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #FE6904' : '1px solid #EAE7E2',
                    backgroundColor: isSelected ? '#FFF8F4' : '#F8F8F7',
                    color: isSelected ? '#FE6904' : '#171717',
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
              placeholder="Specify your course or self-directed study focus..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid #FE6904',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          )}
        </div>

        {/* Question 3: Descriptive Interests */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #EAE7E2',
          padding: '1.75rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(23, 23, 23, 0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#FFE5CE',
              color: '#FE6904',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#171717' }}>
                3. In your own words, what are your genuine interests and passions?
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#77736F' }}>
                Describe what activities, projects, or topics make you lose track of time
              </p>
            </div>
          </div>

          <textarea
            rows={4}
            value={descriptiveInterests}
            onChange={(e) => setDescriptiveInterests(e.target.value)}
            placeholder="e.g. I love designing clean interfaces, coding small games, and reading about emerging AI tools. I also enjoy mentoring classmates..."
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1.5px solid #EAE7E2',
              fontSize: '0.925rem',
              color: '#171717',
              outline: 'none',
              lineHeight: '1.6',
              backgroundColor: '#F8F8F7',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#FE6904')}
            onBlur={(e) => (e.target.style.borderColor = '#EAE7E2')}
          />

          {/* Quick topic suggestion chips */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#77736F', marginBottom: '6px' }}>
              Quick Suggestions (Click to append):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {INTEREST_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAE7E2',
                    padding: '4px 10px',
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

        {/* Submit & Go to Stage 2 Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
              padding: '14px 28px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: !descriptiveInterests.trim() ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(254, 105, 4, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>Proceed to AI Assessment (MCQ)</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
