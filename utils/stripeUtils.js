import moment from "moment";


export const calculate_Total_Days = (booking_Dates) => {
  const date1 = moment(booking_Dates[0]);
  const date2 = moment(booking_Dates[1]);

  // Calculate the difference in days
  const daysDifference = date2.diff(date1, "days");

  return daysDifference
};



export const modify_Date_Format = (booking_Dates) => {
  const date1 = moment(booking_Dates[0]).format('DD/MM/YYYY');
  const date2 = moment(booking_Dates[1]).format('DD/MM/YYYY');

  return [date1, date2];
};



export const total_Booking_Amount = (book_Dates, prop_Price) => {
  const total_Days = calculate_Total_Days(book_Dates) + 1
  
  const total_Amount = (prop_Price * total_Days) + 1200

  return total_Amount * 100
}