import { jwtDecode } from "jwt-decode";

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
function dateToText(dateString) {
  const now = new Date();
  const postDate = new Date(dateString + "Z");
  const diffMs = now - postDate;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return years === 1 ? "one year ago" : `${years} years ago`;
  if (months > 0) return months === 1 ? "one month ago" : `${months} months ago`;
  if (days > 0) return days === 1 ? "one day ago" : `${days} days ago`;
  if (hours > 0) return hours === 1 ? "one hour ago" : `${hours} hours ago`;
  if (minutes > 0) return minutes === 1 ? "one minute ago" : `${minutes} minutes ago`;

  return "just now";
}

function getUserIdFromStorage()
{
  const token = localStorage.getItem("token");
  const userId = jwtDecode(token).nameid
  return userId;
}
export  {dateToText, isAdult, getUserIdFromStorage};

