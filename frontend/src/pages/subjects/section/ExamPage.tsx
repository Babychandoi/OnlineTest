import React, { useEffect } from 'react';
import GradesSubjects from './exam/Subject';

const Subjects: React.FC = () => {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="min-h-screen">
      <GradesSubjects />
    </div>
  );
};

export default Subjects;