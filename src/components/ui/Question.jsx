import QuestionText from './QuestionText.jsx'
import FormButton from './FormButton.jsx'

export default function Question({ type, options, selected, onChange, question }) {

    function handleChange(value) {
        if (type === "radio") {
            onChange(value);
        } else {
            if (selected.includes(value)) {
                onChange(selected.filter(item => item !== value));
            } else {
                onChange([...selected, value]);
            }
        }
    }

    return (
        <div className='flex flex-col'>
            <QuestionText text={question} />

            <div className="w-full sm:grid sm:grid-cols-2 flex flex-col gap-2 p-2">
                {options.map(option => (
                    <FormButton
                        key={option.value}
                        type={type}
                        name={question}
                        option={option}
                        selected={type === "radio" ? selected === option.value : selected.includes(option.value)}
                        onChange={() => handleChange(option.value)}
                    />
                ))}
            </div>
        </div>
    );
}