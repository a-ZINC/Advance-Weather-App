const yourtab=document.querySelector(".your-weather");
const searchtab=document.querySelector(".search-weather");
const grantUI=document.querySelector(".grant-location");
const grantbtn=document.querySelector(".loc");
const loadingUI=document.querySelector(".loading");
const input_field=document.querySelector("[input-field]");
const searchbtn=document.querySelector("[btn-search]");
const weatherUI=document.querySelector(".user-info");
const searchform=document.querySelector("#search-tab");
const vid=document.querySelector(".src");
const video=document.querySelector(".vid");
const volume=document.querySelector(".volo");
const novolume=document.querySelector(".xmark");
const videox=document.querySelector(".vide");
const novideo=document.querySelector(".slash");
novideo.classList.add("remove");
volume.classList.add("remove");
const videobtn=document.querySelector("#videox");
const volumebtn=document.querySelector(".voice1");
const prop={};
const api="60303b0f3ae8644b3632967cc2fb9480";
let currenttab=yourtab;
currenttab.classList.add("current-tab");
grantbtn.addEventListener('click', getlocation);
yourtab.addEventListener('click', ()=>{switchtab(yourtab);});
searchtab.addEventListener('click', ()=>{switchtab(searchtab);});
const msg=new SpeechSynthesisUtterance();
const err=document.querySelector(".error");

function getlocation(){
    stop();
    if(navigator.geolocation){
        navigator.geolocation.watchPosition(usercoords);
    }
    else{
        alert('Location Permission Denied, Unable to detect Weather');
    }
}

function usercoords(position){
    const coordinates={
        lats:position.coords.latitude,
        long:position.coords.longitude,
    };
    sessionStorage.setItem('user-coords', JSON.stringify(coordinates));
    fetchuserweather(coordinates);
}

async function fetchuserweather(position){
    const lat=position.lats;
    const lon=position.long;
    
    grantUI.classList.remove("active");
    weatherUI.classList.remove("active");
    loadingUI.classList.add("active");
    volume.classList.add("remove");
    novolume.classList.remove("remove");
    window.speechSynthesis.cancel(msg);
    try{
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}&units=metric`);
        const data = await response.json();
        loadingUI.classList.remove("active");
        err.classList.remove("active");
        weatherUI.classList.add("active");
        volumebtn.classList.add("active");
        videobtn.classList.add("active");
        renderinfo(data);
        Object.assign(prop, data);
    }
    catch{
        loadingUI.classList.remove("active");
        err.classList.add("active");
    }
}


function renderinfo(stats){
    const cityname=document.querySelector("[city-name]");
    const countryicon=document.querySelector("[country-icon]");
    const weatherdes=document.querySelector("[weather-desc]");
    const weathericon=document.querySelector("[weather-icon]");
    const temp=document.querySelector("[temp]");
    const windspeed=document.querySelector("[windspeed]");
    const humidity=document.querySelector("[humidity]");
    const cloud=document.querySelector("[cloud]");

    cityname.innerText=stats?.name;
    countryicon.src=`https://flagcdn.com/144x108/${stats?.sys?.country.toLowerCase()}.png`;
    weatherdes.innerText=stats?.weather[0]?.description;
    weathericon.src=`https://openweathermap.org/img/wn/${stats?.weather[0]?.icon}.png`;
    temp.innerText=`${stats?.main?.temp} °C`;
    windspeed.innerText=`${stats?.wind?.speed}m/s`;
    humidity.innerText=`${stats?.main?.humidity}%`;
    cloud.innerText=`${stats?.clouds?.all}%`;

    const main=stats?.weather[0]?.main;
    bgchange(main);

}
function switchtab(clickedtab){
    if(clickedtab!=currenttab){
        currenttab.classList.remove("current-tab");
        currenttab=clickedtab;
        currenttab.classList.add("current-tab");
        video.classList.add("remove");
        stop();
    }
    if(!searchform.classList.contains("active")){
        weatherUI.classList.remove("active");
        volumebtn.classList.remove("active");
        videobtn.classList.remove("active");
        grantUI.classList.remove("active");
        err.classList.remove("active");
        searchform.classList.add("active");
    }
    else{
        searchform.classList.remove("active");
        weatherUI.classList.remove("active");
        volumebtn.classList.remove("active");
        videobtn.classList.remove("active");
        err.classList.remove("active");
        getsessionstorage();
        video.classList.remove("remove");
    }
}

function getsessionstorage(){
    const localcord=sessionStorage.getItem('user-coords');
    if(localcord){
        const coordinate=JSON.parse(localcord);
        fetchuserweather(coordinate);
    }
    else{
        grantUI.classList.add("active");
    }
    
}

searchform.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(input_field.value=="") return ;
    else fetchsearchweather(input_field.value);
});

async function fetchsearchweather(loc){
    loadingUI.classList.add("active");
    weatherUI.classList.remove("active");
    volumebtn.classList.remove("active");
    videobtn.classList.remove("active");
    grantUI.classList.remove("active");
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${api}&units=metric`);
        const data= await response.json();
        loadingUI.classList.remove("active");
        weatherUI.classList.add("active");
        volumebtn.classList.add("active");
        videobtn.classList.add("active");
        renderinfo(data);
        Object.assign(prop, data);
    }
    catch{
        loadingUI.classList.remove("active");
        err.classList.add("active");
    }
}
getsessionstorage();

function bgchange(main){
    video.classList.remove("remove");
    if(main=="Clear"){
        vid.src="video/clear.mp4";
        video.load();
    }
    else if(main=="Thunderstorm"){
        vid.src="video/light.mp4";
        video.load();
    }
    else if(main=="Drizzle" || main=="Rain"){
        vid.src="video/rain.mp4";
        video.load();
    }
    else if(main=="Snow"){
        vid.src="video/snow.mp4";
        video.load();
    }
    else if(main=="Mist" ||main=="Smoke" || main=="Haze" || main=="Dust" || main=="Fog" || main=="Sand" || main=="Ash" || main=="Squall" || main=="Tornado"){
        vid.src="video/fog.mp4";
        video.load();
    }
    else if(main=="Clouds"){
        vid.src="video/clouds.mp4";
        video.load();
    }
}

videobtn.addEventListener('click', ()=>{
    switchvideobtn();
});

function switchvideobtn(){
    if(novideo.classList.contains("remove")){
        novideo.classList.remove("remove");
        videox.classList.add("remove");
        video.classList.add("remove");
    }
    else{
        novideo.classList.add("remove");
        videox.classList.remove("remove");
        video.classList.remove("remove");
    }
}


volumebtn.addEventListener('click', ()=>{
    switchvolumebtn();
});
function switchvolumebtn(){
    if('speechSynthesis' in window){
        const voicestr=voice_assist();
        msg.text=voicestr.toString();
        const voices=window.speechSynthesis.getVoices();
        msg.voice=voices[0];
        if(volume.classList.contains("remove")){
            volume.classList.remove("remove");
            novolume.classList.add("remove");
            window.speechSynthesis.speak(msg);
            alert("your browser support voive assistant 🎉");
        }
        else if(novolume.classList.contains("remove") || flag){
            volume.classList.add("remove");
            novolume.classList.remove("remove");
            window.speechSynthesis.cancel(msg);
        }
        
    }
    else{
        alert("Sorry, your browser donot support voice assistant.");
    }
}
function voice_assist(){
    const denotionstr=gettimestr();
    const temp=`${prop?.main?.temp}`;
    const city=prop?.name;
    const name="Ajinkya";
    const desc=prop?.weather[0]?.description;
    const windspeed=`${prop?.wind?.speed}`;
    const maxtemp=`${prop?.main?.temp_max}`;
    const mintemp=`${prop?.main?.temp_min}`;
    const humidity=`${prop?.main?.humidity}`;
    const cloud=`${prop?.clouds?.all}`;
    const d1=prop?.sys?.sunrise;
    const dat1=new Date(d1*1000);
    const hrsr=String(dat1.getHours());
    const minr=String(dat1.getMinutes());
    const secr=String(dat1.getSeconds());
    

    const d2=prop?.sys?.sunset;
    const dat2=new Date(d2*1000);
    const hrss=String(dat2.getHours());
    const mins=String(dat2.getMinutes());
    const secs=String(dat2.getSeconds());
    
    const voicestr=`${denotionstr}, ${city}! I'm ${name}, and it's time for your daily weather update.

    Right now, we have a ${desc} with a temperature of ${temp} degrees Celsius. The wind is coming in at ${windspeed} kilometers per hour.
    As we move through the day, temperatures will reach a high of ${maxtemp} degrees Celsius with a low of ${mintemp} degrees Celsius.

    Here are some additional details for your day:

    Humidity stands at ${humidity}.
    The clouds is ${cloud}.
    Sunrise is at ${hrsr}hours ${minr}minutes ${secr}seconds and sunset at ${hrss}hours ${mins}minutes ${secs}seconds.

    Stay tuned for further updates and have a fantastic day.
    `;
    
    return voicestr;
        

}

function gettimestr(){
    const d=new Date();
    const currhrs=d.getHours();
    if(currhrs<12){
        return "Good Morning"
    }
    else if(currhrs<17){
        return "Good Afternoon";
    }
    else{
        return "Good Evening";
    }
}

function stop(){
    volume.classList.add("remove");
    novolume.classList.remove("remove");
    window.speechSynthesis.cancel(msg);
}





