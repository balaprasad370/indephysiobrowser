import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Layout } from '@/components/custom/layout'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { IconUpload } from '@tabler/icons-react'
import UploadDocuments from './UploadDocuments'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/components/theme-provider'
import { FileUpload } from './../students/FileUpload'
import moment from 'moment'
import SuperfastDocuments from './SuperfastDocuments'
import ExpressDocuments from './ExpressDocuments'
import ProfessionalDocuments from './ProfessionalDocuments'
import UGFinals from './UGFinals'
import UGDreamers from './UGDreamers'

interface Document {
  student_id: string
  document_name: string
  document_path: string
  status: string
}

const Index = () => {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<Document[]>([])
  const [token, settoken] = useState(localStorage.getItem('token'))
  const [openModal, setopenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [studentDetails, setStudentDetails] = useState({})

  const filesServerUrl = 'https://d2c9u2e33z36pz.cloudfront.net/'

  const { packageModal, setPackageModal, files } = useTheme()

  useEffect(() => {
    fetchDocuments()
    fetchStudentDetails()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        'https://server.indephysio.com/student/documentData',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const fetchedDocuments = response.data.documents || []
      setDocuments(fetchedDocuments)
    } catch (error) {
      console.error('Error fetching documents:', error)
    }
  }

  const fetchStudentDetails = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        'https://server.indephysio.com/student/getDetails',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const fetchedStudentDetails = response.data || {}
      setStudentDetails(fetchedStudentDetails)
      console.log(fetchedStudentDetails.package)
    } catch (error) {
      console.error('Error fetching student details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const truncateText = (text: string, length: number) => {
    return text.length > length ? `${text.substring(0, length)}...` : text
  }

  const uploadFileToServer = async (file: File): Promise<string> => {
    const token = localStorage.getItem('token')
    const formData = new FormData()

    formData.append('file', file)

    try {
      const response = await axios.post(
        'https://server.indephysio.com/upload/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // console.log(response.data.filepath)
      return response.data.filepath
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  const handleUploadDocument = async () => {
    const status = 'pending'

    try {
      const filePaths: string[] = []

      // Upload each file and collect their paths
      for (const file of files) {
        const filePath = await uploadFileToServer(file)
        filePaths.push(filePath)
      }

      const document_names = files.map((file: any) => file.name)
      const document_paths = filePaths // Comma-separated file paths
      // console.log(document_names, document_paths)
      // return;

      const response = await axios.post(
        'https://server.indephysio.com/student/documents',
        {
          document_name: document_names, // Comma-separated document names
          document_path: document_paths, // Comma-separated document paths (URLs)
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log(response.data)
      fetchDocuments()
      setPackageModal(false)
    } catch (error) {
      console.error('Error uploading document:', error)
    }
  }

  const handleUpload = (document: string) => {
    console.log(document)
  }

  // Assuming isPdfUrl and isImageUrl functions are defined
  const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif)$/.test(url)
  const isPdfUrl = (url: string) => /\.pdf$/.test(url)

  const renderPackageDocuments = (packageName: string) => {
    switch (packageName) {
      case 'Superfast':
        return <SuperfastDocuments studentDetails={studentDetails} />
      case 'Express':
        return <ExpressDocuments studentDetails={studentDetails} />
      case 'Professional':
        return <ProfessionalDocuments studentDetails={studentDetails} />
      case 'UG Finals':
        return <UGFinals studentDetails={studentDetails} />
      case 'UG Dreamers':
        return <UGDreamers studentDetails={studentDetails} />
      default:
        return <NOPackage />
    }
  }

  const NOPackage = () => {
    return (
      <div className='bg-red flex min-h-[20rem] w-full flex-col items-center justify-center'>
        <div className='flex items-center justify-center'>
          <p className='my-4 text-2xl font-semibold'>No package choosen</p>
        </div>

        <div className='flex items-center  justify-center'>
          <Button onClick={() => navigate('/dashboard')}>Choose Package</Button>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <div className='w-full p-4 px-4 lg:px-8'>
        <div className='w full flex items-center justify-between'>
          <p className='mb-4 text-2xl font-semibold'>List of Documents</p>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className='w-full '>
            {renderPackageDocuments(studentDetails.package)}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Index

const topNav = [
  {
    title: 'Overview',
    href: '/dashboard',
    isActive: true,
  },
  {
    title: 'Consultancy fees',
    href: '/transaction',
    isActive: false,
  },
  {
    title: 'Documents',
    href: '/documents',
    isActive: false,
  },
  {
    title: 'Referrals',
    href: '/app',
    isActive: false,
  },
]
