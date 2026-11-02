import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Field, FieldLabel } from '../components/ui/field'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

export default function SearchLinePage() {

    return(
        <div className='flex flex-col justify-center items-center gap-3 lg:w-[700px] md:w-[500px] w-[350px]'>

            <Field>
                <FieldLabel>Pesquisa por linha de ônibus</FieldLabel>
                <div className='flex md:flex-row flex-col gap-3'>
                    <Input type="" placeholder="Exemplos: 8084-10, Terminal Lapa" />
                    <Button>Pesquisar</Button>
                </div>
            </Field>

            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>N resultados</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col'>
                    <Button className='justify-start' variant='ghost'>XXXX-XX - Sentido A</Button>
                    <Button className='justify-start' variant='ghost'>YYYY-YY - Sentido B</Button>
                    <Button className='justify-start' variant='ghost'>ZZZZ-ZZ - Sentido C</Button>
                </CardContent>
            </Card>
        </div>
    )

}