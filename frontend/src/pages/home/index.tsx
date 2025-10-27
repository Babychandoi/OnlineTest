import Banner from "./section/Banner"
import React from 'react'
import UseOnlineTest from './section/WhyUseOnlineTest'
import FeaturesSection from "./section/FeaturesSection"
import SubjectsSelectionSection from "./section/SubjectsSelectionSection"
export default function index() {
  return (
    <div>
      <Banner />
      <FeaturesSection />
      <SubjectsSelectionSection />
      <UseOnlineTest />
    </div>
  )
}
