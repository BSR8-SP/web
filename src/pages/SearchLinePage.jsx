import { useState } from 'react';
import { useLineSearch } from '../hooks/useLineSearch'

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Field, FieldLabel } from '../components/ui/field'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

export default function SearchLinePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [lastSearchTerm, setLastSearchTerm] = useState(null);

    const {
        results,
        isLoading,
        error,
        searchLines
    } = useLineSearch();

    const handleSearch = async () => {
        const search_term = searchTerm.trim();

        if (!search_term || isLoading) { return; }

        setLastSearchTerm(search_term);
        await searchLines(search_term);
    };

    return(
        <div className='flex flex-col justify-center items-center gap-3 lg:w-[700px] md:w-[500px] w-[350px]'>

            <Field>
                <FieldLabel>Pesquisa por linha de ônibus</FieldLabel>
                <div className='flex md:flex-row flex-col gap-3'>
                    <Input
                        type="text"
                        placeholder="Exemplos: 8084-10, Terminal Lapa"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? "Pesquisando..." : "Pesquisar"}
                    </Button>
                </div>
            </Field>

            {error && (
                <p className="text-destructive">{error}</p>
            )}

            {isLoading && <p>Carregando resultados...</p>}

            {lastSearchTerm !== null && !isLoading && !error && results.length === 0 && (
                <p>Nenhum resultado encontrado para "{lastSearchTerm}"</p>
            )}

            {!isLoading && results.length > 0 && (
                <Card className='w-full'>
                    <CardHeader>
                        <CardTitle>{results.length} resultados</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col'>
                        {results.map((line) => (
                            <Button
                                className='justify-start'
                                variant='ghost'
                                key={`${line.bus_line_code}-${line.direction}`}
                            >
                                {line.bus_line_code} - {line.destination}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )

}