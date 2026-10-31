import { useNavigate } from 'react-router'
import BusImage from '../assets/bus.svg'
import TriangleImage from '../assets/triangle-exclamation.svg'
import PeopleImage from '../assets/people-group.svg'
import MapImage from '../assets/map-location.svg'

// function that returns a main page button
function MainPageButton({ path, text, image }) {
    const navigate = useNavigate()

    return (
        <button className='bg-[#F08921] hover:bg-[#fcb45b] hover:cursor-pointer shadow border border-black
                        w-full  h-[110px] md:w-[300px] p-10 rounded-full
                        flex items-center justify-center gap-5
                        font-carl-sans font-bold'
                        onClick={() => navigate(path)}>
            <img src={image} className='h-10' />
            <div className='flex-1'>
                {text}
            </div>
        </button>
    )
}


export default function MainPage() {

    return(
        <div className='w-full flex flex-col items-center justify-center py-[100px] px-[20px] md:px-[50px]'>
            <div className='md:max-w-[800px] w-full flex flex-col items-center justify-center gap-10'>
                <div className='font-carl-sans font-bold text-xl items-center justify-center text-center p-5'>
                    Seu site para reportar as condições dos ônibus na cidade de São Paulo
                </div>
                <div className='md:grid md:grid-cols-2  gap-5 flex flex-col justify-center items-center' >
                    <MainPageButton path="/ontherun" text="Reportar lotação agora" image={PeopleImage} />
                    <MainPageButton path="/latereport" text="Reportar informações sobre uma linha" image={TriangleImage} />
                    <MainPageButton path="/searchline" text="Visualize informações sobre uma linha de ônibus" image={BusImage} />
                    <MainPageButton path="/generalmap" text="Visualize o mapa da cidade" image={MapImage} />
                </div>
            </div>
        </div>
    )

}