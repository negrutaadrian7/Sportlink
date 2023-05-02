import React from 'react'
import HomeNav from './HomeNav'
import Section1 from './Section1'
import Section2 from './Section2'
import Section3 from './Section3'
export default function App() {
  return (
      <>
      <div className='home-body'>
        <div className='rectangle1'></div>
        <div className='rectangle2'></div>
        <HomeNav />
          <Section1 />
          <Section2 />
          <Section3 />
      </div>
      </>
    
  )
}
