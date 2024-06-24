// src/components/Registration.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';

function Registration(props) {
    const [registrationFields, setRegistrationFields] = useState([]);
    const [formData, setFormData] = useState('');
    const [idade, setIdade] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();
    const YOUR_API_ENDPOINT = 'http://localhost:5072/api/Paciente'

    useEffect(() => {
        fetch('/src/cadastro.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setRegistrationFields(data))
            .catch(error => console.error('Error fetching registration fields:', error));
    }, []);

    const handleChange = (id, value) => {
        setFormData({
            ...formData,
            [id]: value
        });

        // Handle auto-fill based on CEP
        if (id === 'cep' && value.length === 9) {
            fetch(`https://viacep.com.br/ws/${value.replace('-', '')}/json/`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (!data.erro) {
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            rua: data.logradouro,
                            bairro: data.bairro,
                            cidade: data.localidade,
                            estado: data.uf,
                            complemento: data.complemento
                        }));
                    }
                })
                .catch(error => console.error('Error fetching address from CEP:', error));
        }

        if (id === 'email') {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            setFormErrors(prevErrors => ({
                ...prevErrors,
                [id]: isValidEmail ? '' : 'Please enter a valid email address.'
            }));
        }

        // Calculate age based on date of birth
        if (id === 'nascimento') {
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setIdade(age);
            setFormData(prevFormData => ({
                ...prevFormData,
                idade: age
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formDataJSON = {
            "nome": formData.nome,
            "cpf": formData.cpf,
            "dataDeNascimento": formData.nascimento,
            "idade": idade,
            "email": formData.email,
            "endereco": {
                "cep": formData.cep,
                "rua": formData.rua,
                "numero": formData.numero,
                "complemento": formData.complemento,
                "bairro": formData.bairro,
                "cidade": formData.cidade,
                "estado": formData.estado
            }
        }
        const formDataString = JSON.stringify(formDataJSON);
        // console.log('Registered user:', formDataString);
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

                navigate('/questionnaire', { state: result });
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error (show error message to user, etc.)
        }
    };

    return (
        <div>
            <h1>Registration</h1>
            <form onSubmit={handleSubmit}>
                {registrationFields.map(field => (
                    <div key={field.id}>
                        <label>
                            {field.label}
                            {field.id === 'cpf' ? (
                                <InputMask
                                    mask={field.format}
                                    type="text"
                                    value={formData[field.id] || ''}
                                    onChange={e => handleChange(field.id, e.target.value)}
                                    required={field.required}
                                />
                            ) : field.type === 'date' ? (
                                <>
                                    <input
                                        type="date"
                                        value={formData[field.id] || ''}
                                        onChange={e => handleChange(field.id, e.target.value)}
                                        required={field.required}
                                    />
                                    {field.id === 'nascimento' && idade !== '' && (
                                        <span style={{ marginLeft: '10px' }}>Idade: {idade}</span>
                                    )}
                                </>
                            ) : field.id === "cep" ? (
                                <InputMask
                                    mask={field.format}
                                    type="text"
                                    value={formData[field.id] || ''}
                                    onChange={e => handleChange(field.id, e.target.value)}
                                    required={field.required}
                                />
                            ) : field.id === "telefone" ? (
                                <InputMask
                                    mask={field.format}
                                    type="text"
                                    value={formData[field.id] || ''}
                                    onChange={e => handleChange(field.id, e.target.value)}
                                    required={field.required}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    value={formData[field.id] || ''}
                                    onChange={e => handleChange(field.id, e.target.value)}
                                    pattern={field.format}
                                    required={field.required}
                                />
                            )}
                        </label>
                        {formErrors[field.id] && <p className="error">{formErrors[field.id]}</p>}
                    </div>
                ))}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Registration;
