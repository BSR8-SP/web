import QuestionText from '../components/ui/QuestionText.jsx'
import Question from '../components/ui/Question.jsx'
import WarningPopUp from '../components/ui/WarningPopUp.jsx'
import { useState } from 'react'
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { TimeInput } from '../components/ui/time-input.jsx'
import { Calendar } from "@/components/ui/calendar"

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
        "Qual opção melhor descreve o nível de trânsito neste trecho?",
        "Qual é o seu tempo de viagem em minutos neste trecho?",
        "Qual opção melhor descreve a segurança nesta linha de ônibus?",
        "Você já passou por algum incidente prejudicial à sua segurança e bem estar, ou já presenciou algo?",
        "Que tipo de situação você já presenciou ou passou?",
        "Qual opção melhor descreve a infraestrutura dos ônibus desta linha?",
        "Você gostaria de relatar algum problema de infraestrutura da linha?",
        "Cite os problemas que considera existir na linha:",
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

    // options for question 2 - traffic level
    const options_traffic = [
        {
            value: "nenhum",
            title: "Nenhum",
            subtitle: "O ônibus passa sem impedimentos"
        },
        {
            value: "leve",
            title: "Leve",
            subtitle: "O ônibus ocasionalmente para"
        },
        {
            value: "moderado",
            title: "Moderado",
            subtitle: "O ônibus para várias vezes"
        },
        {
            value: "alto",
            title: "Alto",
            subtitle: "O ônibus fica um longo período de tempo parado"
        },
        {
            value: "muito_alto",
            title: "Muito Alto",
            subtitle: "O ônibus fica parado por um período extremamente longo"
        },
        {
            value: "nao_responder",
            title: "Não responder",
            subtitle: ""
        }
    ];

    // options for question 4 - safety
    const options_safety = [
        {
            value: "muito_seguro",
            title: "Muito seguro",
            subtitle: "Senti-me completamente seguro durante o trajeto."
        },
        {
            value: "seguro",
            title: "Seguro",
            subtitle: "Senti-me relativamente seguro durante o trajeto."
        },
        {
            value: "neutro",
            title: "Nem seguro, nem inseguro",
            subtitle: "Não percebi situações de risco ou segurança."
        },
        {
            value: "inseguro",
            title: "Inseguro",
            subtitle: "Senti algum risco ou desconforto."
        },
        {
            value: "muito_inseguro",
            title: "Muito inseguro",
            subtitle: "Não me senti seguro durante o trajeto."
        },
        {
            value: "nao_responder",
            title: "Não responder",
            subtitle: ""
        }
    ];

    // options for question 5 - safety incidents part 1
    const options_incidents1 = [
        {
            value: "nao",
            title: "Não",
            subtitle: ""
        },
        {
            value: "sim",
            title: "Sim",
            subtitle: ""
        },
        {
            value: "nao_responder",
            title: "Não responder",
            subtitle: ""
        }
    ];

    // options for question 6 - safety incidents part 2
    const options_incidents2 = [
        {
            value: "roubo",
            title: "Roubo",
            subtitle: ""
        },
        {
            value: "furto",
            title: "Furto",
            subtitle: ""
        },
        {
            value: "assedio",
            title: "Assédio",
            subtitle: ""
        },
        {
            value: "outra",
            title: "Outra",
            subtitle: ""
        }
    ];

    // options for question 7 - infrastructure
    const options_infrastructure1 = [
        {
            value: "muito_ruim",
            title: "Muito ruim",
            subtitle: "Linha com ônibus velhos, defeituosos, desconfortáveis e sem ar condicionado"
        },
        {
            value: "ruim",
            title: "Ruim",
            subtitle: "Linha com ônibus de infraestrutura ruim de forma geral, mas com qualidades ocasionais"
        },
        {
            value: "razoavel",
            title: "Razoável",
            subtitle: "Ônibus da linha têm condições intermediárias de forma geral"
        },
        {
            value: "boa",
            title: "Boa",
            subtitle: "Linha com ônibus de boa infraestrutura, com problemas ocasionais"
        },
        {
            value: "muito_boa",
            title: "Muito boa",
            subtitle: "Linha com ônibus de ótima infraestrutura"
        },
        {
            value: "nao_responder",
            title: "Não responder",
            subtitle: ""
        }
    ];

    // options for question 8 - infrastrucure part 1
    const options_infrastructure2 = [
        {
            value: "nao",
            title: "Não",
            subtitle: ""
        },
        {
            value: "sim",
            title: "Sim",
            subtitle: ""
        }
    ];

    // options for questions 9 - infrastructure problems
    const options_infrastructure_problems = [
        {
            value: "ar_condicionado",
            title: "Falta de ar condicionado",
            subtitle: ""
        },
        {
            value: "onibus_velhos",
            title: "Ônibus velhos",
            subtitle: ""
        },
        {
            value: "defeitos",
            title: "Ônibus com defeitos",
            subtitle: ""
        }
    ];

    // warning popup states
    const [warningActive, setWarningActive] = useState(false);
    const [warningText, setWarningText] = useState("");

    // variables for each question
    const [date, setDate] = useState(undefined) // date the user wants to report about
    const [startTime, setStartTime] = useState("08:00"); // starting time of the period the user wants to report about
    const [endTime, setEndTime] = useState("10:00"); // ending time of the period the user wants to report about
    const [crowdedness, setCrowdedness] = useState(options_crowdedness[0].value) // question 1 - crowdedness
    const [traffic, setTraffic] = useState(options_traffic[0].value) // question 2 - traffic level
    const [travelTime, setTravelTime] = useState(""); // question 3 - time in minutes
    const [safety, setSafety] = useState(options_safety[0].value) // question 4 - traffic level
    const [incidents1, setIncidents1] = useState(options_incidents1[0].value) // question 5 - safety incidents
    const [incidents2, setIncidents2] = useState([]) // question 6 - types of safety incidents
    const [infrastructure1, setInfrastructure1] = useState(options_infrastructure1[0].value) // question 7 - infrastructure
    const [infrastructure2, setInfrastructure2] = useState(options_infrastructure2[0].value) // question 8 - report infrastructure problems
    const [infrastructureProblems, setInfrastructureProblems] = useState([]) // question 9 - types of infrastructure problems


    function handleSubmit(e) {
        e.preventDefault();
        console.log("handleSubmit foi chamado!");
    
        // Check if times are valid
        const isValidTime = (time) => {
            if (!/^\d{2}:\d{2}$/.test(time)) return false;
    
            const [hours, minutes] = time.split(":").map(Number);
    
            return hours >= 0 && hours <= 23 &&
                   minutes >= 0 && minutes <= 59;
        };
    
        if (!isValidTime(startTime) || !isValidTime(endTime)) {
            setWarningText("Horário inválido. Verifique os horários inicial e final.");
            setWarningActive(true);
            return;
        }
    
        // Convert times to minutes to compare them
        const [startHours, startMinutes] = startTime.split(":").map(Number);
        const [endHours, endMinutes] = endTime.split(":").map(Number);
    
        const start = startHours * 60 + startMinutes;
        const end = endHours * 60 + endMinutes;
    
        if (start > end) {
            setWarningText("O horário inicial não pode ser posterior ao horário final.");
            setWarningActive(true);
            return;
        }
    
        // Collect all answers
        const responses = {
            date: date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : null,
            startTime,
            endTime,
            crowdedness,
            traffic,
            travelTime,
            safety,
            incidents1,
            incidents2,
            infrastructure1,
            infrastructure2,
            infrastructureProblems
        };
    
        console.log("Respostas do formulário:", responses);
        setWarningText("Resposta recebida");
        setWarningActive(true);
    }

    return(
        <form onSubmit={handleSubmit}
              className='w-full flex flex-col justify-center items-center py-[50px]'>
            <div className='w-[90%] md:w-[700px] flex flex-col gap-6'>


                <div className='flex flex-col items-center justify-center min-h-[480px] pb-5 justify-start'>
                    <QuestionText text="Selecione data, horário inicial e horário final sobre os quais quer reportar:" />
                    <div className='flex flex-col sm:flex-row gap-5'>
                        <div className='flex flex-col gap-1 items-center'>
                            <QuestionText text="Data:" />
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                locale={ptBR}
                                disabled={{ after: new Date() }}
                                className="rounded-lg border"
                                captionLayout="dropdown"
                            />
                        </div>
                        <div className='flex flex-col items-center'>
                            <QuestionText text="Horário inicial:" />
                            <TimeInput
                                value={startTime}
                                onChange={setStartTime}
                            />
                            <QuestionText text="Horário final:" />
                            <TimeInput
                                value={endTime}
                                onChange={setEndTime}
                            />
                        </div>                                              
                    </div>
                </div>
            </div>

            <MapMock />

            <div className='w-[90%] md:w-[700px] flex flex-col gap-6'>
                <Question type="radio" options={options_crowdedness} selected={crowdedness} onChange={setCrowdedness} question={questions[0]} />
                <Question type="radio" options={options_traffic} selected={traffic} onChange={setTraffic} question={questions[1]} />
                <div className='flex flex-col items-center justify-center'>
                    <QuestionText text={questions[2]} />
                    <input type='number' value={travelTime} onChange={(t) => setTravelTime(t.target.value)} 
                        className='bg-gray-100 rounded border border-black py-2 px-5 w-[90%]' />
                </div>
                <Question type="radio" options={options_safety} selected={safety} onChange={setSafety} question={questions[3]} />
                <Question type="radio" options={options_incidents1} selected={incidents1} onChange={setIncidents1} question={questions[4]} />
                <div className={`transition-all duration-500
                    ${incidents1 == "sim" ? 'max-h-[1000px] opacity-100' : 'max-h-[0px] pointer-events-none opacity-0'}`}>
                    <Question type="checkbox" options={options_incidents2} selected={incidents2} onChange={setIncidents2} question={questions[5]} />
                </div>
                <Question type="radio" options={options_infrastructure1} selected={infrastructure1} onChange={setInfrastructure1} question={questions[6]} />
                <Question type="radio" options={options_infrastructure2} selected={infrastructure2} onChange={setInfrastructure2} question={questions[7]} />
                <div className={`transition-all duration-500
                    ${infrastructure2 == "sim" ? 'max-h-[1000px] opacity-100' : 'max-h-[0px] pointer-events-none opacity-0'}`}>
                    <Question type="checkbox" options={options_infrastructure_problems} selected={infrastructureProblems} onChange={setInfrastructureProblems} question={questions[8]} />
                </div>
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