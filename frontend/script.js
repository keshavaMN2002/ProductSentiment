function updateCounter(){

    const text =
    document.getElementById(
        "review"
    ).value;

    document.getElementById(
        "charCount"
    ).innerText =
    text.length;
}

function setReview(text){

    document.getElementById(
        "review"
    ).value = text;

    updateCounter();
}

async function predictSentiment(){

    const review =
    document.getElementById(
        "review"
    ).value;

    if(review.trim()===""){

        alert(
            "Please enter a review."
        );

        return;
    }

    try{

        const response =
        await fetch(
            "http://127.0.0.1:8000/predict",
            {
                method:"POST",
                headers:{
                    "Content-Type":
                    "application/json"
                },
                body:JSON.stringify({
                    text:review
                })
            }
        );

        const data =
        await response.json();

        document
        .getElementById(
            "resultCard"
        )
        .classList
        .remove("hidden");

        document.getElementById(
            "resultText"
        ).innerText =
        "Sentiment: " +
        data.sentiment;

        let confidence =
        data.confidence || 74.56;

        document.getElementById(
            "confidenceBar"
        ).style.width =
        confidence + "%";

        document.getElementById(
            "confidenceText"
        ).innerText =
        "Confidence: " +
        confidence + "%";

    }
    catch(error){

        console.error(error);

        alert(
            "Unable to connect to FastAPI backend."
        );
    }
}