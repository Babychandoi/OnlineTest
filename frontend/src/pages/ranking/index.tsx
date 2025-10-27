import React, { useState, useEffect } from 'react';
import { Trophy, Users, Clock, Calendar, BookOpen, Award, Medal, ChevronLeft, Search } from 'lucide-react';
import { getTop10Competitions,getResultsByCompetition } from '../../services/service';
export interface CompetitionRes {
  id: string;
  title: string;
  description: string;
  startTime: string;
  duration: number;
  type: string;
  subjectName: string;
  gradeName: string;
  registerStudent: number;
}

export interface ResultRes {
  studentName: string;
  score: number;
  totalQuestions: number;
  totalQuestionsCorrect: number;
  totalScore: number;
}

interface StudentRanking extends ResultRes {
  rank: number;
  accuracy: number;
}

const CompetitionLeaderboard: React.FC = () => {
  const [competitions, setCompetitions] = useState<CompetitionRes[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<CompetitionRes | null>(null);
  const [rankings, setRankings] = useState<StudentRanking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);

  // Fetch top 10 competitions
  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const response = await getTop10Competitions();
      
      setCompetitions(response.data);
    } catch (error) {
      console.error('Error fetching competitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRankings = async (competitionId: string) => {
    setLoading(true);
    try {
        const response = await getResultsByCompetition(competitionId);
      
      // Sort by score and add rank and accuracy
      const rankedResults: StudentRanking[] = response.data
        .sort((a, b) => b.score - a.score)
        .map((result, index) => ({
          ...result,
          rank: index + 1,
          accuracy: (result.totalQuestionsCorrect / result.totalQuestions) * 100
        }));
      
      setRankings(rankedResults);
      setShowAllResults(false);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompetitionClick = (competition: CompetitionRes) => {
    setSelectedCompetition(competition);
    fetchRankings(competition.id);
  };

  const handleBackToList = () => {
    setSelectedCompetition(null);
    setRankings([]);
    setSearchTerm('');
    setShowAllResults(false);
  };

  const filteredRankings = rankings.filter(ranking =>
    ranking.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: <Trophy className="h-6 w-6" />, color: "text-yellow-500", bg: "bg-yellow-50" };
    if (rank === 2) return { icon: <Medal className="h-6 w-6" />, color: "text-gray-400", bg: "bg-gray-50" };
    if (rank === 3) return { icon: <Medal className="h-6 w-6" />, color: "text-orange-600", bg: "bg-orange-50" };
    return { icon: <Award className="h-5 w-5" />, color: "text-gray-500", bg: "bg-gray-50" };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedCompetition) {
    const top10 = rankings.slice(0, 10);
    const displayRankings = showAllResults ? filteredRankings : top10;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button & Competition Header */}
          <div className="mb-6">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-4 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Quay lại danh sách cuộc thi
            </button>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCompetition.title}</h1>
                  <p className="text-gray-600 mb-4">{selectedCompetition.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(selectedCompetition.startTime)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedCompetition.duration} phút
                    </div>
                    <div className="flex items-center text-gray-600">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {selectedCompetition.subjectName}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {selectedCompetition.registerStudent} thí sinh
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {selectedCompetition.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Podium Display for Top 10 */}
          {!showAllResults && rankings.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🏆 Top 10 Học Sinh Xuất Sắc 🏆
              </h2>
              
              {/* Top 3 Podium */}
              <div className="flex items-end justify-center gap-4 mb-8 max-w-4xl mx-auto">
                {/* Rank 2 */}
                {top10[1] && (
                  <div className="flex-1 flex flex-col items-center">
                    <div className="bg-gradient-to-br from-gray-200 to-gray-400 rounded-full w-20 h-20 flex items-center justify-center mb-3 shadow-lg ring-4 ring-gray-300">
                      <span className="text-3xl">🥈</span>
                    </div>
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-3xl p-6 w-full text-center shadow-xl border-4 border-gray-300" style={{ height: '180px' }}>
                      <div className="text-4xl font-bold text-gray-700 mb-2">2</div>
                      <div className="font-bold text-gray-900 mb-2 text-lg">{top10[1].studentName}</div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">{top10[1].score.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">{top10[1].totalQuestionsCorrect}/{top10[1].totalQuestions} câu</div>
                    </div>
                  </div>
                )}

                {/* Rank 1 */}
                {top10[0] && (
                  <div className="flex-1 flex flex-col items-center">
                    <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full w-24 h-24 flex items-center justify-center mb-3 shadow-2xl ring-4 ring-yellow-400 animate-pulse">
                      <span className="text-4xl">👑</span>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-t-3xl p-6 w-full text-center shadow-2xl border-4 border-yellow-400" style={{ height: '220px' }}>
                      <div className="text-5xl font-bold text-yellow-700 mb-2">1</div>
                      <div className="font-bold text-gray-900 mb-2 text-xl">{top10[0].studentName}</div>
                      <div className="text-3xl font-bold text-yellow-700 mb-1">{top10[0].score.toFixed(1)}</div>
                      <div className="text-sm text-gray-700">{top10[0].totalQuestionsCorrect}/{top10[0].totalQuestions} câu</div>
                    </div>
                  </div>
                )}

                {/* Rank 3 */}
                {top10[2] && (
                  <div className="flex-1 flex flex-col items-center">
                    <div className="bg-gradient-to-br from-orange-300 to-orange-500 rounded-full w-20 h-20 flex items-center justify-center mb-3 shadow-lg ring-4 ring-orange-400">
                      <span className="text-3xl">🥉</span>
                    </div>
                    <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-t-3xl p-6 w-full text-center shadow-xl border-4 border-orange-300" style={{ height: '160px' }}>
                      <div className="text-4xl font-bold text-orange-700 mb-2">3</div>
                      <div className="font-bold text-gray-900 mb-2 text-lg">{top10[2].studentName}</div>
                      <div className="text-2xl font-bold text-orange-700 mb-1">{top10[2].score.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">{top10[2].totalQuestionsCorrect}/{top10[2].totalQuestions} câu</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ranks 4-10 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {top10.slice(3).map((student) => (
                  <div
                    key={student.rank}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all border-2 border-gray-200 hover:border-blue-300"
                  >
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg mr-3">
                        {student.rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-sm">{student.studentName}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Điểm:</span>
                        <span className="font-bold text-blue-600">{student.score.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Đúng:</span>
                        <span className="text-sm font-semibold">{student.totalQuestionsCorrect}/{student.totalQuestions}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${student.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              {rankings.length > 10 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowAllResults(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Xem chi tiết toàn bộ {rankings.length} học sinh
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Full Results Table */}
          {showAllResults && (
            <>
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên học sinh..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Back to Top 10 Button */}
              <div className="mb-6">
                <button
                  onClick={() => {
                    setShowAllResults(false);
                    setSearchTerm('');
                  }}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Quay lại Top 10
                </button>
              </div>

              {/* Rankings Table */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Hạng</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Học sinh</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Điểm số</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Câu đúng</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Độ chính xác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {displayRankings.map((student) => {
                        const badge = getRankBadge(student.rank);
                        return (
                          <tr 
                            key={student.rank}
                            className={`hover:bg-gray-50 transition-colors ${
                              student.rank <= 3 ? 'bg-gradient-to-r from-yellow-50/30 to-transparent' : ''
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${badge.bg}`}>
                                <span className={`${badge.color} font-bold`}>
                                  {student.rank <= 3 ? badge.icon : `#${student.rank}`}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-semibold mr-3">
                                  {student.studentName.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">{student.studentName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                                {student.score.toFixed(1)}/{student.totalScore}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center text-gray-700 font-semibold">
                              {student.totalQuestionsCorrect}/{student.totalQuestions}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${student.accuracy}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                  {student.accuracy.toFixed(0)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4 shadow-lg">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bảng Xếp Hạng</h1>
          <p className="text-gray-600 text-lg">Top 10 cuộc thi gần đây nhất</p>
        </div>

        {/* Competitions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitions.map((competition) => (
              <div
                key={competition.id}
                onClick={() => handleCompetitionClick(competition)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {competition.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{competition.description}</p>
                  </div>
                  <span className="ml-4 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {competition.type}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    {formatDate(competition.startTime)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    Thời gian: {competition.duration} phút
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
                    {competition.subjectName} - {competition.gradeName}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 mr-2 text-orange-600" />
                    <span className="font-semibold">{competition.registerStudent}</span>
                    <span className="text-sm ml-1">thí sinh</span>
                  </div>
                  <div className="text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Xem BXH →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionLeaderboard;