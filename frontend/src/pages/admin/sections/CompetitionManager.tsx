import React, { useState } from 'react';
import CompetitionList from './competition/CompetitionList';
import CompetitionDetailView from './competition/CompetitionDetailView';
import CreateCompetition from './competition/CreateCompetition';
import EditCompetition from './competition/CompetitionEdit';
import { CompetitionResponse } from '../../../types/competition.admin';

type ViewMode = 'list' | 'detail' | 'create' | 'edit';

const CompetitionManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCompetition, setSelectedCompetition] = useState<CompetitionResponse | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Handler: Xem chi tiết cuộc thi (thông tin cơ bản)
  const handleViewDetail = (competition: CompetitionResponse) => {
    setSelectedCompetition(competition);
    // TODO: Navigate to competition general info page
    console.log('View competition general info:', competition);
    // Nếu bạn có trang thông tin chung khác, thêm logic ở đây
  };

  // Handler: Xem danh sách thí sinh đăng ký
  const handleViewRegistrations = (competition: CompetitionResponse) => {
    setSelectedCompetition(competition);
    setViewMode('detail');
  };

  // Handler: Chỉnh sửa cuộc thi
  const handleEdit = (competition: CompetitionResponse) => {
    setSelectedCompetition(competition);
    setViewMode('edit');
    console.log('Edit competition:', competition);
  };

  // Handler: Tạo cuộc thi mới
  const handleCreate = () => {
    setViewMode('create');
    setSelectedCompetition(null);
    console.log('Create new competition');
  };

  // Handler: Quay lại danh sách
  const handleBack = () => {
    setViewMode('list');
    setSelectedCompetition(null);
  };

  // Handler: Tạo cuộc thi thành công
  const handleCreateSuccess = () => {
    setViewMode('list');
    setSelectedCompetition(null);
    // Refresh danh sách bằng cách tăng refreshKey
    setRefreshKey(prev => prev + 1);
  };

  // Handler: Cập nhật cuộc thi thành công
  const handleUpdateSuccess = () => {
    setViewMode('list');
    setSelectedCompetition(null);
    // Refresh danh sách bằng cách tăng refreshKey
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      {viewMode === 'list' && (
        <CompetitionList
          key={refreshKey}
          onViewDetail={handleViewDetail}
          onViewRegistrations={handleViewRegistrations}
          onEdit={handleEdit}
          onCreate={handleCreate}
        />
      )}

      {viewMode === 'detail' && selectedCompetition && (
        <CompetitionDetailView
          competitionId={selectedCompetition.id}
          onBack={handleBack}
        />
      )}

      {viewMode === 'create' && (
        <CreateCompetition 
          onBack={handleBack}
          onSuccess={handleCreateSuccess}
        />
      )}

      {viewMode === 'edit' && selectedCompetition && (
        <EditCompetition
          competition={selectedCompetition}
          onBack={handleBack}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
};

export default CompetitionManagement;