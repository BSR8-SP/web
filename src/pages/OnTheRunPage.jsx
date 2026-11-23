import Question from '../components/ui/Question.jsx'
import WarningPopUp from '../components/ui/WarningPopUp.jsx'
import { useState } from 'react'
import LocationField from '../components/ui/LocationField.jsx'


function SubmitButton () {
    return (
        <button type='submit' className='bg-[#F08921] hover:bg-[#fcb45b] hover:cursor-pointer shadow border border-black
                    w-[80%]  h-[110px] md:w-[300px] p-10 rounded-full m-10
                    flex items-center justify-center gap-5
                    font-carl-sans font-bold'>
            Enviar resposta
        </button>
    );

}

export default function OnTheRunPage() {


    // set of questions
    const questions = [
        "Qual opção melhor descreve a lotação dos ônibus neste trecho?",
    ];

    // options for question 1 - crowdedness
    const options_crowdedness = [
        {
            value: "vazio",
            title: "Vazio",
            subtitle: "Há vários lugares disponíveis para se sentar"
        },
        {
            value: "sentado",
            title: "Sentado",
            subtitle: "Há poucos lugares disponíveis para se sentar"
        },
        {
            value: "em_pe",
            title: "Em pé",
            subtitle: "Todos os lugares estão ocupados, mas há bastante espaço pra ficar em pé"
        },
        {
            value: "cheio",
            title: "Cheio",
            subtitle: "Há pouco espaço para ficar em pé, mas ainda é possível embarcar"
        },
        {
            value: "lotado",
            title: "Lotado",
            subtitle: "Não há mais nenhum espaço razoável no ônibus"
        }
    ];



    // warning popup states
    const [warningActive, setWarningActive] = useState(false);
    const [warningText, setWarningText] = useState("");

    // variables for each question
    const [location, setLocation] = useState("")
    const [coords, setCoords] = useState(null)
    const [crowdedness, setCrowdedness] = useState(options_crowdedness[0].value) // question 1 - crowdedness

    function handleSubmit(e) {
        e.preventDefault();
    
        // Check if location is filled
        const trimmedLocation = location.trim();
    
        if (!trimmedLocation) {
            setWarningText("Por favor, informe uma localização.");
            setWarningActive(true);
            return;
        }
    
        // Check if location is a CEP or an address
        const cepRegex = /^\d{5}-?\d{3}$/;
        const isCEP = cepRegex.test(trimmedLocation);
    
        const locationType = isCEP ? "CEP" : "Endereço";
    
        // Collect responses
        const responses = {
            location: {
                type: locationType,
                value: trimmedLocation,
                coordinates: coords
            },
            crowdedness
        };
    
        console.log("Respostas do formulário:", responses);
    
        setWarningText("Resposta recebida");
        setWarningActive(true);
    }

    return(
        <form onSubmit={handleSubmit}
              className='w-full flex flex-col justify-center items-center py-[50px]'>

            <LocationField
                location={location}
                setLocation={setLocation}
                setCoords={setCoords}
            />

            {location && (
                <>
                    <div className='w-[90%] md:w-[700px] flex flex-col gap-6'>
                        <Question type="radio" options={options_crowdedness} selected={crowdedness} onChange={setCrowdedness} question={questions[0]} />
                    </div>
                    <SubmitButton />
                </>
            )}

            <WarningPopUp
                text={warningText}
                active={warningActive}
                setActive={setWarningActive}
            />
        </form>
    )

}