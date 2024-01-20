// import {api_url, _api_key, country_code, topic} from '../Backend/config/rest_Api_config';

// export default async function getArticles(){

//     try{
//         let articles_data = await fetch('https://newsapi.org/v2/top-headlines?country=in&category=politics&apiKey=444142a9e7444f7aa6d9f676ed208a90',
//         {
//             headers: {
//                 'X-API-KEY': _api_key,
//             }
//         })
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }

//         let result = await articles_data.json();
//         // console.log(result.articles);
//         return result
//     }catch(error){
//         throw error;
//     }
// }
