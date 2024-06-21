document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form");
  const input = document.querySelector("#input");
  const button = document.querySelector("#button");
  const results = document.querySelector(".results");
  let clear = document.querySelector("#clear-input");
  const welcomeDiv = document.querySelector(".welcome");

  clear.addEventListener("click", () => {
    input.value = "";
    input.focus();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    wordInfo(input.value);
  });

  let wordInfo = async function (word) {
    try {
      if (word.length === 0) {
        alert("Input Field can't be empty.");
      } else {
        welcomeDiv.style.display = "none";

        results.innerHTML = "Fetching data...";

        let apiResponse = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );

        let data = await apiResponse.json();

        console.log(data);

        let userWord = data[0].word;
        let phonetic = data[0].phonetic || "None";
        let meanings = data[0].meanings;
        let url = data[0].sourceUrls.join();

        results.innerHTML = `
          <div class="primary jsDiv">
          <p><strong>Word:</strong> ${userWord}</p>
          <p><strong>Phonetic:</strong> ${phonetic}</p>
          <a href=${url} target="_blank" class="read-more">Read More</a>
          </div>
          `;

        meanings.forEach((meaning) => {
          results.innerHTML += `
              <div class="secondary jsDiv"> 
  
                <p><strong>Part of Speech:</strong> ${
                  meaning.partOfSpeech
                }</p>    
  
                <p><strong>Antonyms:</strong> ${
                  meaning.antonyms.join(", ") || "None"
                }</p>
                    
                <p><strong>Synonyms:</strong> ${
                  meaning.synonyms.join(", ") || "None"
                }</p> 
                  
                <p><strong> Definitions:</strong><ul> ${meaning.definitions
                  .map((def) => `<li>${def.definition}</li>`)
                  .join("")}
                </ul>
                </p>
  
                <p><strong>Examples:</strong><ul> ${
                  meaning.definitions
                    .map((def) =>
                      def.example !== undefined ? `<li>${def.example}</li>` : ""
                    )
                    .join("") || "None"
                }
                </ul>
                </p>
              
              </div>
              `;
        });

        input.value = "";
        input.focus();
      }
    } catch (error) {
      results.innerHTML = `<p>Sorry, we couldn't find definitions for the word: '${word}' you were looking for. Try searching the web instead.</p>`;
    }
  };

  document.querySelector("h1").addEventListener("click", () => {
    document.querySelectorAll(".jsDiv").forEach((e) => e.remove());
    welcomeDiv.style.display = "flex";
  });
});
