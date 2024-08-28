import sunny from '../assets/images/sunny.png'
import cloudy from '../assets/images/cloudy.png'
import rainy from '../assets/images/rainy.png'
import snowy from '../assets/images/snowy.png'
import { useState, useEffect } from 'react'
import loadingGif from "../assets/images/loading.gif"


const WeatherApp = () => {

    const [data, setData] = useState({})
    const [location, setLocation] = useState('')
    const [loading, setLoading] = useState(false);
    const api_key = "1758980d282ead160b1233c965e78eb5"


    // useEffect(() => {
    //     const fetchDefaultWeather = async () => {
    //         setLoading(true);
    //         const defaultLocation = "Ahmedabad";
    //         const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=${api_key}`;
    //         const res = await fetch(url);
    //         const defaultData = await res.json();
    //         setData(defaultData);
    //         setLoading(false);
    //     }
    //     fetchDefaultWeather();

    // }
    //     , [])
    useEffect(() => {
        const fetchWeather = async (lat, lon) => {
            setLoading(true);
            let url;
            if (lat && lon) {
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=Metric&appid=${api_key}`;
            } else {
                const defaultLocation = "Ahmedabad";
                url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=${api_key}`;
            }
            try {
                const res = await fetch(url);
                const weatherData = await res.json();
                if (weatherData.cod !== 200) {
                    setData({ notFound: true });
                } else {
                    setData(weatherData);
                }
            } catch (error) {
                setData({ notFound: true });
            } finally {
                setLoading(false);
            }
        };

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        fetchWeather(position.coords.latitude, position.coords.longitude);
                    },
                    () => {
                        fetchWeather(); // If permission denied or error, use default location (Ahmedabad)
                    }
                );
            } else {
                fetchWeather(); // If geolocation is not supported, use default location (Ahmedabad)
            }
        };

        getLocation();
    }, []);

    const handleInputChange = (e) => {
        setLocation(e.target.value)
    }

    const search = async () => {
        if (location.trim() !== "") {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${api_key}`

            const res = await fetch(url);
            const searchData = await res.json();
            if (searchData.cod !== 200) {
                setData({ notFound: true })
            }
            else {
                setData(searchData);
                setLocation('');
            }

            // console.log(searchData)

        }
        setLoading(false)

    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            search();
        }
    }


    const weatherImages = {
        Clear: sunny,
        Clouds: cloudy,
        Rain: rainy,
        Snow: snowy,
        Haze: cloudy,
        Mist: cloudy,
        Drizzle: rainy,
        Fog: cloudy,
        Thunderstorm: rainy
    }
    const weatherImage = data.weather ? weatherImages[data.weather[0].main] : null

    const backgroundImages = {
        Clear: 'linear-gradient(to right, #f3b07c,#fcd283)',
        Clouds: 'linear-gradient(to right,#57d6d4,#71eeec)',
        Rain: 'linear-gradient(to right,#5bc8fb,#80eaff)',
        Snow: 'linear-gradient(to right,#aff2ff,#fff)',
        Haze: 'linear-gradient(to right,#57d6d4,#71eeec)',
        Mist: 'linear-gradient(to right,#57d6d4,#71eeec)',
        Drizzle: 'linear-gradient(to right,#5bc8fb,#80eaff)',
        Fog: 'linear-gradient(to right,#57d6d4,#71eeec)',
        Thunderstorm: 'linear-gradient(to right,#5bc8fb,#80eaff)'

    }

    const backgroundImage = data.weather ? backgroundImages[data.weather[0].main] : 'linear-gradient(to right, #f3b07c,#fcd283)';

    const currentDate = new Date();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dayOfWeek = daysOfWeek[currentDate.getDay()]
    const month = months[currentDate.getMonth()];
    const dayOfMonth = currentDate.getDate();

    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;

    return (
        <div className="container" style={{ backgroundImage }}>
            <div className="weather-app" style={{ backgroundImage: backgroundImage && backgroundImage.replace ? backgroundImage.replace("to rightt", "to top") : null }}>
                <div className="search">
                    <div className="search-top">
                        <i className="fa-solid fa-location-dot"></i>
                        <div className="location">{data.name}</div>
                    </div>
                    <div className="search-bar">
                        <input type="text" placeholder="Enter location" value={location} onChange={handleInputChange} onKeyDown={handleKeyDown} />
                        <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
                    </div>
                </div>

                {loading ? (<img className='loader' src={loadingGif} />) : data.notFound ? (<div className='not-found'>Not Found 😒</div>) : <>
                    <div className="weather">
                        <img src={weatherImage} alt="" />
                        <div className='weather-type'>{data.weather ? data.weather[0].main : null}</div>
                        <div className="temp">{data.main ? `${Math.floor(data.main.temp)}°` : null}</div>
                    </div>
                    <div className="weather-date">
                        <p>{formattedDate}</p>
                    </div>
                    <div className="weather-data">
                        <div className="humidity">
                            <div className="data-name">Humidity</div>
                            <i className="fa-solid fa-droplet"></i>
                            <div className="data">{data.main ? data.main.humidity : null}%</div>
                        </div>
                        <div className="wind">
                            <div className="data-name">Wind</div>
                            <i className="fa-solid fa-wind"></i>
                            <div className="data">{data.wind ? data.wind.speed : null} km/h</div>
                        </div>
                    </div>
                </>}
            </div>
        </div>
    )
}

export default WeatherApp






/*
 <div className="weather">
                        <img src={sunny} alt="" />
                        <div className='weather-type'>Clear</div>
                        <div className="temp">28°</div>
                    </div>
                    <div className="weather-date">
                        <p>Fri, 26 Aug</p>
                    </div>
                    <div className="weather-data">
                        <div className="humidity">
                            <div className="data-name">Humidity</div>
                            <i className="fa-solid fa-droplet"></i>
                            <div className="data">55%</div>
                        </div>
                        <div className="wind">
                            <div className="data-name">Wind</div>
                            <i className="fa-solid fa-wind"></i>
                            <div className="data">3 km/h</div>
                        </div>
                     </div>

*/