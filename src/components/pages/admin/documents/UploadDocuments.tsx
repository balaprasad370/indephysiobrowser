import {
  Modal,
  ModalBody,
  ModalContent,
  ModalProvider,
} from '../students/NonStrictModal'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@/components/theme-provider'

const UploadDocuments = ({ children }) => {
  const { packageModal, setPackageModal } = useTheme()

  return (
    <div className='w-2/5 bg-red-600'>
      <ModalProvider>
        <Modal strict={packageModal}>
          <ModalBody className='h-5/6 w-11/12 lg:w-1/2'>
            <ModalContent className='flex h-full  flex-col justify-between'>
              {children}
            </ModalContent>
          </ModalBody>
        </Modal>
      </ModalProvider>
    </div>
  )
}

export default UploadDocuments
