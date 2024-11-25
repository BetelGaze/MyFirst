document.addEventListener('DOMContentLoaded', () => {
  // Questions for the stress questionnaire
  const questions = [
    { question: "How often do you feel overwhelmed at work?", explanation: "Frequent feelings of overwhelm can indicate high stress levels." },
    { question: "Do you feel you have too many responsibilities?", explanation: "Excessive responsibilities may lead to burnout." },
    { question: "How often do you lack control over your tasks?", explanation: "Feeling powerless increases workplace stress." },
    { question: "Do you frequently work overtime?", explanation: "Overtime disrupts work-life balance and raises stress." },
    { question: "How often do you face unclear expectations?", explanation: "Uncertain expectations create stress." },
    { question: "Do you feel supported by your team?", explanation: "Lack of support makes stress harder to manage." },
    { question: "How often do you have conflicts with colleagues?", explanation: "Frequent conflicts lead to emotional exhaustion." },
    { question: "Do you find your work fulfilling?", explanation: "Lack of fulfillment increases stress." },
    { question: "How often do you worry about job security?", explanation: "Job insecurity is a significant stressor." },
  ];

  // Render questionnaire
  function renderQuestions() {
    const questionsContainer = document.getElementById("questions");
    questions.forEach((q, i) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'question';
      questionDiv.innerHTML = `
        <label for="question-${i}">${q.question}</label>
        <input type="number" id="question-${i}" min="1" max="10" required>
      `;
      questionsContainer.appendChild(questionDiv);
    });
  }

  // Validate the form
  function validateForm() {
    const inputs = document.querySelectorAll('#stress-form input[type="number"]');
    return Array.from(inputs).every(input => {
      const value = parseInt(input.value, 10);
      return value >= 1 && value <= 10;
    });
  }

  // Fetch or provide fallback advice
  async function getAdvice() {
    try {
      const response = await fetch('https://api.example.com/stress-advice'); // Example URL
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      return {
        low: {
          techniques: ['Practice meditation', 'Exercise regularly', 'Maintain work-life balance'],
          consultation: 'Keep stress management techniques integrated into daily life.'
        },
        moderate: {
          techniques: ['Discuss workload with your supervisor', 'Learn time management skills', 'Reach out for peer support'],
          consultation: 'Consider professional stress management counseling.'
        },
        high: {
          techniques: ['Seek professional counseling', 'Take breaks to prevent burnout', 'Consider major changes to reduce stress'],
          consultation: 'Immediate intervention may be necessary for stress management.'
        }
      };
    }
  }

  // Calculate and display results
  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      alert("Please fill out all fields with values between 1 and 10.");
      return;
    }

    const totalScore = Array.from(document.querySelectorAll('#stress-form input[type="number"]'))
      .reduce((sum, input) => sum + parseInt(input.value, 10), 0);

    const stressLevel = totalScore <= 30 ? 'low' : totalScore <= 60 ? 'moderate' : 'high';

    const advice = await getAdvice();

    document.getElementById("total-score").innerText = `Your total score is ${totalScore}. Stress level: ${stressLevel}.`;
    document.getElementById("explanations").innerHTML = questions.map((q, i) =>
      `<li><strong>${q.question}</strong>: You scored ${document.getElementById(`question-${i}`).value}. ${q.explanation}</li>`
    ).join('');
    document.getElementById("techniques").innerHTML = advice[stressLevel].techniques.map(technique => `<li>${technique}</li>`).join('');
    document.getElementById("consultation").innerText = advice[stressLevel].consultation;

    document.getElementById("results").classList.remove('hidden');
  }

  // Event Listeners
  document.getElementById("age-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const age = parseInt(document.getElementById("age").value, 10);
    if (age >= 18 && age <= 100) {
      document.getElementById("questionnaire-section").classList.remove("hidden");
    } else {
      alert("Please enter a valid age between 18 and 100.");
    }
  });

  document.getElementById("stress-form").addEventListener("submit", handleSubmit);

  // Initialize
  renderQuestions();
});
