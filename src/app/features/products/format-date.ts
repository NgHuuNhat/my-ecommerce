export const formatDate = (iso?: string | null) => {
  if (!iso) return '-'

  const date = new Date(iso)

  const datePart = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const timePart = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  return `${timePart} - ${datePart}`
}