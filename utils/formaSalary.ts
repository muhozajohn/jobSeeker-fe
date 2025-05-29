  export const formatSalary = (salary: number, salaryType: string) => {
  
    const formattedAmount = salary.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    return `${formattedAmount} ${salaryType.toLowerCase()}`;
  };