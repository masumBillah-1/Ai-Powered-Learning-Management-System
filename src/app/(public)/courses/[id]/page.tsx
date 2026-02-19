import React from 'react';

interface CourseDetailsProps {
  params: {
    id: string;
  };
}

const CourseDetails = ({ params }: CourseDetailsProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Course Details</h1>
      <p className="mt-4">Course ID: {params.id}</p>
    </div>
  );
};

export default CourseDetails;
