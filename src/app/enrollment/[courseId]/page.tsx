import React from 'react';

interface EnrollmentProps {
  params: {
    courseId: string;
  };
}

const EnrollmentPage = ({ params }: EnrollmentProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Enroll in Course</h1>
      <p className="mt-4">Course ID: {params.courseId}</p>
    </div>
  );
};

export default EnrollmentPage;
