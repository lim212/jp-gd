import { ref, reactive } from 'vue'

interface ImagePopupState {
  isOpen: boolean
  imageSrc: string
  imageAlt: string
  title: string
  description: string
}

const popupState = reactive<ImagePopupState>({
  isOpen: false,
  imageSrc: '',
  imageAlt: '',
  title: '',
  description: ''
})

export const useImagePopup = () => {
  const openPopup = (imageSrc: string, imageAlt: string = '', title: string = 'Informasi Umum', description: string = 'Detail rekening resmi untuk transaksi') => {
    popupState.isOpen = true
    popupState.imageSrc = imageSrc
    popupState.imageAlt = imageAlt
    popupState.title = title
    popupState.description = description
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    
    // Add professional backdrop class
    document.body.classList.add('modal-open')
  }

  const closePopup = () => {
    popupState.isOpen = false
    popupState.imageSrc = ''
    popupState.imageAlt = ''
    popupState.title = ''
    popupState.description = ''
    
    // Restore body scroll
    document.body.style.overflow = ''
    document.body.classList.remove('modal-open')
  }

  const togglePopup = (imageSrc: string, imageAlt: string = '', title: string = 'Informasi Umum', description: string = 'Detail rekening resmi untuk transaksi') => {
    if (popupState.isOpen) {
      closePopup()
    } else {
      openPopup(imageSrc, imageAlt, title, description)
    }
  }

  return {
    popupState,
    openPopup,
    closePopup,
    togglePopup
  }
}

