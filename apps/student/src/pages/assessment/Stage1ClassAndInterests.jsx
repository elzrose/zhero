import React, { useState } from 'react';
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
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#171717',
          margin: '0 0 0.5rem 0',
        }}>
          Background and interests
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#77736F', margin: 0 }}>
          Select your academic level, current stream, and topics that interest you.
        </p>
      </div>

      <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Level */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #EAE7E2',
          padding: '1.5rem',
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#171717',
            marginBottom: '0.75rem',
          }}>
            Academic level
          </label>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '8px',
          }}>
            {CLASS_OPTIONS.map((item) => {
              const isSelected = classGrade === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setClassGrade(item)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: isSelected ? '1px solid #FE6904' : '1px solid #EAE7E2',
                    backgroundColor: isSelected ? '#FFE5CE' : '#FFFFFF',
                    color: '#171717',
                    fontWeight: isSelected ? 600 : 400,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stream */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #EAE7E2',
          padding: '1.5rem',
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#171717',
            marginBottom: '0.75rem',
          }}>
            Current course or stream
          </label>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '8px',
            marginBottom: courseStream === 'Other / Self-Taught' ? '0.75rem' : 0,
          }}>
            {COURSE_OPTIONS.map((course) => {
              const isSelected = courseStream === course;
              return (
                <button
                  key={course}
                  type="button"
                  onClick={() => setCourseStream(course)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: isSelected ? '1px solid #FE6904' : '1px solid #EAE7E2',
                    backgroundColor: isSelected ? '#FFE5CE' : '#FFFFFF',
                    color: '#171717',
                    fontWeight: isSelected ? 600 : 400,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {course}
                </button>
              );
            })}
          </div>

          {courseStream === 'Other / Self-Taught' && (
            <input
              type="text"
              value={customCourse}
              onChange={(e) => setCustomCourse(e.target.value)}
              placeholder="Specify your stream..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #EAE7E2',
                fontSize: '0.9rem',
                outline: 'none',
                marginTop: '8px',
              }}
            />
          )}
        </div>

        {/* Interests */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #EAE7E2',
          padding: '1.5rem',
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#171717',
            marginBottom: '0.25rem',
          }}>
            Areas of interest
          </label>
          <p style={{ fontSize: '0.8rem', color: '#77736F', margin: '0 0 0.75rem 0' }}>
            Describe subjects, hobbies, or types of problems you enjoy working on.
          </p>

          <textarea
            rows={4}
            value={descriptiveInterests}
            onChange={(e) => setDescriptiveInterests(e.target.value)}
            placeholder="Type your interests..."
            required
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #EAE7E2',
              fontSize: '0.9rem',
              color: '#171717',
              outline: 'none',
              lineHeight: 1.5,
              backgroundColor: '#FFFFFF',
              boxSizing: 'border-box',
            }}
          />

          {/* Quick topic tags */}
          <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {QUICK_INTERESTS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                style={{
                  backgroundColor: '#F8F8F7',
                  border: '1px solid #EAE7E2',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  color: '#171717',
                  cursor: 'pointer',
                }}
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button
            type="submit"
            disabled={!descriptiveInterests.trim()}
            className="btn-primary"
            style={{
              padding: '0.75rem 1.75rem',
              fontSize: '0.9rem',
              fontWeight: 500,
              opacity: !descriptiveInterests.trim() ? 0.5 : 1,
              cursor: !descriptiveInterests.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
