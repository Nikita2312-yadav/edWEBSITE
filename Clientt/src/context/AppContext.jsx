import React, { useEffect, useState } from 'react';
import { createContext } from "react";
import { dummyCourses } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import humanizeDuration from 'humanize-duration';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios'
import { toast } from 'react-toastify';
export const AppContext =createContext()

export const AppContextProvider = (props)=>{
  const backenedUrl = import.meta.env.VITE_BACKEND_URL
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()
    const {getToken} = useAuth()
    const {user} = useUser()
    const [allCourses, setallCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState([])
      //Fetch all Courses
      const fetchAllCourses = async ()=>{
        try {
          const {data} = await axios.get(backenedUrl + '/api/course/all');
          if(data.sucess){
            setallCourses(data.courses)
          }else{
            toast.error(data.message)
          }
        } catch (error) {
          toast.error(data.message)
        }
      }

      //Function to calculate average rating of course
      const calculateRating = (course)=>{
        if(course.courseRatings.length===0){
            return 0;
        } 
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return totalRating / course.courseRatings.length

      }
      //Function to calculate course chapter time
      const calculateChapterTime = (chapter)=>{
        let time = 0
        chapter.chapterContent.map((lecture)=> time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
      }
      // Function to calculate course duration
      const calculateCourseDuration = (course)=>{
       let time=0
       course.courseContent.map((chapter)=> chapter.chapterContent.map((lecture)=> time += lecture.lectureDuration))
       return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
      }
      //Function to calculate number of lecture in the course
      const calculateNoOfLectures = (course)=>{
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length
            }
        });
        return totalLectures;

      }
      //Fetch user enrolled courses
      const fetchUserEnrolledCourses = async ()=> {
        setEnrolledCourses(dummyCourses)
      }

         useEffect(()=>{
            fetchAllCourses()
            fetchUserEnrolledCourses()
         },[])
            const logToken = async()=>{
              console.log(await getToken());
            }
         useEffect(()=>{
          if(user){
               logToken()   
          }
         }, [user])
                     


    const value={
        currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures, enrolledCourses, fetchUserEnrolledCourses

    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )


}