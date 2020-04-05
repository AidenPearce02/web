$(document).ready(function () {
    const keywords = document.getElementById("keyword").list.options;
    function toCamelCase(text) {
        let result = "";
        for(let index = 0 , len = text.length; index < len; index++) {
            let currentStr = text[index];
            let tempStr = currentStr.toUpperCase();
            if(index !== 0) {
                // convert first letter to upper case (the word is in lowercase)
                tempStr = tempStr.substr(0, 1).toLowerCase() + tempStr.substr(1);
            }
            result +=tempStr;
        }
        return result;
    }
    function opinion2html(opinion){
        opinion.createdDate = (new Date(opinion.created)).toDateString();
        opinion.willReturnMessage = opinion.willReturn?"I will return to this page.":"Sorry, one visit was enough.";
        opinion.srcImage = (opinion.pictureProfile==='') ? "images/user-silhouette.png" : opinion.pictureProfile;
        opinion.preferToWatch = toCamelCase(opinion.preferToWatch);
        opinion.keywordClass = "";
        for(let index = 0; index < keywords.length; index++){
            if(keywords[index].value===opinion.keyword){
                opinion.keywordClass = opinion.keyword;
                break;
            }
        }
        opinion.keywordClass = opinion.keywordClass.toLowerCase();

        const template = document.getElementById("templateOpinion").innerHTML;
        const htmlWOp = Mustache.render(template,opinion);

        delete(opinion.keywordClass);
        delete(opinion.srcImage);
        delete(opinion.createdDate);
        delete(opinion.willReturnMessage);

        return htmlWOp;
    }

    function opinionArray2html(sourceData){
        return sourceData.reduce((htmlWithOpinions,opn) => htmlWithOpinions+ opinion2html(opn),"");
    }


    let opinions=[];

    function clearList(event){
        for (let index = 0; index < opinions.length; index++) {
            if((Date.now() - new Date(opinions[0].created)) > 86400000 ){
                opinions.splice(index);
            }
        }
        localStorage.comments  = JSON.stringify(opinions);
        opinionsContainer.innerHTML=opinionArray2html(opinions);
    }


    const opinionsContainer=document.getElementById("opinionsContainer");
    if(localStorage.comments){
        opinions=JSON.parse(localStorage.comments);
    }
    opinionsContainer.innerHTML=opinionArray2html(opinions);

    const opinionForm=document.getElementById("opinionForm");
    const opinionInputs = opinionForm.elements;
    const clearOpinions = document.getElementById("clearOpinions");
    console.log(clearOpinions);
    clearOpinions.addEventListener("click",clearList);
    opinionForm.addEventListener
    ("submit",processOpnFrmData);
    function processOpnFrmData(event){
        //1.prevent normal event (form sending) processing
        event.preventDefault();

        //2. Read and adjust data from the form (here we remove white spaces before and after the strings)
        const name = opinionInputs["name"].value.trim();
        const email = opinionInputs["email"].value.trim();
        let pictureProfile = opinionInputs["pictureProfile"].value.trim();
        const preferencesToWatch = opinionInputs["preferToWatch"];
        let preferToWatch;
        for(let i=0;i<preferencesToWatch.length;i++){
            if(preferencesToWatch[i].checked){
                preferToWatch = toCamelCase(preferencesToWatch[i].value);
                break;
            }
        }
        const keyword = opinionInputs["keyword"].value.trim();
        const willReturn = opinionInputs["willReturn"].checked;
        const comment = opinionInputs["comment"].value;

        //3. Add the data to the array opinions and local storage
        const newOpinion = {
            name : name,
            email : email,
            pictureProfile : pictureProfile,
            preferToWatch : preferToWatch,
            keyword : keyword,
            willReturn : willReturn,
            comment : comment,
            created : new Date()
        };

        opinions.push(newOpinion);
        localStorage.comments  = JSON.stringify(opinions);

        //4. Update HTML
        opinionsContainer.innerHTML+=opinion2html(newOpinion);

        //5. Reset the form
        opinionForm.reset();
    }
});