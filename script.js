document.addEventListener('DOMContentLoaded', function() {
    let currentIndex = 0;
    let questionCount = 0; // Counter to track loaded questions

    loadQuestion(currentIndex);

    function loadQuestion(index) {
        fetch(`/get_question?index=${index}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.index !== -1) {
                    document.getElementById('question-prompt').textContent = data.prompt;
                    document.getElementById('answer-options').innerHTML = `
                        <label><input type="radio" name="answer" value="a"> Option A</label><br>
                        <label><input type="radio" name="answer" value="b"> Option B</label><br>
                        <label><input type="radio" name="answer" value="c"> Option C</label><br>
                        <label><input type="radio" name="answer" value="d"> Option D</label><br>
                    `;
                    document.getElementById('submit-answer').style.display = 'block'; // Ensure submit button is visible

                    document.getElementById('submit-answer').addEventListener('click', submitAnswer);
                } else {
                    // No more questions
                    document.getElementById('question-prompt').textContent = 'No more questions';
                    document.getElementById('answer-options').innerHTML = '';
                    document.getElementById('submit-answer').style.display = 'none'; // Hide submit button
                    document.getElementById('submit-answer').removeEventListener('click', submitAnswer); // Remove event listener
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was a problem loading the question. Please try again.');
            });
    }

    function submitAnswer() {
        const answer = document.querySelector('input[name="answer"]:checked');
        if (answer) {
            fetch('/check_answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    index: currentIndex,
                    answer: answer.value
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                document.getElementById('result').textContent = result.result;
                currentIndex++;
                questionCount++; // Increment question count
                loadQuestion(currentIndex);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was a problem with your answer. Please try again.');
            });
        } else {
            alert('Please select an answer.');
        }
    }
});
