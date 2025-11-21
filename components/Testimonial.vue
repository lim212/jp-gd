let data = ref(null)

if (process.env.DISABLE_TESTIMONIALS !== 'true') {
  const res = await useFetch('https://testimonial.jasapembayaran.id/testimoni/0/12', {
    key: 'testimonial-fetch',
  })
  data.value = res.data.value
}


