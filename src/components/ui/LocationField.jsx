import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import WarningPopUp from './WarningPopUp.jsx'

// Converte coordenadas em um endereço legível (OpenStreetMap / Nominatim).
async function reverseGeocode(latitude, longitude, signal) {
    const url =
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2` +
        `&lat=${latitude}&lon=${longitude}&accept-language=pt-BR`;

    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Falha na geocodificação (HTTP ${response.status})`);

    const data = await response.json();
    const a = data.address ?? {};

    const street = [a.road, a.house_number].filter(Boolean).join(", ");
    const city = a.city || a.town || a.village || a.municipality;
    const parts = [street, a.suburb || a.neighbourhood, city, a.state].filter(Boolean);

    return parts.length ? parts.join(" - ") : (data.display_name ?? "");
}

const buttonClass =
    "w-[80%] md:w-[300px] py-3 rounded-full border border-black shadow " +
    "font-carl-sans font-bold hover:cursor-pointer";

export default function LocationField({ location, setLocation, setCoords }) {
    const navigate = useNavigate();

    const [status, setStatus] = useState("asking");
    const [warningText, setWarningText] = useState("");
    const [warningActive, setWarningActive] = useState(false);

    const abortRef = useRef(null);

    const deny = useCallback(() => {
        setStatus("denied");
        setWarningText("A localização é necessária para usar esta funcionalidade.");
        setWarningActive(true);
    }, []);

    const requestLocation = useCallback(() => {
        if (!("geolocation" in navigator)) {
            deny();
            return;
        }

        setStatus("requesting");

        navigator.geolocation.getCurrentPosition(
            async ({ coords: { latitude, longitude } }) => {
                abortRef.current?.abort();
                const controller = new AbortController();
                abortRef.current = controller;

                let text;
                try {
                    text = await reverseGeocode(latitude, longitude, controller.signal);
                } catch (error) {
                    if (error.name === "AbortError") return;
                    console.error("Erro ao obter o endereço:", error);
                }

                // coordenadas como texto
                setLocation(text || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                setCoords({ latitude, longitude });
                setStatus("granted");
            },
            () => {
                // qualquer falha depois de pedir a localização
                setWarningText("Ative sua localização.");
                setWarningActive(true);
                setStatus("asking");
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
        );
    }, [setLocation, setCoords, deny]);


    // Cancela a busca de endereço se o componente for desmontado
    useEffect(() => () => abortRef.current?.abort(), []);

    const showPrompt = status === "asking" || status === "denied";

    return (
        <>
            {showPrompt ? (
                <div className='w-[90%] md:w-[700px] my-5 flex flex-col items-center gap-4 text-center'>
                    <p className='font-carl-sans'>
                        Para continuar, precisamos da sua localização. Você permite o acesso?
                    </p>

                    <button
                        type='button'
                        onClick={requestLocation}
                        className={`${buttonClass} bg-[#F08921] hover:bg-[#fcb45b]`}>
                        Permitir localização
                    </button>
                    <button
                        type='button'
                        onClick={deny}
                        className={`${buttonClass} bg-white hover:bg-gray-100`}>
                        Não permitir
                    </button>

                    {/* só aparece depois que o popup de aviso for fechado */}
                    {status === "denied" && !warningActive && (
                        <button
                            type='button'
                            onClick={() => navigate('/')}
                            className={`${buttonClass} bg-white hover:bg-gray-100`}>
                            Voltar para a página principal
                        </button>
                    )}
                </div>
            ) : (
                <input
                    type="text"
                    value={location}
                    readOnly
                    placeholder="Obtendo sua localização…"
                    className="w-[90%] md:w-[700px] border border-gray-300 rounded-full py-3 my-5 px-5 bg-gray-50"
                />
            )}

            <WarningPopUp
                text={warningText}
                active={warningActive}
                setActive={setWarningActive}
            />
        </>
    )

}
