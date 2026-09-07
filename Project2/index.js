document.addEventListener("DOMContentLoaded", () => {

    const coin = document.querySelector(".coin");
    const coinShadow = document.querySelector(".shadow");
    const currentFace = document.getElementById("curr_face");
    const clickBtn = document.getElementById("click_me");
    const coinFace = document.getElementById("Face");

    let coinflip;

    const flip =() => {
        return Math.floor(Math.random() * 2);
        
    };

     const changeBgColor = () => {
       const originalColor = clickBtn.style.backgroundColor = "blue";
       clickBtn.style.backgroundColor = "green";
    
       setTimeout(() =>{
        clickBtn.style.backgroundColor = originalColor;
       }, 1000);
    };
  
    const doFlip = () => {

        changeBgColor();
        const coinflip = flip();

        coin.classList.remove("flip");
        void coin.offsetWidth;
        coin.classList.add("flip");

        if(coinflip === 0){
            currentFace.textContent = "Head";
            coinFace.textContent = "$";
            
        }else{
            currentFace.textContent = "Tail";
            coinFace.textContent ="I";
        };

    };

   

    clickBtn.addEventListener("click", doFlip);
    coin.addEventListener("click", doFlip);



});