import { defineEventHandler, getQuery } from 'h3'

// Simple i18n messages for the application
const messages = {
  id: {
    // Navigation
    home: 'Beranda',
    blog: 'Blog',
    about: 'Tentang',
    contact: 'Kontak',
    services: 'Layanan',
    
    // Common
    loading: 'Memuat...',
    error: 'Terjadi kesalahan',
    success: 'Berhasil',
    cancel: 'Batal',
    save: 'Simpan',
    edit: 'Edit',
    delete: 'Hapus',
    search: 'Cari',
    readMore: 'Baca Selengkapnya',
    
    // Blog
    publishedOn: 'Dipublikasikan pada',
    writtenBy: 'Ditulis oleh',
    tags: 'Tag',
    categories: 'Kategori',
    
    // Footer
    allRightsReserved: 'Semua hak dilindungi',
    followUs: 'Ikuti Kami',
    
    // Contact
    getInTouch: 'Hubungi Kami',
    name: 'Nama',
    email: 'Email',
    message: 'Pesan',
    send: 'Kirim'
  },
  en: {
    // Navigation
    home: 'Home',
    blog: 'Blog',
    about: 'About',
    contact: 'Contact',
    services: 'Services',
    
    // Common
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    readMore: 'Read More',
    
    // Blog
    publishedOn: 'Published on',
    writtenBy: 'Written by',
    tags: 'Tags',
    categories: 'Categories',
    
    // Footer
    allRightsReserved: 'All rights reserved',
    followUs: 'Follow Us',
    
    // Contact
    getInTouch: 'Get In Touch',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send'
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = (query.locale as string) || 'id'
  
  // Return messages for the requested locale, fallback to Indonesian
  const localeMessages = messages[locale] || messages.id
  
  return {
    locale,
    messages: localeMessages
  }
})
