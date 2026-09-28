import React, { useState } from 'react';
import { SchoolProvider } from './context/SchoolContext';
import { Header } from './components/layout/Header';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { OfflineIndicator } from './components/common/OfflineIndicator';

import { DashboardModule } from './components/modules/DashboardModule';
import { EstablishmentModule } from './components/modules/EstablishmentModule';
import { StudentsModule } from './components/modules/StudentsModule';
import { AcademicStructureModule } from './components/modules/AcademicStructureModule';
import { StaffModule } from './components/modules/StaffModule';
import { TimetableModule } from './components/modules/TimetableModule';
import { AttendanceModule } from './components/modules/AttendanceModule';
import { GradesModule } from './components/modules/GradesModule';
import { ReportCardModule } from './components/modules/ReportCardModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { DocumentsModule } from './components/modules/DocumentsModule';
import { UsersModule } from './components/modules/UsersModule';
import { AuditLogModule } from './components/modules/AuditLogModule';
import { BackupRestoreModule } from './components/modules/BackupRestoreModule';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigateToStudent = (studentId: string) => {
    setActiveTab('students');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigateToStudent={handleNavigateToStudent}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <DashboardModule onNavigate={setActiveTab} />}
          {activeTab === 'establishment' && <EstablishmentModule />}
          {activeTab === 'students' && <StudentsModule />}
          {activeTab === 'structure' && <AcademicStructureModule />}
          {activeTab === 'staff' && <StaffModule />}
          {activeTab === 'timetable' && <TimetableModule />}
          {activeTab === 'attendance' && <AttendanceModule />}
          {activeTab === 'grades' && <GradesModule />}
          {activeTab === 'reportcards' && <ReportCardModule />}
          {activeTab === 'finances' && <FinanceModule />}
          {activeTab === 'documents' && <DocumentsModule />}
          {activeTab === 'users' && <UsersModule />}
          {activeTab === 'audit' && <AuditLogModule />}
          {activeTab === 'backup' && <BackupRestoreModule />}
        </main>
      </div>

      {/* Offline Status Badge */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
