// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]
let numOfCategories = 6
let numOfQuestions = 5

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
async function getCategoryIds () {
  const response = await axios.get(
    'http://jservice.io/api/categories?count=100'
  )
  console.log({ response })

  const randomCategoryIds = []
  while (randomCategoryIds.length <= numOfCategories) {
    const randomIndex = Math.floor(Math.random() * response.data.length)
    const randomCategory = response.data[randomIndex]

    if (!randomCategoryIds.includes(randomCategory.id)) {
      randomCategoryIds.push(randomCategory.id)
    }
  }
  return randomCategoryIds
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory (catIdNumber) {
  const results = await axios.get(
    `http://jservice.io/api/clues?category=${catIdNumber}&min_date=1985-02-20`
  )
  console.log({results});
  //console.log({catIdNumber});
  //the parameter here in an object from the result array
  //console.log(catIdNumber);
  let clues = []
  for (let j = 0; j < results.data.length; j++) {
    if (results.data[j].category.id === catIdNumber) {
      let categoryData = {
        question: results.data[j].question,
        answer: results.data[j].answer,
        showing: null
      }
      clues.push(categoryData)
    }
  }
  const title = results.data[0].category.title
  const categoryObj = { title, clues, id: catIdNumber }
  return categoryObj
}

/** Fill the HTML table #jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

let randomIds
let categoryQuestions

//let randomIds = await getCategoryIds();
//let categoryQuestions = await getCategory(randomIds);
const $table = $('#jeopardy');
async function fillTable () {
  const tHead = document.getElementsByTagName('thead')[0]
  const tBody = document.getElementsByTagName('tbody')[0]
  tHead.innerHTML = "";
  tBody.innerHTML = "";
  randomIds = await getCategoryIds()
  console.log({ randomIds })
  categoryQuestions = []
  for (let i = 0; i < randomIds.length; i++) {
    categoryQuestions.push(await getCategory(randomIds[i]))
  }

  console.log({ categoryQuestions })
  const headRow = document.createElement('tr')
  for (let i = 0; i < numOfCategories; i++) {
    let cell = document.createElement('td')
    cell.textContent = categoryQuestions[i].title
    headRow.appendChild(cell)
  }
  tHead.appendChild(headRow)

  for (let i = 0; i < numOfQuestions; i++) {
    let bodyRow = document.createElement('tr')

    for (let j = 0; j < numOfCategories; j++) {
      let bodyCell = document.createElement('td')
      //console.log(i, j);
      //const cellNumber = i * numOfCategories + j;
      const categoryId = randomIds[j]
      const questionNumber = i
      bodyCell.setAttribute('data-cell-categoryId', categoryId)
      bodyCell.setAttribute('data-cell-questionNumber', questionNumber)
      bodyCell.classList.add('gameCell')
      bodyCell.textContent = '?'
      bodyRow.appendChild(bodyCell)
      bodyCell.addEventListener('click', handleClick)
    }
    tBody.appendChild(bodyRow)
  }
  return $table
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick (evt) {
  //get the bodyCell data cell number
  //from category dataset cell number value you get the .showing property of the cell.
  let categoryId = evt.currentTarget.getAttribute('data-cell-categoryId')
  //console.log(categoryId);
  let questionNumber = evt.currentTarget.getAttribute(
    'data-cell-questionNumber'
  )
  //console.log(categoryQuestions);
  const catObj = categoryQuestions.find(function (obj) {
    console.log({ obj })
    return obj.id == categoryId
  })

  //console.log(catObj);

  const cell = evt.currentTarget
  //console.log(cell);
  const clue = catObj.clues[questionNumber]
  console.log(questionNumber)
  console.log(catObj.clues)

  //console.log(clue);
  //showing === question (bug)
  if (clue.showing === null) {
    cell.textContent = clue.question
    clue.showing = 'question'
  } else if (clue.showing === 'question') {
    cell.textContent = clue.answer
  } else if ((clue.showing = 'answer')) {
    return
  }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
*/
const startButton = document.getElementById('start');
console.log({startButton});
let buttonClicked = false;







function showLoadingView () {
  if(buttonClicked){
    $table.innerHTML = "";
  }
};


/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView () {
  let spinner = document.getElementById("spin-container");
  if (spinner.style.display === "none") {
    spinner.style.display = "block";
  } else {
    spinner.style.display = "none";
  }
  if(buttonClicked){
    startButton.innerText = 'Restart';
  }
}


/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart () {
  startButton.addEventListener('click', function (evt) {
    if (evt.type === 'click') {
      buttonClicked = true;
      showLoadingView();
      hideLoadingView();
      fillTable();
    }
  });
}
setupAndStart()

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
