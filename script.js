console.log("good morminhb")
let currentSong= new Audio();
let song
let currFolder
async function getSongs(folder){
    currFolder=folder
    let a= await fetch(`http://127.0.0.1:3000/${folder}`)
    let response = await a.text()
// console.log(response);
    let div = document.createElement("div")
    div.innerHTML=response
    let as=div.getElementsByTagName("a")
    song=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            song.push(element.href.split(`/${folder}/`)[1])
        }  
        
    }
    let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const songs of song) {
        songUL.innerHTML=songUL.innerHTML+`<li><img class="invert" src="music.svg" alt="">
        <div class="info">
            <div>${songs.replaceAll("%20"," ")}</div>
            <div>Gaggu</div>
        </div>
        <div class="playnow">
            <span>Play now</span>
            <img class="invert" src="play.svg" alt="">
        </div>
    </li>`
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",()=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })  
    return song

}

const playMusic=(track,pause=false)=>{
    console.log(track);
    currentSong.src= `/${currFolder}/`+track
    console.log(currentSong.src);
    if(!pause){
        currentSong.play()
        play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00/00"
}
function secondsToMinutes(seconds) {
    if(isNaN(seconds)||seconds<0){
        return "00:00"
    }

    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    var formattedMinutes = String(minutes).padStart(2,'0');
    var formattedSeconds = String(remainingSeconds).padStart(2,'0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function displayAlbums(){
    let a= await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    let cardcontainer=document.querySelector(".card-container")
    div.innerHTML=response
    console.log(div);
    let anchors=div.getElementsByTagName("a")
    let array= Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/songs")){
           let folder=(e.href.split("/").slice(-2)[0]);
           let a= await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
           let response = await a.json()
           console.log(response);
           cardcontainer.innerHTML=cardcontainer.innerHTML+`<div data-folder="${folder}" class="card">
               <div class="play">     
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none" style="width: 100%; padding:0; height: auto; fill: black;">
                         <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                   </svg>
           </div>
               <img src="/songs/${folder}/cover.jpeg" alt="">
               <h2>${response.title}</h2>
               <p>${response.description}</p>
           </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e);
        e.addEventListener("click",async item=>{
            console.log(item.currentTarget.dataset.folder);
            song= await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(song[0])
        })
    })


}
async function main(){
    await getSongs("songs/og")
    playMusic(song[0],true)

    displayAlbums()
    
    
 
     
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="pause.svg"
        }
        else{
            currentSong.pause()
            play.src="play.svg"
        }
    })
        currentSong.addEventListener("timeupdate",()=>{
            document.querySelector(".songtime").innerHTML=`${secondsToMinutes(currentSong.currentTime)}/${secondsToMinutes(currentSong.duration)}`
            console.log(currentSong.currentTime,currentSong.duration);
            document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
        })
        document.querySelector(".seekbar").addEventListener("click",e=>{
            let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
            document.querySelector(".circle").style.left=percent +"%";
            currentSong.currentTime=(currentSong.duration*percent)/100
        })
        document.querySelector(".hamburger").addEventListener("click",()=>{
            document.querySelector(".left").style.left="0"
        })
        document.querySelector(".close").addEventListener("click",()=>{
            document.querySelector(".left").style.left="-110%"
        })
        previous.addEventListener("click",()=>{
            console.log("previous clicked");
            index= songs.indexOf(currentSong.src.split("/").slice(-1)[0] );
            if((index-1)>=0){
                playMusic(songs[index-1])
            }

        })
        next.addEventListener("click",()=>{
            console.log("next clicked");
            index= song.indexOf(currentSong.src.split("/").slice(-1)[0]);
            // console.log(songs.length);
            if((index+1)<song.length){
                playMusic(song[index+1])
            }
        })
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
            console.log(e,e.target,e.target.value);
            currentSong.volume=(e.target.value)/100
            if(currentSong.volume>0){
                document.querySelector(".volume img").src=document.querySelector(".volume img").src.replace("mute.svg","volume.svg")
            }
        })
        document.querySelector(".volume img").addEventListener("click",e=>{
            if(e.target.src.includes("volume.svg")){
                console.log("inside");
                e.target.src=e.target.src.replace("volume.svg","mute.svg")
                currentSong.volume=0
                document.querySelector(".range").getElementsByTagName("input")[0].value=0
            }
            else{
                e.target.src=e.target.src.replace("mute.svg","volume.svg")
                currentSong.volume=0.15
                document.querySelector(".range").getElementsByTagName("input")[0].value=15
            }
        })

    }  
main()  