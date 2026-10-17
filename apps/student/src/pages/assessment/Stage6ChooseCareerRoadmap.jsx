import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { CAREERS_DATA } from '../../data/careersData';

export function Stage6ChooseCareerRoadmap({ onFinalChoiceConfirmed, onBackToStage5 }) {
  const preliminary = storageService.getStage3Preliminary() || {};
  const mentorReview = storageService.getStage4MentorReview() || {};

  const availableCareers = preliminary?.careers && preliminary.careers.length > 0
    ? preliminary.careers.slice(0, 5)
    : CAREERS_DATA.slice(0, 5);

  const [selectedCareerId, setSelectedCareerId] = useState(
    availableCareers[0]?.id || 'full-stack-engineer'
  );

  const selectedCareer = availableCareers.find((c) => c.id === selectedCareerId) || availableCareers[0];
  const matchedCd = CAREERS_DATA.find((cd) => 
    cd.id === selectedCareerId || 
    (selectedCareer?.title && cd.title.toLowerCase() === selectedCareer.title.toLowerCase())
  );

  const chosenCareer = {
    ...(matchedCd || CAREERS_DATA[0]),
    ...(selectedCareer || {}),
    id: selectedCareer?.id || matchedCd?.id || 'career-choice',
    title: selectedCareer?.title || matchedCd?.title || 'Selected Career',
  };

  const handleConfirmCareer = () => {
    storageService.updateCareerGoal(chosenCareer.title);
    const roadmap = storageService.setRoadmapForCareer(chosenCareer.id);

    const finalReport = {
      primaryCareer: chosenCareer.title,
      careerId: chosenCareer.id,
      roadmap,
      mentorName: mentorReview.mentorName || 'Career Counsellor',
      confirmedAt: new Date().toISOString(),
    };

    storageService.saveStage5Final(finalReport);
    onFinalChoiceConfirmed(finalReport);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#171717', margin: '0 0 0.5rem 0' }}>
          Select career
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#77736F', margin: 0 }}>
          Choose your target career direction to build your roadmap.
        </p>
      </div>

      {/* Career options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
        {availableCareers.map((c) => {
          const isSelected = selectedCareerId === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCareerId(c.id)}
              style={{
                backgroundColor: isSelected ? '#FFE5CE' : '#FFFFFF',
                borderRadius: '12px',
                border: isSelected ? '1px solid #FE6904' : '1px solid #EAE7E2',
                padding: '1rem 1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#171717', marginBottom: '2px' }}>
                  {c.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#77736F' }}>
                  {c.category}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {c.matchScore && (
                  <span className="badge" style={{
                    backgroundColor: isSelected ? '#FFFFFF' : '#F8F8F7',
                    color: isSelected ? '#FE6904' : '#171717',
                    border: '1px solid #EAE7E2',
                  }}>
                    {c.matchScore}% match
                  </span>
                )}
                <span style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: isSelected ? '5px solid #FE6904' : '1px solid #EAE7E2',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1.25rem',
        borderTop: '1px solid #EAE7E2',
      }}>
        <button
          type="button"
          onClick={onBackToStage5}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          type="button"
          onClick={handleConfirmCareer}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px', borderRadius: '8px' }}
        >
          <span>Select career</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
