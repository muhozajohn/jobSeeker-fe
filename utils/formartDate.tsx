
export const formatDate = (dateString: string): string => {
    if (!dateString || dateString === "Not specified") return dateString;
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
  
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

//   get current Year

export const currentYear = new Date().getFullYear();