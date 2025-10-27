import SubjectCard, { Subject } from "./SubjectCard";

const SubjectsSelectionSection: React.FC = () => {
  const subjects: Subject[] = [
    {
      id: 'math',
      name: 'Toán',
      emoji: '🧮',
      color: 'bg-blue-500',
      description: 'Đề 50 câu trắc nghiệm, thời gian 90 phút; trọng tâm lớp 12 (hàm số, mũ–log, nguyên hàm–tích phân, hình OXYZ). Câu vận dụng cao 8–10%.',

    },
    {
      id: 'physics',
      name: 'Vật lý',
      emoji: '⚡',
      color: 'bg-green-500',
      description: 'Đề 40 câu/50 phút; chủ đạo lớp 12 (dao động, sóng, điện xoay chiều, quang lý). Một số câu liên hệ kiến thức lớp 11 ở mức cơ bản.',

    },
    {
      id: 'chemistry',
      name: 'Hóa học',
      emoji: '🧪',
      color: 'bg-red-500',
      description: 'Đề 40 câu; khoảng 70% lớp 12 (este, amin, peptit, điện phân, kim loại), 20% lớp 11, 10% lớp 10. Tính toán hoá học ~40–45%.',

    },
    {
      id: 'literature',
      name: 'Ngữ văn',
      emoji: '📚',
      color: 'bg-purple-500',
      description: 'Gồm Đọc hiểu và Làm văn: nghị luận xã hội (khoảng 200 chữ) và nghị luận văn học. Trọng tâm chương trình ngữ văn THPT, nhấn lớp 12.',

    },
    {
      id: 'english',
      name: 'Tiếng Anh',
      emoji: '🌍',
      color: 'bg-yellow-500',
      description: 'Đề 50 câu/60 phút; gồm ngữ âm, từ vựng–ngữ pháp, chức năng giao tiếp, đọc hiểu, điền từ và tìm lỗi sai. Tỷ lệ đọc hiểu tăng nhẹ.',

    },
    {
      id: 'biology',
      name: 'Sinh học',
      emoji: '🧬',
      color: 'bg-emerald-500',
      description: 'Đề 40 câu; trọng tâm Di truyền–Tiến hoá–Sinh thái (lớp 12). Kỹ năng đọc biểu đồ, xử lý số liệu, bài toán di truyền nhiều bước.',
    },
    {
      id: 'history',
      name: 'Lịch sử',
      emoji: '📜',
      color: 'bg-orange-500',
      description: 'Đề 40 câu; Việt Nam 1919–2000 và Lịch sử thế giới hiện đại. Yêu cầu nhận biết mốc thời gian, so sánh sự kiện, khai thác lược đồ–tư liệu.',
    },
    {
      id: 'geography',
      name: 'Địa lý',
      emoji: '🌏',
      color: 'bg-cyan-500',
      description: 'Đề 40 câu; khai thác Atlat Địa lý Việt Nam, biểu đồ–bảng số liệu; chuyên đề kinh tế–xã hội, vùng kinh tế, thiên nhiên và tài nguyên.',
    },
    {
      id: 'civic-education',
      name: 'GDCD',
      emoji: '⚖️',
      color: 'bg-indigo-500',
      description: 'Đề 40 câu; pháp luật và đời sống, công dân với pháp luật, kinh tế–chính trị–xã hội. Nhiều tình huống vận dụng vào thực tiễn.',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Các môn học phổ biến
        </h2>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
};

export default SubjectsSelectionSection;