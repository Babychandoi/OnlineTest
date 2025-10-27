import {MockData,DateRange,ViewMode} from "../types/statistical.admin"
export const calculateStats = (mockData : MockData, dateRange :DateRange, viewMode :ViewMode) => {
  const filterByDate = (dateStr: string | number | Date): boolean => {
    const date = new Date(dateStr);
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    return date >= start && date <= end;
  };

  const filteredExams = mockData.exams.filter(e => filterByDate(e.createAt));
  const filteredCompetitions = mockData.competitions.filter(c => filterByDate(c.startDate));
  const filteredUsers = mockData.users.filter(u => filterByDate(u.createAt));
  const filteredResults = mockData.results.filter(r => filterByDate(r.submittedAt));
  const filteredUserCompetitions = mockData.userCompetitions.filter(uc => filterByDate(uc.registeredAt));

  const groupByPeriod = (items: Array<Record<string, any>>, dateField: string): { period: string; count: number }[] => {
    const grouped: Record<string, number> = {};
    
    items.forEach(item => {
      const date = new Date(item[dateField]);
      let key: string;
      
      if (viewMode === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (viewMode === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = String(date.getFullYear());
      }
      
      grouped[key] = (grouped[key] || 0) + 1;
    });
    
    return Object.entries(grouped).map(([period, count]) => ({ period, count })).sort((a, b) => a.period.localeCompare(b.period));
  };

  const newStudents = filteredUsers.filter(u => u.role === 'STUDENT').length;
  const newTeachers = filteredUsers.filter(u => u.role === 'TEACHER').length;

  const participated = filteredUserCompetitions.filter(uc => uc.hasParticipated).length;
  const registered = filteredUserCompetitions.filter(uc => !uc.hasParticipated).length;

  const passedCount = filteredUserCompetitions.filter(uc => 
    uc.hasParticipated && uc.result && uc.result.score >= 50
  ).length;
  const failedCount = filteredUserCompetitions.filter(uc => 
    uc.hasParticipated && uc.result && uc.result.score < 50
  ).length;

  return {
    totalExams: filteredExams.length,
    totalCompetitions: filteredCompetitions.length,
    totalUsers: filteredUsers.length,
    newStudents,
    newTeachers,
    examTakers: filteredResults.length,
    competitionStats: {
      participated,
      registered,
      passedCount,
      failedCount
    },
    examsByPeriod: groupByPeriod(filteredExams, 'createAt'),
    competitionsByPeriod: groupByPeriod(filteredCompetitions, 'startDate'),
    usersByPeriod: groupByPeriod(filteredUsers, 'createAt'),
    resultsByPeriod: groupByPeriod(filteredResults, 'submittedAt')
  };
};