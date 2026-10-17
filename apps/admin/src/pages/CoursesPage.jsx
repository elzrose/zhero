import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { Modal } from '../components/common/Modal';
import { StorageService } from '../services/storageService';
import { AnalyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';
import {
  GraduationCap,
  Building2,
  Users,
  Clock,
  BookOpen,
  Award,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  Download,
  Star,
  Check,
  ShieldCheck,
} from 'lucide-react';

export function CoursesPage() {
  const { addToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProvider, setFilterProvider] = useState('ALL');
  const [filterTrack, setFilterTrack] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal states
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

  // New Course Form state
  const [newCourseForm, setNewCourseForm] = useState({
    title: '',
    providerId: 'INST-01',
    category: 'Software Engineering',
    careerTrack: 'Full Stack Engineer',
    instructorName: '',
    duration: '12 Weeks (240 Hours)',
    fee: '₹18,000',
    seatCapacity: 100,
    level: 'Intermediate',
    description: '',
    module1: 'Foundations & Architecture',
    module2: 'Core Framework Implementation',
    module3: 'Production Deployment & Capstone',
  });

  const loadData = () => {
    setCourses(StorageService.getCourses());
    setInstitutions(StorageService.getInstitutions());
  };

  useEffect(() => {
    loadData();
    const handleStoreChange = () => loadData();
    window.addEventListener('zhero_store_change', handleStoreChange);
    return () => window.removeEventListener('zhero_store_change', handleStoreChange);
  }, []);

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProvider = filterProvider === 'ALL' || c.providerId === filterProvider;
    const matchesTrack = filterTrack === 'ALL' || c.careerTrack === filterTrack;
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;

    return matchesSearch && matchesProvider && matchesTrack && matchesStatus;
  });

  // Providers list for filters
  const uniqueProviders = Array.from(
    new Set(courses.map((c) => JSON.stringify({ id: c.providerId, name: c.providerName })))
  ).map((str) => JSON.parse(str));

  // Toggle course status
  const handleToggleCourseStatus = (course) => {
    const nextStatus = course.status === 'ACTIVE' ? 'PENDING_REVIEW' : 'ACTIVE';
    const updated = StorageService.updateCourseStatus(course.id, nextStatus);
    setCourses(updated);
    addToast(
      `Course "${course.title}" status changed to ${nextStatus === 'ACTIVE' ? 'ACTIVE (Published)' : 'PENDING REVIEW'}`,
      'info'
    );
    if (selectedCourse && selectedCourse.id === course.id) {
      setSelectedCourse({ ...selectedCourse, status: nextStatus });
    }
  };

  // Export to CSV
  const handleExportCourses = () => {
    const exportData = courses.map((c) => ({
      'Course ID': c.id,
      'Course Title': c.title,
      'Offered By (Tuition Centre)': c.providerName,
      'Provider Location': c.providerLocation,
      'Lead Instructor': c.instructorName,
      'Career Track': c.careerTrack,
      'Duration': c.duration,
      'Tuition Fee': c.fee,
      'Enrolled Students': c.enrolledStudents,
      'Seat Capacity': c.seatCapacity,
      'Completion Rate': c.completionRate,
      'Status': c.status,
      'Accreditation': c.accreditation,
    }));
    AnalyticsService.exportToCsv('ZHERO_All_Offered_Courses_and_Providers', exportData);
    addToast('Course offerings directory exported to CSV', 'success');
  };

  // Create new course offering
  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseForm.title || !newCourseForm.instructorName) {
      addToast('Please enter course title and lead instructor name', 'error');
      return;
    }

    const provider = institutions.find((i) => i.id === newCourseForm.providerId) || {
      id: 'INST-01',
      name: 'Apex Career Academy',
      location: 'Kochi, Kerala',
    };

    const newCourse = {
      id: `CRS-0${courses.length + 1}`,
      title: newCourseForm.title,
      slug: newCourseForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      providerId: provider.id,
      providerName: provider.name,
      providerType: 'Tuition Centre',
      providerLocation: provider.location || 'Kerala, India',
      instructorName: newCourseForm.instructorName,
      instructorRole: 'Lead Subject Matter Specialist',
      category: newCourseForm.category,
      careerTrack: newCourseForm.careerTrack,
      level: newCourseForm.level,
      duration: newCourseForm.duration,
      fee: newCourseForm.fee,
      enrolledStudents: 0,
      seatCapacity: Number(newCourseForm.seatCapacity) || 100,
      completionRate: '95.0%',
      verbalExamIncluded: true,
      status: 'ACTIVE',
      rating: 5.0,
      description: newCourseForm.description || `Specialized vocational course curriculum delivered by ${provider.name}.`,
      syllabusModules: [
        newCourseForm.module1,
        newCourseForm.module2,
        newCourseForm.module3,
      ].filter(Boolean),
      accreditation: 'AICTE / Industry Endorsed',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    const updated = [newCourse, ...courses];
    StorageService.saveCourses(updated);
    setCourses(updated);
    setIsAddCourseModalOpen(false);
    addToast(`New course offering "${newCourse.title}" registered under ${provider.name}`, 'success');

    setNewCourseForm({
      title: '',
      providerId: 'INST-01',
      category: 'Software Engineering',
      careerTrack: 'Full Stack Engineer',
      instructorName: '',
      duration: '12 Weeks (240 Hours)',
      fee: '₹18,000',
      seatCapacity: 100,
      level: 'Intermediate',
      description: '',
      module1: 'Foundations & Architecture',
      module2: 'Core Framework Implementation',
      module3: 'Production Deployment & Capstone',
    });
  };

  const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0);
  const totalCapacity = courses.reduce((sum, c) => sum + (c.seatCapacity || 0), 0);
  const activeCount = courses.filter((c) => c.status === 'ACTIVE').length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Course Offerings & Tuition Providers"
        description="Central directory of all courses offered across Zhero, tuition providers, instructors, fees, and enrollment capacity."
        actions={
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Button
              variant="secondary"
              icon={Download}
              onClick={handleExportCourses}
            >
              Export Registry (CSV)
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setIsAddCourseModalOpen(true)}
            >
              Register Course Offering
            </Button>
          </div>
        }
      />

      {/* Provider Governance Architecture Banner */}
      <div
        style={{
          backgroundColor: '#FCEADE',
          border: '1px solid #FAD1C6',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: '#FAD1C6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#DB5E8C',
            flexShrink: 0,
          }}
        >
          <BookOpen size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#171717' }}>
            Course Catalog & Provider Accreditation
          </div>
          <div style={{ fontSize: '0.825rem', color: '#77736D', marginTop: '3px' }}>
            Overview of course curricula, tuition centre providers, syllabus modules, and student seat capacity.
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #FAD1C6',
            padding: '8px 16px',
            borderRadius: '10px',
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: '0.725rem', color: '#77736D', fontWeight: 600 }}>Total Active Courses</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#DB5E8C' }}>
            {activeCount} of {courses.length} Active
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <StatCard
          title="Total Courses Offered"
          value={courses.length.toString()}
          subtitle="Accredited learning tracks"
          icon={GraduationCap}
        />
        <StatCard
          title="Offering Tuition Centres"
          value={uniqueProviders.length.toString()}
          subtitle="Verified academic partners"
          icon={Building2}
          variant="coral"
        />
        <StatCard
          title="Active Course Enrollment"
          value={totalEnrollments.toString()}
          subtitle={`Out of ${totalCapacity} seat capacity`}
          icon={Users}
          variant="orange"
        />
        <StatCard
          title="Avg Course Completion"
          value="87.5%"
          subtitle="With verbal voice exams"
          icon={Award}
        />
      </div>

      {/* Search & Filters */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#77736D',
            }}
          />
          <input
            type="text"
            placeholder="Search course title, offering tuition centre, instructor, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 2.25rem',
              borderRadius: '8px',
              border: '1px solid #FAD1C6',
              fontSize: '0.875rem',
              backgroundColor: '#FFFFFF',
              color: '#171717',
              outline: 'none',
            }}
          />
        </div>

        {/* Provider Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#77736D', fontWeight: 600 }}>Offering Centre:</span>
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #FAD1C6',
              fontSize: '0.8rem',
              backgroundColor: '#FFFFFF',
              color: '#171717',
              fontWeight: 600,
            }}
          >
            <option value="ALL">All Tuition Centres</option>
            {uniqueProviders.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#77736D', fontWeight: 600 }}>Status:</span>
          {['ALL', 'ACTIVE', 'PENDING_REVIEW'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: filterStatus === st ? '1px solid #DB5E8C' : '1px solid #FAD1C6',
                backgroundColor: filterStatus === st ? '#FCEADE' : '#FFFFFF',
                color: filterStatus === st ? '#DB5E8C' : '#77736D',
                cursor: 'pointer',
              }}
            >
              {st === 'ALL' ? 'ALL' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {filteredCourses.map((course) => {
          const occupancyRate = Math.round((course.enrolledStudents / course.seatCapacity) * 100);
          const isActive = course.status === 'ACTIVE';

          return (
            <div
              key={course.id}
              className="admin-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isActive ? '1px solid #FAD1C6' : '1px dashed #F5AFAE',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div>
                {/* Top Badge & Category */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#DB5E8C',
                      backgroundColor: '#FCEADE',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {course.category}
                  </span>
                  <Badge variant={isActive ? 'success' : 'warning'}>
                    {course.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Course Title */}
                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#171717',
                    marginBottom: '0.75rem',
                    lineHeight: '1.3',
                  }}
                >
                  {course.title}
                </h3>

                {/* OFFERING PROVIDER HIGHLIGHT (Key Requirement) */}
                <div
                  style={{
                    backgroundColor: '#FCEADE',
                    border: '1px solid #FAD1C6',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    marginBottom: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <Building2 size={14} color="#DB5E8C" />
                    <span style={{ fontSize: '0.725rem', color: '#77736D', fontWeight: 600 }}>Offered By Tuition Centre:</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#171717' }}>
                    {course.providerName}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#77736D', marginTop: '2px' }}>
                    <span>📍 {course.providerLocation}</span>
                    <span>👨‍🏫 {course.instructorName}</span>
                  </div>
                </div>

                {/* Key Course Metrics */}
                <div style={{ fontSize: '0.775rem', color: '#77736D', marginBottom: '0.85rem', lineHeight: 1.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span>Target Career Track:</span>
                    <strong style={{ color: '#171717' }}>{course.careerTrack}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span>Duration & Level:</span>
                    <span style={{ color: '#171717' }}>{course.duration} • {course.level}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span>Tuition Fee:</span>
                    <strong style={{ color: '#DB5E8C' }}>{course.fee}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Completion Rate:</span>
                    <strong style={{ color: '#171717' }}>{course.completionRate}</strong>
                  </div>
                </div>

                {/* Enrollment Seat Occupancy Bar */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', marginBottom: '4px' }}>
                    <span style={{ color: '#77736D' }}>Student Seat Enrollment:</span>
                    <strong style={{ color: '#171717' }}>
                      {course.enrolledStudents} / {course.seatCapacity} ({occupancyRate}%)
                    </strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#FAD1C6', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, occupancyRate)}%`,
                        height: '100%',
                        backgroundColor: '#DB5E8C',
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>

                {/* Core Syllabus Modules Sample */}
                <div style={{ fontSize: '0.725rem', color: '#77736D' }}>
                  <span style={{ fontWeight: 700, color: '#171717', display: 'block', marginBottom: '4px' }}>
                    Syllabus Modules:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {course.syllabusModules?.slice(0, 2).map((mod, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={11} color="#DB5E8C" />
                        <span>{mod}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '1rem',
                  borderTop: '1px solid #FCEADE',
                  paddingTop: '0.75rem',
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  icon={Eye}
                  onClick={() => {
                    setSelectedCourse(course);
                    setIsDetailModalOpen(true);
                  }}
                  style={{ flex: 1 }}
                >
                  Inspect Syllabus
                </Button>

                <Button
                  variant={isActive ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => handleToggleCourseStatus(course)}
                >
                  {isActive ? 'Suspend' : 'Publish'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: INSPECT COURSE & OFFERING PROVIDER */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedCourse ? `${selectedCourse.title}` : 'Course Syllabus Details'}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {selectedCourse && (
              <Button
                variant="outline"
                onClick={() => {
                  handleToggleCourseStatus(selectedCourse);
                  setIsDetailModalOpen(false);
                }}
              >
                {selectedCourse.status === 'ACTIVE' ? 'Suspend Course' : 'Publish to Students'}
              </Button>
            )}
            <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>
              Close Audit
            </Button>
          </div>
        }
      >
        {selectedCourse && (
          <div>
            {/* Provider Highlight Banner */}
            <div
              style={{
                backgroundColor: '#FCEADE',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #FAD1C6',
                marginBottom: '1rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#77736D', fontWeight: 600 }}>
                Offering Tuition Centre & Academic Partner:
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#DB5E8C', marginTop: '2px' }}>
                {selectedCourse.providerName}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#171717', marginTop: '6px' }}>
                <span>📍 Location: <strong>{selectedCourse.providerLocation}</strong></span>
                <span>👨‍🏫 Lead Faculty: <strong>{selectedCourse.instructorName}</strong></span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#171717', lineHeight: 1.5, marginBottom: '1rem' }}>
              {selectedCourse.description}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '0.825rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <span style={{ color: '#77736D' }}>Target Career Track:</span>
                <div style={{ fontWeight: 700, color: '#171717' }}>{selectedCourse.careerTrack}</div>
              </div>
              <div>
                <span style={{ color: '#77736D' }}>Course Duration:</span>
                <div style={{ fontWeight: 700, color: '#171717' }}>{selectedCourse.duration}</div>
              </div>
              <div>
                <span style={{ color: '#77736D' }}>Tuition Fee:</span>
                <div style={{ fontWeight: 800, color: '#DB5E8C' }}>{selectedCourse.fee}</div>
              </div>
              <div>
                <span style={{ color: '#77736D' }}>Student Seat Quota:</span>
                <div style={{ fontWeight: 700, color: '#171717' }}>
                  {selectedCourse.enrolledStudents} enrolled of {selectedCourse.seatCapacity} seats
                </div>
              </div>
              <div>
                <span style={{ color: '#77736D' }}>Accreditation:</span>
                <div style={{ fontWeight: 600, color: '#171717' }}>{selectedCourse.accreditation}</div>
              </div>
              <div>
                <span style={{ color: '#77736D' }}>Anti-Speedrun AI Voice Exam:</span>
                <div style={{ fontWeight: 700, color: '#DB5E8C' }}>Included (Verbal Post-Module Test)</div>
              </div>
            </div>

            {/* Complete Syllabus Modules */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem' }}>
                Full Curriculum & Modules
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {selectedCourse.syllabusModules?.map((mod, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #FAD1C6',
                      fontSize: '0.8rem',
                    }}
                  >
                    <CheckCircle2 size={15} color="#DB5E8C" />
                    <span style={{ fontWeight: 600, color: '#171717' }}>
                      Module {i + 1}: {mod}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 2: REGISTER NEW COURSE OFFERING */}
      <Modal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        title="Register New Course Offering"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
            <Button variant="secondary" onClick={() => setIsAddCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateCourse}>
              Publish Course Offering
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
              Offering Tuition Centre *
            </label>
            <select
              value={newCourseForm.providerId}
              onChange={(e) => setNewCourseForm({ ...newCourseForm, providerId: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #FAD1C6',
                fontSize: '0.85rem',
                backgroundColor: '#FFFFFF',
              }}
            >
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.location || 'Tuition Centre'})
                </option>
              ))}
            </select>
            <div style={{ fontSize: '0.725rem', color: '#77736D', marginTop: '3px' }}>
              Select which authorized tuition centre is offering and delivering this course.
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
              Course Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Production Go Microservices & Cloud Telemetry"
              value={newCourseForm.title}
              onChange={(e) => setNewCourseForm({ ...newCourseForm, title: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #FAD1C6',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Career Track
              </label>
              <select
                value={newCourseForm.careerTrack}
                onChange={(e) => setNewCourseForm({ ...newCourseForm, careerTrack: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="AI / ML Specialist">AI / ML Specialist</option>
                <option value="UI/UX Product Designer">UI/UX Product Designer</option>
                <option value="Cloud Solutions Architect">Cloud Solutions Architect</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Lead Instructor *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. K. R. Menon"
                value={newCourseForm.instructorName}
                onChange={(e) => setNewCourseForm({ ...newCourseForm, instructorName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Duration
              </label>
              <input
                type="text"
                value={newCourseForm.duration}
                onChange={(e) => setNewCourseForm({ ...newCourseForm, duration: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Tuition Fee
              </label>
              <input
                type="text"
                value={newCourseForm.fee}
                onChange={(e) => setNewCourseForm({ ...newCourseForm, fee: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Seat Quota
              </label>
              <input
                type="number"
                value={newCourseForm.seatCapacity}
                onChange={(e) => setNewCourseForm({ ...newCourseForm, seatCapacity: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
              Syllabus Outline (3 Key Modules)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <input
                type="text"
                placeholder="Module 1: Foundations & Architecture"
                value={newCourseForm.module1}
                onChange={(e) => setNewCourseForm({ ...newCourseForm, module1: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #FAD1C6', fontSize: '0.8rem' }}
              />
              <input
                type="text"
                placeholder="Module 2: Core Engineering Implementation"
                value={newCourseForm.module2}
                onChange={(e) => setNewCourseForm({ ...newCourseForm, module2: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #FAD1C6', fontSize: '0.8rem' }}
              />
              <input
                type="text"
                placeholder="Module 3: Capstone Problem & Deployment"
                value={newCourseForm.module3}
                onChange={(e) => setNewCourseForm({ ...newCourseForm, module3: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #FAD1C6', fontSize: '0.8rem' }}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
