const isAdult = (dateString)=> {
  const today = new Date();
  const birthDate = new Date(dateString);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= 18;
}
function dateToText(dateString)
{
  const today = new Date();
  const postDate = new Date(dateString)

  let yearDiff = today.getFullYear() - postDate.getFullYear();
  let monthDiff = today.getMonth() - postDate.getMonth();
  let dayDiff = today.getDate() - postDate.getDate();
  if(yearDiff > 0)
  {
    if(year == 1)
    return `one year ago`
  else
    return `${yearDiff} years ago`
  }
    if(monthDiff > 0)
  {
    if(monthDiff == 1)
    return `one month ago`
  else
    return `${monthDiff} months ago`
  }
      if(dayDiff > 0)
  {
    if(dayDiff == 1)
    return `one day ago`
  else
    return `${dayDiff} days ago`
  }
}
export  {dateToText, isAdult};

