from flask import Flask, render_template, request, jsonify

app1 = Flask(__name__)

class Question:
    def __init__(self, prompt, answer):
        self.prompt = prompt
        self.answer = answer

def create_questions():
    questions_prompts = [
        "What is the capital of Maharashtra? \n a. Mumbai\n b. Nasik \n c. Pune \n d. Shirdi\n",
        "What is the capital of Assam? \n a. Manipur\n b. Dispur \n c. Nagaland \n d. Trichy\n",
        "Which city is known as the Pink City? \n a. Nagpur \n b. Madhya Pradesh \n c. Uttar Pradesh \n d. Jaipur\n",
        "Uttrakhand is the capital of which state? \n a. Kedarnath \n b. Badrinath \n c. Dehradun \n d. Manali\n",
        "How many total states are there in India? \n a. 30 \n b. 29 \n c. 28 \n d. 27\n"
    ]
    
    questions = [
        Question(questions_prompts[0], "a"),
        Question(questions_prompts[1], "b"),
        Question(questions_prompts[2], "d"),
        Question(questions_prompts[3], "c"),
        Question(questions_prompts[4], "b")
    ]
    
    return questions

questions = create_questions()

@app1.route('/')
def index():
    return render_template('index.html')

@app1.route('/get_question', methods=['GET'])
def get_question():
    question_index = int(request.args.get('index', 0))
    if question_index < len(questions):
        question = questions[question_index]
        return jsonify({'prompt': question.prompt, 'index': question_index})
    else:
        return jsonify({'prompt': 'No more questions', 'index': -1})

@app1.route('/check_answer', methods=['POST'])
def check_answer():
    data = request.json
    question_index = int(data['index'])
    user_answer = data['answer']
    
    if question_index < len(questions):
        correct_answer = questions[question_index].answer
        if user_answer == correct_answer:
            return jsonify({'result': 'correct'})
        else:
            return jsonify({'result': 'incorrect'})
    else:
        return jsonify({'result': 'invalid'})

if __name__ == '__main__':
    app1.run(debug=True)
