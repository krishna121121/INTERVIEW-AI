import {generateInterviewReport, getInterviewReportById,getAllInterviewReports} from "../services/Interview.ai"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response?.interviewReport;
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response?.interviewReport;
    }

    const getReports = async () => {
        setLoading(true);
      
        try {
          const response = await getAllInterviewReports();
          setReports(response.interviewReports);
          console.log(response);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };



    return { loading, report, reports, setReports,generateReport, getReportById,getReports}

}