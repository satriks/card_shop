// import "./Delivery.scss";

// import React, { useState } from "react";

// const CityInput = () => {
//   const [city, setCity] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleInputChange = (event) => {
//     setCity(event.target.value);
//   };

//   const apikey = async () => {
//     try {
//       const resp = await fetch(
//         import.meta.env.VITE_SDEK_URL + "/v2/auth/token",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             grant_type: "client_credentials",
//             client_id: import.meta.env.VITE_SDEK_ACOUNT,grappelli
//             client_secret: import.meta.env.VITE_SDEK_SECRET,
//           }),
//         }
//       );
//       const key = await resp.json();
//       console.log(key, "this is key");
//     } catch (error) {}
//   };
//   apikey();

//   const fetchCityData = async () => {
//     if (city) {
//       setLoading(true);
//       try {
//         console.log(city);

//         const params = new URLSearchParams({
//           city: city,
//         });

//         //TODO Получаю ошибку cors, попробовать  зарегиться с айта перед этим, а не использовать готовый токен
//         const response = await fetch(
//           import.meta.env.VITE_SDEK_URL +
//             "/v2/location/suggest/cities" +
//             `?${params.toString()}`,
//           {
//             method: "GET",
//             mode: "no-cors",
//             headers: {
//               Authorization: `Bearer <${String(
//                 import.meta.env.VITE_SDEK_JWT
//               )}>`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const data = await response.json();
//         if (data.cod === 200) {
//           setSuggestions([data]); // Сохраняем только один объект, если нужен список, измените логику
//         } else {
//           setSuggestions([]);
//         }
//       } catch (error) {
//         console.error("Error fetching city data:", error);
//         setSuggestions([]);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleBlur = () => {
//     fetchCityData();
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={city}
//         onChange={handleInputChange}
//         onBlur={handleBlur}
//         placeholder="Введите город"
//       />
//       {loading && <p>Загрузка...</p>}
//       {suggestions.length > 0 && (
//         <ul>
//           {suggestions.map((suggestion, index) => (
//             <li key={index}>
//               {suggestion.name}: {Math.round(suggestion.main.temp - 273.15)}°C
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default CityInput;
