const createElements = (arr) => {
    const htmlElements = arr.map(el => `<span class="btn">${el}</span>`);
    return (htmlElements.join(" "));
};

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
};

const manageSpinner = (status) => {
    if (status === true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }

}

const loadlessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then((res) => res.json())
        .then((json) => displaylessons(json.data))
};

const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn")
    lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            removeActive();
            const clickBtn = document.getElementById(`lesson-btn-${id}`)
            clickBtn.classList.add("active")
            displayLevelWord(data.data)
        })
};

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
};

// {
//     "word": "Grateful",
//     "meaning": "কৃতজ্ঞ",
//     "pronunciation": "গ্রেটফুল",
//     "level": 3,
//     "sentence": "I am grateful for your help.",
//     "points": 3,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "thankful",
//         "appreciative",
//         "obliged"
//     ],
//     "id": 7
// }

const displayWordDetails = (word) => {
    console.log(word);
    const detailBox = document.getElementById("details-container");
    detailBox.innerHTML = `
    <div class="font-semibold text-[26px] mb-[17px]">
            <h2 class="font-bangla">${word.word}(<i class="fa-solid fa-microphone-lines"></i>):(${word.pronunciation})</h2>
        </div>
        <div class="font-semibold">
            <h2 class="text-[24px] mb-[6px] font-bangla">অর্থ</h2>
            <p class="mb-[17px] font-bangla">${word.meaning}</p>
        </div>
        <div class="">
            <h2 class="font-semibold text-[24px] mb-[4px] font-bangla">উদাহরণ</h2>
            <p class="text-[18px] mb-[32px]">${word.sentence}</p>
        </div>
        <div class="">
            <h2 class="font-semibold text-[24px] font-bangla">সমার্থক শব্দ গুলো</h2>
            <div class="">${createElements(word.synonyms)}</div>
        </div>
    `;
    document.getElementById("word_modal").showModal();
};

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container")
    wordContainer.innerHTML = "";

    if (words.length === 0) {
        wordContainer.innerHTML = `
        <div class="text-center col-span-full rounded">
            <img class ="mx-auto" src="./english-janala-resources/assets/alert-error.png" alt="">
            <p class="font-bangla text-[14px] mb-[10px] text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <p class="font-bangla font-medium text-[35px]">নেক্সট Lesson এ যান</p>
        </div>
        `;
        manageSpinner();
        return;
    }

    //    {  
    //     "id": 72,
    //     "level": 1,
    //     "word": "Big",
    //     "meaning": "বড়",
    //     "pronunciation": "বিগ"
    //    }

    words.forEach(word => {


        const card = document.createElement("div")
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 space-y-[24px]">
            <h2 class="font-bold text-[28px]">${word.word ? word.word : "শব্দ পাওয়া যায়নি।"}</h2>
            <p class="font-semibold text-[20px]">Meaning /Pronounciation</p>
            <div class="font-bangla font-semibold text-[28px]">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি।"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি।"}"</div>
            <div class="flex justify-between items-center">
                <button onclick ="loadWordDetail(${word.id})" class="btn ml-6 bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick = "pronounceWord('${word.word}')" class="btn mr-6 bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `
        wordContainer.append(card)
    });
    manageSpinner(false);
};

const displaylessons = (lessons) => {
    const levelContainer = document.getElementById("level-container")
    levelContainer.innerHTML = "";

    for (let lesson of lessons) {
        const btndiv = document.createElement("div");

        btndiv.innerHTML = `
        <button id ="lesson-btn-${lesson.level_no}" onclick ="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary hover:scale-105 transition duration-100 ease-out lesson-btn"><i class="fa-brands fa-leanpub"></i>Lesson - ${lesson.level_no}</button>`


        levelContainer.append(btndiv);
    }

};

loadlessons();

document.getElementById("Search-btn").addEventListener("click", () => {
    removeActive();
    const input = document.getElementById("Search-input");
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue);
    fetch("https://openapi.programming-hero.com/api/words/all")
        .then((res) => res.json())
        .then((data) => {
            const allwords = data.data
            console.log(allwords);
            const filterWords = allwords.filter(word => word.word.toLowerCase().includes(searchValue));
            displayLevelWord(filterWords)
        });
});