import QuestionText from './QuestionText.jsx'

export default function WarningPopUp({ text, active, setActive }) {
	return (
		<div
			className={
				active
					? 'fixed inset-0 flex flex-col items-center justify-center bg-black/20 dark:bg-white/20 z-50'
					: 'hidden'
			}>
			<div
				className='rounded-4xl w-[90%] sm:w-[300px] h-[200px]
				border border-gray-300 bg-white
				flex flex-col items-center justify-center gap-3'>
                <QuestionText text={text} />
                <button type='button' onClick={() => setActive(false)}
                        className="bg-[#F08921] hover:bg-[#fcb45b] rounded-full px-4 py-2 cursor-pointer font-carl-sans border border-black" >
                    Fechar
                </button>
			</div>
		</div>
	)
}