import QuestionText from '../components/ui/QuestionText.jsx'
import Question from '../components/ui/Question.jsx'
import WarningPopUp from '../components/ui/WarningPopUp.jsx'
import { useState } from 'react'

function MapMock() {
    return (
        <div className='bg-blue-600 w-[90%] h-[400px] text-white text-6xl text-center'> Insert Map here</div>
    );
}

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

export default function LateReportPage() {


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
    const [location, setLocation] = useState("Av. Paulista, 1000 - São Paulo, SP")
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
                value: trimmedLocation
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

            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Digite um endereço ou CEP"
                className="w-[90%] md:w-[700px] border border-gray-300 rounded-full py-3 my-5 px-5"
            />

            <MapMock />

            <div className='w-[90%] md:w-[700px] flex flex-col gap-6'>
                <Question type="radio" options={options_crowdedness} selected={crowdedness} onChange={setCrowdedness} question={questions[0]} />
            </div>
            <SubmitButton />
            <WarningPopUp
                text={warningText}
                active={warningActive}
                setActive={setWarningActive}
            />
        </form>
    )

}