import QuestionText from '../components/ui/QuestionText.jsx'
import Question from '../components/ui/Question.jsx'
import { useState } from 'react'


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
        "Os ônibus da linha são novos?",
        "Os ônibus da linha têm ar condicionado?",
        "Os ônibus da linha apresentam defeitos mecânicos ou outros defeitos?"
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

    // options for question 5 - incidents
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

    // options for question 5 - incidents
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

    const options_infrastructure2 = [
        {
            value: "todos",
            title: "Todos",
            subtitle: ""
        },
        {
            value: "alguns",
            title: "Alguns",
            subtitle: ""
        },
        {
            value: "nenhum",
            title: "Nenhum",
            subtitle: ""
        },
        {
            value: "nao_responder",
            title: "Não responder",
            subtitle: ""
        }
    ];

    // variables for each question
    const [crowdedness, setCrowdedness] = useState(options_crowdedness[0].value) // question 1 - crowdedness
    const [traffic, setTraffic] = useState(options_traffic[0].value) // question 2 - traffic level
    const [time, setTime] = useState("");
    const [safety, setSafety] = useState(options_safety[0].value) // question 4 - traffic level
    const [incidents1, setIncidents1] = useState(options_incidents1[0].value)
    const [incidents2, setIncidents2] = useState([]) 
    const [infrastructure1, setInfrastructure1] = useState(options_infrastructure1[0].value)
    const [newbuses, setNewbuses] = useState(options_infrastructure2[0].value)
    const [airconditioning, setAirconditioning] = useState(options_infrastructure2[0].value)
    const [defects, setDefects] = useState(options_infrastructure2[0].value)

    return(
        <div className='w-full flex flex-col justify-center items-center py-[50px]'>
            <div className='w-full md:w-[700px] flex flex-col gap-6'>
                <Question type="radio" options={options_crowdedness} selected={crowdedness} onChange={setCrowdedness} question={questions[0]} />
                <Question type="radio" options={options_traffic} selected={traffic} onChange={setTraffic} question={questions[1]} />
                <div className='flex flex-col items-center justify-center'>
                    <QuestionText text={questions[2]} />
                    <input type='number' value={time} onChange={(t) => setTime(t.target.value)} 
                        className='bg-gray-100 rounded border border-black py-2 px-5 w-[90%]' />
                </div>
                <Question type="radio" options={options_safety} selected={safety} onChange={setSafety} question={questions[3]} />
                <Question type="radio" options={options_incidents1} selected={incidents1} onChange={setIncidents1} question={questions[4]} />
                <div className={`transition-all duration-500
                    ${incidents1 == "sim" ? 'max-h-[1000px] opacity-100' : 'max-h-[0px] pointer-events-none opacity-0'}`}>
                    <Question type="checkbox" options={options_incidents2} selected={incidents2} onChange={setIncidents2} question={questions[5]} />
                </div>
                <Question type="radio" options={options_infrastructure1} selected={infrastructure1} onChange={setInfrastructure1} question={questions[6]} />
                <Question type="radio" options={options_infrastructure2} selected={newbuses} onChange={setNewbuses} question={questions[7]} />
                <Question type="radio" options={options_infrastructure2} selected={airconditioning} onChange={setAirconditioning} question={questions[8]} />
                <Question type="radio" options={options_infrastructure2} selected={defects} onChange={setDefects} question={questions[9]} />
            </div>
        </div>
    )

}