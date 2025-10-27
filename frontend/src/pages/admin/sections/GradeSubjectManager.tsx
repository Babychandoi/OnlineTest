import React, { useEffect, useState } from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';
import { SubjectResponse, SubjectsOfGradeResponse } from '../../../types/subjectforgrade.admin';
import Modal from '../../../components/Modal';
import SubjectCard from './subjects/SubjectCard';
import GradesManagement from './grades/GradesManagement';
import SubjectsManagement from './subjects/SubjectsManagement';
import { toast } from 'react-toastify';
import { assignSubjectToGrade, createGrade, createSubject, deleteGrade, deleteSubject, getSubjectForGrades, removeSubjectFromGrade, updateGrade, updateSubject } from '../../../services/subjectforgrade.admin';
import Swal from 'sweetalert2';

type ModalType = 'addGrade' | 'editGrade' | 'addSubject' | 'editSubject' | 'addSubjectToGrade' | '';

interface FormData {
    id: string;
    name: string;
}

const GradeSubjectManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'grades' | 'subjects'>('grades');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalType>('');
    const [formData, setFormData] = useState<FormData>({ id: '', name: '' });
    const [expandedGrades, setExpandedGrades] = useState<Record<string, boolean>>({});
    const [selectedGradeForAdd, setSelectedGradeForAdd] = useState<string | null>(null);

    // State chính sử dụng SubjectsOfGradeResponse
    const [gradesWithSubjects, setGradesWithSubjects] = useState<SubjectsOfGradeResponse[]>([]);

    // Danh sách tất cả môn học
    const [allSubjects, setAllSubjects] = useState<SubjectResponse[]>([]);

    useEffect(() => {
        const fetchObject = async () => {
            try {
                const response = await getSubjectForGrades();
                setGradesWithSubjects(response.data.subjectsOfGrades);
                setAllSubjects(response.data.subjects);
            } catch (error) {
                toast.error("Lấy dữ liệu không thành công, thử lại sau!")
            }
        };
        fetchObject();
    }, []);

    const openModal = (type: ModalType, data?: SubjectsOfGradeResponse | SubjectResponse | string) => {
        // Chặn việc thêm môn học vào khối lớp mặc định
        if (type === 'addSubjectToGrade' && typeof data === 'string' && data === '1') {
            Swal.fire({
                title: 'Không thể thực hiện',
                text: 'Không thể thêm môn học vào khối lớp mặc định của hệ thống.',
                icon: 'warning',
                confirmButtonText: 'Đã hiểu',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        // Chặn việc chỉnh sửa khối lớp hoặc môn học mặc định
        if (typeof data === 'object' && data && 'id' in data && data.id === '1') {
            if (type === 'editGrade' || type === 'editSubject') {
                Swal.fire({
                    title: 'Không thể thực hiện',
                    text: `Không thể chỉnh sửa ${type === 'editGrade' ? 'khối lớp' : 'môn học'} mặc định của hệ thống.`,
                    icon: 'warning',
                    confirmButtonText: 'Đã hiểu',
                    confirmButtonColor: '#3085d6'
                });
                return;
            }
        }

        setModalType(type);
        if (data) {
            if (type === 'addSubjectToGrade' && typeof data === 'string') {
                setSelectedGradeForAdd(data);
            } else if (typeof data === 'object') {
                setFormData({ id: data.id, name: data.name });
            }
        } else {
            setFormData({ id: '', name: '' });
            setSelectedGradeForAdd(null);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ id: '', name: '' });
        setSelectedGradeForAdd(null);
    };

    const handleSave = async () => {
        try {
            let newGrade: SubjectsOfGradeResponse | null = null;
            let newSubject: SubjectResponse | null = null;

            if (modalType === 'addGrade') {
                const response = await createGrade(formData.name);
                if (response?.data) {
                    newGrade = {
                        id: response.data.id,
                        name: response.data.name,
                        subjects: []
                    };
                    setGradesWithSubjects([...gradesWithSubjects, newGrade]);
                    Swal.fire({
                        icon: 'success',
                        title: 'Thêm khối lớp thành công!',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            }
            else if (modalType === 'editGrade') {
                await updateGrade(formData.id, formData.name);
                setGradesWithSubjects(gradesWithSubjects.map(g =>
                    g.id === formData.id ? { ...g, name: formData.name } : g
                ));
                Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật khối lớp thành công!',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
            else if (modalType === 'addSubject') {
                const response = await createSubject(formData.name);
                if (response?.data) {
                    newSubject = {
                        id: response.data.id,
                        name: response.data.name
                    };
                    setAllSubjects([...allSubjects, newSubject]);
                    Swal.fire({
                        icon: 'success',
                        title: 'Thêm môn học thành công!',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            }
            else if (modalType === 'editSubject') {
                await updateSubject(formData.id, formData.name);

                // Cập nhật trong danh sách môn học
                setAllSubjects(allSubjects.map(s =>
                    s.id === formData.id ? { ...s, name: formData.name } : s
                ));

                // Cập nhật trong từng khối lớp
                setGradesWithSubjects(gradesWithSubjects.map(grade => ({
                    ...grade,
                    subjects: grade.subjects.map(s =>
                        s.id === formData.id ? { ...s, name: formData.name } : s
                    )
                })));

                Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật môn học thành công!',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error in handleSave:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Không thể lưu dữ liệu. Vui lòng thử lại.',
            });
        } finally {
            closeModal();
        }
    };


    const handleAddSubjectToGrade = (subjectId: string) => {
        if (!selectedGradeForAdd) return;

        // 🟡 Kiểm tra môn mặc định
        if (subjectId === '1') {
            Swal.fire({
                title: 'Không thể thực hiện',
                text: 'Đây là môn mặc định không thể thêm vào lớp.',
                icon: 'warning',
                confirmButtonText: 'Đã hiểu',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        const subjectToAdd = allSubjects.find((s) => s.id === subjectId);
        if (!subjectToAdd) return;

        const selectedGrade = gradesWithSubjects.find(
            (g) => g.id === selectedGradeForAdd
        );
        if (!selectedGrade) return;

        // 🟡 Kiểm tra môn đã tồn tại trong lớp chưa
        const exists = selectedGrade.subjects.some((s) => s.id === subjectId);
        if (exists) {
            Swal.fire({
                title: 'Đã tồn tại',
                text: 'Môn học này đã có trong lớp.',
                icon: 'info',
                confirmButtonText: 'Đã hiểu',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        // ✅ Hộp thoại xác nhận
        Swal.fire({
            title: 'Xác nhận thêm môn học?',
            text: `Bạn có chắc muốn thêm môn "${subjectToAdd.name}" vào lớp "${selectedGrade.name}" không?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then(async (result) => {
            if (result.isConfirmed) {
                // 🟢 Hiển thị loading
                Swal.fire({
                    title: 'Đang thêm...',
                    text: 'Vui lòng chờ trong giây lát.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                try {
                    // 🔥 Gọi API backend
                    await assignSubjectToGrade(subjectId, selectedGradeForAdd);

                    // 🧩 Cập nhật state
                    setGradesWithSubjects((prev) =>
                        prev.map((grade) =>
                            grade.id === selectedGradeForAdd
                                ? { ...grade, subjects: [...grade.subjects, subjectToAdd] }
                                : grade
                        )
                    );

                    // ✅ Thông báo thành công
                    Swal.fire({
                        title: 'Thành công',
                        text: `Đã thêm môn "${subjectToAdd.name}" vào lớp "${selectedGrade.name}".`,
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                    });

                    closeModal();
                } catch (error: any) {
                    // ❌ Thông báo lỗi
                    Swal.fire({
                        title: 'Lỗi',
                        text:
                            error?.response?.data?.message ||
                            'Không thể thêm môn học. Vui lòng thử lại!',
                        icon: 'error',
                        confirmButtonText: 'Đóng',
                        confirmButtonColor: '#d33',
                    });
                }
            }
        });
    };



    const handleRemoveSubjectFromGrade = async (gradeId: string, subjectId: string) => {
        // 🟡 Chặn xóa môn khỏi lớp mặc định
        if (gradeId === '1') {
            Swal.fire({
                title: 'Không thể thực hiện',
                text: 'Không thể xóa môn học khỏi khối lớp mặc định của hệ thống.',
                icon: 'warning',
                confirmButtonText: 'Đã hiểu',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        // 🟠 Hộp thoại xác nhận
        const result = await Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa môn học này khỏi khối lớp?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            // 🔵 Hiển thị loading trong khi xử lý
            Swal.fire({
                title: 'Đang xóa...',
                text: 'Vui lòng chờ trong giây lát.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            try {
                // ✅ Gọi API backend
                await removeSubjectFromGrade(subjectId, gradeId);

                // 🧩 Cập nhật state an toàn
                setGradesWithSubjects((prev) =>
                    prev.map((grade) =>
                        grade.id === gradeId
                            ? {
                                ...grade,
                                subjects: grade.subjects.filter((s) => s.id !== subjectId),
                            }
                            : grade
                    )
                );

                // ✅ Thông báo thành công
                Swal.fire({
                    title: 'Đã xóa!',
                    text: 'Môn học đã được xóa khỏi khối lớp.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } catch (error: any) {
                // ❌ Thông báo lỗi từ server (nếu có)
                Swal.fire({
                    title: 'Lỗi',
                    text:
                        error?.response?.data?.message ||
                        'Không thể xóa môn học. Vui lòng thử lại!',
                    icon: 'error',
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#d33',
                });
            }
        }
    };


    const handleDeleteGrade = async (gradeId: string) => {
        // 🚫 Không cho xóa khối mặc định
        if (gradeId === '1') {
            Swal.fire({
                title: 'Không thể thực hiện',
                text: 'Không thể xóa khối lớp mặc định của hệ thống.',
                icon: 'error',
                confirmButtonText: 'Đã hiểu',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc chắn muốn xóa khối lớp này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (!result.isConfirmed) return;

        try {
            await deleteGrade(gradeId);
            setGradesWithSubjects(gradesWithSubjects.filter(g => g.id !== gradeId));

            Swal.fire({
                title: 'Đã xóa!',
                text: 'Khối lớp đã được xóa thành công.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Lỗi khi xóa khối lớp:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: 'Không thể xóa khối lớp này. Có thể nó đang được sử dụng ở nơi khác.',
                icon: 'error',
                confirmButtonText: 'Đã hiểu'
            });
        }
    };


    const handleDeleteSubject = async (subjectId: string) => {
        // 🚫 Không cho xóa môn mặc định
        if (subjectId === '1') {
            Swal.fire({
                title: 'Không thể thực hiện',
                text: 'Không thể xóa môn học mặc định của hệ thống.',
                icon: 'error',
                confirmButtonText: 'Đã hiểu',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Xác nhận xóa',
            html: 'Xóa môn học sẽ xóa môn này khỏi <strong>tất cả các khối lớp</strong>.<br/>Bạn có chắc chắn?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (!result.isConfirmed) return;

        try {
            await deleteSubject(subjectId);

            // Cập nhật state
            setAllSubjects(allSubjects.filter(s => s.id !== subjectId));
            setGradesWithSubjects(gradesWithSubjects.map(grade => ({
                ...grade,
                subjects: grade.subjects.filter(s => s.id !== subjectId)
            })));

            Swal.fire({
                title: 'Đã xóa!',
                text: 'Môn học đã được xóa khỏi tất cả các khối lớp.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Lỗi khi xóa môn học:', error);
            Swal.fire({
                title: 'Lỗi!',
                text: 'Không thể xóa môn học này. Có thể nó đang được sử dụng trong bài thi hoặc bảng điểm.',
                icon: 'error',
                confirmButtonText: 'Đã hiểu'
            });
        }
    };


    const getAvailableSubjectsForGrade = (gradeId: string): SubjectResponse[] => {
        const grade = gradesWithSubjects.find(g => g.id === gradeId);
        if (!grade) return allSubjects;

        const assignedSubjectIds = grade.subjects.map(s => s.id);
        return allSubjects.filter(s => !assignedSubjectIds.includes(s.id));
    };

    const toggleGrade = (gradeId: string) => {
        setExpandedGrades(prev => ({ ...prev, [gradeId]: !prev[gradeId] }));
    };

    const renderModalContent = () => {
        if (modalType === 'addSubjectToGrade' && selectedGradeForAdd) {
            const availableSubjects = getAvailableSubjectsForGrade(selectedGradeForAdd);
            const gradeName = gradesWithSubjects.find(g => g.id === selectedGradeForAdd)?.name;

            return (
                <Modal
                    isOpen={showModal}
                    onClose={closeModal}
                    title={`Thêm môn học vào ${gradeName}`}
                    showSaveButton={false}
                >
                    <p className="text-gray-600 mb-4">Chọn môn học để thêm vào khối lớp</p>
                    {availableSubjects.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                            {availableSubjects.map(subject => (
                                <SubjectCard
                                    key={subject.id}
                                    subject={subject}
                                    onClick={() => handleAddSubjectToGrade(subject.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
                            <p>Đã thêm tất cả môn học có sẵn</p>
                        </div>
                    )}
                </Modal>
            );
        }

        return (
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={
                    modalType === 'addGrade' ? 'Thêm khối lớp mới' :
                        modalType === 'editGrade' ? 'Chỉnh sửa khối lớp' :
                            modalType === 'addSubject' ? 'Thêm môn học mới' : 'Chỉnh sửa môn học'
                }
                onSave={handleSave}
                saveDisabled={!formData.name}
            >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {modalType.includes('Grade') ? 'Tên khối lớp' : 'Tên môn học'}
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder={modalType.includes('Grade') ? 'Ví dụ: Khối 10' : 'Ví dụ: Toán học'}
                    autoFocus
                />
            </Modal>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Quản trị Hệ thống</h1>
                    <p className="text-gray-600">Quản lý khối lớp và môn học</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm mb-6 p-1">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('grades')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all ${activeTab === 'grades' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <GraduationCap size={20} />
                            Khối lớp
                        </button>
                        <button
                            onClick={() => setActiveTab('subjects')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all ${activeTab === 'subjects' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <BookOpen size={20} />
                            Môn học
                        </button>
                    </div>
                </div>

                {activeTab === 'grades' ? (
                    <GradesManagement
                        gradesWithSubjects={gradesWithSubjects}
                        onAddGrade={() => openModal('addGrade')}
                        onEditGrade={(grade) => openModal('editGrade', grade)}
                        onDeleteGrade={handleDeleteGrade}
                        onAddSubjectToGrade={(gradeId) => openModal('addSubjectToGrade', gradeId)}
                        onRemoveSubjectFromGrade={handleRemoveSubjectFromGrade}
                        expandedGrades={expandedGrades}
                        onToggleGrade={toggleGrade}
                    />
                ) : (
                    <SubjectsManagement
                        subjects={allSubjects}
                        gradesWithSubjects={gradesWithSubjects}
                        onAddSubject={() => openModal('addSubject')}
                        onEditSubject={(subject) => openModal('editSubject', subject)}
                        onDeleteSubject={handleDeleteSubject}
                    />
                )}

                {renderModalContent()}
            </div>
        </div>
    );
};

export default GradeSubjectManager;