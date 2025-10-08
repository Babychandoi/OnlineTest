import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'flowbite-react';
import { GraduationCap, BookOpen, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { GradeWithSubjects } from '../../../../types/exam';
import { listSubjectsOfGrades } from '../../../../services/service';

const GradesSubjects: React.FC = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState<GradeWithSubjects[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    const response = await listSubjectsOfGrades();
    setGrades(response.data);
    setLoading(false);
  };

  const toggleGrade = (gradeId: string) => {
    setSelectedGrade(selectedGrade === gradeId ? null : gradeId);
  };

  const getTotalExams = (grade: GradeWithSubjects) => {
    return grade.subjects.reduce((sum, subject) => sum + subject.totalExams, 0);
  };

  const handleSubjectClick = (
    gradeId: string,
    gradeName: string,
    subjectId: string,
    subjectName: string
  ) => {
    // Navigate với query params và state
    navigate(`/exams?subjectId=${subjectId}&gradeId=${gradeId}`, {
      state: {
        subjectName,
        gradeName
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Kho Đề Thi Theo Lớp
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Chọn lớp để xem các môn học và đề thi
          </p>
        </div>

        {/* Grades Accordion */}
        <div className="space-y-4">
          {grades.map((grade) => (
            <div key={grade.id} className="overflow-hidden">
              {/* Grade Card - Clickable */}
              <Card
                className="cursor-pointer hover:shadow-xl transition-all duration-300 group"
                onClick={() => toggleGrade(grade.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg group-hover:scale-110 transition-transform">
                      <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {grade.name}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {grade.subjects.length} môn học • {getTotalExams(grade)} đề thi
                      </p>
                    </div>
                  </div>
                  <div className={`transform transition-transform duration-300 ${selectedGrade === grade.id ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-6 w-6 text-gray-400 group-hover:text-indigo-600" />
                  </div>
                </div>
              </Card>

              {/* Subjects Grid - Collapsible */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  selectedGrade === grade.id
                    ? 'max-h-[2000px] opacity-100 mt-4'
                    : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-0 md:pl-4">
                  {grade.subjects.map((subject) => (
                    <Card
                      key={subject.id}
                      className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-l-4 border-l-indigo-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubjectClick(grade.id, grade.name, subject.id, subject.name);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-lg group-hover:scale-110 transition-transform">
                            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                              {subject.name}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <FileText className="h-4 w-4" />
                              <span>{subject.totalExams} đề thi</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Độ phổ biến</span>
                          <span>{Math.min(100, subject.totalExams * 2)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(100, subject.totalExams * 2)}%` }}
                          ></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Footer */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {grades.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Khối lớp</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {grades.reduce((acc, grade) => acc + grade.subjects.length, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Môn học</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900 dark:to-pink-800">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              {grades.reduce((acc, grade) => acc + grade.subjects.reduce((sum, s) => sum + s.totalExams, 0), 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tổng đề thi</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GradesSubjects;