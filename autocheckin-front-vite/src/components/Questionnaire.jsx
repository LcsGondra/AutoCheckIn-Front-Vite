import React, { useState, useEffect } from 'react';
import questionnaireData from '/src/perguntas.json';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Questionnaire.css'; // Import the CSS file

const Questionnaire = (props) => {
    const [responses, setResponses] = useState({});
    const [planOptions, setPlanOptions] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const paciente = location.state;
    const [hospitals, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState('');
    const [showAbdominalImage, setShowAbdominalImage] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const YOUR_API_ENDPOINT = 'http://localhost:5072/api/CheckIn'

    const fetchHospitalData = async () => {
        console.log(JSON.stringify(paciente, null, 4))
        try {
            const response = await fetch('http://localhost:5072/api/Hospital/All');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setHospitals(data);
        } catch (error) {
            console.error('Error fetching hospital data:', error);
        }
    };

    const handleTermsAgreement = () => {
        setAgreedToTerms(!agreedToTerms);
    };

    useEffect(() => {
        fetchHospitalData();
    }, []);

    const handleHospitalChange = (event) => {
        const selectedId = event.target.value;
        const hospital = hospitals.find(h => h.id === selectedId);
        setSelectedHospital(hospital);
        console.log(JSON.stringify(hospital, null, 4));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitAttempted(true);

        if (!agreedToTerms) {
            return;
        }

        const formattedQuestions = questionnaireData.questionario.perguntas.map((question, idx) => ({
            "numero": question.numero,
            "pergunta": question.pergunta,
            "resposta": responses[idx.toString()] || ""
        }));
        const data = {
            questionario: {
                perguntas: formattedQuestions
            },
            paciente: paciente,
            hospital: selectedHospital,
            prioridade: '',
            tipoEmergencia: ''
        };
        console.log(JSON.stringify(data, null, 4));
        const formDataString = JSON.stringify(data, null, 4)
        try {
            const response = await fetch(YOUR_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: formDataString
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                const result = await response.json();
                console.log('API response:', result);

                // Navigate to the questionnaire page upon successful submission

                navigate('/', { state: result });
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error (show error message to user, etc.)
        }
    };

    const handleChange = (questionNumber, value) => {
        setResponses({
            ...responses,
            [questionNumber]: value,
        });

        // Check if the question is about "Operadora de Saúde" to update plan options
        if (questionNumber === "0.0") {
            const selectedOperadora = value;
            const planQuestion = questionnaireData.questionario.perguntas.find(q => q.numero === 1);
            if (planQuestion && planQuestion.opcoesDependentes[selectedOperadora]) {
                setPlanOptions(planQuestion.opcoesDependentes[selectedOperadora]);
            } else {
                setPlanOptions([]);
            }
            // Reset dependent fields
            setResponses(responses => ({ ...responses, "1": "", "2": "" }));
        }

        // Reset Número do Beneficiário if Plano is changed
        if (questionNumber === "1") {
            setResponses(responses => ({ ...responses, "2": "" }));
        }

        // Show abdominal image if "Dor abdominal" question is answered "Sim"
        if (questionNumber === "27" && value === "Sim") {
            setShowAbdominalImage(true);
        } else if (questionNumber === "27" && value === "Não") {
            setShowAbdominalImage(false);
        }
    };

    const renderDependentQuestions = (dependents, prefix) => {
        return dependents.map((dependent, idx) =>
            renderQuestion(dependent, `${prefix}.${idx}`)
        );
    };

    const renderQuestion = (question, number) => {
        if (question.pergunta === "Localização" && !showAbdominalImage) {
            return null;
        }

        switch (question.tipo) {
            case 'radio':
                return (
                    <div key={number} className="question-container">
                        <label className="question-label">{question.pergunta}</label>
                        {question.opcoes.map((option, idx) => (
                            <div key={idx} className="option-container">
                                <label>
                                    <input
                                        type="radio"
                                        name={number}
                                        value={option}
                                        checked={responses[number] === option}
                                        onChange={(e) => handleChange(number, e.target.value)}
                                    />
                                    {option}
                                </label>
                            </div>
                        ))}
                        {question.numero === 27 && showAbdominalImage && (
                            <div className="image-container">
                                <img src="/src/assets/Abdomen.png" alt="Localização Image" />
                            </div>
                        )}
                        {question.dependente && responses[number] && question.dependente[responses[number]] && (
                            <div className="dependent-container">
                                {renderDependentQuestions(question.dependente[responses[number]], number)}
                            </div>
                        )}
                    </div>
                );
            case 'dropdown':
                return (
                    <div key={number} className="question-container">
                        <label className="question-label">{question.pergunta}</label>
                        <select
                            value={responses[number] || ''}
                            onChange={(e) => handleChange(number, e.target.value)}
                            className="dropdown"
                            required
                        >
                            <option value="">Selecione</option>
                            {(number === "1" ? planOptions : question.opcoes).map((option, idx) => (
                                <option key={idx} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            case 'text':
                return (
                    <div key={number} className="question-container">
                        <label className="question-label">{question.pergunta}</label>
                        <input
                            type="text"
                            value={responses[number] || ''}
                            onChange={(e) => handleChange(number, e.target.value)}
                            className="text-input"
                            required
                        />
                    </div>
                );
            case 'checkbox':
                return (
                    <div key={number} className="question-container">
                        <label className="question-label">{question.pergunta}</label>
                        {question.opcoes.map((option, idx) => (
                            <div key={idx} className="option-container">
                                <label>
                                    <input
                                        type="checkbox"
                                        name={number}
                                        value={option}
                                        checked={responses[number]?.includes(option) || false}
                                        onChange={(e) => {
                                            const newValue = responses[number]?.includes(option)
                                                ? responses[number].filter(item => item !== option)
                                                : [...(responses[number] || []), option];
                                            handleChange(number, newValue);
                                        }}
                                    />
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                );
            case 'date':
                return (
                    <div key={number} className="question-container">
                        <label className="question-label">{question.pergunta}</label>
                        <input
                            type="date"
                            value={responses[number] || ''}
                            onChange={(e) => handleChange(number, e.target.value)}
                            className="date-input"
                            required
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="questionnaire-container">
            <h1 className="title">Questionario</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="question-container">
                    <label className="question-label">Selecione Hospital/Clinica:</label>
                    <select value={selectedHospital ? selectedHospital.id : ''} onChange={handleHospitalChange} required className="dropdown">
                        <option value="">Selecione Hospital/Clinica:</option>
                        {hospitals.map(hospital => (
                            <option key={hospital.id} value={hospital.id}>
                                {hospital.unidade} - {hospital.endereco.cidade}, {hospital.endereco.estado}
                            </option>
                        ))}
                    </select>
                </div>
                {questionnaireData.questionario.perguntas.map((question, idx) => {
                    if (question.numero === 1 && !responses["0.0"]) return null; // Skip "Plano" if no "Operadora de Saúde" selected
                    if (question.numero === 2 && !responses["1"]) return null;  // Skip "Número do Beneficiário" if no "Plano" selected
                    return renderQuestion(question, idx.toString());
                })}

                <div className="terms-overlay">
                    <div className="terms-content">
                        <h2>Termo de consentimento</h2>
                        <p> Declaro que as informações preenchidas neste questionário de anamnese são informações verdadeiras e assumo total responsabilidade sobre as respostas preenchidas. </p>
                        <label>
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={handleTermsAgreement}
                            />
                            Estou de acordo com os termos de consentimento
                        </label>
                    </div>
                </div>
                {submitAttempted && !agreedToTerms && (
                    <p className="warning-message">Por favor, aceite os termos de consentimento</p>
                )}
                <button type="submit" className="submit-button">
                    Enviar
                </button>
            </form>
        </div>
    );
}

export default Questionnaire;
