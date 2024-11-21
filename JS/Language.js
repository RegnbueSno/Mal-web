
// default = h1: ""
const translations = {
    en: {
        test: "test",
        MW: "We're more than just a community— we're a family of streamers, friends, content creators, gamers, and everything in between",
        MW2: "Here, we treasure our time together, believe in forming deep connections, and are committed to supporting each other through every high and low.",
        MW3: "Whether you're here to share your passion, make new friends,",
        MW4: "or just hang out, know that you've found a place where you truly belong. Dive in, get cozy, and let's make amazing memories together!",
        Q1: "Be yourself. An original is always worth more than a copy",
        Q21: "Being yourself doesn't mean you stop making yourself better.",
        Q22: "It's doing so without comparing your Journey to others",
        Q3: "Dont lie, Be yourself",
        Q4: "We're all the same, even tho we have difrences.",
        art: "Mals art",
    },
    pg: {
        test: "tester",
        MW: "test",
        MW2: "test",
        MW3: "test",
        MW4: "test",
        Q1: "test",
        Q21: "test",
        Q22: "test",
        Q3: "test",
        Q4: "test",
        art: "test",
    }
}


const languageSelectop = document.querySelector("#LG");
// default = let h1 = document.getElementById("h1");


languageSelectop.addEventListener("change", (event) => {
    setLanguage(event.target.value)
})
// default = h1.innerText = translations.en.h1
const setLanguage = (language) => {
    if (language == "pg") {

        console.log(`language set to ${language}`)

    } else if (language == "en") {


        console.log(`language set to ${language}`)
    }
}