export const dashboardMetadata = (title: string, description: string) => ({
  title: title === "Home" ? "Nww" : `Nww | ${title}`,
  description,
})