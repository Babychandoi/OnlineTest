import React from 'react'
import HeroBanner from './section/HeroBanner'
import Subjects from './section/ExamPage'
export default function index() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <HeroBanner />
      <Subjects />
    </div>
  )
}
