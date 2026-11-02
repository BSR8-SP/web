export default function FormButton({ type, option, selected, onChange, name }) {
    return (
        <label
            className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer
                w-full
                ${selected
                    ? "border-black bg-gray-100"
                    : "border-gray-300"
                }`}
        >
            <input
                type={type}
                name={name}
                value={option.value}
                checked={selected}
                onChange={onChange}
                className="mt-1 accent-black"
            />

            <div>
                <p className="font-medium">{option.title}</p>
                <p className="text-sm text-gray-500">
                    {option.subtitle}
                </p>
            </div>
        </label>
    );
}