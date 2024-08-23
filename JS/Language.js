
// default = h1: ""
const translations = {
    en: {
        
        
    },
    pg: {
        
    }
}


const languageSelectop = document.querySelector("#LG");
// default = let h1 = document.getElementById("h1");


languageSelectop.addEventListener("change", (event) => {
    setLanguage(event.target.value)
})
// default = h1.innerText = translations.lg.h1
const setLanguage = (language) => {
    if(language == "pg"){

        console.log(`language set to ${language}` )

    }else if(language == "en"){

        console.log(`language set to ${language}` )
    }
}